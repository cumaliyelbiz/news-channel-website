
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchProgramsData, updateProgramsData } from '@/lib/api';
import { toast } from "sonner";
import { Tv, Save, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface Program {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  presenter: string;
  broadcast_day: string;
  broadcast_time: string;
  image: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id ? parseInt(params.id as string) : null;

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState(""); // New field
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(""); // New field
  const [broadcast_day, setBroadcastDay] = useState("");
  const [broadcast_time, setBroadcastTime] = useState("");
  const [presenter, setPresenter] = useState("");
  const [isActive, setIsActive] = useState(true); // New field
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProgramData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProgramsData();
      const program = data.programs.find((p: Program) => p.id === programId);

      if (program) {
        setTitle(program.title || "");
        setSubtitle(program.subtitle || "");
        setDescription(program.description || "");
        setPresenter(program.presenter || "");
        setBroadcastDay(program.broadcast_day || "");
        setBroadcastTime(program.broadcast_time || "");
        setImage(program.image || "");
        setCategory(program.category || "");
        setIsActive(program.is_active !== undefined ? program.is_active : true);
      } else {
        toast.error("Program bulunamadı.");
        router.push('/panel/pages/programlar');
      }
    } catch (error) {
      console.error("Veri çekme sırasında hata oluştu:", error);
      toast.error("Veri çekme sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [programId, router]);

  useEffect(() => {
    if (programId) {
      fetchProgramData();
    }
  }, [programId, fetchProgramData]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Get the existing program to preserve created_at if it exists
      const data = await fetchProgramsData();
      const existingProgram = programId ? data.programs.find((p: Program) => p.id === programId) : null;

      const programData = {
        id: programId || Math.floor(Math.random() * 1000),
        title,
        subtitle,
        description,
        presenter,
        broadcast_day,
        broadcast_time,
        image,
        category,
        is_active: isActive,
        created_at: existingProgram?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Tüm programları al ve güncelle
      let updatedPrograms;

      if (programId) {
        // Mevcut programı güncelle
        updatedPrograms = data.programs.map((p: Program) =>
          p.id === programId ? programData : p
        );
      } else {
        // Yeni program ekle
        updatedPrograms = [...data.programs, programData];
      }

      await updateProgramsData({ programs: updatedPrograms });

      toast.success(programId ? "Program güncellendi." : "Yeni program eklendi.");
      router.push('/panel/pages/programlar');
    } catch (error) {
      console.error("Kaydetme sırasında hata oluştu:", error);
      toast.error("Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingImage(true);

      try {
        // Create FormData and append the file
        const formData = new FormData();
        formData.append("file", file);
        formData.append("destination", "programs");

        // Upload the file using the API route
        const response = await fetch('http://localhost:3001/api/upload?destination=programs', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setImage(result.filePath);
          toast.success("Görsel başarıyla yüklendi.");
        } else {
          toast.error("Görsel yüklenirken bir hata oluştu.");
        }
      } catch (error) {
        console.error("Görsel yükleme hatası:", error);
        toast.error("Görsel yüklenirken bir hata oluştu.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/panel/pages">
                    Sayfalar
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/panel/pages/programlar">
                    Programlar
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {programId ? "Programı Düzenle" : "Yeni Program"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="ml-auto mr-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/panel/pages/programlar')}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="gap-1"
            >
              {saving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="px-4 py-6">
            <Card className="rounded-xl border bg-card text-card-foreground shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Tv className="h-5 w-5" />
                  {programId ? "Programı Düzenle" : "Yeni Program Ekle"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Program Adı</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Program adını girin"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subtitle">Alt Başlık</Label>
                        <Input
                          id="subtitle"
                          value={subtitle}
                          onChange={(e) => setSubtitle(e.target.value)}
                          placeholder="Program alt başlığını girin"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Program açıklamasını girin"
                          rows={5}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Input
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="Program kategorisini girin"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="broadcast_day">Yayın Günü</Label>
                          <Input
                            id="broadcast_day"
                            value={broadcast_day}
                            onChange={(e) => setBroadcastDay(e.target.value)}
                            placeholder="Örn: Pazartesi-Cuma"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="broadcast_time">Yayın Saati</Label>
                          <Input
                            id="broadcast_time"
                            value={broadcast_time}
                            onChange={(e) => setBroadcastTime(e.target.value)}
                            placeholder="Örn: 19:00"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="presenter">Sunucu</Label>
                        <Input
                          id="presenter"
                          value={presenter}
                          onChange={(e) => setPresenter(e.target.value)}
                          placeholder="Sunucu adını girin"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_active"
                          checked={isActive}
                          onCheckedChange={(checked) => setIsActive(checked as boolean)}
                        />
                        <Label htmlFor="is_active">Aktif</Label>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="image">Program Görseli</Label>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="border rounded-md p-2 w-full"
                          disabled={uploadingImage}
                        />
                        {uploadingImage && (
                          <div className="mt-2 flex items-center text-sm text-muted-foreground">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                            Görsel yükleniyor...
                          </div>
                        )}
                        {image && (
                          <div className="mt-4">
                            <Label>Görsel Önizleme</Label>
                            <div className="mt-2 aspect-video rounded-md overflow-hidden border bg-gray-50">
                              <Image
                                src={image}
                                alt="Program görseli"
                                width={400}
                                height={300}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">Görsel URL</Label>
                        <Input
                          id="imageUrl"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="Görsel URL'sini girin"
                        />
                        <p className="text-xs text-muted-foreground">
                          Görsel yüklemek yerine doğrudan URL girebilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}