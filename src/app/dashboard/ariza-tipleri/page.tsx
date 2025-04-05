"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type ArizaTipi = {
  id: string;
  ad: string;
  ekbilgi: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ArizaTipleriPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [arizaTipleri, setArizaTipleri] = useState<ArizaTipi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArizaTipi, setSelectedArizaTipi] = useState<ArizaTipi | null>(null);
  
  // Form state
  const [ad, setAd] = useState("");
  const [ekbilgi, setEkbilgi] = useState("");
  
  // Arıza tiplerini getir
  useEffect(() => {
    const fetchArizaTipleri = async () => {
      try {
        const response = await fetch("/api/ariza-tipleri");
        
        if (!response.ok) {
          throw new Error("Arıza tipleri getirilemedi");
        }
        
        const data = await response.json();
        setArizaTipleri(data);
      } catch (error) {
        console.error("Hata:", error);
        toast({
          title: "Hata",
          description: "Arıza tipleri yüklenirken bir hata oluştu",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session) {
      fetchArizaTipleri();
    }
  }, [session, toast]);
  
  // Yeni arıza tipi ekle
  const handleAddArizaTipi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/ariza-tipleri", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ad, ekbilgi }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Arıza tipi eklenirken bir hata oluştu");
      }
      
      // Arıza tiplerini yenile
      const arizaTipleriResponse = await fetch("/api/ariza-tipleri");
      const arizaTipleriData = await arizaTipleriResponse.json();
      setArizaTipleri(arizaTipleriData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsAddOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Arıza tipi başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Arıza tipi eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Arıza tipi düzenle
  const handleEditArizaTipi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedArizaTipi) return;
    
    try {
      const response = await fetch(`/api/ariza-tipleri/${selectedArizaTipi.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ad, ekbilgi }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Arıza tipi güncellenirken bir hata oluştu");
      }
      
      // Arıza tiplerini yenile
      const arizaTipleriResponse = await fetch("/api/ariza-tipleri");
      const arizaTipleriData = await arizaTipleriResponse.json();
      setArizaTipleri(arizaTipleriData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsEditOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Arıza tipi başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Arıza tipi güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Arıza tipi sil
  const handleDeleteArizaTipi = async () => {
    if (!selectedArizaTipi) return;
    
    try {
      const response = await fetch(`/api/ariza-tipleri/${selectedArizaTipi.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Arıza tipi silinirken bir hata oluştu");
      }
      
      // Arıza tiplerini yenile
      const arizaTipleriResponse = await fetch("/api/ariza-tipleri");
      const arizaTipleriData = await arizaTipleriResponse.json();
      setArizaTipleri(arizaTipleriData);
      
      // Modal'ı kapat
      setIsDeleteOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Arıza tipi başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Arıza tipi silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini seçilen arıza tipi ile doldur
  const editArizaTipi = (arizaTipi: ArizaTipi) => {
    setSelectedArizaTipi(arizaTipi);
    setAd(arizaTipi.ad);
    setEkbilgi(arizaTipi.ekbilgi || "");
    setIsEditOpen(true);
  };
  
  // Silme modal'ını aç
  const deleteArizaTipi = (arizaTipi: ArizaTipi) => {
    setSelectedArizaTipi(arizaTipi);
    setIsDeleteOpen(true);
  };
  
  // Form değerlerini temizle
  const resetForm = () => {
    setAd("");
    setEkbilgi("");
    setSelectedArizaTipi(null);
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Arıza Tipleri Yönetimi</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Yeni Arıza Tipi</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Arıza Tipi Ekle</DialogTitle>
              <DialogDescription>
                Arıza tipi bilgilerini doldurun ve ekle butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddArizaTipi}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ad" className="text-right">
                    Ad
                  </Label>
                  <Input
                    id="ad"
                    value={ad}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAd(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="ekbilgi" className="text-right pt-2">
                    Ek Bilgi
                  </Label>
                  <Textarea
                    id="ekbilgi"
                    value={ekbilgi}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEkbilgi(e.target.value)}
                    className="col-span-3"
                    rows={4}
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
          <CardTitle>Arıza Tipleri</CardTitle>
          <CardDescription>
            Sistemdeki tüm arıza tipleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          {arizaTipleri.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              Henüz arıza tipi bulunmamaktadır.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">Ad</th>
                    <th className="p-2 text-left">Ek Bilgi</th>
                    <th className="p-2 text-left">Oluşturulma Tarihi</th>
                    <th className="p-2 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {arizaTipleri.map((arizaTipi) => (
                    <tr key={arizaTipi.id} className="border-b">
                      <td className="p-2">{arizaTipi.ad}</td>
                      <td className="p-2">{arizaTipi.ekbilgi || "-"}</td>
                      <td className="p-2">{new Date(arizaTipi.createdAt).toLocaleDateString()}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => editArizaTipi(arizaTipi)}
                          >
                            Düzenle
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteArizaTipi(arizaTipi)}
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
          )}
        </CardContent>
      </Card>
      
      {/* Düzenleme Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arıza Tipi Düzenle</DialogTitle>
            <DialogDescription>
              Arıza tipi bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditArizaTipi}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ad" className="text-right">
                  Ad
                </Label>
                <Input
                  id="edit-ad"
                  value={ad}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAd(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-ekbilgi" className="text-right pt-2">
                  Ek Bilgi
                </Label>
                <Textarea
                  id="edit-ekbilgi"
                  value={ekbilgi}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEkbilgi(e.target.value)}
                  className="col-span-3"
                  rows={4}
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
            <DialogTitle>Arıza Tipi Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Arıza tipini silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedArizaTipi?.ad}</strong> arıza tipini silmek üzeresiniz.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              İptal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteArizaTipi}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 