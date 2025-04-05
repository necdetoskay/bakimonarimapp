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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type UzmanlikAlani = {
  id: string;
  ad: string;
  ekbilgi: string | null;
};

type Tekniker = {
  id: string;
  adsoyad: string;
  telefon: string | null;
  ekbilgi: string | null;
  createdAt: string;
  updatedAt: string;
  uzmanlikAlanlari: UzmanlikAlani[];
};

export default function TeknikerlerPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [teknikerler, setTeknikerler] = useState<Tekniker[]>([]);
  const [uzmanlikAlanlari, setUzmanlikAlanlari] = useState<UzmanlikAlani[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTekniker, setSelectedTekniker] = useState<Tekniker | null>(null);
  
  // Form state
  const [adsoyad, setAdsoyad] = useState("");
  const [telefon, setTelefon] = useState("");
  const [ekbilgi, setEkbilgi] = useState("");
  const [selectedUzmanlikAlanlari, setSelectedUzmanlikAlanlari] = useState<string[]>([]);
  
  // Tekniker ve Uzmanlık alanlarını getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Teknikerleri getir
        const teknikerlerResponse = await fetch("/api/teknikerler");
        
        if (!teknikerlerResponse.ok) {
          throw new Error("Teknikerler getirilemedi");
        }
        
        const teknikerlerData = await teknikerlerResponse.json();
        setTeknikerler(teknikerlerData);
        
        // Uzmanlık alanlarını getir
        const uzmanlikAlanlariResponse = await fetch("/api/uzmanlik-alanlari");
        
        if (!uzmanlikAlanlariResponse.ok) {
          throw new Error("Uzmanlık alanları getirilemedi");
        }
        
        const uzmanlikAlanlariData = await uzmanlikAlanlariResponse.json();
        setUzmanlikAlanlari(uzmanlikAlanlariData);
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
  
  // Uzmanlık alanı checkbox durumu değiştiğinde
  const handleUzmanlikAlaniToggle = (uzmanlikAlaniId: string) => {
    setSelectedUzmanlikAlanlari(prev => {
      if (prev.includes(uzmanlikAlaniId)) {
        return prev.filter(id => id !== uzmanlikAlaniId);
      } else {
        return [...prev, uzmanlikAlaniId];
      }
    });
  };
  
  // Yeni tekniker ekle
  const handleAddTekniker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/teknikerler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          adsoyad, 
          telefon, 
          ekbilgi, 
          uzmanlikAlanlariIds: selectedUzmanlikAlanlari 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Tekniker eklenirken bir hata oluştu");
      }
      
      // Teknikerleri yenile
      const teknikerlerResponse = await fetch("/api/teknikerler");
      const teknikerlerData = await teknikerlerResponse.json();
      setTeknikerler(teknikerlerData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsAddOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Tekniker başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Tekniker eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Tekniker düzenle
  const handleEditTekniker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedTekniker) return;
    
    try {
      const response = await fetch(`/api/teknikerler/${selectedTekniker.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          adsoyad, 
          telefon, 
          ekbilgi, 
          uzmanlikAlanlariIds: selectedUzmanlikAlanlari 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Tekniker güncellenirken bir hata oluştu");
      }
      
      // Teknikerleri yenile
      const teknikerlerResponse = await fetch("/api/teknikerler");
      const teknikerlerData = await teknikerlerResponse.json();
      setTeknikerler(teknikerlerData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsEditOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Tekniker başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Tekniker güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Tekniker sil
  const handleDeleteTekniker = async () => {
    if (!selectedTekniker) return;
    
    try {
      const response = await fetch(`/api/teknikerler/${selectedTekniker.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Tekniker silinirken bir hata oluştu");
      }
      
      // Teknikerleri yenile
      const teknikerlerResponse = await fetch("/api/teknikerler");
      const teknikerlerData = await teknikerlerResponse.json();
      setTeknikerler(teknikerlerData);
      
      // Modal'ı kapat
      setIsDeleteOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Tekniker başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Tekniker silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini seçilen tekniker ile doldur
  const editTekniker = (tekniker: Tekniker) => {
    setSelectedTekniker(tekniker);
    setAdsoyad(tekniker.adsoyad);
    setTelefon(tekniker.telefon || "");
    setEkbilgi(tekniker.ekbilgi || "");
    
    // Seçili uzmanlık alanlarını ayarla
    const uzmanlikAlanlariIds = tekniker.uzmanlikAlanlari.map(alan => alan.id);
    setSelectedUzmanlikAlanlari(uzmanlikAlanlariIds);
    
    setIsEditOpen(true);
  };
  
  // Silme modal'ını aç
  const deleteTekniker = (tekniker: Tekniker) => {
    setSelectedTekniker(tekniker);
    setIsDeleteOpen(true);
  };
  
  // Form değerlerini temizle
  const resetForm = () => {
    setAdsoyad("");
    setTelefon("");
    setEkbilgi("");
    setSelectedUzmanlikAlanlari([]);
    setSelectedTekniker(null);
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Tekniker Yönetimi</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Yeni Tekniker</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Tekniker Ekle</DialogTitle>
              <DialogDescription>
                Tekniker bilgilerini doldurun ve ekle butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTekniker}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="adsoyad" className="text-right">
                    Ad Soyad
                  </Label>
                  <Input
                    id="adsoyad"
                    value={adsoyad}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdsoyad(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="telefon" className="text-right">
                    Telefon
                  </Label>
                  <Input
                    id="telefon"
                    value={telefon}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefon(e.target.value)}
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
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    Uzmanlık Alanları
                  </Label>
                  <div className="col-span-3 space-y-3">
                    {uzmanlikAlanlari.map(alan => (
                      <div key={alan.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`uzmanlik-${alan.id}`} 
                          checked={selectedUzmanlikAlanlari.includes(alan.id)}
                          onCheckedChange={() => handleUzmanlikAlaniToggle(alan.id)}
                        />
                        <Label 
                          htmlFor={`uzmanlik-${alan.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {alan.ad}
                        </Label>
                      </div>
                    ))}
                    {uzmanlikAlanlari.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Henüz uzmanlık alanı bulunmamaktadır.
                      </div>
                    )}
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
          <CardTitle>Teknikerler</CardTitle>
          <CardDescription>
            Sistemdeki tüm teknikerler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teknikerler.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              Henüz tekniker bulunmamaktadır.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">Ad Soyad</th>
                    <th className="p-2 text-left">Telefon</th>
                    <th className="p-2 text-left">Uzmanlık Alanları</th>
                    <th className="p-2 text-left">Ek Bilgi</th>
                    <th className="p-2 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {teknikerler.map((tekniker) => (
                    <tr key={tekniker.id} className="border-b">
                      <td className="p-2">{tekniker.adsoyad}</td>
                      <td className="p-2">{tekniker.telefon || "-"}</td>
                      <td className="p-2">
                        {tekniker.uzmanlikAlanlari.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {tekniker.uzmanlikAlanlari.map(alan => (
                              <span 
                                key={alan.id} 
                                className="inline-block px-2 py-1 text-xs bg-slate-100 rounded"
                              >
                                {alan.ad}
                              </span>
                            ))}
                          </div>
                        ) : "-"}
                      </td>
                      <td className="p-2">{tekniker.ekbilgi || "-"}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => editTekniker(tekniker)}
                          >
                            Düzenle
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteTekniker(tekniker)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tekniker Düzenle</DialogTitle>
            <DialogDescription>
              Tekniker bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditTekniker}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-adsoyad" className="text-right">
                  Ad Soyad
                </Label>
                <Input
                  id="edit-adsoyad"
                  value={adsoyad}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdsoyad(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-telefon" className="text-right">
                  Telefon
                </Label>
                <Input
                  id="edit-telefon"
                  value={telefon}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefon(e.target.value)}
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Uzmanlık Alanları
                </Label>
                <div className="col-span-3 space-y-3">
                  {uzmanlikAlanlari.map(alan => (
                    <div key={alan.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`edit-uzmanlik-${alan.id}`} 
                        checked={selectedUzmanlikAlanlari.includes(alan.id)}
                        onCheckedChange={() => handleUzmanlikAlaniToggle(alan.id)}
                      />
                      <Label 
                        htmlFor={`edit-uzmanlik-${alan.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {alan.ad}
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
              <Button type="submit">Güncelle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Silme Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tekniker Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Teknikeri silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedTekniker?.adsoyad}</strong> adlı teknikeri silmek üzeresiniz.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              İptal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteTekniker}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 