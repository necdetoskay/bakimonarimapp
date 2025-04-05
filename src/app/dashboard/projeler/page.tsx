"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, MapPin, Edit, Trash2, Building2, Upload, X, Image as ImageIcon, Eye } from "lucide-react";
import Image from "next/image";
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

export default function ProjelerPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [projeler, setProjeler] = useState<Proje[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProje, setSelectedProje] = useState<Proje | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state
  const [ad, setAd] = useState("");
  const [ekbilgi, setEkbilgi] = useState("");
  const [adres, setAdres] = useState("");
  const [konum, setKonum] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Input refs
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // Projeleri getir
  useEffect(() => {
    const fetchProjeler = async () => {
      try {
        const response = await fetch("/api/projeler");
        
        if (!response.ok) {
          throw new Error("Projeler getirilemedi");
        }
        
        const data = await response.json();
        setProjeler(data);
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
      fetchProjeler();
    }
  }, [session, toast]);
  
  // Form modalları açıldığında veya kapandığında önizlemeyi temizle
  useEffect(() => {
    if (!isAddOpen && !isEditOpen) {
      setPreviewImage(null);
    }
  }, [isAddOpen, isEditOpen]);
  
  // Resim yükleme fonksiyonu
  const handleImageUpload = async (file: File): Promise<string> => {
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Resim yüklenirken bir hata oluştu");
      }
      
      setUploadingImage(false);
      return data.url;
    } catch (error: any) {
      setUploadingImage(false);
      throw new Error(error.message || "Resim yüklenirken bir hata oluştu");
    }
  };
  
  // Dosya seçildiğinde çalışacak fonksiyon
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Dosya tipi kontrolü
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast({
        title: "Hata",
        description: "Sadece JPG ve PNG dosyaları yüklenebilir",
        variant: "destructive",
      });
      return;
    }
    
    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 5MB'dan küçük olmalıdır",
        variant: "destructive",
      });
      return;
    }
    
    // Önizleme için URL oluştur
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    
    try {
      // Resmi yükle
      const imageUrl = await handleImageUpload(file);
      setImage(imageUrl);
      
      toast({
        title: "Başarılı",
        description: "Resim başarıyla yüklendi",
      });
    } catch (error: any) {
      console.error("Resim yükleme hatası:", error);
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Resmi kaldır
  const handleRemoveImage = () => {
    setImage("");
    setPreviewImage(null);
    
    // File input'u temizle
    if (addFileInputRef.current) addFileInputRef.current.value = "";
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };
  
  // Yeni proje ekle
  const handleAddProje = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/projeler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ad, ekbilgi, adres, konum, image }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Proje eklenirken bir hata oluştu");
      }
      
      // Projeleri yenile
      const projelerResponse = await fetch("/api/projeler");
      const projelerData = await projelerResponse.json();
      setProjeler(projelerData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsAddOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Proje başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Proje eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Proje düzenle
  const handleEditProje = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedProje) return;
    
    try {
      const response = await fetch(`/api/projeler/${selectedProje.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ad, ekbilgi, adres, konum, image }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Proje güncellenirken bir hata oluştu");
      }
      
      // Projeleri yenile
      const projelerResponse = await fetch("/api/projeler");
      const projelerData = await projelerResponse.json();
      setProjeler(projelerData);
      
      // Formu temizle ve modal'ı kapat
      resetForm();
      setIsEditOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Proje başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Proje güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Proje sil
  const handleDeleteProje = async () => {
    if (!selectedProje) return;
    
    try {
      const response = await fetch(`/api/projeler/${selectedProje.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Proje silinirken bir hata oluştu");
      }
      
      // Projeleri yenile
      const projelerResponse = await fetch("/api/projeler");
      const projelerData = await projelerResponse.json();
      setProjeler(projelerData);
      
      // Modal'ı kapat
      setIsDeleteOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Proje başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Proje silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Form değerlerini seçilen proje ile doldur
  const editProje = (proje: Proje) => {
    setSelectedProje(proje);
    setAd(proje.ad);
    setEkbilgi(proje.ekbilgi || "");
    setAdres(proje.adres);
    setKonum(proje.konum || "");
    setImage(proje.image || "");
    setPreviewImage(proje.image);
    setIsEditOpen(true);
  };
  
  // Silme modal'ını aç
  const deleteProje = (proje: Proje) => {
    setSelectedProje(proje);
    setIsDeleteOpen(true);
  };
  
  // Form değerlerini temizle
  const resetForm = () => {
    setAd("");
    setEkbilgi("");
    setAdres("");
    setKonum("");
    setImage("");
    setPreviewImage(null);
    setSelectedProje(null);
    if (addFileInputRef.current) addFileInputRef.current.value = "";
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  // Yer tutucu resim değeri
  const placeholderImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Proje Yönetimi</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Yeni Proje
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Proje Ekle</DialogTitle>
              <DialogDescription>
                Proje bilgilerini doldurun ve ekle butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProje}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ad" className="text-right">
                    Proje Adı
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
                  <Label htmlFor="adres" className="text-right">
                    Adres
                  </Label>
                  <Input
                    id="adres"
                    value={adres}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdres(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="konum" className="text-right">
                    Konum
                  </Label>
                  <Input
                    id="konum"
                    placeholder="39.925533, 32.866287"
                    value={konum}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKonum(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="image" className="text-right pt-2">
                    Resim
                  </Label>
                  <div className="col-span-3 space-y-3">
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        id="image"
                        ref={addFileInputRef}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        disabled={uploadingImage}
                      />
                      
                      {!previewImage ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addFileInputRef.current?.click()}
                          disabled={uploadingImage}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingImage ? "Yükleniyor..." : "Resim Yükle"}
                        </Button>
                      ) : (
                        <div className="relative border rounded-md overflow-hidden">
                          <img
                            src={previewImage}
                            alt="Önizleme"
                            className="w-full h-40 object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-xs text-slate-500 mt-1">
                        Sadece JPG ve PNG formatları desteklenmektedir (max 5MB).
                      </p>
                    </div>
                  </div>
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
                <Button type="submit" disabled={uploadingImage}>
                  {uploadingImage ? "İşleniyor..." : "Ekle"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {projeler.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-slate-50">
          <Building2 className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium">Henüz proje bulunmamaktadır</h3>
          <p className="mt-2 text-sm text-slate-500">
            Yeni bir proje eklemek için "Yeni Proje" butonuna tıklayın.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projeler.map((proje) => (
            <Card key={proje.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48 w-full">
                <img
                  src={proje.image || placeholderImage}
                  alt={proje.ad}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{proje.ad}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {proje.adres}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-slate-600">
                  {proje.ekbilgi || "Ek bilgi bulunmuyor."}
                </p>
                {proje.konum && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500">Konum Bilgisi:</p>
                    <p className="text-sm">{proje.konum}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => editProje(proje)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href={`/dashboard/projeler/${proje.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Detay
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteProje(proje)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Düzenleme Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Proje Düzenle</DialogTitle>
            <DialogDescription>
              Proje bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProje}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ad" className="text-right">
                  Proje Adı
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
                <Label htmlFor="edit-adres" className="text-right">
                  Adres
                </Label>
                <Input
                  id="edit-adres"
                  value={adres}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdres(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-konum" className="text-right">
                  Konum
                </Label>
                <Input
                  id="edit-konum"
                  placeholder="39.925533, 32.866287"
                  value={konum}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKonum(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-image" className="text-right pt-2">
                  Resim
                </Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      id="edit-image"
                      ref={editFileInputRef}
                      className="hidden"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      disabled={uploadingImage}
                    />
                    
                    {!previewImage ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => editFileInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingImage ? "Yükleniyor..." : "Resim Yükle"}
                      </Button>
                    ) : (
                      <div className="relative border rounded-md overflow-hidden">
                        <img
                          src={previewImage}
                          alt="Önizleme"
                          className="w-full h-40 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <p className="text-xs text-slate-500 mt-1">
                      Sadece JPG ve PNG formatları desteklenmektedir (max 5MB).
                    </p>
                  </div>
                </div>
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
              <Button type="submit" disabled={uploadingImage}>
                {uploadingImage ? "İşleniyor..." : "Güncelle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Silme Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proje Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Projeyi silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedProje?.ad}</strong> adlı projeyi silmek üzeresiniz.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              İptal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteProje}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 