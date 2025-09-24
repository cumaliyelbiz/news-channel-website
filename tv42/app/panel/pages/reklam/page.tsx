"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect, useCallback } from "react";
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
import { fetchAdvertisingData, updateAdvertisingData } from '@/lib/api';
import { toast } from "sonner";
import { PenSquare, ListPlus, Phone, Save, Plus } from "lucide-react";
import { debounce } from 'lodash';

interface AdvertisingData {
  introText: string;
  adOpportunities: string[];
  adBenefits: string[];
  contactPhone: string;
  contactEmail: string;
  contactNote: string;
}

export default function EditPage() {

  // State variables for advertising page
  const [introText, setIntroText] = useState<string>("");
  const [adOpportunities, setAdOpportunities] = useState<string[]>([""]);
  const [adBenefits, setAdBenefits] = useState<string[]>([""]);
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactNote, setContactNote] = useState<string>("");
  const [initialData, setInitialData] = useState<AdvertisingData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  // Verileri fetch et
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAdvertisingData();
        setIntroText(data.introText);
        setAdOpportunities(data.adOpportunities);
        setAdBenefits(data.adBenefits);
        setContactPhone(data.contactPhone);
        setContactEmail(data.contactEmail);
        setContactNote(data.contactNote);
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
      introText !== initialData.introText ||
      JSON.stringify(adOpportunities) !== JSON.stringify(initialData.adOpportunities) ||
      JSON.stringify(adBenefits) !== JSON.stringify(initialData.adBenefits) ||
      contactPhone !== initialData.contactPhone ||
      contactEmail !== initialData.contactEmail ||
      contactNote !== initialData.contactNote;

    setFormChanged(isChanged);  }, [initialData, introText, adOpportunities, adBenefits, contactPhone, contactEmail, contactNote]);

    const debouncedCheckIfFormChanged = useCallback(
      () => debounce(checkIfFormChanged, 300),
      [checkIfFormChanged]
    );
  
    useEffect(() => {
      const debouncedFn = debouncedCheckIfFormChanged();
      debouncedFn();
      return () => debouncedFn.cancel();
    }, [debouncedCheckIfFormChanged, introText, adOpportunities, adBenefits, contactPhone, contactEmail, contactNote]);
    
  // List item handlers
  const handleItemChange = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const addItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList([...list, ""]);
  };

  const deleteItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    const updatedList = list.filter((_, idx) => idx !== index);
    setList(updatedList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const updatedData = {
      introText,
      adOpportunities,
      adBenefits,
      contactPhone,
      contactEmail,
      contactNote
    };

    try {
      await updateAdvertisingData(updatedData);
      setInitialData(updatedData);
      toast.success("Başarılı", { description: "Reklam sayfası verileri başarıyla güncellendi." });
      setFormChanged(false);
    } catch (error) {
      console.error("Güncelleme sırasında hata oluştu:", error);
      toast.error("Hata", { description: "Güncelleme sırasında bir hata oluştu." });
    } finally {
      setIsSaving(false);
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
                  <BreadcrumbPage>Reklam</BreadcrumbPage>
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
                <CardTitle className="tracking-tight text-lg font-medium">Reklam Sayfası Düzenle</CardTitle>
                {formChanged && <span className="text-sm text-amber-500">Kaydedilmemiş değişiklikler var</span>}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tabs for different sections */}
              <Tabs defaultValue="content">
                <TabsList className="flex space-x-4">
                  <TabsTrigger value="content">
                    <PenSquare className="h-4 w-4 mr-2" />
                    İçerik
                  </TabsTrigger>
                  <TabsTrigger value="lists">
                    <ListPlus className="h-4 w-4 mr-2" />
                    Listeler
                  </TabsTrigger>
                  <TabsTrigger value="contact">
                    <Phone className="h-4 w-4 mr-2" />
                    İletişim
                  </TabsTrigger>
                </TabsList>

                {/* İçerik */}
                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Giriş Metni</label>
                    <Textarea
                      value={introText}
                      onChange={(e) => setIntroText(e.target.value)}
                      className="w-full"
                      placeholder="Reklam sayfası giriş metnini girin"
                      rows={5}
                    />
                  </div>
                </TabsContent>

                {/* Listeler */}
                <TabsContent value="lists" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Reklam Fırsatları</h3>
                      <Button 
                        onClick={() => addItem(adOpportunities, setAdOpportunities)} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ekle
                      </Button>
                    </div>
                    
                    {adOpportunities.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <Input
                          value={item}
                          onChange={(e) => handleItemChange(adOpportunities, setAdOpportunities, index, e.target.value)}
                          className="flex-1"
                          placeholder="Reklam fırsatını girin"
                        />
                        <Button 
                          onClick={() => deleteItem(adOpportunities, setAdOpportunities, index)} 
                          className="ml-2" 
                          variant="outline"
                          disabled={adOpportunities.length <= 1}
                        >
                          Sil
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 mt-8">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Reklam Avantajları</h3>
                      <Button 
                        onClick={() => addItem(adBenefits, setAdBenefits)} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ekle
                      </Button>
                    </div>
                    
                    {adBenefits.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <Input
                          value={item}
                          onChange={(e) => handleItemChange(adBenefits, setAdBenefits, index, e.target.value)}
                          className="flex-1"
                          placeholder="Reklam avantajını girin"
                        />
                        <Button 
                          onClick={() => deleteItem(adBenefits, setAdBenefits, index)} 
                          className="ml-2" 
                          variant="outline"
                          disabled={adBenefits.length <= 1}
                        >
                          Sil
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* İletişim */}
                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Telefon</label>
                    <Input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full"
                      placeholder="İletişim telefon numarasını girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">E-posta</label>
                    <Input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full"
                      placeholder="İletişim e-posta adresini girin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">İletişim Notu</label>
                    <Textarea
                      value={contactNote}
                      onChange={(e) => setContactNote(e.target.value)}
                      className="w-full"
                      placeholder="İletişim notunu girin"
                      rows={3}
                    />
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