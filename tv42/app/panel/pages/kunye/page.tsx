"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { fetchKunyePageData, updateKunyePageData } from '@/lib/api';
import { toast } from "sonner";
import { Building, Users, User, FileText, Save } from "lucide-react";

// At the top of the file, add these imports
import { Upload } from "lucide-react";
import { useRef } from "react";

// Yeni veri yapısı için interface
interface KunyeData {
  id?: number;
  unvan: string;
  logo: string;
  yayin_ortami: string;
  lisans_tipi: string;
  yayin_turu: string;
  adres: string;
  telefon_faks: string;
  internet_adresi: string;
  email: string;
  kep_adresi: string;
  vergi_daire_no: string;
  mersis_no: string;
  sorumlular: ResponsibleManager[];
  izleyici_temsilcisi_ad: string;
  izleyici_temsilcisi_email: string;
  dokumanlar: Document[];
}

interface ResponsibleManager {
  name: string;
  title: string;
  email: string;
}

interface Document {
  name: string;
  link: string;
}

export default function EditPage() {
  // Künye verisi için state
  const [kunyeData, setKunyeData] = useState<KunyeData>({
    unvan: "",
    logo: "",
    yayin_ortami: "",
    lisans_tipi: "",
    yayin_turu: "",
    adres: "",
    telefon_faks: "",
    internet_adresi: "",
    email: "",
    kep_adresi: "",
    vergi_daire_no: "",
    mersis_no: "",
    sorumlular: [{ name: "", title: "", email: "" }],
    izleyici_temsilcisi_ad: "",
    izleyici_temsilcisi_email: "",
    dokumanlar: [{ name: "", link: "" }]
  });
  
  const [originalData, setOriginalData] = useState<KunyeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  // Verileri fetch et
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchKunyePageData();
        
        if (data) {
          setKunyeData(data);
          setOriginalData(JSON.parse(JSON.stringify(data))); // Deep copy
        }
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
        toast.error("Veri yüklenirken bir hata oluştu.");
      }
    };

    fetchData();
  }, []);

  // Form değişikliklerini kontrol et
  useEffect(() => {
    if (originalData) {
      const isChanged = JSON.stringify(kunyeData) !== JSON.stringify(originalData);
      setFormChanged(isChanged);
    }
  }, [kunyeData, originalData]);

  // Şirket bilgileri değişiklik handler'ı
  const handleCompanyInfoChange = (field: keyof KunyeData, value: string) => {
    setKunyeData(prev => ({ ...prev, [field]: value }));
  };

  // Sorumlu müdürler için handler'lar
  const handleManagerChange = (index: number, field: keyof ResponsibleManager, value: string) => {
    const newManagers = [...kunyeData.sorumlular];
    newManagers[index] = { ...newManagers[index], [field]: value };
    setKunyeData(prev => ({ ...prev, sorumlular: newManagers }));
  };

  const addManager = () => {
    setKunyeData(prev => ({
      ...prev,
      sorumlular: [...prev.sorumlular, { name: "", title: "", email: "" }]
    }));
  };

  const deleteManager = (index: number) => {
    const updatedManagers = kunyeData.sorumlular.filter((_, idx) => idx !== index);
    setKunyeData(prev => ({ ...prev, sorumlular: updatedManagers }));
  };

  // İzleyici temsilcisi için handler
  const handleRepresentativeChange = (field: 'izleyici_temsilcisi_ad' | 'izleyici_temsilcisi_email', value: string) => {
    setKunyeData(prev => ({ ...prev, [field]: value }));
  };

  // Dokümanlar için handler'lar
  const handleDocumentChange = (index: number, field: 'name' | 'link', value: string) => {
    const newDocuments = [...kunyeData.dokumanlar];
    newDocuments[index] = { ...newDocuments[index], [field]: value };
    setKunyeData(prev => ({ ...prev, dokumanlar: newDocuments }));
  };

  const addDocument = () => {
    setKunyeData(prev => ({
      ...prev,
      dokumanlar: [...prev.dokumanlar, { name: "", link: "" }]
    }));
  };

  const deleteDocument = (index: number) => {
    const updatedDocuments = kunyeData.dokumanlar.filter((_, idx) => idx !== index);
    setKunyeData(prev => ({ ...prev, dokumanlar: updatedDocuments }));
  };

  // Form gönderme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateKunyePageData(kunyeData);
      setOriginalData(JSON.parse(JSON.stringify(kunyeData))); // Deep copy
      toast.success("Başarılı", { description: "Künye sayfası verileri başarıyla güncellendi." });
      setFormChanged(false);
    } catch (error) {
      console.error("Veri güncellenirken hata oluştu:", error);
      toast.error("Hata", { description: "Güncelleme sırasında bir hata oluştu." });
    } finally {
      setIsSaving(false);
    }
  };

  // Add fileInputRefs and handleFileUpload function after your existing handlers

