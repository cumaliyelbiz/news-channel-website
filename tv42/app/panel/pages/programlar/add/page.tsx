"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useRouter } from 'next/navigation';
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
import { addProgramsData } from '@/lib/api';
import { toast } from "sonner";
import { Tv, Save, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export default function AddProgramPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [broadcast_day, setBroadcastDay] = useState("");
  const [broadcast_time, setBroadcastTime] = useState("");
  const [presenter, setPresenter] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const programData = {
        id: Math.floor(Math.random() * 1000), // Yeni program için rastgele ID
        title,
        subtitle,
        description,
        presenter,
        broadcast_day,
        broadcast_time,
        image,
        category,
        is_active: isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Tüm programları al ve yeni programı ekle
      const updatedPrograms = [programData];
      
      await addProgramsData({ programs: updatedPrograms });
      
      toast.success("Yeni program eklendi.");
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
                    Yeni Program
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

        <div className="px-4 py-6">
          <Card className="rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Tv className="h-5 w-5" />
                Yeni Program Ekle
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
                    
                    {image && (
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
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}