"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, Edit, Home, MapPin, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

type Blok = {
  id: string;
  ad: string;
  ekbilgi: string | null;
  projeId: string;
  createdAt: string;
  updatedAt: string;
  proje?: {
    id: string;
    ad: string;
  };
};

type Daire = {
  id: string;
  numara: string;
  kat: string | null;
  ekbilgi: string | null;
  blokId: string;
  createdAt: string;
  updatedAt: string;
};

type Proje = {
  id: string;
  ad: string;
};

export default function BlokDetayPage({ params }: { params: { id: string; blokId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [blok, setBlok] = useState<Blok | null>(null);
  const [proje, setProje] = useState<Proje | null>(null);
  const [daireler, setDaireler] = useState<Daire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDaireOpen, setIsAddDaireOpen] = useState(false);
  const [isEditDaireOpen, setIsEditDaireOpen] = useState(false);
  const [isDeleteDaireOpen, setIsDeleteDaireOpen] = useState(false);
  const [selectedDaire, setSelectedDaire] = useState<Daire | null>(null);
  
  // Daire form state
  const [daireNumara, setDaireNumara] = useState("");
  const [daireKat, setDaireKat] = useState("");
  const [daireEkbilgi, setDaireEkbilgi] = useState("");
  
  // Blok ve daireleri getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session) return;
        
        // Bloku getir
        const blokResponse = await fetch(`/api/bloklar/${params.blokId}`);
        
        if (!blokResponse.ok) {
          if (blokResponse.status === 404) {
            router.push(`/dashboard/projeler/${params.id}`);
            return;
          }
          throw new Error("Blok getirilemedi");
        }
        
        const blokData = await blokResponse.json();
        setBlok(blokData);
        
        // Projeyi getir
        const projeResponse = await fetch(`/api/projeler/${params.id}`);
        
        if (projeResponse.ok) {
          const projeData = await projeResponse.json();
          setProje(projeData);
        }
        
        // Bloğa ait daireleri getir
        const dairelerResponse = await fetch(`/api/daireler?blokId=${params.blokId}`);
        
        if (dairelerResponse.ok) {
          const dairelerData = await dairelerResponse.json();
          setDaireler(dairelerData);
        } else {
          console.error("Daireler getirilemedi:", await dairelerResponse.text());
        }
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
    
    fetchData();
  }, [session, params.blokId, params.id, router, toast]);
  
  // Yeni daire ekle
  const handleAddDaire = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/daireler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          numara: daireNumara, 
          kat: daireKat,
          ekbilgi: daireEkbilgi, 
          blokId: params.blokId 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Daire eklenirken bir hata oluştu");
      }
      
      // Daireleri yenile
      const dairelerResponse = await fetch(`/api/daireler?blokId=${params.blokId}`);
      const dairelerData = await dairelerResponse.json();
      setDaireler(dairelerData);
      
      // Formu temizle ve modal'ı kapat
      resetDaireForm();
      setIsAddDaireOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Daire başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Daire eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Daire güncelle
  const handleUpdateDaire = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedDaire) return;
    
    try {
      const response = await fetch(`/api/daireler/${selectedDaire.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          numara: daireNumara, 
          kat: daireKat,
          ekbilgi: daireEkbilgi 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Daire güncellenirken bir hata oluştu");
      }
      
      // Daireleri yenile
      const dairelerResponse = await fetch(`/api/daireler?blokId=${params.blokId}`);
      const dairelerData = await dairelerResponse.json();
      setDaireler(dairelerData);
      
      // Formu temizle ve modal'ı kapat
      resetDaireForm();
      setIsEditDaireOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Daire başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Daire güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Daire sil
  const handleDeleteDaire = async () => {
    if (!selectedDaire) return;
    
    try {
      const response = await fetch(`/api/daireler/${selectedDaire.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Daire silinirken bir hata oluştu");
      }
      
      // Daireleri yenile
      const dairelerResponse = await fetch(`/api/daireler?blokId=${params.blokId}`);
      const dairelerData = await dairelerResponse.json();
      setDaireler(dairelerData);
      
      // Modal'ı kapat
      setIsDeleteDaireOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Daire başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Daire silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini daireyle doldur
  const editDaire = (daire: Daire) => {
    setSelectedDaire(daire);
    setDaireNumara(daire.numara);
    setDaireKat(daire.kat || "");
    setDaireEkbilgi(daire.ekbilgi || "");
    setIsEditDaireOpen(true);
  };
  
  // Silme modal'ını aç
  const deleteDaire = (daire: Daire) => {
    setSelectedDaire(daire);
    setIsDeleteDaireOpen(true);
  };
  
  // Formu temizle
  const resetDaireForm = () => {
    setDaireNumara("");
    setDaireKat("");
    setDaireEkbilgi("");
    setSelectedDaire(null);
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  if (!blok) {
    return <div className="text-center p-10">Blok bulunamadı.</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Üst kısım */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/projeler/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{blok.ad} Blok</h2>
      </div>
      
      {/* Blok Bilgileri */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold mb-4">Blok Bilgisi</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700">Proje:</h4>
            <p className="flex items-center gap-1 text-gray-600">
              <Building2 className="h-4 w-4" />
              {proje ? proje.ad : blok.proje?.ad || "Bilinmiyor"}
            </p>
          </div>
          
          {blok.ekbilgi && (
            <div>
              <h4 className="font-medium text-gray-700">Açıklama:</h4>
              <p className="text-gray-600">{blok.ekbilgi}</p>
            </div>
          )}
          
          <div>
            <h4 className="font-medium text-gray-700">Daire Sayısı:</h4>
            <p className="text-gray-600">{daireler.length}</p>
          </div>
        </div>
      </div>
      
      {/* Daireler Başlık */}
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-xl font-semibold">Daireler</h3>
        <Dialog open={isAddDaireOpen} onOpenChange={setIsAddDaireOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetDaireForm()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Yeni Daire Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Daire Ekle</DialogTitle>
              <DialogDescription>
                Daire bilgilerini doldurun ve ekle butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDaire}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="daire-numara">Daire No</Label>
                    <Input
                      id="daire-numara"
                      value={daireNumara}
                      onChange={(e) => setDaireNumara(e.target.value)}
                      className="w-full mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="daire-kat">Kat</Label>
                    <Input
                      id="daire-kat"
                      value={daireKat}
                      onChange={(e) => setDaireKat(e.target.value)}
                      className="w-full mt-1"
                      placeholder="Örn: 1, 2, 3..."
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="daire-ekbilgi">Ek Bilgi</Label>
                  <Textarea
                    id="daire-ekbilgi"
                    value={daireEkbilgi}
                    onChange={(e) => setDaireEkbilgi(e.target.value)}
                    className="w-full mt-1"
                    rows={3}
                    placeholder="Oda sayısı, metrekare vb."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDaireOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">Ekle</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Daireler Listesi */}
      {daireler.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-slate-50">
          <Home className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium">Henüz daire bulunmamaktadır</h3>
          <p className="mt-2 text-sm text-slate-500">
            Yeni bir daire eklemek için "Yeni Daire Ekle" butonuna tıklayın.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daireler.map((daire) => (
            <Card key={daire.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/dashboard/projeler/${params.id}/bloklar/${params.blokId}/daireler/${daire.id}`}>
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    {daire.numara} Nolu Daire
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {daire.kat && (
                      <div className="flex items-center text-sm text-slate-700">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>Kat: {daire.kat}</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-600 min-h-[40px]">
                      {daire.ekbilgi || "Ek bilgi bulunmuyor."}
                    </p>
                  </div>
                </CardContent>
              </Link>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => editDaire(daire)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteDaire(daire)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Daire Düzenleme Modal */}
      <Dialog open={isEditDaireOpen} onOpenChange={setIsEditDaireOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daire Düzenle</DialogTitle>
            <DialogDescription>
              Daire bilgilerini güncelleyin ve güncelle butonuna tıklayın.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDaire}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="edit-daire-numara">Daire No</Label>
                  <Input
                    id="edit-daire-numara"
                    value={daireNumara}
                    onChange={(e) => setDaireNumara(e.target.value)}
                    className="w-full mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-daire-kat">Kat</Label>
                  <Input
                    id="edit-daire-kat"
                    value={daireKat}
                    onChange={(e) => setDaireKat(e.target.value)}
                    className="w-full mt-1"
                    placeholder="Örn: 1, 2, 3..."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-daire-ekbilgi">Ek Bilgi</Label>
                <Textarea
                  id="edit-daire-ekbilgi"
                  value={daireEkbilgi}
                  onChange={(e) => setDaireEkbilgi(e.target.value)}
                  className="w-full mt-1"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDaireOpen(false)}>
                İptal
              </Button>
              <Button type="submit">Güncelle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Daire Silme Modal */}
      <Dialog open={isDeleteDaireOpen} onOpenChange={setIsDeleteDaireOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daire Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Daireyi silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedDaire?.numara}</strong> nolu daireyi silmek üzeresiniz.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDaireOpen(false)}>
              İptal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteDaire}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 