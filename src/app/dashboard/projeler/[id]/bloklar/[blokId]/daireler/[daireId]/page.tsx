"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, Home, AlertTriangle, Edit, Trash2, Plus, Clock, Calendar, User, Phone } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type Daire = {
  id: string;
  numara: string;
  kat: string | null;
  ekbilgi: string | null;
  blokId: string;
  createdAt: string;
  updatedAt: string;
};

type Blok = {
  id: string;
  ad: string;
  projeId: string;
  ekbilgi: string | null;
  proje?: {
    id: string;
    ad: string;
  };
};

type Proje = {
  id: string;
  ad: string;
};

type ArizaTipi = {
  id: string;
  ad: string;
  ekbilgi: string | null;
}

type Ariza = {
  id: string;
  bildirenKisi: string | null;
  telefon: string | null;
  aciklama: string;
  ekbilgi: string | null;
  oncelik: string;
  durum: string;
  createdAt: string;
  updatedAt: string;
  daireId: string;
  arizaTipiId: string | null;
  arizaTipi: ArizaTipi | null;
}

export default function DaireDetayPage({ params }: { params: { id: string; blokId: string; daireId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [daire, setDaire] = useState<Daire | null>(null);
  const [blok, setBlok] = useState<Blok | null>(null);
  const [proje, setProje] = useState<Proje | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [arizalar, setArizalar] = useState<Ariza[]>([]);
  const [arizaTipleri, setArizaTipleri] = useState<ArizaTipi[]>([]);
  const [isAddArizaOpen, setIsAddArizaOpen] = useState(false);
  
  // Edit arıza state
  const [isEditArizaOpen, setIsEditArizaOpen] = useState(false);
  const [editingAriza, setEditingAriza] = useState<Ariza | null>(null);
  const [editBildirenKisi, setEditBildirenKisi] = useState("");
  const [editTelefon, setEditTelefon] = useState("");
  const [editAciklama, setEditAciklama] = useState("");
  const [editArizaTipiId, setEditArizaTipiId] = useState("");
  const [editOncelik, setEditOncelik] = useState("");
  const [editDurum, setEditDurum] = useState("");
  const [editEkbilgi, setEditEkbilgi] = useState("");
  
  // Arıza form state
  const [bildirenKisi, setBildirenKisi] = useState("");
  const [telefon, setTelefon] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [arizaTipiId, setArizaTipiId] = useState("");
  const [oncelik, setOncelik] = useState("Orta");
  const [ekbilgi, setEkbilgi] = useState("");
  
  // Daire, blok ve proje verilerini getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session) return;
        
        // Daireyi getir
        const daireResponse = await fetch(`/api/daireler/${params.daireId}`);
        
        if (!daireResponse.ok) {
          if (daireResponse.status === 404) {
            router.push(`/dashboard/projeler/${params.id}/bloklar/${params.blokId}`);
            return;
          }
          throw new Error("Daire getirilemedi");
        }
        
        const daireData = await daireResponse.json();
        setDaire(daireData);
        
        // Bloku getir
        const blokResponse = await fetch(`/api/bloklar/${params.blokId}`);
        
        if (blokResponse.ok) {
          const blokData = await blokResponse.json();
          setBlok(blokData);
          
          // Projeyi getir
          const projeResponse = await fetch(`/api/projeler/${params.id}`);
          
          if (projeResponse.ok) {
            const projeData = await projeResponse.json();
            setProje(projeData);
          }
        }
        
        // Arızaları getir
        const arizalarResponse = await fetch(`/api/arizalar?daireId=${params.daireId}`);
        if (arizalarResponse.ok) {
          const arizalarData = await arizalarResponse.json();
          setArizalar(arizalarData);
        }
        
        // Arıza tiplerini getir
        const arizaTipleriResponse = await fetch(`/api/ariza-tipleri`);
        if (arizaTipleriResponse.ok) {
          const arizaTipleriData = await arizaTipleriResponse.json();
          setArizaTipleri(arizaTipleriData);
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
  }, [session, params.id, params.blokId, params.daireId, router, toast]);
  
  // Yeni arıza ekle
  const handleAddAriza = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/arizalar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          daireId: params.daireId,
          bildirenKisi,
          telefon,
          aciklama,
          arizaTipiId: arizaTipiId || null,
          oncelik,
          ekbilgi
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Arıza eklenirken bir hata oluştu");
      }
      
      const data = await response.json();
      
      // Arızaları yenile
      const arizalarResponse = await fetch(`/api/arizalar?daireId=${params.daireId}`);
      if (arizalarResponse.ok) {
        const arizalarData = await arizalarResponse.json();
        setArizalar(arizalarData);
      }
      
      // Formu temizle ve modalı kapat
      resetArizaForm();
      setIsAddArizaOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Arıza kaydı başarıyla oluşturuldu",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Arıza eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Formu temizle
  const resetArizaForm = () => {
    setBildirenKisi("");
    setTelefon("");
    setAciklama("");
    setArizaTipiId("");
    setOncelik("Orta");
    setEkbilgi("");
  };
  
  // Öncelik badge rengi
  const getOncelikBadgeVariant = (oncelik: string) => {
    switch(oncelik) {
      case "Yüksek": return "destructive";
      case "Orta": return "default";
      case "Düşük": return "secondary";
      default: return "default";
    }
  };
  
  // Durum badge rengi
  const getDurumBadgeVariant = (durum: string) => {
    switch(durum) {
      case "Talep Alındı": return "secondary";
      case "Randevu Planlandı": return "warning";
      case "Randevu Yeniden Planlandı": return "warning";
      case "Kısmı Çözüm": return "default";
      case "Çözüm": return "success";
      case "İptal Edildi": return "destructive";
      // Eski durumların geri uyumluluk için korunması
      case "Bekliyor": return "secondary";
      case "İşleniyor": return "warning";
      case "Tamamlandı": return "success";
      default: return "secondary";
    }
  };
  
  // Arıza düzenleme formunu aç
  const openEditArizaForm = (ariza: Ariza) => {
    setEditingAriza(ariza);
    setEditBildirenKisi(ariza.bildirenKisi || "");
    setEditTelefon(ariza.telefon || "");
    setEditAciklama(ariza.aciklama);
    setEditArizaTipiId(ariza.arizaTipiId || "");
    setEditOncelik(ariza.oncelik);
    setEditDurum(ariza.durum);
    setEditEkbilgi(ariza.ekbilgi || "");
    setIsEditArizaOpen(true);
  };
  
  // Arıza düzenleme
  const handleEditAriza = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAriza) return;
    
    try {
      const response = await fetch(`/api/arizalar/${editingAriza.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bildirenKisi: editBildirenKisi,
          telefon: editTelefon,
          aciklama: editAciklama,
          arizaTipiId: editArizaTipiId || null,
          oncelik: editOncelik,
          durum: editDurum,
          ekbilgi: editEkbilgi
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Arıza güncellenirken bir hata oluştu");
      }
      
      // Arızaları yenile
      const arizalarResponse = await fetch(`/api/arizalar?daireId=${params.daireId}`);
      if (arizalarResponse.ok) {
        const arizalarData = await arizalarResponse.json();
        setArizalar(arizalarData);
      }
      
      // Modalı kapat
      setIsEditArizaOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Arıza kaydı başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Arıza güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }
  
  if (!daire) {
    return <div className="text-center p-10">Daire bulunamadı.</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Üst kısım */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/projeler/${params.id}/bloklar/${params.blokId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{daire.numara} Nolu Daire</h2>
        
        <div className="ml-auto flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>
      </div>
      
      {/* Daire Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle>Daire Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Proje:</h4>
              <p className="flex items-center gap-1 text-gray-600">
                <Building2 className="h-4 w-4" />
                {proje?.ad || blok?.proje?.ad || "Bilinmiyor"}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Blok:</h4>
              <p className="flex items-center gap-1 text-gray-600">
                <Building2 className="h-4 w-4" />
                {blok?.ad || "Bilinmiyor"}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Daire Numarası:</h4>
              <p className="flex items-center gap-1 text-gray-600">
                <Home className="h-4 w-4" />
                {daire.numara}
              </p>
            </div>
            
            {daire.kat && (
              <div>
                <h4 className="font-medium text-gray-700">Kat:</h4>
                <p className="text-gray-600">{daire.kat}</p>
              </div>
            )}
            
            {daire.ekbilgi && (
              <div className="col-span-1 md:col-span-2">
                <h4 className="font-medium text-gray-700">Açıklama:</h4>
                <p className="text-gray-600">{daire.ekbilgi}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Arızalar Bölümü */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Arızalar</h3>
          <Dialog open={isAddArizaOpen} onOpenChange={setIsAddArizaOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetArizaForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Arıza Kaydı
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Yeni Arıza Kaydı</DialogTitle>
                <DialogDescription>
                  Arıza bilgilerini doldurun ve kaydet butonuna tıklayın.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAriza}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <Label htmlFor="bildiren-kisi">Bildiren Kişi</Label>
                      <Input
                        id="bildiren-kisi"
                        value={bildirenKisi}
                        onChange={(e) => setBildirenKisi(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <Label htmlFor="telefon">Telefon</Label>
                      <Input
                        id="telefon"
                        value={telefon}
                        onChange={(e) => setTelefon(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="aciklama">Arıza Açıklaması</Label>
                    <Textarea
                      id="aciklama"
                      value={aciklama}
                      onChange={(e) => setAciklama(e.target.value)}
                      className="mt-1"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ariza-tipi">Arıza Tipi</Label>
                      <Select value={arizaTipiId} onValueChange={setArizaTipiId}>
                        <SelectTrigger id="ariza-tipi" className="mt-1">
                          <SelectValue placeholder="Arıza tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {arizaTipleri.map((tip) => (
                            <SelectItem key={tip.id} value={tip.id}>
                              {tip.ad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="oncelik">Öncelik</Label>
                      <Select value={oncelik} onValueChange={setOncelik}>
                        <SelectTrigger id="oncelik" className="mt-1">
                          <SelectValue placeholder="Öncelik seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Düşük">Düşük</SelectItem>
                          <SelectItem value="Orta">Orta</SelectItem>
                          <SelectItem value="Yüksek">Yüksek</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="ekbilgi">Ek Bilgi (Opsiyonel)</Label>
                    <Textarea
                      id="ekbilgi"
                      value={ekbilgi}
                      onChange={(e) => setEkbilgi(e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddArizaOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit">Kaydet</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {arizalar.length === 0 ? (
          <div className="text-center p-10 border rounded-lg bg-slate-50">
            <AlertTriangle className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium">Henüz arıza kaydı bulunmamaktadır</h3>
            <p className="mt-2 text-sm text-slate-500">
              Yeni bir arıza eklemek için "Yeni Arıza Kaydı" butonuna tıklayın.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {arizalar.map((ariza) => (
              <Card key={ariza.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50 border-b p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {ariza.arizaTipi?.ad || "Diğer Arıza"}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {format(new Date(ariza.createdAt), "d MMM yyyy, HH:mm", { locale: tr })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getOncelikBadgeVariant(ariza.oncelik)}>
                        {ariza.oncelik}
                      </Badge>
                      <Badge variant={getDurumBadgeVariant(ariza.durum)}>
                        {ariza.durum}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm">Arıza Açıklaması:</h4>
                      <p className="text-sm mt-1">{ariza.aciklama}</p>
                    </div>
                    
                    {ariza.bildirenKisi && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{ariza.bildirenKisi}</span>
                        </div>
                        
                        {ariza.telefon && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{ariza.telefon}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {ariza.ekbilgi && (
                      <div>
                        <h4 className="font-medium text-sm">Ek Bilgi:</h4>
                        <p className="text-sm mt-1">{ariza.ekbilgi}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end border-t p-2 bg-slate-50">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditArizaForm(ariza)}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Düzenle
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Sil
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Arıza Düzenleme Modal */}
      <Dialog open={isEditArizaOpen} onOpenChange={setIsEditArizaOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Arıza Kaydını Düzenle</DialogTitle>
            <DialogDescription>
              Arıza bilgilerini güncelleyin ve kaydet butonuna tıklayın.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditAriza}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="edit-bildiren-kisi">Bildiren Kişi</Label>
                  <Input
                    id="edit-bildiren-kisi"
                    value={editBildirenKisi}
                    onChange={(e) => setEditBildirenKisi(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="edit-telefon">Telefon</Label>
                  <Input
                    id="edit-telefon"
                    value={editTelefon}
                    onChange={(e) => setEditTelefon(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-aciklama">Arıza Açıklaması</Label>
                <Textarea
                  id="edit-aciklama"
                  value={editAciklama}
                  onChange={(e) => setEditAciklama(e.target.value)}
                  className="mt-1"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-ariza-tipi">Arıza Tipi</Label>
                  <Select value={editArizaTipiId} onValueChange={setEditArizaTipiId}>
                    <SelectTrigger id="edit-ariza-tipi" className="mt-1">
                      <SelectValue placeholder="Arıza tipi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {arizaTipleri.map((tip) => (
                        <SelectItem key={tip.id} value={tip.id}>
                          {tip.ad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-oncelik">Öncelik</Label>
                  <Select value={editOncelik} onValueChange={setEditOncelik}>
                    <SelectTrigger id="edit-oncelik" className="mt-1">
                      <SelectValue placeholder="Öncelik seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Düşük">Düşük</SelectItem>
                      <SelectItem value="Orta">Orta</SelectItem>
                      <SelectItem value="Yüksek">Yüksek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-durum">Durum</Label>
                <Select value={editDurum} onValueChange={setEditDurum}>
                  <SelectTrigger id="edit-durum" className="mt-1">
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Talep Alındı">Talep Alındı</SelectItem>
                    <SelectItem value="Randevu Planlandı">Randevu Planlandı</SelectItem>
                    <SelectItem value="Randevu Yeniden Planlandı">Randevu Yeniden Planlandı</SelectItem>
                    <SelectItem value="Kısmı Çözüm">Kısmı Çözüm</SelectItem>
                    <SelectItem value="Çözüm">Çözüm</SelectItem>
                    <SelectItem value="İptal Edildi">İptal Edildi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-ekbilgi">Ek Bilgi (Opsiyonel)</Label>
                <Textarea
                  id="edit-ekbilgi"
                  value={editEkbilgi}
                  onChange={(e) => setEditEkbilgi(e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditArizaOpen(false)}>
                İptal
              </Button>
              <Button type="submit">Güncelle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 