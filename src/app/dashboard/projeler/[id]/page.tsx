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
import { ArrowLeft, Building2, Edit, MapPin, PlusCircle, Trash2, X, Eye } from "lucide-react";
import Link from "next/link";

type Proje = {
  id: string;
  ad: string;
  ekbilgi: string | null;
  adres: string;
  konum: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

type Blok = {
  id: string;
  ad: string;
  ekbilgi: string | null;
  projeId: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProjeDetayPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [proje, setProje] = useState<Proje | null>(null);
  const [bloklar, setBloklar] = useState<Blok[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddBlokOpen, setIsAddBlokOpen] = useState(false);
  const [isEditBlokOpen, setIsEditBlokOpen] = useState(false);
  const [isDeleteBlokOpen, setIsDeleteBlokOpen] = useState(false);
  const [selectedBlok, setSelectedBlok] = useState<Blok | null>(null);
  
  // Blok form state
  const [blokAd, setBlokAd] = useState("");
  const [blokEkbilgi, setBlokEkbilgi] = useState("");
  
  // Proje ve blokları getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session) return;
        
        // Projeyi getir
        const projeResponse = await fetch(`/api/projeler/${params.id}`);
        
        if (!projeResponse.ok) {
          if (projeResponse.status === 404) {
            router.push("/dashboard/projeler");
            return;
          }
          throw new Error("Proje getirilemedi");
        }
        
        const projeData = await projeResponse.json();
        setProje(projeData);
        
        // Projeye ait blokları getir
        const bloklarResponse = await fetch(`/api/bloklar?projeId=${params.id}`);
        
        if (!bloklarResponse.ok) {
          throw new Error("Bloklar getirilemedi");
        }
        
        const bloklarData = await bloklarResponse.json();
        setBloklar(bloklarData);
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
  }, [session, params.id, router, toast]);
  
  // Yeni blok ekle
  const handleAddBlok = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/bloklar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ad: blokAd, 
          ekbilgi: blokEkbilgi, 
          projeId: params.id 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Blok eklenirken bir hata oluştu");
      }
      
      // Blokları yenile
      const bloklarResponse = await fetch(`/api/bloklar?projeId=${params.id}`);
      const bloklarData = await bloklarResponse.json();
      setBloklar(bloklarData);
      
      // Formu temizle ve modal'ı kapat
      resetBlokForm();
      setIsAddBlokOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Blok başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Blok eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Blok güncelle
  const handleUpdateBlok = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedBlok) return;
    
    try {
      const response = await fetch(`/api/bloklar/${selectedBlok.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ad: blokAd, 
          ekbilgi: blokEkbilgi 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Blok güncellenirken bir hata oluştu");
      }
      
      // Blokları yenile
      const bloklarResponse = await fetch(`/api/bloklar?projeId=${params.id}`);
      const bloklarData = await bloklarResponse.json();
      setBloklar(bloklarData);
      
      // Formu temizle ve modal'ı kapat
      resetBlokForm();
      setIsEditBlokOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Blok başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Blok güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Blok sil
  const handleDeleteBlok = async () => {
    if (!selectedBlok) return;
    
    try {
      const response = await fetch(`/api/bloklar/${selectedBlok.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Blok silinirken bir hata oluştu");
      }
      
      // Blokları yenile
      const bloklarResponse = await fetch(`/api/bloklar?projeId=${params.id}`);
      const bloklarData = await bloklarResponse.json();
      setBloklar(bloklarData);
      
      // Modal'ı kapat
      setIsDeleteBlokOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Blok başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Blok silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini blokla doldur
  const editBlok = (blok: Blok) => {
    setSelectedBlok(blok);
    setBlokAd(blok.ad);
    setBlokEkbilgi(blok.ekbilgi || "");
    setIsEditBlokOpen(true);
  };
  
  // Silme modal'ını aç
  const deleteBlok = (blok: Blok) => {
    setSelectedBlok(blok);
    setIsDeleteBlokOpen(true);
  };
  
  // Formu temizle
  const resetBlokForm = () => {
    setBlokAd("");
    setBlokEkbilgi("");
    setSelectedBlok(null);
  };
  
  // Yer tutucu resim değeri
  const placeholderImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  if (!proje) {
    return <div className="text-center p-10">Proje bulunamadı.</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Üst kısım */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projeler">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{proje.ad}</h2>
      </div>
      
      {/* Proje Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Proje Bilgisi</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Adres:</h4>
              <p className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                {proje.adres}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Açıklama:</h4>
              <p className="text-gray-600">{proje.ekbilgi || "Ek bilgi bulunmuyor."}</p>
            </div>
            
            {proje.konum && (
              <div>
                <h4 className="font-medium text-gray-700">Konum:</h4>
                <p className="text-gray-600">{proje.konum}</p>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-gray-700">Blok Sayısı:</h4>
              <p className="text-gray-600">{bloklar.length}</p>
            </div>
          </div>
        </div>
        
        {/* Proje Resmi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="relative h-64 w-full">
            <img
              src={proje.image || placeholderImage}
              alt={proje.ad}
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        </div>
      </div>
      
      {/* Bloklar Başlık */}
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-xl font-semibold">Bloklar</h3>
        <Dialog open={isAddBlokOpen} onOpenChange={setIsAddBlokOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetBlokForm()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Yeni Blok Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Blok Ekle</DialogTitle>
              <DialogDescription>
                Blok bilgilerini doldurun ve ekle butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBlok}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="blok-ad" className="text-right">
                    Blok Adı
                  </Label>
                  <Input
                    id="blok-ad"
                    value={blokAd}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBlokAd(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="blok-ekbilgi" className="text-right pt-2">
                    Ek Bilgi
                  </Label>
                  <Textarea
                    id="blok-ekbilgi"
                    value={blokEkbilgi}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBlokEkbilgi(e.target.value)}
                    className="col-span-3"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddBlokOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">
                  Ekle
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Bloklar Listesi */}
      {bloklar.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-slate-50">
          <Building2 className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium">Henüz blok bulunmamaktadır</h3>
          <p className="mt-2 text-sm text-slate-500">
            Yeni bir blok eklemek için "Yeni Blok Ekle" butonuna tıklayın.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bloklar.map((blok) => (
            <Card key={blok.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  {blok.ad} Blok
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-slate-600 min-h-[60px]">
                  {blok.ekbilgi || "Ek bilgi bulunmuyor."}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  <span className="font-medium">Daire Sayısı:</span>
                  <span className="ml-1">0</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => editBlok(blok)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href={`/dashboard/projeler/${params.id}/bloklar/${blok.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Detay
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteBlok(blok)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Blok Düzenleme Modal */}
      <Dialog open={isEditBlokOpen} onOpenChange={setIsEditBlokOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Blok Düzenle</DialogTitle>
            <DialogDescription>
              Blok bilgilerini güncelleyin ve güncelle butonuna tıklayın.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateBlok}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-blok-ad" className="text-right">
                  Blok Adı
                </Label>
                <Input
                  id="edit-blok-ad"
                  value={blokAd}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBlokAd(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-blok-ekbilgi" className="text-right pt-2">
                  Ek Bilgi
                </Label>
                <Textarea
                  id="edit-blok-ekbilgi"
                  value={blokEkbilgi}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBlokEkbilgi(e.target.value)}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditBlokOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                Güncelle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Blok Silme Modal */}
      <Dialog open={isDeleteBlokOpen} onOpenChange={setIsDeleteBlokOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blok Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Bloku silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedBlok?.ad}</strong> adlı bloku silmek üzeresiniz.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteBlokOpen(false)}>
              İptal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteBlok}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 