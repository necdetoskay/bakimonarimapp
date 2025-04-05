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
import { Checkbox } from "@/components/ui/checkbox";

type Role = {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  _count: {
    users: number;
  };
};

type Permission = {
  id: string;
  name: string;
  description: string | null;
};

export default function RolesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  // Rolleri ve izinleri getir
  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchPermissions = async () => {
      try {
        const response = await fetch("/api/permissions");
        
        if (!response.ok) {
          throw new Error("İzinler getirilemedi");
        }
        
        const data = await response.json();
        setPermissions(data);
      } catch (error) {
        console.error("Hata:", error);
        toast({
          title: "Hata",
          description: "İzinler yüklenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    };
    
    // Tüm kullanıcılar erişebilir
    if (session) {
      fetchRoles();
      fetchPermissions();
    }
  }, [session, toast]);
  
  // Yeni rol ekle
  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name, 
          description, 
          permissionIds: selectedPermissions 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Rol eklenirken bir hata oluştu");
      }
      
      // Rolleri yenile
      const rolesResponse = await fetch("/api/roles");
      const rolesData = await rolesResponse.json();
      setRoles(rolesData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsAddOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Rol başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Rol eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Rol düzenle
  const handleEditRole = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) return;
    
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name, 
          description, 
          permissionIds: selectedPermissions 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Rol güncellenirken bir hata oluştu");
      }
      
      // Rolleri yenile
      const rolesResponse = await fetch("/api/roles");
      const rolesData = await rolesResponse.json();
      setRoles(rolesData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsEditOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Rol başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Rol güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Rol sil
  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Rol silinirken bir hata oluştu");
      }
      
      // Rolleri yenile
      const rolesResponse = await fetch("/api/roles");
      const rolesData = await rolesResponse.json();
      setRoles(rolesData);
      
      // Modal'ı kapat
      setIsDeleteOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Rol başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Rol silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini seçilen rol ile doldur
  const editRole = (role: Role) => {
    setSelectedRole(role);
    setName(role.name);
    setDescription(role.description || "");
    setSelectedPermissions(role.permissions.map(p => p.id));
    setIsEditOpen(true);
  };
  
  // Silme modal'ını aç
  const deleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };
  
  // Form değerlerini temizle
  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedPermissions([]);
    setSelectedRole(null);
  };
  
  // İzin seçimini değiştir
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Rol Yönetimi</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Yeni Rol</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Rol Ekle</DialogTitle>
              <DialogDescription>
                Rol bilgilerini ve izinlerini ayarlayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRole}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Rol Adı
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
                  <Label htmlFor="description" className="text-right">
                    Açıklama
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    İzinler
                  </Label>
                  <div className="col-span-3 grid grid-cols-1 gap-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`permission-${permission.id}`}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label htmlFor={`permission-${permission.id}`} className="cursor-pointer">
                          {permission.name}{permission.description && ` - ${permission.description}`}
                        </Label>
                      </div>
                    ))}
                  </div>
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
          <CardTitle>Roller</CardTitle>
          <CardDescription>
            Sistem rolleri ve izinleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">Rol</th>
                  <th className="p-2 text-left">Açıklama</th>
                  <th className="p-2 text-left">İzinler</th>
                  <th className="p-2 text-left">Kullanıcı Sayısı</th>
                  <th className="p-2 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b">
                    <td className="p-2">{role.name}</td>
                    <td className="p-2">{role.description}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <span key={permission.id} className="px-2 py-1 bg-slate-100 rounded-full text-xs">
                            {permission.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2">{role._count.users}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => editRole(role)}
                        >
                          Düzenle
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => deleteRole(role)}
                          disabled={(role.name === "admin" || role.name === "user" || role._count.users > 0)}
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
            <DialogTitle>Rol Düzenle</DialogTitle>
            <DialogDescription>
              Rol bilgilerini ve izinlerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRole}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Rol Adı
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  required
                  disabled={selectedRole?.name === "admin" || selectedRole?.name === "user"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Açıklama
                </Label>
                <Input
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  İzinler
                </Label>
                <div className="col-span-3 grid grid-cols-1 gap-2">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`edit-permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                        disabled={selectedRole?.name === "admin"} // Admin rolünün izinlerini değiştirmeyi engelle
                      />
                      <Label htmlFor={`edit-permission-${permission.id}`} className="cursor-pointer">
                        {permission.name}{permission.description && ` - ${permission.description}`}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={selectedRole?.name === "admin"}>
                Güncelle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Silme Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rol Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Rolü silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedRole?.name}</strong> rolünü silmek üzeresiniz.
            </p>
            {(selectedRole?._count?.users ?? 0) > 0 && (
              <p className="text-red-500 mt-2">
                Bu role sahip kullanıcılar olduğu için silinemez.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              İptal
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteRole}
              disabled={
                selectedRole?.name === "admin" || 
                selectedRole?.name === "user" || 
                (selectedRole?._count?.users ?? 0) > 0
              }
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 