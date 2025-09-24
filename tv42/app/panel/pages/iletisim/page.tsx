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
import { fetchContactPageData, updateContactPageData } from '@/lib/api';
import { toast } from "sonner";
import { Contact, MapPlus, Save } from "lucide-react";
import { debounce } from 'lodash';

import { useRef } from "react";

interface ContactPageData {
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  contact: {
    address: string;
    phone: string[];
    faxs: string[];
    email: string[];
    maps: string;
  };
}

// Utility function to robustly parse contact fields
function parseContactField(field: unknown): string[] {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field.flatMap(item =>
      typeof item === "string"
        ? item.split(",").map(s => s.trim()).filter(Boolean)
        : []
    );
  }
  if (typeof field === "string") {
    try {
      // Try to parse as JSON array
      const arr = JSON.parse(field);
      if (Array.isArray(arr)) {
        return arr.flatMap(item =>
          typeof item === "string"
            ? item.split(",").map(s => s.trim()).filter(Boolean)
            : []
        );
      }
    } catch {
      // Not a JSON array, treat as comma-separated string
      return field.split(",").map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export default function EditPage() {
  // State variables for contact info
  const initialPhones = [""]; // Başlangıç telefon numaraları
  const initialFaxs = [""]; // Başlangıç telefon numaraları
  const initialEmails = [""]; // Başlangıç e-posta adresleri
  const initialAddress = ""; // Başlangıç adresi
  const initialGoogleMapsLink = ""; // Başlangıç Google Maps bağlantısı
  const [initialData, setInitialData] = useState<ContactPageData | null>(null);

  const [phones, setPhones] = useState<string[]>(initialPhones); // Dizi olarak telefon numaraları
  const [faxs, setFaxs] = useState<string[]>(initialFaxs);
  const [emails, setEmails] = useState<string[]>(initialEmails);
  const [address, setAddress] = useState<string>(initialAddress);
  const [googleMapsLink, setGoogleMapsLink] = useState<string>(initialGoogleMapsLink);
  
  const [formChanged, setFormChanged] = useState(false)

  // Verileri fetch et
  useEffect(() => {
    const fetchData = async () => {
      try {
        const datas = await fetchContactPageData();
        const contact = datas.contact || {};

        const parsedPhones = parseContactField(contact.phone);
        const parsedFaxs = parseContactField(contact.faxs);
        const parsedEmails = parseContactField(contact.email);

        setPhones(parsedPhones);
        setFaxs(parsedFaxs);
        setEmails(parsedEmails);
        setAddress(contact.address || "");
        setGoogleMapsLink(contact.maps || "");
        // Store normalized values for change detection
        setInitialData({
          ...datas,
          contact: {
            ...contact,
            phone: parsedPhones,
            faxs: parsedFaxs,
            email: parsedEmails,
            address: contact.address || "",
            maps: contact.maps || "",
          }
        });
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

const debouncedCheckIfFormChanged = useRef<ReturnType<typeof debounce>>(debounce(() => {}, 300));

  useEffect(() => {
    // Create a new debounced function whenever dependencies change
    debouncedCheckIfFormChanged.current = debounce(() => {
      if (!initialData) return;
      const isChanged =
        JSON.stringify(phones) !== JSON.stringify(initialData.contact.phone) ||
        JSON.stringify(faxs) !== JSON.stringify(initialData.contact.faxs) ||
        JSON.stringify(emails) !== JSON.stringify(initialData.contact.email) ||
        address !== initialData.contact.address ||
        googleMapsLink !== initialData.contact.maps;
      setFormChanged(isChanged);
    }, 300);

    // Cleanup old debounced function
    return () => {
      if (debouncedCheckIfFormChanged.current?.cancel) {
        debouncedCheckIfFormChanged.current.cancel();
      }
    };
  }, [phones, faxs, emails, address, googleMapsLink, initialData]);

  useEffect(() => {
    // Always call the latest debounced function
    if (debouncedCheckIfFormChanged.current) {
      debouncedCheckIfFormChanged.current();
    }
  }, [phones, faxs, emails, address, googleMapsLink, initialData]);

  const handleDeletePhone = (index: number) => {
    const updatedPhones = phones.filter((_, idx) => idx !== index); // Seçilen index'teki telefon numarasını sil
    setPhones(updatedPhones);
  };

  const handleDeleteFax = (index: number) => {
    const updatedFaxs = faxs.filter((_, idx) => idx !== index); // Seçilen index'teki telefon numarasını sil
    setFaxs(updatedFaxs);
  };

  const handleDeleteEmail = (index: number) => {
    const updatedEmails = emails.filter((_, idx) => idx !== index); // Seçilen index'teki e-posta adresini sil
    setEmails(updatedEmails);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const handleFaxChange = (index: number, value: string) => {
    const newFaxs = [...faxs];
    newFaxs[index] = value;
    setFaxs(newFaxs);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addPhone = () => {
    setPhones([...phones, ""]); // Yeni bir telefon numarası ekle
  };

  const addFax = () => {
    setFaxs([...faxs, ""]); // Yeni bir telefon numarası ekle
  };

  const addEmail = () => {
    setEmails([...emails, ""]); // Yeni bir e-posta adresi ekle
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      address: address,
      phone: phones,
      fax: faxs,
      email: emails,
      maps: googleMapsLink,
    };

    try {
      await updateContactPageData(updatedData);
      // Update the initial data after successful save

      toast.success("Başarılı", { description: "İletişim sayfası verileri başarıyla güncellendi." });
      setFormChanged(false);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast.error("Hata", { description: "Güncelleme sırasında bir hata oluştu." });
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
                  <BreadcrumbPage>İletişim</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
              </Breadcrumb>
          </div>

          {/* Kaydet butonu */}
          <div className="ml-auto mr-4">
            <Button onClick={handleSubmit} disabled={!formChanged} className="px-4">
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </header>

        {/* Form for editing the page */}
        <div className="px-4 py-6">
          <Card className="rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader className="pb-0 mb-4">
              <div className="flex space-x-2 justify-between">
                <CardTitle className="tracking-tight text-lg font-medium">İletişim Düzenle</CardTitle>
                {formChanged && <span className="text-sm text-amber-500">Kaydedilmemiş değişiklikler var</span>}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tabs for different sections */}
              <Tabs defaultValue="content">
                <TabsList className="flex space-x-4">
                  <TabsTrigger value="content">
                    <Contact className="h-4 w-4 mr-2" />
                    İletişim Bilgileri
                  </TabsTrigger>
                  <TabsTrigger value="maps">
                    <MapPlus className="h-4 w-4 mr-2" />
                    Google Maps Linki
                  </TabsTrigger>
                </TabsList>

                {/* İletişim Bilgileri */}
                <TabsContent value="content">
                  <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground">Telefon</label>
                  {phones.map((phone, index) => (
                    <div key={index} className="flex items-center">
                      <Input
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                        className="my-2 flex-1"
                        placeholder="Telefon numaranızı girin"
                      />
                      <Button onClick={() => handleDeletePhone(index)} className="ml-2" variant="outline">
                        Sil
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addPhone} className="ml-2" variant="default">Telefon Ekle</Button>

                  <label htmlFor="fax" className="block text-sm font-medium text-muted-foreground">Fax</label>
                  {faxs.map((fax, index) => (
                    <div key={index} className="flex items-center">
                      <Input
                        value={fax}
                        onChange={(e) => handleFaxChange(index, e.target.value)}
                        className="my-2 flex-1"
                        placeholder="Fax numaranızı girin"
                      />
                      <Button onClick={() => handleDeleteFax(index)} className="ml-2" variant="outline">
                        Sil
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addFax} className="ml-2" variant="default">Fax Ekle</Button>

                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">E-posta</label>

                  {emails.map((email, index) => (
                    <div key={index} className="flex items-center">
                      <Input
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        className="my-2 flex-1"
                        placeholder="E-posta adresinizi girin"
                      />
                      <Button onClick={() => handleDeleteEmail(index)} className="ml-2" variant="outline">
                        Sil
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addEmail} className="ml-2" variant="default">E-posta Ekle</Button>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-muted-foreground">Adres</label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-2"
                      placeholder="Adresinizi girin"
                      rows={3}
                    />
                  </div>
                </TabsContent>

                {/* Google Maps Linki */}
                <TabsContent value="maps">
                  <div>
                    <label htmlFor="googleMapsLink" className="block text-sm font-medium text-muted-foreground">Google Maps Linki</label>
                    <Input
                      id="googleMapsLink"
                      value={googleMapsLink}
                      onChange={(e) => setGoogleMapsLink(e.target.value)}
                      className="mt-2"
                      placeholder="Google Maps URL'sini girin"
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
