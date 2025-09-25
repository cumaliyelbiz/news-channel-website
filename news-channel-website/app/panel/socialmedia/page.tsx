"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { fetchSiteSettingsData, updateSocialMediaData } from "@/lib/api";
import { toast } from "sonner";

interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

const SocialMediaSettingsPage = () => {
  const [socialMediaData, setSocialMediaData] = useState<SocialMedia>({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSiteSettingsData();
        setSocialMediaData(data.socialmedia);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, platform: keyof SocialMedia) => {
    setSocialMediaData({
      ...socialMediaData,
      [platform]: e.target.value,
    });
  };

  // Submit handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    try {

      await updateSocialMediaData(socialMediaData);

    } catch (error) {
      console.error("Kaydetme hatası:", error)
      toast(
        "Hata",
        {
          description: "Değişiklikler kaydedilirken bir hata oluştu.",
        })
    }
  }

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
                  <BreadcrumbLink href="/panel/socialmedia">Sosyal Medya</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sosyal Medya Ayarları</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-4 py-6">
          <Card className="rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader className="pb-0 mb-4">
              <CardTitle className="tracking-tight text-lg font-medium">Sosyal Medya Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Facebook Link */}
                <div>
                  <label className="block">Facebook Hesabı</label>
                  <Input
                    value={socialMediaData.facebook}
                    onChange={(e) => handleInputChange(e, 'facebook')}
                    className="mt-2"
                    placeholder="Facebook sayfanızın URL'si"
                  />
                </div>

                {/* Instagram Link */}
                <div>
                  <label className="block">Instagram Hesabı</label>
                  <Input
                    value={socialMediaData.instagram}
                    onChange={(e) => handleInputChange(e, 'instagram')}
                    className="mt-2"
                    placeholder="Instagram sayfanızın URL'si"
                  />
                </div>

                {/* Twitter Link */}
                <div>
                  <label className="block">Twitter Hesabı</label>
                  <Input
                    value={socialMediaData.twitter}
                    onChange={(e) => handleInputChange(e, 'twitter')}
                    className="mt-2"
                    placeholder="Twitter hesabınızın URL'si"
                  />
                </div>

                {/* LinkedIn Link */}
                <div>
                  <label className="block">LinkedIn Hesabı</label>
                  <Input
                    value={socialMediaData.linkedin}
                    onChange={(e) => handleInputChange(e, 'linkedin')}
                    className="mt-2"
                    placeholder="LinkedIn hesabınızın URL'si"
                  />
                </div>
                {/* YouTube Link */}
                <div>
                  <label className="block">YouTube Kanalı</label>
                  <Input
                    value={socialMediaData.youtube}
                    onChange={(e) => handleInputChange(e, 'youtube')}
                    className="mt-2"
                    placeholder="YouTube kanalınızın URL'si"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-4">
                  <Button className="text-sm" onClick={handleSave}>Kaydet</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SocialMediaSettingsPage;
