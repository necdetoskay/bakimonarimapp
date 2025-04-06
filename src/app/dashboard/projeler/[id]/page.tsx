"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Building2, Home } from "lucide-react";
import Link from "next/link";

// Fetch fonksiyonu
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Veri çekerken bir hata oluştu');
    throw error;
  }
  return res.json();
};

// Tip tanımlamaları
type Proje = {
  id: string;
  ad: string;
  adres: string;
  konum: string | null;
  image: string | null;
  ekbilgi: string | null;
  createdAt: string;
  updatedAt: string;
};

type Blok = {
  id: string;
  ad: string;
  projeId: string;
  ekbilgi: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProjeDetay() {
  const params = useParams();
  const projeId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  
  // SWR ile proje verilerini çekme
  const { data: proje, error: projeError, isLoading: projeLoading } = useSWR<Proje>(
    status === "authenticated" ? `/api/projeler/${projeId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000 // 10 saniye içinde tekrar sorgu yapılmasını engeller
    }
  );
  
  // SWR ile blok verilerini çekme
  const { data: bloklar, error: bloklarError, isLoading: bloklarLoading } = useSWR<Blok[]>(
    status === "authenticated" ? `/api/bloklar?projeId=${projeId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000
    }
  );
  
  // Blok kartı için daire sayısını tutan state
  const [blokDaireCounts, setBlokDaireCounts] = useState<{[key: string]: number}>({});

  // Blokların daire sayılarını getir
  useEffect(() => {
    if (bloklar && bloklar.length > 0) {
      const fetchDaireSayilari = async () => {
        const counts: {[key: string]: number} = {};
        
        for (const blok of bloklar) {
          try {
            const response = await fetch(`/api/daireler?blokId=${blok.id}`);
            if (response.ok) {
              const data = await response.json();
              counts[blok.id] = data.length;
            } else {
              counts[blok.id] = 0;
            }
          } catch (error) {
            console.error(`Daire sayısı alınırken hata: ${blok.id}`, error);
            counts[blok.id] = 0;
          }
        }
        
        setBlokDaireCounts(counts);
      };
      
      fetchDaireSayilari();
    }
  }, [bloklar]);

  const isLoading = status === "loading" || projeLoading || bloklarLoading;

  const [isAddBlokOpen, setIsAddBlokOpen] = useState(false);
  const [isEditBlokOpen, setIsEditBlokOpen] = useState(false);
  const [isDeleteBlokOpen, setIsDeleteBlokOpen] = useState(false);
  const [selectedBlok, setSelectedBlok] = useState<Blok | null>(null);
  
  // Form durumları
  const [yeniBlokAd, setYeniBlokAd] = useState("");
  const [yeniBlokEkbilgi, setYeniBlokEkbilgi] = useState("");
  const [editBlokAd, setEditBlokAd] = useState("");
  const [editBlokEkbilgi, setEditBlokEkbilgi] = useState("");

  // Yeni blok ekleme
  const handleAddBlok = async () => {
    if (!yeniBlokAd) {
      toast({
        title: "Hata",
        description: "Blok adı zorunludur",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/bloklar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ad: yeniBlokAd,
          projeId: projeId,
          ekbilgi: yeniBlokEkbilgi || null,
        }),
      });

      if (response.ok) {
        const yeniBlok = await response.json();
        
        // SWR önbelleğini doğrudan güncelle ve mevcut verilere yeni bloğu ekle
        mutate(
          `/api/bloklar?projeId=${projeId}`,
          (eskiVeri) => {
            if (Array.isArray(eskiVeri)) {
              return [yeniBlok, ...eskiVeri];
            }
            return [yeniBlok];
          },
          false // false: Önce veriyi güncelleyip sonra sunucudan yeniden doğrulama yapma
        );
        
        // Ekstra güvenlik için 500ms sonra tekrar mutate çağrısı yap
        setTimeout(() => {
          mutate(`/api/bloklar?projeId=${projeId}`);
        }, 500);
        
        setYeniBlokAd("");
        setYeniBlokEkbilgi("");
        setIsAddBlokOpen(false);
        
        toast({
          title: "Başarılı",
          description: "Blok başarıyla eklendi",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.message || "Blok eklenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Blok eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  // Blok düzenleme
  const handleEditBlok = async () => {
    if (!selectedBlok || !editBlokAd) {
      toast({
        title: "Hata",
        description: "Blok adı zorunludur",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/bloklar/${selectedBlok.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ad: editBlokAd,
          ekbilgi: editBlokEkbilgi || null,
        }),
      });

      if (response.ok) {
        const guncellenenBlok = await response.json();
        
        // SWR önbelleğini doğrudan güncelle
        mutate(
          `/api/bloklar?projeId=${projeId}`,
          (eskiVeri) => {
            if (Array.isArray(eskiVeri)) {
              return eskiVeri.map(blok => 
                blok.id === selectedBlok.id ? guncellenenBlok : blok
              );
            }
            return eskiVeri;
          },
          false
        );
        
        // Ekstra güvenlik için 500ms sonra tekrar mutate çağrısı yap
        setTimeout(() => {
          mutate(`/api/bloklar?projeId=${projeId}`);
        }, 500);
        
        setEditBlokAd("");
        setEditBlokEkbilgi("");
        setSelectedBlok(null);
        setIsEditBlokOpen(false);
        
        toast({
          title: "Başarılı",
          description: "Blok başarıyla güncellendi",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.message || "Blok güncellenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Blok güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  // Blok silme
  const handleDeleteBlok = async () => {
    if (!selectedBlok) return;

    try {
      const response = await fetch(`/api/bloklar/${selectedBlok.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // SWR önbelleğini doğrudan güncelle
        mutate(
          `/api/bloklar?projeId=${projeId}`,
          (eskiVeri) => {
            if (Array.isArray(eskiVeri)) {
              return eskiVeri.filter(blok => blok.id !== selectedBlok.id);
            }
            return eskiVeri;
          },
          false
        );
        
        // Ekstra güvenlik için 500ms sonra tekrar mutate çağrısı yap
        setTimeout(() => {
          mutate(`/api/bloklar?projeId=${projeId}`);
        }, 500);
        
        setSelectedBlok(null);
        setIsDeleteBlokOpen(false);
        
        toast({
          title: "Başarılı",
          description: "Blok başarıyla silindi",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.message || "Blok silinirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Blok silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  // Düzenleme modalını aç
  const openEditBlokModal = (blok: Blok) => {
    setSelectedBlok(blok);
    setEditBlokAd(blok.ad);
    setEditBlokEkbilgi(blok.ekbilgi || "");
    setIsEditBlokOpen(true);
  };

  // Silme modalını aç
  const openDeleteBlokModal = (blok: Blok | null) => {
    setSelectedBlok(blok);
    setIsDeleteBlokOpen(true);
  };

  // İlave state'ler ekleyelim
  const [isEditProjeOpen, setIsEditProjeOpen] = useState(false);
  const [isDeleteProjeOpen, setIsDeleteProjeOpen] = useState(false);
  const [editProjeData, setEditProjeData] = useState({ ad: "", adres: "", ekbilgi: "", image: "" });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // useEffect ile proje verisi geldiğinde edit formunu dolduralım
  useEffect(() => {
    if (proje) {
      setEditProjeData({
        ad: proje.ad,
        adres: proje.adres,
        ekbilgi: proje.ekbilgi || "",
        image: proje.image || ""
      });
      setImagePreview(proje.image || null);
    }
  }, [proje]);

  // Dosya seçme işleyicisi
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 5MB'dan büyük olamaz",
        variant: "destructive",
      });
      return;
    }

    // Dosya tipi kontrolü
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast({
        title: "Hata",
        description: "Sadece JPEG ve PNG dosyaları yüklenebilir",
        variant: "destructive",
      });
      return;
    }

    setSelectedImageFile(file);
    
    // Dosya önizleme URL'i oluştur
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Resim kaldırma
  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    setEditProjeData({...editProjeData, image: ""});
  };

  // Resim yükleme
  const uploadImage = async (): Promise<string> => {
    if (!selectedImageFile) return editProjeData.image;

    const formData = new FormData();
    formData.append("file", selectedImageFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Resim yüklenirken bir hata oluştu");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      toast({
        title: "Hata",
        description: "Resim yüklenirken bir hata oluştu",
        variant: "destructive",
      });
      return editProjeData.image; // Hata durumunda mevcut resmi kullan
    }
  };

  // Proje düzenleme fonksiyonu
  const handleEditProje = async () => {
    if (!editProjeData.ad || !editProjeData.adres) {
      toast({
        title: "Hata",
        description: "Proje adı ve adresi zorunludur",
        variant: "destructive",
      });
      return;
    }

    try {
      // Eğer yeni resim seçildiyse önce resmi yükle
      let imageUrl = editProjeData.image;
      
      if (selectedImageFile) {
        toast({
          title: "İşleniyor",
          description: "Resim yükleniyor, lütfen bekleyin...",
        });
        
        imageUrl = await uploadImage();
        if (!imageUrl && selectedImageFile) {
          // Resim yükleme başarısız oldu ve bir dosya seçilmiş
          return;
        }
      }

      const response = await fetch(`/api/projeler/${projeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editProjeData,
          image: imageUrl
        }),
      });

      if (response.ok) {
        // SWR önbelleğini yenile
        mutate(`/api/projeler/${projeId}`);
        
        // Kaynakları temizle
        if (imagePreview && selectedImageFile) {
          URL.revokeObjectURL(imagePreview);
        }
        setSelectedImageFile(null);
        setIsEditProjeOpen(false);
        
        toast({
          title: "Başarılı",
          description: "Proje başarıyla güncellendi",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.message || "Proje güncellenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Proje güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  // Proje silme işlemi
  const handleDeleteProje = async () => {
    try {
      const response = await fetch(`/api/projeler/${projeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Proje başarıyla silindi",
        });
        router.push("/dashboard/projeler");
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.message || "Proje silinirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Proje silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Yükleniyor...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (projeError || bloklarError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bir hata oluştu</h2>
          <p>Veri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/projeler")}>
            Projelere Dön
          </Button>
        </div>
      </div>
    );
  }

  if (!proje) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Proje bulunamadı</h2>
          <p>İstediğiniz proje bilgileri bulunamadı.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/projeler")}>
            Projelere Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="mb-0">
            <Link href="/dashboard/projeler">
              <span className="mr-1">←</span> Geri
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{proje.ad}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditProjeOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setIsDeleteProjeOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>
      </div>

      {/* Proje Bilgisi Kartı */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Proje Bilgisi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sol taraf - Proje bilgileri */}
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="font-medium text-sm text-gray-500">Adres:</h3>
                <p>{proje.adres}</p>
              </div>
              {proje.ekbilgi && (
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Açıklama:</h3>
                  <p>{proje.ekbilgi}</p>
                </div>
              )}
              <div>
                <h3 className="font-medium text-sm text-gray-500">Blok Sayısı:</h3>
                <p>{bloklar?.length || 0}</p>
              </div>
            </div>
            
            {/* Sağ taraf - Proje resmi */}
            <div className="w-full lg:w-1/3 flex items-center justify-center">
              {proje.image && proje.image.trim() !== "" ? (
                <div className="relative rounded-lg overflow-hidden w-full aspect-video">
                  <img 
                    src={proje.image} 
                    alt={`${proje.ad} projesi`} 
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg w-full aspect-video flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-gray-300" />
                  <span className="sr-only">Proje resmi bulunmuyor</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloklar Bölümü */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bloklar</h2>
          <Button onClick={() => setIsAddBlokOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Blok Ekle
          </Button>
        </div>

        {!bloklar || bloklar.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Henüz blok bulunmuyor</h2>
            <p className="text-gray-500 mb-4">Bu projeye blok ekleyerek başlayın.</p>
            <Button onClick={() => setIsAddBlokOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Blok Ekle
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bloklar.map((blok) => (
              <Link href={`/dashboard/projeler/${projeId}/bloklar/${blok.id}`} key={blok.id}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <Building2 className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{blok.ad}</h3>
                        <p className="text-sm text-gray-500">{blok.ekbilgi || "Açıklama bulunmuyor"}</p>
                        <div className="mt-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {blokDaireCounts[blok.id] || 0} Daire
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button size="sm" variant="ghost" onClick={(e) => { e.preventDefault(); openEditBlokModal(blok); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={(e) => { e.preventDefault(); openDeleteBlokModal(blok); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Blok Ekleme Dialog */}
      <Dialog open={isAddBlokOpen} onOpenChange={setIsAddBlokOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Blok Ekle</DialogTitle>
            <DialogDescription>Blok bilgilerini girin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="blokAd">Blok Adı *</Label>
              <Input
                id="blokAd"
                value={yeniBlokAd}
                onChange={(e) => setYeniBlokAd(e.target.value)}
                placeholder="Blok adını girin (örn: A Blok)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="blokEkbilgi">Ek Bilgi</Label>
              <Textarea
                id="blokEkbilgi"
                value={yeniBlokEkbilgi}
                onChange={(e) => setYeniBlokEkbilgi(e.target.value)}
                placeholder="Blok ek bilgisi girin (opsiyonel)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBlokOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddBlok}>Ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blok Düzenleme Dialog */}
      <Dialog open={isEditBlokOpen} onOpenChange={setIsEditBlokOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blok Düzenle</DialogTitle>
            <DialogDescription>Blok bilgilerini güncelleyin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editBlokAd">Blok Adı *</Label>
              <Input
                id="editBlokAd"
                value={editBlokAd}
                onChange={(e) => setEditBlokAd(e.target.value)}
                placeholder="Blok adını girin (örn: A Blok)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editBlokEkbilgi">Ek Bilgi</Label>
              <Textarea
                id="editBlokEkbilgi"
                value={editBlokEkbilgi}
                onChange={(e) => setEditBlokEkbilgi(e.target.value)}
                placeholder="Blok ek bilgisi girin (opsiyonel)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBlokOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleEditBlok}>Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blok Silme AlertDialog */}
      <AlertDialog open={isDeleteBlokOpen} onOpenChange={setIsDeleteBlokOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Blok Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bloğu silmek istediğinize emin misiniz?
              Blok silindiğinde, bloğa bağlı tüm daireler de silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteBlokOpen(false)}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBlok} className="bg-red-500 hover:bg-red-600">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Proje Düzenleme Dialog */}
      <Dialog open={isEditProjeOpen} onOpenChange={setIsEditProjeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Projeyi Düzenle</DialogTitle>
            <DialogDescription>Proje bilgilerini güncelleyin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="projeAd">Proje Adı *</Label>
                  <Input
                    id="projeAd"
                    value={editProjeData.ad}
                    onChange={(e) => setEditProjeData({ ...editProjeData, ad: e.target.value })}
                    placeholder="Proje adını girin"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="projeAdres">Adres *</Label>
                  <Input
                    id="projeAdres"
                    value={editProjeData.adres}
                    onChange={(e) => setEditProjeData({ ...editProjeData, adres: e.target.value })}
                    placeholder="Proje adresini girin"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="projeAciklama">Açıklama</Label>
                  <Textarea
                    id="projeAciklama"
                    value={editProjeData.ekbilgi}
                    onChange={(e) => setEditProjeData({ ...editProjeData, ekbilgi: e.target.value })}
                    placeholder="Proje açıklaması girin (opsiyonel)"
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Proje Resmi</Label>
                <div className="border rounded-md p-4">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={imagePreview} 
                          alt="Proje resmi önizleme" 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex gap-2">
                        <label 
                          htmlFor="projeResimDegistir" 
                          className="cursor-pointer text-xs text-blue-600 hover:text-blue-800"
                        >
                          Değiştir
                        </label>
                        <span className="text-gray-300">|</span>
                        <button 
                          type="button" 
                          onClick={handleRemoveImage}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="aspect-video rounded-md bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-gray-300" />
                      </div>
                      <label 
                        htmlFor="projeResimDegistir" 
                        className="cursor-pointer block text-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        Resim Ekle
                      </label>
                    </div>
                  )}
                  <input
                    id="projeResimDegistir"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    En fazla 5MB boyutunda JPG veya PNG formatında bir resim yükleyin
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              // Kaynakları temizle
              if (imagePreview && selectedImageFile) {
                URL.revokeObjectURL(imagePreview);
              }
              setSelectedImageFile(null);
              setIsEditProjeOpen(false);
            }}>
              İptal
            </Button>
            <Button onClick={handleEditProje}>Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proje Silme AlertDialog */}
      <AlertDialog open={isDeleteProjeOpen} onOpenChange={setIsDeleteProjeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proje Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Projeyi silmek istediğinize emin misiniz?
              Proje silindiğinde, projeye bağlı tüm bloklar ve daireler de silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteProjeOpen(false)}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProje} className="bg-red-500 hover:bg-red-600">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 