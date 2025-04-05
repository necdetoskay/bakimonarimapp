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

type Malzeme = {
  id: string;
  ad: string;
  birim: string | null;
  ekbilgi: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function MalzemelerPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [malzemeler, setMalzemeler] = useState<Malzeme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMalzeme, setSelectedMalzeme] = useState<Malzeme | null>(null);
  
  // Form state
  const [ad, setAd] = useState("");
  const [birim, setBirim] = useState("");
  const [ekbilgi, setEkbilgi] = useState("");
  
  // Malzemeleri getir
  useEffect(() => {
    const fetchMalzemeler = async () => {
      try {
        const response = await fetch("/api/malzemeler");
        
        if (!response.ok) {
          throw new Error("Malzemeler getirilemedi");
        }
        
        const data = await response.json();
        setMalzemeler(data);
      } catch (error) {
        console.error("Hata:", error);
        toast({
          title: "Hata",
          description: "Malzemeler yüklenirken bir hata oluştu",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session) {
      fetchMalzemeler();
    }
  }, [session, toast]);
  
  // Yeni malzeme ekle
  const handleAddMalzeme = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/malzemeler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ad, birim, ekbilgi }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Malzeme eklenirken bir hata oluştu");
      }
      
      // Malzemeleri yenile
      const malzemelerResponse = await fetch("/api/malzemeler");
      const malzemelerData = await malzemelerResponse.json();
      setMalzemeler(malzemelerData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsAddOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Malzeme başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Malzeme eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Malzeme düzenle
  const handleEditMalzeme = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedMalzeme) return;
    
    try {
      const response = await fetch(`/api/malzemeler/${selectedMalzeme.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ad, birim, ekbilgi }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Malzeme güncellenirken bir hata oluştu");
      }
      
      // Malzemeleri yenile
      const malzemelerResponse = await fetch("/api/malzemeler");
      const malzemelerData = await malzemelerResponse.json();
      setMalzemeler(malzemelerData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsEditOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Malzeme başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Malzeme güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Malzeme sil
  const handleDeleteMalzeme = async () => {
    if (!selectedMalzeme) return;
    
    try {
      const response = await fetch(`/api/malzemeler/${selectedMalzeme.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Malzeme silinirken bir hata oluştu");
      }
      
      // Malzemeleri yenile
      const malzemelerResponse = await fetch("/api/malzemeler");
      const malzemelerData = await malzemelerResponse.json();
      setMalzemeler(malzemelerData);
      
      // Modal'ı kapat
      setIsDeleteOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Malzeme başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Malzeme silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini seçilen malzeme ile doldur
  const editMalzeme = (malzeme: Malzeme) => {
    setSelectedMalzeme(malzeme);
    setAd(malzeme.ad);
    setBirim(malzeme.birim || "");
    setEkbilgi(malzeme.ekbilgi || "");
    setIsEditOpen(true);
  };
  
  // Silme modal'ını aç
  const deleteMalzeme = (malzeme: Malzeme) => {
    setSelectedMalzeme(malzeme);
    setIsDeleteOpen(true);
  };
  
  // Form değerlerini temizle
  const resetForm = () => {
    setAd("");
    setBirim("");
    setEkbilgi("");
    setSelectedMalzeme(null);
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Malzeme Yönetimi</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Yeni Malzeme</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Malzeme Ekle</DialogTitle>
              <DialogDescription>
                Malzeme bilgilerini doldurun ve ekle butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMalzeme}>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="birim" className="text-right">
                    Birim
                  </Label>
                  <Input
                    id="birim"
                    value={birim}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirim(e.target.value)}
                    className="col-span-3"
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
          <CardTitle>Malzemeler</CardTitle>
          <CardDescription>
            Sistemdeki tüm malzemeler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {malzemeler.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              Henüz malzeme bulunmamaktadır.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">Ad</th>
                    <th className="p-2 text-left">Birim</th>
                    <th className="p-2 text-left">Ek Bilgi</th>
                    <th className="p-2 text-left">Oluşturulma Tarihi</th>
                    <th className="p-2 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {malzemeler.map((malzeme) => (
                    <tr key={malzeme.id} className="border-b">
                      <td className="p-2">{malzeme.ad}</td>
                      <td className="p-2">{malzeme.birim || "-"}</td>
                      <td className="p-2">{malzeme.ekbilgi || "-"}</td>
                      <td className="p-2">{new Date(malzeme.createdAt).toLocaleDateString()}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => editMalzeme(malzeme)}
                          >
                            Düzenle
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteMalzeme(malzeme)}
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
            <DialogTitle>Malzeme Düzenle</DialogTitle>
            <DialogDescription>
              Malzeme bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditMalzeme}>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-birim" className="text-right">
                  Birim
                </Label>
                <Input
                  id="edit-birim"
                  value={birim}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirim(e.target.value)}
                  className="col-span-3"
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
            <DialogTitle>Malzeme Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Malzemeyi silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedMalzeme?.ad}</strong> malzemesini silmek üzeresiniz.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              İptal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteMalzeme}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 