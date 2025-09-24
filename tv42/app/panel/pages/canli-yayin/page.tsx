"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fetchLiveStreamData, updateLiveStreamData } from '@/lib/api';
import { toast } from "sonner";
import { Play, Video, Save, Upload, RefreshCw } from "lucide-react";
import Image from "next/image";

interface LiveStreamData {
  streamUrl: string;
  streamTitle: string;
  thumbnailUrl: string;
  isLive: boolean;
}

export default function EditPage() {

  // State variables for live stream
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [streamTitle, setStreamTitle] = useState<string>("KONTV CANLI YAYIN");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("/placeholder.svg");
  const [isLive, setIsLive] = useState<boolean>(true);

  const [initialData, setInitialData] = useState<LiveStreamData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Verileri fetch et
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLiveStreamData();
        setStreamUrl(data.streamUrl);
        setStreamTitle(data.streamTitle);
        setThumbnailUrl(data.thumbnailUrl);
        setIsLive(data.isLive);
        setInitialData(data);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);


  const checkIfFormChanged = useCallback(() => {
    if (!initialData) return;
    const isChanged =
      streamUrl !== initialData.streamUrl ||
      streamTitle !== initialData.streamTitle ||
      thumbnailUrl !== initialData.thumbnailUrl ||
      isLive !== initialData.isLive;
    setFormChanged(isChanged);
  }, [streamUrl, streamTitle, thumbnailUrl, isLive, initialData]);

  useEffect(() => {
    checkIfFormChanged();
  }, [streamUrl, streamTitle, thumbnailUrl, isLive, checkIfFormChanged]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedData = {
      streamUrl,
      streamTitle,
      thumbnailUrl,
      isLive
    };

    try {
      await updateLiveStreamData(updatedData);
      setInitialData(updatedData);
      toast.success("Başarılı", { description: "Canlı yayın verileri başarıyla güncellendi." });
      setFormChanged(false);
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
      toast.error("Hata", { description: "Güncelleme sırasında bir hata oluştu." });
    } finally {
      setIsSaving(false);
    }
  };


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('destination', 'livestream'); // Store in public/livestream folder

      // Show loading toast
      toast.loading("Görsel yükleniyor...");

      // Upload the file using the API endpoint
      const response = await fetch('http://localhost:3001/api/upload?destination=livestream', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Dosya yükleme hatası');
      }

      const data = await response.json();

      // Update the thumbnail URL with the uploaded file path
      setThumbnailUrl(data.filePath);

      toast.dismiss();
      toast.success("Görsel başarıyla yüklendi");
    } catch (error) {
      console.error("Görsel yükleme hatası:", error);
      toast.dismiss();
      toast.error("Görsel yüklenirken bir hata oluştu");
    } finally {
      setIsUploading(false);
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
                  <BreadcrumbPage>Canlı Yayın</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Kaydet butonu */}
          <div className="ml-auto mr-4">
            <Button onClick={handleSubmit} disabled={isSaving || !formChanged} className="px-4">
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Form for editing the page */}
        <div className="px-4 py-6">
          <Card className="rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader className="pb-0 mb-4">
              <div className="flex space-x-2 justify-between">
                <CardTitle className="tracking-tight text-lg font-medium">Canlı Yayın Düzenle</CardTitle>
                {formChanged && <span className="text-sm text-amber-500">Kaydedilmemiş değişiklikler var</span>}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tabs for different sections */}
              <Tabs defaultValue="stream">
                <TabsList className="flex space-x-4">
                  <TabsTrigger value="stream">
                    <Play className="h-4 w-4 mr-2" />
                    Yayın Ayarları
                  </TabsTrigger>
                  <TabsTrigger value="appearance">
                    <Video className="h-4 w-4 mr-2" />
                    Görünüm
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Canlı Önizleme
                  </TabsTrigger>
                </TabsList>

                {/* Yayın Ayarları */}
                <TabsContent value="stream" className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Yayın URL&apos;si</label>
                    <Input
                      value={streamUrl}
                      onChange={(e) => setStreamUrl(e.target.value)}
                      className="w-full"
                      placeholder="Yayın URL&apos;sini girin"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Yayın Durumu</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isLive"
                        checked={isLive}
                        onChange={(e) => setIsLive(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <label htmlFor="isLive" className="text-sm">Canlı yayın aktif</label>
                    </div>
                  </div>
                </TabsContent>

                {/* Görünüm */}
                <TabsContent value="appearance" className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Yayın Başlığı</label>
                    <Input
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      className="w-full"
                      placeholder="Yayın başlığını girin"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Önizleme Görseli</label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                          className="w-full"
                          placeholder="Önizleme görseli URL'sini girin"
                        />
                        <div className="relative">
                          <Button
                            type="button"
                            variant="outline"
                            className="relative"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                                Yükleniyor...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Yükle
                              </>
                            )}
                            <input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleImageUpload}
                              accept="image/*"
                              disabled={isUploading}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Önizleme</h3>
                    <div className="aspect-video bg-black relative">
                      <Image
                        src={thumbnailUrl || "/placeholder.svg"}
                        alt="Live broadcast preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="bg-white/50 rounded-full p-4">
                          <Play className="w-12 h-12 text-white fill-white" />
                        </button>
                      </div>
                      {isLive && (
                        <div className="absolute bottom-4 left-4 px-2 py-1 bg-red-600 text-white text-sm">
                          CANLI
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Canlı Önizleme */}
                <TabsContent value="preview" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Canlı Yayın Önizleme</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLivePreview(!showLivePreview)}
                      >
                        {showLivePreview ? "Yayını Durdur" : "Yayını Başlat"}
                      </Button>
                    </div>

                    {showLivePreview ? (
                      streamUrl ? (
                        <div className="aspect-video bg-black relative">
                          <iframe
                            src={streamUrl}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          ></iframe>
                          {isLive && (
                            <div className="absolute top-4 left-4 px-2 py-1 bg-red-600 text-white text-sm">
                              CANLI
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
<p>Yayın URL&apos;si YouTube, Twitch veya diğer embed edilebilir yayın platformlarının URL&apos;si olmalıdır.</p>                        </div>
                      )
                    ) : (
                      <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
                        <p>Yayını başlatmak için &quot;Yayını Başlat&quot; butonuna tıklayın.</p>
                      </div>
                    )}

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Bilgi</h4>
                      <p className="text-sm text-muted-foreground">
                        Bu sekme, canlı yayın akışınızın doğru çalışıp çalışmadığını kontrol etmenizi sağlar.
                        Yayın URL&apos;si YouTube, Twitch veya diğer embed edilebilir yayın platformlarının URL&apos;si olmalıdır.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}