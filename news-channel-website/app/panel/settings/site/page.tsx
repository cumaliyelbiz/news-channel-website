"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Tab components
import { fetchSiteSettingsData, updateSiteSettingsData } from "@/lib/api";
import { toast } from "sonner";

const SiteSettingsPage = () => {

  // State variables for site settings
  const [siteName, setSiteName] = useState<string>("");
  const [siteDescription, setSiteDescription] = useState<string>("");

  const [seoTitle, setSeoTitle] = useState<string>("Test");
  const [seoDescription, setSeoDescription] = useState<string>("Test");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSiteSettingsData();
        setSiteName(data.contact.name);
        setSiteDescription(data.contact.description);

      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    }

    fetchData()
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        name: siteName,
        description: siteDescription,
      }
      await updateSiteSettingsData(data);

    }
    catch {
      toast(
        "Hata",
        {
          description: "Değişiklikler kaydedilirken bir hata oluştu.",
        })
    }
    console.log("Site Name:", siteName);
    console.log("Site Description:", siteDescription);
    console.log("SEO Title:", seoTitle);
    console.log("SEO Description:", seoDescription);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/panel/settings/site">Ayarlar</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Site Ayarları</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-4 py-6">
          <Card className="rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader className="pb-0 mb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="tracking-tight text-lg font-medium">Site Ayarları</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Tabs for different sections */}
              <Tabs defaultValue="general">
                <TabsList className="flex space-x-4 border-b">
                  <TabsTrigger value="general" className="text-sm">Genel Ayarlar</TabsTrigger>
                  <TabsTrigger value="seo" className="text-sm">SEO Ayarları</TabsTrigger>
                </TabsList>

                {/* Genel Ayarlar */}
                <TabsContent value="general">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-muted-foreground">Site Adı</label>
                    <input
                      id="siteName"
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="mt-2 p-2 border rounded w-full"
                      placeholder="Site Adınızı Girin"
                    />
                  </div>

                  <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-muted-foreground">Site Açıklaması</label>
                    <textarea
                      id="siteDescription"
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      className="mt-2 p-2 border rounded w-full"
                      placeholder="Site Açıklamanızı Girin"
                      rows={3}
                    />
                  </div>
                </TabsContent>

                {/* SEO Ayarları */}
                <TabsContent value="seo">
                  <div>
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-muted-foreground">SEO Başlık</label>
                    <input
                      id="seoTitle"
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="mt-2 p-2 border rounded w-full"
                      placeholder="Örneğin: Example Site"
                    />
                  </div>
                  <div>
                    <label htmlFor="seoDescription" className="block text-sm font-medium text-muted-foreground">SEO Açıklaması</label>
                    <textarea
                      id="seoDescription"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="mt-2 p-2 border rounded w-full"
                      placeholder="Site açıklamanızı girin"
                      rows={3}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Kaydet Butonu */}
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>Kaydet</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SiteSettingsPage;
