"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { fetchMediaPartnersData, updateMediaPartnersData, deleteMediaPartnersData, addMediaPartnersData } from '@/lib/api';
import { toast } from "sonner";
import { Newspaper, Globe, Link2, Edit, Trash, Plus, Eye, LayoutGrid, List, Save, X } from "lucide-react";
import Image from "next/image";

// Partner type definition
interface Partner {
  id: number;
  name: string;
  url: string;
  image: string;
}

export default function MediaPartnersPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<string>("grid");
  const [mediaPartners, setMediaPartners] = useState<Partner[]>([]);

  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [partnerIdToDelete, setPartnerIdToDelete] = useState<number | null>(null);

  // Form states
  const [currentPartner, setCurrentPartner] = useState<Partner>({
    id: 0,
    name: '',
    url: '',
    image: ''
  });
  const [isNewPartner, setIsNewPartner] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchMediaPartnersData();
      setMediaPartners(data.mediaPartners || []);
    } catch (error) {
      console.error("Veri çekme sırasında hata oluştu:", error);
      toast.error("Veri çekme sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    setPartnerIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (partnerIdToDelete !== null) {
      try {
        await deleteMediaPartnersData(partnerIdToDelete);
        toast.success("Medya ortağı başarıyla silindi.");
        fetchData();
      } catch (error) {
        toast.error("Medya ortağı silinirken bir hata oluştu.");
        console.error("Medya ortağı silinirken bir hata oluştu:", error);
      } finally {
        setIsDeleteDialogOpen(false);
        setPartnerIdToDelete(null);
      }
    }
  };

  const handleAddPartner = () => {
    setIsNewPartner(true);
    setCurrentPartner({
      id: Math.floor(Math.random() * 1000), // Temporary ID for new partner
      name: '',
      url: '',
      image: ''
    });
    setIsEditDialogOpen(true);
  };

  const handleEditPartner = (id: number) => {
    const partner = mediaPartners.find(p => p.id === id);
    if (partner) {
      setIsNewPartner(false);
      setCurrentPartner({ ...partner });
      setIsEditDialogOpen(true);
    }
  };

  const handleViewPartner = (id: number) => {
    const partner = mediaPartners.find(p => p.id === id);
    if (partner) {
      setCurrentPartner({ ...partner });
      setIsViewDialogOpen(true);
    }
  };

  const handleExternalLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error("Bu medya ortağı için bir URL tanımlanmamış.");
    }
  };

  // Replace the handleImageChange function with this updated version
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('destination', 'media-partners'); // Store in public/media-partners folder

        // Show loading state
        toast.loading("Logo yükleniyor...");

        // Upload the file using existing API
        const response = await fetch('http://localhost:3001/api/upload?destination=media-partners', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Dosya yükleme hatası');
        }

        const data = await response.json();

        // Update the partner with the uploaded file URL
        setCurrentPartner({ ...currentPartner, image: data.filePath });
        toast.dismiss();
        toast.success("Logo başarıyla yüklendi");
      } catch (error) {
        console.error("Dosya yükleme hatası:", error);
        toast.dismiss();
        toast.error("Logo yüklenirken bir hata oluştu");
      }
    }
  };

  const handleSavePartner = async () => {
    if (!currentPartner.name) {
      toast.error("Medya ortağı adı gereklidir.");
      return;
    }

    setSaving(true);
    try {
      if (isNewPartner) {
        // Add new partner using the API function
        await addMediaPartnersData(currentPartner);
        toast.success("Yeni medya ortağı başarıyla eklendi.");
      } else {
        // Update existing partner
        const updatedPartners = mediaPartners.map(p =>
          p.id === currentPartner.id ? currentPartner : p
        );
        await updateMediaPartnersData({ mediaPartners: updatedPartners });
        toast.success("Medya ortağı başarıyla güncellendi.");
      }

      // Refresh data after add/update
      fetchData();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Veri çekme sırasında hata oluştu", error);
      toast.error("Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
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
                  <BreadcrumbPage>Basın</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Newspaper className="h-6 w-6" />
                Medya Ortakları Yönetimi
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Medya ortaklarını ekleyin, düzenleyin veya silin
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex bg-secondary rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="px-3 gap-1"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  className="px-3 gap-1"
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Tablo</span>
                </Button>
              </div>
              <Button onClick={handleAddPartner} className="flex items-center gap-1 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Yeni Medya Ortağı Ekle
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : mediaPartners.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Henüz medya ortağı eklenmemiş</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                  Yeni bir medya ortağı ekleyerek başlayabilirsiniz. Medya ortakları, basın sayfanızda görüntülenecektir.
                </p>
                <Button onClick={handleAddPartner} className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Yeni Medya Ortağı Ekle
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === "table" ? (
            <div className="rounded-md border overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Medya Ortağı</TableHead>
                    <TableHead>Web Sitesi</TableHead>
                    <TableHead className="w-[150px] text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mediaPartners.map((partner) => (
                    <TableRow key={partner.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{partner.id}</TableCell>
                      <TableCell>
                        <div className="h-14 w-14 rounded-md overflow-hidden border bg-muted">
                          <Image
                            src={partner.image || "/placeholder.svg"}
                            alt={partner.name}
                            width={56}
                            height={56}
                            className="h-full w-full object-contain"
                            unoptimized
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <a href={partner.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px]">
                          {partner.url || "URL belirtilmemiş"}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewPartner(partner.id)}
                            title="Görüntüle"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditPartner(partner.id)}
                            title="Düzenle"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onDelete(partner.id)}
                            title="Sil"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mediaPartners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden transition-all hover:shadow-md group">
                  <div className="relative aspect-video overflow-hidden bg-muted flex items-center justify-center p-4">
                    <Image
                      src={partner.image || "/placeholder.svg"}
                      alt={partner.name}
                      width={400}
                      height={300}
                      className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewPartner(partner.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditPartner(partner.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => onDelete(partner.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{partner.name}</h3>
                      <Badge variant="outline" className="text-xs">ID: {partner.id}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {partner.url || "URL belirtilmemiş"}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleEditPartner(partner.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleExternalLink(partner.url)}
                    >
                      <Link2 className="h-4 w-4 mr-1" />
                      Ziyaret Et
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Silme onay dialogu */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Medya Ortağını Sil</DialogTitle>
              <DialogDescription>
                Bu medya ortağını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                İptal
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Sil
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Düzenleme/Ekleme dialogu */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isNewPartner ? "Yeni Medya Ortağı Ekle" : "Medya Ortağını Düzenle"}
              </DialogTitle>
              <DialogDescription>
                {isNewPartner
                  ? "Yeni bir medya ortağı eklemek için aşağıdaki formu doldurun."
                  : "Medya ortağı bilgilerini güncellemek için aşağıdaki formu düzenleyin."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Medya Ortağı Adı</Label>
                    <Input
                      id="name"
                      value={currentPartner.name}
                      onChange={(e) => setCurrentPartner({ ...currentPartner, name: e.target.value })}
                      placeholder="Medya ortağı adını girin"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">Web Sitesi URL</Label>
                    <Input
                      id="url"
                      value={currentPartner.url}
                      onChange={(e) => setCurrentPartner({ ...currentPartner, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>

                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Logo</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Önerilen boyut: 200x100 piksel, maksimum 2MB
                    </p>
                  </div>

                  {currentPartner.image && (
                    <div className="mt-4">
                      <Label>Logo Önizleme</Label>
                      <div className="mt-2 aspect-video rounded-md overflow-hidden border bg-muted flex items-center justify-center p-4">
                        <Image
                          src={currentPartner.image}
                          alt="Logo önizleme"
                          width={400}
                          height={300}
                          className="max-h-full max-w-full object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Logo URL (İsteğe Bağlı)</Label>
                    <Input
                      id="imageUrl"
                      value={currentPartner.image}
                      onChange={(e) => setCurrentPartner({ ...currentPartner, image: e.target.value })}
                      placeholder="Logo URL'sini girin"
                    />
                    <p className="text-xs text-muted-foreground">
                      Logo yüklemek yerine doğrudan URL girebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <X className="h-4 w-4 mr-1" />
                İptal
              </Button>
              <Button onClick={handleSavePartner} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Kaydet
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Görüntüleme dialogu */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Medya Ortağı Detayları</DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="flex justify-center">
                <div className="h-40 w-40 rounded-md overflow-hidden border bg-muted flex items-center justify-center p-4">
                  <Image
                    src={currentPartner.image || "/placeholder.svg"}
                    alt={currentPartner.name}
                    width={160}
                    height={160}
                    className="max-h-full max-w-full object-contain"
                    unoptimized
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{currentPartner.name}</h3>
                  <Badge variant="outline" className="mt-1">ID: {currentPartner.id}</Badge>
                </div>

                <div className="space-y-1">
                  <Label>Web Sitesi</Label>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={currentPartner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {currentPartner.url || "URL belirtilmemiş"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Kapat
              </Button>
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                handleEditPartner(currentPartner.id);
              }}>
                <Edit className="h-4 w-4 mr-1" />
                Düzenle
              </Button>
              {currentPartner.url && (
                <Button onClick={() => handleExternalLink(currentPartner.url)}>
                  <Link2 className="h-4 w-4 mr-1" />
                  Ziyaret Et
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}