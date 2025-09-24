"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Tab components
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import { updatePassword, updateUser } from "@/lib/api";

export default function UserSettingsPage() {
  const { user } = useSelector((state: RootState) => state.user);

  // Örnek kullanıcı verisi
  const [userInfo, setUserInfo] = useState({
    id: user?.user?.id,
    name: user?.user?.name,
    email: user?.user?.email,
    groupId: user?.user?.group_id,
    status: user?.user?.status
  });

  const [security, setSecurity] = useState({
    userId: user?.user?.id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedTab, setSelectedTab] = useState("general");

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(security.oldPassword && security.newPassword && security.confirmPassword)
    {
      if(security.newPassword == security.confirmPassword)
      {
        try{
          await updatePassword(security);
        }
        catch{
          toast(
            "Hata",
            {
              description: "Şifre değiştirilirken bir hata oluştu.",
            })
        }
      }
      else{
        toast.error("Hata", { description: "Şifreler uyuşmuyor." })
      }
    }
    else{
      try {
        await updateUser(userInfo);
  
      }
      catch {
        toast(
          "Hata",
          {
            description: "Değişiklikler kaydedilirken bir hata oluştu.",
          })
      }
    }
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
                  <BreadcrumbLink href="/panel/settings/user">Ayarlar</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kullanıcı Ayarları</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-4 py-6">
          <Card className="rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader className="pb-0 mb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="tracking-tight text-lg font-medium">Kullanıcı Ayarları</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Tablar */}
              <Tabs defaultValue="general" onValueChange={handleTabChange}>
                <TabsList className="flex space-x-4">
                  <TabsTrigger value="general" className={`text-sm ${selectedTab === "general" ? "font-semibold text-primary" : ""}`}>
                    Genel Bilgiler
                  </TabsTrigger>
                  <TabsTrigger value="security" className={`text-sm ${selectedTab === "security" ? "font-semibold text-primary" : ""}`}>
                    Güvenlik
                  </TabsTrigger>
                </TabsList>

                {/* Genel Bilgiler */}
                <TabsContent value="general">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Ad</label>
                      <input
                        id="name"
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="mt-2 p-2 border rounded w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">E-posta</label>
                      <input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="mt-2 p-2 border rounded w-full"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Güvenlik */}
                <TabsContent value="security">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="oldPassword" className="block text-sm font-medium text-muted-foreground">Eski Şifre</label>
                      <input
                        id="oldPassword"
                        type="password"
                        value={security.oldPassword}
                        onChange={(e) => setSecurity({ ...security, oldPassword: e.target.value })}
                        className="mt-2 p-2 border rounded w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-muted-foreground">Yeni Şifre</label>
                      <input
                        id="newPassword"
                        type="password"
                        value={security.newPassword}
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        className="mt-2 p-2 border rounded w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground">Yeni Şifreyi Onayla</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        className="mt-2 p-2 border rounded w-full"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Kaydet Butonu */}
              <div className="flex justify-end mt-4">
                <Button onClick={handleSubmit}>Kaydet</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
