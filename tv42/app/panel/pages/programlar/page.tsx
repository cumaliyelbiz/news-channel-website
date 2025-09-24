"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { fetchProgramsData, deleteProgramData } from '@/lib/api';
import { toast } from "sonner";
import { Tv, Calendar, Clock, User, Edit, Trash, Plus, Eye, LayoutGrid, List } from "lucide-react";
import Image from "next/image";

interface Program {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  category?: string;
  broadcast_day?: string;
  broadcast_time?: string;
  presenter?: string;
  is_active?: boolean;
}

export default function ProgramsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<string>("grid");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [programIdToDelete, setProgramIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchProgramsData();
      setPrograms(data.programs || []);
    } catch (error) {
      console.error("Veri çekme sırasında hata oluştu:", error);
      toast.error("Veri çekme sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    setProgramIdToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (programIdToDelete !== null) {
      try {
        await deleteProgramData(programIdToDelete);
        toast.success("Program başarıyla silindi.");
        fetchData();
      } catch (error) {
        console.error("Program silinirken hata oluştu:", error);
        toast.error("Program silinirken bir hata oluştu.");
      } finally {
        setIsDialogOpen(false);
        setProgramIdToDelete(null);
      }
    }
  };

  const handleAddProgram = () => {
    router.push('/panel/pages/programlar/add');
  };

  const handleEditProgram = (id: number) => {
    router.push(`/panel/pages/programlar/edit/${id}`);
  };

  const handleViewProgram = (id: number) => {
    router.push(`/programlar/${encodeURIComponent(programs.find(p => p.id === id)?.id || '')}`);
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
                  <BreadcrumbPage>Programlar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Tv className="h-6 w-6" />
                Program Yönetimi
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Programları ekleyin, düzenleyin veya silin
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
              <Button onClick={handleAddProgram} className="flex items-center gap-1 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Yeni Program Ekle
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-background">
              <Tv className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Henüz program eklenmemiş</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Yeni bir program eklemek için Yeni Program Ekle butonuna tıklayın.
              </p>
              <Button onClick={handleAddProgram} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Program Ekle
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((program) => (
                <Card key={program.id} className="overflow-hidden">
                  {program.image ? (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={program.image || "/placeholder.svg"}
                        alt={program.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Tv className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{program.title}</h3>
                        {program.subtitle && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {program.subtitle}
                          </p>
                        )}
                      </div>
                      {program.category && (
                        <Badge variant="secondary" className="ml-2">
                          {program.category}
                        </Badge>
                      )}
                    </div>

                    {program.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {program.description?.replace(/"/g, "&quot;")}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {program.presenter && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          {program.presenter}
                        </div>
                      )}
                      {program.broadcast_day && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {program.broadcast_day}
                        </div>
                      )}
                      {program.broadcast_time && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {program.broadcast_time}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProgram(program.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Görüntüle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProgram(program.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(program.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Sil
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Görsel</TableHead>
                    <TableHead>Program Adı</TableHead>
                    <TableHead className="hidden md:table-cell">Alt Başlık</TableHead>
                    <TableHead className="hidden md:table-cell">Sunucu</TableHead>
                    <TableHead className="hidden md:table-cell">Kategori</TableHead>
                    <TableHead className="hidden md:table-cell">Yayın Zamanı</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        {program.image ? (
                          <div className="w-16 h-12 relative rounded overflow-hidden">
                            <Image
                              src={program.image || "/placeholder.svg"}
                              alt={program.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-12 bg-muted flex items-center justify-center rounded">
                            <Tv className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{program.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{program.subtitle || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">{program.presenter || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {program.category ? (
                          <Badge variant="secondary">{program.category}</Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {program.broadcast_day && program.broadcast_time ? (
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {program.broadcast_day}, <Clock className="h-3 w-3 mx-1" /> {program.broadcast_time}
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewProgram(program.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProgram(program.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onDelete(program.id)}
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
          )}
        </div>

        {/* Silme onay dialog'u */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programı Sil</DialogTitle>
              <DialogDescription>
                Bu programı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Sil
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
};