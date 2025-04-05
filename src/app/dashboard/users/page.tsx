"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: {
    id: string;
    name: string;
  };
  createdAt: string;
};

type Role = {
  id: string;
  name: string;
  description: string | null;
};

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  
  // Kullanıcıları getir
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        
        if (!response.ok) {
          throw new Error("Kullanıcılar getirilemedi");
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Hata:", error);
        toast({
          title: "Hata",
          description: "Kullanıcılar yüklenirken bir hata oluştu",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/roles");
        
        if (!response.ok) {
          throw new Error("Roller getirilemedi");
        }
        
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Hata:", error);
        toast({
          title: "Hata",
          description: "Roller yüklenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    };
    
    // Tüm kullanıcılar erişebilir
    if (session) {
      fetchUsers();
      fetchRoles();
    }
  }, [session, toast]);
  
  // Yeni kullanıcı ekle
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, roleId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Kullanıcı eklenirken bir hata oluştu");
      }
      
      // Kullanıcıları yenile
      const usersResponse = await fetch("/api/users");
      const usersData = await usersResponse.json();
      setUsers(usersData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsAddOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Kullanıcı eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Kullanıcı düzenle
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      const updateData: any = { name, email, roleId };
      
      // Şifre girilmişse ekle
      if (password.trim()) {
        updateData.password = password;
      }
      
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Kullanıcı güncellenirken bir hata oluştu");
      }
      
      // Kullanıcıları yenile
      const usersResponse = await fetch("/api/users");
      const usersData = await usersResponse.json();
      setUsers(usersData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsEditOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Kullanıcı güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Kullanıcı sil
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Kullanıcı silinirken bir hata oluştu");
      }
      
      // Kullanıcıları yenile
      const usersResponse = await fetch("/api/users");
      const usersData = await usersResponse.json();
      setUsers(usersData);
      
      // Modal'ı kapat
      setIsDeleteOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Kullanıcı silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini seçilen kullanıcı ile doldur
  const editUser = (user: User) => {
    setSelectedUser(user);
    setName(user.name || "");
    setEmail(user.email);
    setPassword(""); // Şifreyi temizle
    setRoleId(user.role.id);
    setIsEditOpen(true);
  };
  
  // Silme modal'ını aç
  const deleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };
  
  // Form değerlerini temizle
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRoleId("");
    setSelectedUser(null);
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Yeni Kullanıcı</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
              <DialogDescription>
                Kullanıcı bilgilerini doldurun ve ekle butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    İsim
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Şifre
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rol
                  </Label>
                  <Select value={roleId} onValueChange={setRoleId} required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roller</SelectLabel>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">Ekle</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar</CardTitle>
          <CardDescription>
            Sistemdeki tüm kullanıcılar ve rolleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">İsim</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Rol</th>
                  <th className="p-2 text-left">Kayıt Tarihi</th>
                  <th className="p-2 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role.name}</td>
                    <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editUser(user)}>
                          Düzenle
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => deleteUser(user)}
                          disabled={user.email === "admin@example.com"} // Admin kullanıcısını silmeyi engelle
                        >
                          Sil
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Düzenleme Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcı Düzenle</DialogTitle>
            <DialogDescription>
              Kullanıcı bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  İsim
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">
                  Şifre
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3"
                  placeholder="Boş bırakırsanız değişmez"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Rol
                </Label>
                <Select 
                  value={roleId} 
                  onValueChange={setRoleId} 
                  required
                  disabled={selectedUser?.email === "admin@example.com"} // Admin kullanıcısının rolünü değiştirmeyi engelle
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roller</SelectLabel>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                İptal
              </Button>
              <Button type="submit">Güncelle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Silme Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcı Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Kullanıcıyı silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedUser?.name}</strong> ({selectedUser?.email}) kullanıcısını silmek üzeresiniz.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              İptal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteUser}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 