"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchUsersPageData, addUser, updateUser, deleteUser } from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";


interface UserFormModalProps {
  user: User | null;      // 'User' tipini tanımladığınızı varsayıyoruz.
  onClose: () => void;
  onSubmit: () => void;
  groups: Group[];        // Burada 'groups' bir grup listesi olduğu için 'Group[]' tipini kullanıyoruz.
}
// Modal Form for Creating or Editing User
// Kullanıcı ekleme ve düzenleme modalı
const UserFormModal: React.FC<UserFormModalProps> = ({ user, onClose, onSubmit, groups }) => {
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState(user ? user.password : "");
  const [groupId, setGroupId] = useState(user ? user.groupId : "1"); // groupId'yi kullanıyoruz
  const [status, setStatus] = useState(user ? user.status : "1");

  const statusOptions = [
    { label: "Aktif", value: "1" },
    { label: "Pasif", value: "0" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      id: user?.id,
      name,
      email,
      password: password,
      groupId, // groupName yerine groupId gönderiyoruz
      status,
    };

    if (user?.id) {
      // Kullanıcıyı güncelle
      await updateUser(userData);
    } else {
      // Yeni kullanıcı ekle
      await addUser(userData);
    }
    
    onSubmit();
    onClose(); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold">{user ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Oluştur"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Ad</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
              placeholder="Kullanıcı Adı"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">E-posta</label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              placeholder="Kullanıcı E-posta"
            />
          </div>
          { !user &&
                    <div>
                    <label htmlFor="password" className="block text-sm font-medium">Şifre</label>
                    <Input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2"
                      placeholder="Kullanıcı Şifre"
                    />
                  </div>
          }


          {/* Grup Seçimi */}
          <div>
            <label htmlFor="group" className="block text-sm font-medium">Grup</label>
            <select
              id="group"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            >
              {groups.length === 0 ? (
                <option disabled>Grup verisi yükleniyor...</option>
              ) : (
                groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Durum Seçimi */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium">Durum</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" onClick={onClose} variant="secondary">Kapat</Button>
            <Button type="submit">{user ? "Düzenle" : "Oluştur"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteConfirmationModalProps {
  user: User | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}

// Confirmation Modal for Deleting User
const DeleteConfirmationModal = ({ user, onClose, onDelete }: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold">Kullanıcıyı Sil</h2>
        <p className="mt-4">Bu kullanıcıyı silmek istediğinize emin misiniz?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" onClick={onClose} variant="secondary">İptal</Button>
          <Button 
            type="button" 
            onClick={() => user && onDelete(user.id)} 
            variant="destructive"
          >
            Sil
          </Button>
        </div>
      </div>
    </div>
  );
};

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  groupId: number;
  status: number;
}

interface Group {
  id: number;
  name: string;
}


export default function UsersListPage() {

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const user = useSelector((state: RootState) => state.user.user); // Redux'tan 'user' state'ini alıyoruz
  const [hasViewGroupPermission, setViewGroupPermission] = useState<boolean>();
  const router = useRouter();


  useEffect(() => {
    setViewGroupPermission(user?.permissions.some(permission => permission.value === 'view_user'));
    const fetchData = async () => {
      try {
        const data = await fetchUsersPageData();
    
        // Eğer veri dizisi bekleniyorsa, kullanıcıları düzgün şekilde alalım
        if (Array.isArray(data.users)) {
          setUsers(data.users); // Veriyi state'e aktar
        } else {
          console.error("API'den gelen veri geçerli bir dizi değil:", data);
        }
        setGroups(data.groups);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      }
    };
  
    fetchData();
  }, [user?.permissions]);

  const hasPermission = (permission: { value: string }) => {
    return user?.permissions?.some((userPermission) => userPermission.value === permission.value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleUserSubmit = async () => {
    try {
      const data = await fetchUsersPageData();
    
      // Eğer veri dizisi bekleniyorsa, kullanıcıları düzgün şekilde alalım
      if (Array.isArray(data.users)) {
        setUsers(data.users); // Veriyi state'e aktar
      } else {
        console.error("API'den gelen veri geçerli bir dizi değil:", data);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      // Kullanıcıyı silmek için deleteUser fonksiyonunu çağır
      await deleteUser(id);

    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    }

    try {
      const data = await fetchUsersPageData();
    
      // Eğer veri dizisi bekleniyorsa, kullanıcıları düzgün şekilde alalım
      if (Array.isArray(data.users)) {
        setUsers(data.users); // Veriyi state'e aktar
      } else {
        console.error("API'den gelen veri geçerli bir dizi değil:", data);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
    setDeleteModalOpen(false); // Modalı kapat
  };
  

  const getStatusLabel = (status: number) => {
    return status === 1 ? "Aktif" : "Pasif";
  };

  const getGroupNameLabel = (groupId: number) => {
    const group = groups.find(group => group.id === groupId); // groupId'ye göre grubu buluyoruz
    return group ? group.name : "Grup Bulunamadı"; // Grup varsa adı döndür, yoksa "Grup Bulunamadı" döndür
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
                  <BreadcrumbPage>Kullanıcı Listesi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Users List Section */}
        {hasViewGroupPermission ? (
        <div className="px-4 py-6">
          <Card className="rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader className="pb-0 mb-4">
              <div className="flex space-x-2 justify-between">
                <CardTitle className="tracking-tight text-lg font-medium">Kullanıcılar</CardTitle>
                {hasPermission({ value: 'create_user' }) && (
                <Button onClick={() => { setEditingUser(null); setFormModalOpen(true); }} className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" /> Yeni Kullanıcı
                </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-muted-foreground">
                  Kullanıcı Ara
                </label>
                <Input
                  id="search"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Ad veya E-posta ara"
                  className="mt-2"
                />
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">Ad</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">E-posta</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">Rol</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">Durum</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-2 px-4">{user.name}</td>
                        <td className="py-2 px-4">{user.email}</td>
                        <td className="py-2 px-4">{getGroupNameLabel(user.groupId)}</td>
                        <td className="py-2 px-4">{getStatusLabel(user.status)}</td>
                        <td className="py-2 px-4 flex space-x-2">
                        {hasPermission({ value: 'edit_user' }) && (
                          <Button onClick={() => { setEditingUser(user); setFormModalOpen(true); }} className="text-sm">
                            Düzenle
                          </Button>
                        )}
                        {hasPermission({ value: 'delete_user' }) && (
                          <Button onClick={() => { setUserToDelete(user); setDeleteModalOpen(true); }} className="text-sm" variant="destructive">
                            <Trash className="h-4 w-4" />
                            Sil
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
        <UserFormModal user={editingUser} onClose={() => setFormModalOpen(false)} onSubmit={handleUserSubmit} groups={groups} />
      )}

      {isDeleteModalOpen && userToDelete && (
        <DeleteConfirmationModal
          user={userToDelete}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteUser}
        />
      )}
    </SidebarProvider>
  );
}