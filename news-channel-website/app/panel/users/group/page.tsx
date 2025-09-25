//group tablosu ve yetkiler tablosu olacak

"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchUsersGroupsPageData, addUsersGroups, updateUsersGroups, updateGroupPermissions } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUserPermissions } from "@/redux/slices/userSlice";

interface UserGroupFormModalProps {
  group: UserGroup | null;
  onClose: () => void;
  onSubmit: () => void;
}

// Modal Form for Creating or Editing Group
const UserGroupFormModal = ({ group, onClose, onSubmit }: UserGroupFormModalProps) => {
  const [name, setName] = useState(group ? group.name : "");
  const [description, setDescription] = useState(group ? group.description : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usersGroupsData = {
      id: group?.id,
      name,
      description
    };


    if (group?.id) {
      // Mevcut kullanıcıyı güncellemek için editUser fonksiyonunu çağırıyoruz
      await updateUsersGroups(usersGroupsData);
    } else {
      // Yeni kullanıcı eklemek için addUser fonksiyonunu çağırıyoruz
      await addUsersGroups(usersGroupsData);
    }

    onSubmit();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold">{group ? "Grup Düzenle" : "Yeni Grup Oluştur"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Grup Adı</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 p-2 border rounded w-full"
              placeholder="Grup Adı"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Açıklama</label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 p-2 border rounded w-full"
              placeholder="Grup Açıklaması"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" onClick={onClose} variant="secondary">Kapat</Button>
            <Button type="submit">{group ? "Düzenle" : "Oluştur"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PermissionsFormModalProps {
  groupPermission: UserGroup | null;
  allPermissions: Permissions[];
  onClose: () => void;
  onSubmit: (data: UpdatedGroupData) => void;
}

const PermissionsFormModal = ({ groupPermission, allPermissions, onClose, onSubmit }: PermissionsFormModalProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Permissions[]>([]);
  // REMOVE this line (activeTab is unused)
  // const [activeTab, setActiveTab] = useState<string>('Genel');  // Varsayılan sekme 'Genel'


  // Grup verisi geldiğinde izinleri otomatik olarak seçili hale getirelim
  useEffect(() => {

    let groupPerms: Permissions[] = [];
    if (Array.isArray(groupPermission?.permissions)) {
      groupPerms = groupPermission.permissions;
    } else if (typeof groupPermission?.permissions === "string") {
      try {
        groupPerms = JSON.parse(groupPermission.permissions);
      } catch (e) {
        console.error("permissions JSON parse error:", e);
        groupPerms = [];
      }
    }

    if (groupPerms.length > 0) {
      const selected = allPermissions.filter(ap =>
        groupPerms.some(gp => gp.id === ap.id)
      );
      setSelectedPermissions(selected);
    } else {
      setSelectedPermissions([]);
    }
  }, [groupPermission, allPermissions]);


  // handlePermissionChange fonksiyonunu güncelleme
  const handlePermissionChange = (permission: Permissions) => {
    setSelectedPermissions((prevSelectedPermissions) => {
      if (!Array.isArray(prevSelectedPermissions)) {
        return [];
      }

      // Eğer izin daha önce eklenmişse, diziden çıkarıyoruz
      if (prevSelectedPermissions.some((p) => p.id === permission.id)) {
        return prevSelectedPermissions.filter((p) => p.id !== permission.id);  // Seçili ise çıkar
      }

      // Seçili değilse, izin bilgisini ekliyoruz
      return [...prevSelectedPermissions, permission];  // Seçili değilse ekle
    });
  };






  // Form submit işlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedGroupData = {
      groupId: groupPermission?.id || 0,
      permissions: selectedPermissions,  // Seçili izinler
    };

    // İzinleri güncelleme işlemi
    await onSubmit(updatedGroupData);
    onClose();  // Modalı kapat
  };

  // İzinleri kategoriye göre gruplama
  const categorizedPermissions = allPermissions.reduce((acc: Record<string, Permissions[]>, permission: Permissions) => {
    const category = permission.category || 'Diğer';  // Kategori belirtilmemişse 'Diğer' olarak al
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">İzinleri Yönet</h2>

        {/* Shadcn UI Tabs (Sekmeler) */}
        <Tabs defaultValue="Genel">
          <TabsList>
            {Object.keys(categorizedPermissions).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Sekme içerikleri */}
          {Object.keys(categorizedPermissions).map((category) => (
            <TabsContent key={category} value={category}>
              <div>
                {categorizedPermissions[category].map((permission: Permissions) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={selectedPermissions.some((p) => p.id === permission.id)} // Eğer izin seçiliyse işaretle
                      onCheckedChange={() => handlePermissionChange(permission)} // Checkbox değişimi
                    />

                    <label htmlFor={`permission-${permission.id}`} className="ml-2 cursor-pointer overflow-y-auto max-h-32">
                      <div className="font-medium">{permission.name}</div>
                      {permission.description && (
                        <div className="text-sm text-gray-500 ml-2 overflow-y-auto max-h-32 hover:max-h-full transition-all duration-300">
                          {permission.description}
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            onClick={onClose}
            className="text-sm"
            variant="outline"
          >
            Kapat
          </Button>
          <Button
            onClick={handleSubmit}
            className="text-sm"
          >
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
};




interface UserGroup {
  id: number;
  name: string;
  description: string;
  membersCount: number;
  permissions: Permissions[];
}

interface Permissions {
  id: number;
  name: string;
  value: string;
  category: string;
  description: string;
}

interface UpdatedGroupData {
  groupId: number;
  permissions: Permissions[];
}


export default function UsersGroupPage() {
  const router = useRouter();

  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [isPermissionsFormModalOpen, setPermissionsFormModalOpen] = useState(false);
  const [editingGroupPermissions, setEditingGroupPermissions] = useState<UserGroup | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permissions[]>([]);
  const user = useSelector((state: RootState) => state.user.user); // Redux'tan 'user' state'ini alıyoruz
  const dispatch = useDispatch();
  const [hasViewGroupPermission, setViewGroupPermission] = useState<boolean>();



  const fetchAllData = async () => {
    try {
      const data = await fetchUsersGroupsPageData();
      setAllPermissions(data.permissions);
      if (Array.isArray(data.groups)) {
        setUserGroups(data.groups); // Veriyi state'e aktar
      } else {
        console.error("API'den gelen veri geçerli bir dizi değil:", data);
      }
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
    }
  };


  useEffect(() => {
    setViewGroupPermission(user?.permissions.some(permission => permission.value === 'view_group'));
      const fetchData = async () => {
        try {
          const data = await fetchUsersGroupsPageData();
          setAllPermissions(data.permissions);
          if (Array.isArray(data.groups)) {
            setUserGroups(data.groups); // Veriyi state'e aktar
          } else {
            console.error("API'den gelen veri geçerli bir dizi değil:", data);
          }
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
        }
      };

      fetchData();
  }, [user?.permissions]);

  const handleUserGroupSubmit = async () => {
    fetchAllData();
  };

  const handlePermissionsSubmit = async (updatedGroupData: UpdatedGroupData) => {

    // Kullanıcı bilgilerini almak (user.user.group_id)
    const userGroupId = user ? user?.user?.group_id : null;

    if (!userGroupId) {
      console.error("Kullanıcı grubu bulunamadı!");
      return;  // Eğer kullanıcı grubu yoksa, işlem yapmayın
    }

    // Eğer gelen groupId ile kullanıcı groupId eşleşiyorsa işlemi yapıyoruz
    if (updatedGroupData && updatedGroupData.permissions && updatedGroupData.groupId === userGroupId) {
      const permissions = updatedGroupData.permissions;

      // Kullanıcı bilgileriyle izinleri eşleştirmek
      const updatedPermissions = permissions.map(permission => ({
        id: permission.id,
        name: permission.name,
        value: permission.value,
        description: permission.description,
        category: permission.category,
      }));

      // Redux'a gönderme işlemi
      dispatch(setUserPermissions({
        groupId: updatedGroupData.groupId,
        permissions: updatedPermissions,
      }));
    }

    // Güncelleme işlemi gerçekleştirilir
    await updateGroupPermissions(updatedGroupData);
    fetchAllData();
  };








  // Kullanıcının izinlerini kontrol etmek için helper function
  const hasPermission = (permission: { value: string }) => {
    return user?.permissions?.some((userPermission) => userPermission.value === permission.value);
  };



  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/panel/users">
                    Kullanıcılar
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kullanıcı Grupları</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* User Groups Section */}
        {/* Eğer kullanıcının 'view_group' izni varsa, aşağıdaki içerik gösterilecek */}
        {hasViewGroupPermission ? (
          <div className="px-4 py-6">
            <Card className="rounded-xl border bg-card text-card-foreground shadow">
              <CardHeader className="pb-0 mb-4">
                <div className="flex space-x-2 justify-between">
                  <CardTitle className="tracking-tight text-lg font-medium">Kullanıcı Grupları</CardTitle>
                  {hasPermission({ value: 'create_group' }) && (
                    <Button onClick={() => { setEditingGroup(null); setFormModalOpen(true); }} className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" /> Yeni Grup
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Groups Table */}
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">Grup Adı</th>
                        <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">Açıklama</th>
                        <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">Üye Sayısı</th>
                        <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userGroups.map((group) => (
                        <tr key={group.id} className="border-b">
                          <td className="py-2 px-4">{group.name}</td>
                          <td className="py-2 px-4">{group.description}</td>
                          <td className="py-2 px-4">{group.membersCount}</td>
                          <td className="py-2 px-4 flex space-x-2">
                            {hasPermission({ value: 'edit_group' }) && (
                              <Button onClick={() => { setEditingGroup(group); setFormModalOpen(true); }} className="text-sm">
                                Düzenle
                              </Button>
                            )}
                            {hasPermission({ value: 'manage_group_permissions' }) && (
                              <Button onClick={() => { setEditingGroupPermissions(group); setPermissionsFormModalOpen(true); }} className="text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                                İzinleri Yönet
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="w-full h-screen flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto p-8 bg-white text-black rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Erişim Reddedildi</h2>
              <p className="text-sm text-gray-600 mb-6">Bu sayfayı görüntülemek için gerekli izniniz yok.</p>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
              >
                Geri Dön
              </Button>
            </Card>
          </div>

        )}
      </SidebarInset>
      {/* Modals */}
      {isFormModalOpen && (
        <UserGroupFormModal group={editingGroup} onClose={() => setFormModalOpen(false)} onSubmit={handleUserGroupSubmit} />
      )}
      {isPermissionsFormModalOpen && (
        <PermissionsFormModal groupPermission={editingGroupPermissions} allPermissions={allPermissions} onClose={() => setPermissionsFormModalOpen(false)} onSubmit={handlePermissionsSubmit} />
      )}
    </SidebarProvider>
  );
}