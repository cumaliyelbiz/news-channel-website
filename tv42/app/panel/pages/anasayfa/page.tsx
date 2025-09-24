"use client"

import React, { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Film,
  Tv,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"
import { deleteHomePageDataEpisode, deleteHomePageDataTrailer, fetchHomePageData, updateHomePageData } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Fragman tipi
interface Trailer {
  id: number;
  image: string;
  title: string;
  time: string;
  day: string;
}

// Bölüm tipi
interface Episode {
  id: number;
  image: string;
  title: string;
}

export default function BolumlerFragmanlarPage() {

  // State tanımlamaları
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state'leri
  const [isTrailerFormOpen, setIsTrailerFormOpen] = useState(false);
  const [isEpisodeFormOpen, setIsEpisodeFormOpen] = useState(false);
  const [editingTrailer, setEditingTrailer] = useState<Trailer | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  // Yeni fragman ve bölüm için state'ler
  const [newTrailer, setNewTrailer] = useState<Partial<Trailer>>({
    image: "/placeholder.svg",
    title: "",
    time: "",
    day: ""
  });

  const [newEpisode, setNewEpisode] = useState<Partial<Episode>>({
    image: "/placeholder.svg",
    title: ""
  });

  // Silme işlemi için state'ler
  const [trailerToDelete, setTrailerToDelete] = useState<number | null>(null);
  const [episodeToDelete, setEpisodeToDelete] = useState<number | null>(null);

  // Veri yükleme
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchHomePageData();

        if (data) {
          setTrailers(data.fragmanlar || []);
          setEpisodes(data.bolumler || []);
        }
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
        toast(
          "Hata",
          {
            description: "Veriler yüklenirken bir hata oluştu.",
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fragman ekleme/güncelleme
  const handleTrailerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Mevcut verileri çek
      const currentData = await fetchHomePageData();
      let updatedTrailers = [...(currentData.fragmanlar || [])];

      if (editingTrailer) {
        // Güncelleme işlemi - mevcut ID ile güncelle
        updatedTrailers = updatedTrailers.map(item =>
          item.id === editingTrailer.id ? {
            ...newTrailer,
            id: editingTrailer.id,
            is_active: 1 // Aktif olarak işaretle
          } : item
        );

        // UI güncelleme
        setTrailers(updatedTrailers);
        toast("Başarılı", { description: "Fragman başarıyla güncellendi." });
      } else {
        // Yeni fragman - ID olmadan ekle (backend ID atayacak)
        const newTrailerItem = {
          ...newTrailer,
          is_active: 1 // Aktif olarak işaretle
        };

        // Geçici bir ID ile UI'a ekle (backend gerçek ID atayacak)
        const tempId = Math.floor(Math.random() * -1000) - 1; // Negatif geçici ID
        setTrailers([...updatedTrailers, { ...newTrailerItem, id: tempId }]);

        // Backend'e gönderilecek veri - ID olmadan
        updatedTrailers.push(newTrailerItem);

        toast("Başarılı", { description: "Fragman başarıyla eklendi." });
      }

      // API ile verileri güncelle - sadece fragmanlar gönder
      await updateHomePageData({
        fragmanlar: updatedTrailers
      });

      // Güncel verileri tekrar çek
      const refreshedData = await fetchHomePageData();
      setTrailers(refreshedData.fragmanlar || []);

      // Form'u sıfırla ve kapat
      setNewTrailer({
        image: "/placeholder.svg",
        title: "",
        time: "",
        day: ""
      });
      setEditingTrailer(null);
      setIsTrailerFormOpen(false);
    } catch (error) {
      console.error("İşlem hatası:", error);
      toast("Hata", { description: "İşlem sırasında bir hata oluştu." });
    }
  };

  // Bölüm ekleme/güncelleme
  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Mevcut verileri çek
      const currentData = await fetchHomePageData();
      let updatedEpisodes = [...(currentData.bolumler || [])];

      if (editingEpisode) {
        // Güncelleme işlemi - mevcut ID ile güncelle
        updatedEpisodes = updatedEpisodes.map(item =>
          item.id === editingEpisode.id ? {
            ...newEpisode,
            id: editingEpisode.id,
            is_active: 1 // Aktif olarak işaretle
          } : item
        );

        // UI güncelleme
        setEpisodes(updatedEpisodes);
        toast("Başarılı", { description: "Bölüm başarıyla güncellendi." });
      } else {
        // Yeni bölüm - ID olmadan ekle (backend ID atayacak)
        const newEpisodeItem = {
          ...newEpisode,
          is_active: 1 // Aktif olarak işaretle
        };

        // Geçici bir ID ile UI'a ekle (backend gerçek ID atayacak)
        const tempId = Math.floor(Math.random() * -1000) - 1; // Negatif geçici ID
        setEpisodes([...updatedEpisodes, { ...newEpisodeItem, id: tempId }]);

        // Backend'e gönderilecek veri - ID olmadan
        updatedEpisodes.push(newEpisodeItem);

        toast("Başarılı", { description: "Bölüm başarıyla eklendi." });
      }

      // API ile verileri güncelle - sadece bölümler gönder
      await updateHomePageData({
        bolumler: updatedEpisodes
      });

      // Güncel verileri tekrar çek
      const refreshedData = await fetchHomePageData();
      setEpisodes(refreshedData.bolumler || []);

      // Form'u sıfırla ve kapat
      setNewEpisode({
        image: "/placeholder.svg",
        title: ""
      });
      setEditingEpisode(null);
      setIsEpisodeFormOpen(false);
    } catch (error) {
      console.error("İşlem hatası:", error);
      toast("Hata", { description: "İşlem sırasında bir hata oluştu." });
    }
  };

  // Fragman silme
  const handleDeleteTrailer = async () => {
    if (!trailerToDelete) return;

    try {
      // Mevcut verileri çek
      const currentData = await fetchHomePageData();

      await deleteHomePageDataTrailer(trailerToDelete);

      // Silinecek fragmanı çıkar
      const updatedTrailers = (currentData.fragmanlar || []).filter(
        (item: { id: number }) => item.id!== trailerToDelete
      );
      // UI güncelleme
      setTrailers(updatedTrailers);
      toast("Başarılı", { description: "Fragman başarıyla silindi." });
    } catch (error) {
      console.error("Silme hatası:", error);
      toast("Hata", { description: "Silme işlemi sırasında bir hata oluştu." });
    } finally {
      setTrailerToDelete(null);
    }
  };

  // Bölüm silme
  const handleDeleteEpisode = async () => {
    if (!episodeToDelete) return;

    try {
      // Mevcut verileri çek
      const currentData = await fetchHomePageData();

      await deleteHomePageDataEpisode(episodeToDelete);

      // Silinecek bölümü çıkar
      const updatedEpisodes = (currentData.bolumler || []).filter(
        (item: { id: number }) => item.id !== episodeToDelete
      );

      // UI güncelleme
      setEpisodes(updatedEpisodes);
      toast("Başarılı", { description: "Bölüm başarıyla silindi." });
    } catch (error) {
      console.error("Silme hatası:", error);
      toast("Hata", { description: "Silme işlemi sırasında bir hata oluştu." });
    } finally {
      setEpisodeToDelete(null);
    }
  };

  // Fragman düzenleme
  const handleEditTrailer = (trailer: Trailer) => {
    setEditingTrailer(trailer);
    setNewTrailer({
      image: trailer.image,
      title: trailer.title,
      time: trailer.time,
      day: trailer.day
    });
    setIsTrailerFormOpen(true);
  };

  // Bölüm düzenleme
  const handleEditEpisode = (episode: Episode) => {
    setEditingEpisode(episode);
    setNewEpisode({
      image: episode.image,
      title: episode.title
    });
    setIsEpisodeFormOpen(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/panel/pages">Sayfalar</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/panel/pages/anasayfa">Anasayfa</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Bölümler ve Fragmanlar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Ana içerik */}
        <div className="px-4 py-6">
          <Card className="rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader className="pb-0 mb-4">
              <CardTitle className="tracking-tight text-lg font-medium">Bölümler ve Fragmanlar Yönetimi</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tabs */}
              <Tabs defaultValue="trailers">
                <TabsList className="flex space-x-4 mb-6">
                  <TabsTrigger value="trailers">
                    <Film className="h-4 w-4 mr-2" />
                    Fragmanlar
                  </TabsTrigger>
                  <TabsTrigger value="episodes">
                    <Tv className="h-4 w-4 mr-2" />
                    Bölümler
                  </TabsTrigger>
                </TabsList>

                {/* Fragmanlar Tab */}
                <TabsContent value="trailers">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Fragmanlar Listesi</h3>
                      <Button onClick={() => {
                        setEditingTrailer(null);
                        setNewTrailer({
                          image: "/placeholder.svg",
                          title: "",
                          time: "",
                          day: ""
                        });
                        setIsTrailerFormOpen(true);
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Fragman Ekle
                      </Button>
                    </div>

                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : trailers.length === 0 ? (
                      <div className="text-center py-10 border rounded-lg">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Henüz fragman bulunmamaktadır.</p>
                        <Button variant="outline" className="mt-4" onClick={() => {
                          setEditingTrailer(null);
                          setNewTrailer({
                            image: "/placeholder.svg",
                            title: "",
                            time: "",
                            day: ""
                          });
                          setIsTrailerFormOpen(true);
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Fragman Ekle
                        </Button>
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">Görsel</TableHead>
                              <TableHead>Başlık</TableHead>
                              <TableHead>Gün</TableHead>
                              <TableHead>Saat</TableHead>
                              <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {trailers.map((trailer) => (
                              <TableRow key={trailer.id}>
                                <TableCell>
                                  <Image
                                    src={trailer.image || "/placeholder.svg"}
                                    alt={trailer.title}
                                    width={64}
                                    height={40}
                                    className="w-16 h-10 object-cover rounded"
                                    unoptimized
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{trailer.title}</TableCell>
                                <TableCell>{trailer.day}</TableCell>
                                <TableCell>{trailer.time}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditTrailer(trailer)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => setTrailerToDelete(trailer.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Fragmanı Sil</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Bu fragmanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setTrailerToDelete(null)}>İptal</AlertDialogCancel>
                                          <AlertDialogAction onClick={handleDeleteTrailer}>Sil</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Bölümler Tab */}
                <TabsContent value="episodes">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Bölümler Listesi</h3>
                      <Button onClick={() => {
                        setEditingEpisode(null);
                        setNewEpisode({
                          image: "/placeholder.svg",
                          title: ""
                        });
                        setIsEpisodeFormOpen(true);
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Bölüm Ekle
                      </Button>
                    </div>

                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : episodes.length === 0 ? (
                      <div className="text-center py-10 border rounded-lg">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Henüz bölüm bulunmamaktadır.</p>
                        <Button variant="outline" className="mt-4" onClick={() => {
                          setEditingEpisode(null);
                          setNewEpisode({
                            image: "/placeholder.svg",
                            title: ""
                          });
                          setIsEpisodeFormOpen(true);
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Bölüm Ekle
                        </Button>
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">Görsel</TableHead>
                              <TableHead>Başlık</TableHead>
                              <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {episodes.map((episode) => (
                              <TableRow key={episode.id}>

                                <TableCell>
                                  <Image
                                    src={episode.image || "/placeholder.svg"}
                                    alt={episode.title}
                                    width={64}
                                    height={40}
                                    className="w-16 h-10 object-cover rounded"
                                    unoptimized
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{episode.title}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditEpisode(episode)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => setEpisodeToDelete(episode.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Bölümü Sil</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Bu bölümü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setEpisodeToDelete(null)}>İptal</AlertDialogCancel>
                                          <AlertDialogAction onClick={handleDeleteEpisode}>Sil</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow >
                            ))}
                          </TableBody >
                        </Table >
                      </div >
                    )}
                  </div >
                </TabsContent >
              </Tabs >
            </CardContent >
          </Card >
        </div >
      </SidebarInset >

      {/* Fragman Ekleme/Düzenleme Dialog */}
      <Dialog open={isTrailerFormOpen} onOpenChange={setIsTrailerFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTrailer ? "Fragman Düzenle" : "Yeni Fragman Ekle"}</DialogTitle>
            <DialogDescription>
              {editingTrailer
                ? "Fragman bilgilerini güncelleyin."
                : "Yeni bir fragman eklemek için aşağıdaki formu doldurun."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTrailerSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Başlık</label>
              <Input
                id="title"
                value={newTrailer.title}
                onChange={(e) => setNewTrailer({ ...newTrailer, title: e.target.value })}
                placeholder="Fragman başlığı"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="day" className="text-sm font-medium">Gün</label>
              <Input
                id="day"
                value={newTrailer.day}
                onChange={(e) => setNewTrailer({ ...newTrailer, day: e.target.value })}
                placeholder="Örn: PAZARTESİ"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">Saat</label>
              <Input
                id="time"
                value={newTrailer.time}
                onChange={(e) => setNewTrailer({ ...newTrailer, time: e.target.value })}
                placeholder="Örn: 20:30"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Görsel</label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={newTrailer.image || "/placeholder.svg"}
                    alt="Önizleme"
                    width={80}
                    height={48}
                    className="w-20 h-12 object-cover rounded border"
                    unoptimized
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          // Create FormData and append the file
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("destination", "fragmanlar");

                          // Upload the file using the API route
                          const response = await fetch('http://localhost:3001/api/upload?destination=fragmanlar', {
                            method: 'POST',
                            body: formData,
                          });

                          const result = await response.json();

                          if (result.success) {
                            setNewTrailer({ ...newTrailer, image: result.filePath });
                            toast("Başarılı", { description: "Görsel başarıyla yüklendi." });
                          } else {
                            toast("Hata", { description: "Görsel yüklenirken bir hata oluştu." });
                          }
                        } catch (error) {
                          console.error("Görsel yükleme hatası:", error);
                          toast("Hata", { description: "Görsel yüklenirken bir hata oluştu." });
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="trailerImageUrl" className="text-sm font-medium">Görsel URL</label>
                  <Input
                    id="trailerImageUrl"
                    value={newTrailer.image}
                    onChange={(e) => setNewTrailer({ ...newTrailer, image: e.target.value })}
                    placeholder="Görsel URL'sini girin"
                  />
                  <p className="text-xs text-muted-foreground">
                    Görsel yüklemek yerine doğrudan URL girebilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsTrailerFormOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingTrailer ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bölüm Ekleme/Düzenleme Dialog */}
      <Dialog open={isEpisodeFormOpen} onOpenChange={setIsEpisodeFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingEpisode ? "Bölüm Düzenle" : "Yeni Bölüm Ekle"}</DialogTitle>
            <DialogDescription>
              {editingEpisode
                ? "Bölüm bilgilerini güncelleyin."
                : "Yeni bir bölüm eklemek için aşağıdaki formu doldurun."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEpisodeSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="episode-title" className="text-sm font-medium">Başlık</label>
              <Textarea
                id="episode-title"
                value={newEpisode.title}
                onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                placeholder="Bölüm başlığı"
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Görsel</label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={newEpisode.image || "/placeholder.svg"}
                    alt="Önizleme"
                    width={80}
                    height={48}
                    className="w-20 h-12 object-cover rounded border"
                    unoptimized
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          // Create FormData and append the file
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("destination", "bolumler");

                          // Upload the file using the API route
                          const response = await fetch('http://localhost:3001/api/upload?destination=bolumler', {
                            method: 'POST',
                            body: formData,
                          });

                          const result = await response.json();

                          if (result.success) {
                            setNewEpisode({ ...newEpisode, image: result.filePath });
                            toast("Başarılı", { description: "Görsel başarıyla yüklendi." });
                          } else {
                            toast("Hata", { description: "Görsel yüklenirken bir hata oluştu." });
                          }
                        } catch (error) {
                          console.error("Görsel yükleme hatası:", error);
                          toast("Hata", { description: "Görsel yüklenirken bir hata oluştu." });
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="episodeImageUrl" className="text-sm font-medium">Görsel URL</label>
                  <Input
                    id="episodeImageUrl"
                    value={newEpisode.image}
                    onChange={(e) => setNewEpisode({ ...newEpisode, image: e.target.value })}
                    placeholder="Görsel URL'sini girin"
                  />
                  <p className="text-xs text-muted-foreground">
                    Görsel yüklemek yerine doğrudan URL girebilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEpisodeFormOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingEpisode ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}