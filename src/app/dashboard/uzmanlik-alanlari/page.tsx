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
import { Edit, Trash2 } from "lucide-react";

type UzmanlikAlani = {
  id: string;
  ad: string;
  ekbilgi: string | null;
  teknikerler?: Array<{ id: string; adsoyad: string }>;
};

export default function UzmanlikAlanlariPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [uzmanlikAlanlari, setUzmanlikAlanlari] = useState<UzmanlikAlani[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUzmanlikAlani, setSelectedUzmanlikAlani] = useState<UzmanlikAlani | null>(null);
  
  // Form state
  const [ad, setAd] = useState("");
  const [ekbilgi, setEkbilgi] = useState("");
  
  // Uzmanlık alanlarını getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/uzmanlik-alanlari");
        
        if (!response.ok) {
          throw new Error("Uzmanlık alanları getirilemedi");
        }
        
        const data = await response.json();
        setUzmanlikAlanlari(data);
      } catch (error) {
        console.error("Hata:", error);
        toast({
          title: "Hata",
          description: "Veriler yüklenirken bir hata oluştu",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session) {
      fetchData();
    }
  }, [session, toast]);
  
  // Yeni uzmanlık alanı ekle
  const handleAddUzmanlikAlani = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/uzmanlik-alanlari", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ad, ekbilgi }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Uzmanlık alanı eklenirken bir hata oluştu");
      }
      
      // Uzmanlık alanlarını yenile
      const uzmanlikAlanlariResponse = await fetch("/api/uzmanlik-alanlari");
      const uzmanlikAlanlariData = await uzmanlikAlanlariResponse.json();
      setUzmanlikAlanlari(uzmanlikAlanlariData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsAddOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Uzmanlık alanı başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Uzmanlık alanı eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Uzmanlık alanı düzenle
  const handleEditUzmanlikAlani = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedUzmanlikAlani) return;
    
    try {
      const response = await fetch(`/api/uzmanlik-alanlari/${selectedUzmanlikAlani.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ad, ekbilgi }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Uzmanlık alanı güncellenirken bir hata oluştu");
      }
      
      // Uzmanlık alanlarını yenile
      const uzmanlikAlanlariResponse = await fetch("/api/uzmanlik-alanlari");
      const uzmanlikAlanlariData = await uzmanlikAlanlariResponse.json();
      setUzmanlikAlanlari(uzmanlikAlanlariData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsEditOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Uzmanlık alanı başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Uzmanlık alanı güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Uzmanlık alanı sil
  const handleDeleteUzmanlikAlani = async () => {
    if (!selectedUzmanlikAlani) return;
    
    try {
      const response = await fetch(`/api/uzmanlik-alanlari/${selectedUzmanlikAlani.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Uzmanlık alanı silinirken bir hata oluştu");
      }
      
      // Uzmanlık alanlarını yenile
      const uzmanlikAlanlariResponse = await fetch("/api/uzmanlik-alanlari");
      const uzmanlikAlanlariData = await uzmanlikAlanlariResponse.json();
      setUzmanlikAlanlari(uzmanlikAlanlariData);
      
      // Modal'ı kapat
      setIsDeleteOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Uzmanlık alanı başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Uzmanlık alanı silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini seçilen uzmanlık alanı ile doldur
  const editUzmanlikAlani = (uzmanlikAlani: UzmanlikAlani) => {
    setSelectedUzmanlikAlani(uzmanlikAlani);
    setAd(uzmanlikAlani.ad);
    setEkbilgi(uzmanlikAlani.ekbilgi || "");
    setIsEditOpen(true);
  };
  
  // Silme modal'ını aç
  const deleteUzmanlikAlani = (uzmanlikAlani: UzmanlikAlani) => {
    setSelectedUzmanlikAlani(uzmanlikAlani);
    setIsDeleteOpen(true);
  };
  
  // Form değerlerini temizle
  const resetForm = () => {
    setAd("");
    setEkbilgi("");
    setSelectedUzmanlikAlani(null);
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Uzmanlık Alanları</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Yeni Uzmanlık Alanı</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Uzmanlık Alanı Ekle</DialogTitle>
              <DialogDescription>
                Uzmanlık alanı bilgilerini doldurun ve ekle butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUzmanlikAlani}>
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
          <CardDescription>
            Sistemdeki tüm uzmanlık alanları
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-100 p-6">
          {uzmanlikAlanlari.length === 0 ? (
            <div className="text-center p-4 bg-white rounded-md text-muted-foreground">
              Henüz uzmanlık alanı bulunmamaktadır.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uzmanlikAlanlari.map((uzmanlikAlani) => (
                <Card key={uzmanlikAlani.id} className="overflow-hidden h-full bg-white shadow-sm relative">
                  <CardHeader>
                    <CardTitle className="text-lg">{uzmanlikAlani.ad}</CardTitle>
                    {uzmanlikAlani.teknikerler && uzmanlikAlani.teknikerler.length > 0 && (
                      <CardDescription>
                        {uzmanlikAlani.teknikerler.length} tekniker tarafından kullanılıyor
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {uzmanlikAlani.ekbilgi || "Ek bilgi bulunmamaktadır."}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-3 right-3 flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => editUzmanlikAlani(uzmanlikAlani)}
                      className="h-8 w-8 text-slate-600 hover:text-slate-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteUzmanlikAlani(uzmanlikAlani)}
                      className="h-8 w-8 text-rose-600 hover:text-rose-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Düzenleme Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uzmanlık Alanı Düzenle</DialogTitle>
            <DialogDescription>
              Uzmanlık alanı bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUzmanlikAlani}>
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
            <DialogTitle>Uzmanlık Alanı Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Uzmanlık alanını silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedUzmanlikAlani?.ad}</strong> adlı uzmanlık alanını silmek üzeresiniz.
            </p>
            {selectedUzmanlikAlani?.teknikerler && selectedUzmanlikAlani.teknikerler.length > 0 && (
              <p className="text-red-500 mt-2">
                Bu uzmanlık alanı {selectedUzmanlikAlani.teknikerler.length} tekniker tarafından kullanılıyor.
                Silmeden önce ilişkiyi kaldırmalısınız.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              İptal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteUzmanlikAlani}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 