// Add file upload reference and handler
const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

const handleFileUpload = async (index: number, file: File) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination', 'documents'); // Store in public/documents folder

    // Upload the file using existing API
    const response = await fetch('http://localhost:3001/api/upload?destination=documents', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Dosya yükleme hatası');
    }

    const data = await response.json();

    // Update the document link with the uploaded file URL
    const newDocuments = [...kunyeData.dokumanlar];
    newDocuments[index] = { 
      ...newDocuments[index], 
      link: data.filePath, // Use filePath from your API response
      name: newDocuments[index].name || file.name // Use existing name or filename
    };

    setKunyeData(prev => ({ ...prev, dokumanlar: newDocuments }));
    toast.success("Dosya başarıyla yüklendi");
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    toast.error("Dosya yüklenirken bir hata oluştu");
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
                  <BreadcrumbPage>Künye</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Kaydet butonu */}
          <div className="ml-auto mr-4">
            <Button onClick={handleSubmit} disabled={isSaving || !formChanged} className="px-4">
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
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
                <CardTitle className="tracking-tight text-lg font-medium">Künye Düzenle</CardTitle>
                {formChanged && <span className="text-sm text-amber-500">Kaydedilmemiş değişiklikler var</span>}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tabs for different sections */}
              <Tabs defaultValue="company">
                <TabsList className="flex space-x-4">
                  <TabsTrigger value="company">
                    <Building className="h-4 w-4 mr-2" />
                    Şirket Bilgileri
                  </TabsTrigger>
                  <TabsTrigger value="managers">
                    <Users className="h-4 w-4 mr-2" />
                    Sorumlu Müdürler
                  </TabsTrigger>
                  <TabsTrigger value="representative">
                    <User className="h-4 w-4 mr-2" />
                    İzleyici Temsilcisi
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    <FileText className="h-4 w-4 mr-2" />
                    Dokümanlar
                  </TabsTrigger>
                </TabsList>

                {/* Şirket Bilgileri */}
                <TabsContent value="company" className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Ünvanı</label>
                    <Input
                      value={kunyeData.unvan}
                      onChange={(e) => handleCompanyInfoChange('unvan', e.target.value)}
                      className="w-full"
                      placeholder="Ünvan bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Logo/Çağrı İşareti</label>
                    <Input
                      value={kunyeData.logo}
                      onChange={(e) => handleCompanyInfoChange('logo', e.target.value)}
                      className="w-full"
                      placeholder="Logo/Çağrı İşareti bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Yayın Ortamı</label>
                    <Input
                      value={kunyeData.yayin_ortami}
                      onChange={(e) => handleCompanyInfoChange('yayin_ortami', e.target.value)}
                      className="w-full"
                      placeholder="Yayın Ortamı bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Lisans Tipi</label>
                    <Input
                      value={kunyeData.lisans_tipi}
                      onChange={(e) => handleCompanyInfoChange('lisans_tipi', e.target.value)}
                      className="w-full"
                      placeholder="Lisans Tipi bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Yayın Türü</label>
                    <Input
                      value={kunyeData.yayin_turu}
                      onChange={(e) => handleCompanyInfoChange('yayin_turu', e.target.value)}
                      className="w-full"
                      placeholder="Yayın Türü bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Yazışma Adresi</label>
                    <Textarea
                      value={kunyeData.adres}
                      onChange={(e) => handleCompanyInfoChange('adres', e.target.value)}
                      className="w-full"
                      placeholder="Yazışma Adresi bilgisini girin"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Telefon ve Faks</label>
                    <Input
                      value={kunyeData.telefon_faks}
                      onChange={(e) => handleCompanyInfoChange('telefon_faks', e.target.value)}
                      className="w-full"
                      placeholder="Telefon ve Faks bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">İnternet Adresi</label>
                    <Input
                      value={kunyeData.internet_adresi}
                      onChange={(e) => handleCompanyInfoChange('internet_adresi', e.target.value)}
                      className="w-full"
                      placeholder="İnternet Adresi bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">E-Posta Adresi</label>
                    <Input
                      value={kunyeData.email}
                      onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                      className="w-full"
                      placeholder="E-Posta Adresi bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Kep Adresi</label>
                    <Input
                      value={kunyeData.kep_adresi}
                      onChange={(e) => handleCompanyInfoChange('kep_adresi', e.target.value)}
                      className="w-full"
                      placeholder="Kep Adresi bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Vergi Daire / No</label>
                    <Input
                      value={kunyeData.vergi_daire_no}
                      onChange={(e) => handleCompanyInfoChange('vergi_daire_no', e.target.value)}
                      className="w-full"
                      placeholder="Vergi Daire / No bilgisini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Mersis No</label>
                    <Input
                      value={kunyeData.mersis_no}
                      onChange={(e) => handleCompanyInfoChange('mersis_no', e.target.value)}
                      className="w-full"
                      placeholder="Mersis No bilgisini girin"
                    />
                  </div>
                </TabsContent>

                {/* Sorumlu Müdürler */}
                <TabsContent value="managers" className="space-y-4">
                  {kunyeData.sorumlular.map((manager, index) => (
                    <Card key={index} className="p-4 border">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium">Sorumlu Müdür #{index + 1}</h3>
                        <Button 
                          onClick={() => deleteManager(index)} 
                          variant="outline" 
                          size="sm"
                          disabled={kunyeData.sorumlular.length <= 1}
                        >
                          Sil
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">Adı Soyadı</label>
                          <Input
                            value={manager.name}
                            onChange={(e) => handleManagerChange(index, 'name', e.target.value)}
                            className="w-full mt-1"
                            placeholder="Adı Soyadı girin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">Ünvan</label>
                          <Input
                            value={manager.title}
                            onChange={(e) => handleManagerChange(index, 'title', e.target.value)}
                            className="w-full mt-1"
                            placeholder="Ünvan girin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">E-posta</label>
                          <Input
                            value={manager.email}
                            onChange={(e) => handleManagerChange(index, 'email', e.target.value)}
                            className="w-full mt-1"
                            placeholder="E-posta girin"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addManager} variant="default">Sorumlu Müdür Ekle</Button>
                </TabsContent>

                {/* İzleyici Temsilcisi */}
                <TabsContent value="representative" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Adı Soyadı</label>
                    <Input
                      value={kunyeData.izleyici_temsilcisi_ad}
                      onChange={(e) => handleRepresentativeChange('izleyici_temsilcisi_ad', e.target.value)}
                      className="w-full mt-1"
                      placeholder="Adı Soyadı girin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">E-posta</label>
                    <Input
                      value={kunyeData.izleyici_temsilcisi_email}
                      onChange={(e) => handleRepresentativeChange('izleyici_temsilcisi_email', e.target.value)}
                      className="w-full mt-1"
                      placeholder="E-posta girin"
                    />
                  </div>
                </TabsContent>
                
                {/* Dokümanlar */}
                <TabsContent value="documents" className="space-y-4">
                  {kunyeData.dokumanlar.map((doc, index) => (
                    <Card key={index} className="p-4 border">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium">Doküman #{index + 1}</h3>
                        <Button 
                          onClick={() => deleteDocument(index)} 
                          variant="outline" 
                          size="sm"
                          disabled={kunyeData.dokumanlar.length <= 1}
                        >
                          Sil
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">Doküman Adı</label>
                          <Input
                            value={doc.name}
                            onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                            className="w-full mt-1"
                            placeholder="Doküman adını girin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">İndirme Linki</label>
                          <div className="flex mt-1 gap-2">
                            <Input
                              value={doc.link}
                              onChange={(e) => handleDocumentChange(index, 'link', e.target.value)}
                              className="flex-1"
                              placeholder="Doküman indirme linkini girin"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                if (!fileInputRefs.current) fileInputRefs.current = [];
                                fileInputRefs.current[index]?.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Dosya Yükle
                            </Button>
                            <input
                              type="file"
                              className="hidden"
                              ref={(el) => {
                                if (!fileInputRefs.current) fileInputRefs.current = [];
                                fileInputRefs.current[index] = el;
                              }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileUpload(index, e.target.files[0]);
                                }
                              }}
                            />
                          </div>
                          {doc.link && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Dosyayı Görüntüle
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addDocument} variant="default">Doküman Ekle</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );}
