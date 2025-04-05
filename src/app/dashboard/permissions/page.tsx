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

type Permission = {
  id: string;
  name: string;
  description: string | null;
  roles: {
    id: string;
    name: string;
  }[];
  _count: {
    roles: number;
  };
};

export default function PermissionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // İzinleri getir
  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };
    
    // Tüm kullanıcılar erişebilir
    // if (session?.user.role === "admin") {
    if (session) {
      fetchPermissions();
    }
  }, [session, toast]);
  
  // Yeni izin ekle
  const handleAddPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "İzin eklenirken bir hata oluştu");
      }
      
      // İzinleri yenile
      const permissionsResponse = await fetch("/api/permissions");
      const permissionsData = await permissionsResponse.json();
      setPermissions(permissionsData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsAddOpen(false);
      
      toast({
        title: "Başarılı",
        description: "İzin başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "İzin eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // İzin düzenle
  const handleEditPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPermission) return;
    
    try {
      const response = await fetch(`/api/permissions/${selectedPermission.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "İzin güncellenirken bir hata oluştu");
      }
      
      // İzinleri yenile
      const permissionsResponse = await fetch("/api/permissions");
      const permissionsData = await permissionsResponse.json();
      setPermissions(permissionsData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsEditOpen(false);
      
      toast({
        title: "Başarılı",
        description: "İzin başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "İzin güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // İzin sil
  const handleDeletePermission = async () => {
    if (!selectedPermission) return;
    
    try {
      const response = await fetch(`/api/permissions/${selectedPermission.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "İzin silinirken bir hata oluştu");
      }
      
      // İzinleri yenile
      const permissionsResponse = await fetch("/api/permissions");
      const permissionsData = await permissionsResponse.json();
      setPermissions(permissionsData);
      
      // Modal'ı kapat
      setIsDeleteOpen(false);
      
      toast({
        title: "Başarılı",
        description: "İzin başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "İzin silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini seçilen izin ile doldur
  const editPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setName(permission.name);
    setDescription(permission.description || "");
    setIsEditOpen(true);
  };
  
  // Silme modal'ını aç
  const deletePermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteOpen(true);
  };
  
  // Form değerlerini temizle
  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedPermission(null);
  };
  
  // İzinin temel izin olup olmadığını kontrol et
  const isBasicPermission = (permissionName: string) => {
    return ["read", "write", "delete"].includes(permissionName);
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">İzin Yönetimi</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Yeni İzin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni İzin Ekle</DialogTitle>
              <DialogDescription>
                İzin bilgilerini doldurun ve ekle butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPermission}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    İzin Adı
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
          <CardTitle>İzinler</CardTitle>
          <CardDescription>
            Sistemdeki tüm izinler ve bağlı roller
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">İzin</th>
                  <th className="p-2 text-left">Açıklama</th>
                  <th className="p-2 text-left">Roller</th>
                  <th className="p-2 text-left">Rol Sayısı</th>
                  <th className="p-2 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.id} className="border-b">
                    <td className="p-2">{permission.name}</td>
                    <td className="p-2">{permission.description}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {permission.roles.map((role) => (
                          <span key={role.id} className="px-2 py-1 bg-slate-100 rounded-full text-xs">
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2">{permission._count.roles}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => editPermission(permission)}
                          disabled={isBasicPermission(permission.name)}
                        >
                          Düzenle
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => deletePermission(permission)}
                          disabled={
                            isBasicPermission(permission.name) || 
                            permission._count.roles > 0
                          }
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
            <DialogTitle>İzin Düzenle</DialogTitle>
            <DialogDescription>
              İzin bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPermission}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  İzin Adı
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
            <DialogTitle>İzin Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. İzni silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedPermission?.name}</strong> iznini silmek üzeresiniz.
            </p>
            {selectedPermission && selectedPermission._count.roles > 0 && (
              <p className="text-red-500 mt-2">
                Bu izin bazı rollere atanmış olduğu için silinemez.
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
              onClick={handleDeletePermission}
              disabled={
                selectedPermission ? 
                  isBasicPermission(selectedPermission.name) || 
                  selectedPermission._count.roles > 0 
                : true
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