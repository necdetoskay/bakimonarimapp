"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Building2, MapPin, Calendar, User, Phone, AlertTriangle, Wrench,
  CheckCircle, XCircle, CheckSquare, Clock, PencilLine, Trash2, CalendarDays, Plus
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Tipler
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
  daire: {
    id: string;
    numara: string;
    kat: string | null;
    blok: {
      id: string;
      ad: string;
      proje: {
        id: string;
        ad: string;
      };
    };
  };
  randevular: Randevu[];
};

type ArizaTipi = {
  id: string;
  ad: string;
  ekbilgi: string | null;
};

type Tekniker = {
  id: string;
  adsoyad: string;
  telefon: string | null;
  ekbilgi: string | null;
  uzmanlikAlanlari: Array<{ id: string; ad: string }>;
};

type Malzeme = {
  id: string;
  ad: string;
  birim: string | null;
};

type RandevuMalzeme = {
  id: string;
  miktar: number;
  birim: string | null;
  fiyat: number;
  malzeme: Malzeme;
};

type Randevu = {
  id: string;
  tarih: string;
  notlar: string | null;
  durum: string;
  sonuc: string | null;
  ariza: Ariza;
  tekniker: Tekniker | null;
  teknikerId: string | null;
  teknikerler: Array<{
    id: string;
    tekniker: Tekniker;
  }>;
  oncekiRandevuId: string | null;
  oncekiRandevu: Randevu | null;
  sonrakiRandevu: Randevu | null;
  createdAt: string;
  updatedAt: string;
  kullanilanMalzemeler: RandevuMalzeme[];
};

export default function ArizaDetayPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [ariza, setAriza] = useState<Ariza | null>(null);
  const [randevular, setRandevular] = useState<Randevu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Randevu form state
  const [isRandevuModalOpen, setIsRandevuModalOpen] = useState(false);
  const [randevuTarih, setRandevuTarih] = useState("");
  const [randevuSaat, setRandevuSaat] = useState("");
  const [randevuTeknikerIds, setRandevuTeknikerIds] = useState<string[]>([]);
  const [randevuNotlar, setRandevuNotlar] = useState("");
  
  // Çözüm form state
  const [isCozumModalOpen, setIsCozumModalOpen] = useState(false);
  const [seciliRandevuId, setSeciliRandevuId] = useState<string>("");
  const [cozumSonuc, setCozumSonuc] = useState("");
  const [cozumDurum, setCozumDurum] = useState("Tamamlandı");
  const [kullanılanMalzemeler, setKullanılanMalzemeler] = useState<Array<{
    malzemeId: string;
    miktar: number;
    birim: string | null;
    fiyat: number;
  }>>([]);
  
  // Tekniker ve malzemeler
  const [teknikerler, setTeknikerler] = useState<Tekniker[]>([]);
  const [malzemeler, setMalzemeler] = useState<Malzeme[]>([]);
  
  // Arıza ve randevu verilerini getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session) return;
        
        // Arızayı getir
        const arizaResponse = await fetch(`/api/arizalar/${params.id}`);
        
        if (!arizaResponse.ok) {
          if (arizaResponse.status === 404) {
            router.push("/dashboard");
            return;
          }
          throw new Error("Arıza detayları getirilemedi");
        }
        
        const arizaData = await arizaResponse.json();
        setAriza(arizaData);
        
        // Randevuları getir
        const randevularResponse = await fetch(`/api/randevular?arizaId=${params.id}`);
        if (randevularResponse.ok) {
          const randevularData = await randevularResponse.json();
          setRandevular(randevularData);
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
  }, [session, params.id, router, toast]);
  
  // Tekniker ve malzemeleri getir
  useEffect(() => {
    const fetchTeknikerVeMalzemeler = async () => {
      try {
        if (!session) return;
        
        // Teknikerleri getir
        const teknikerlerResponse = await fetch('/api/teknikerler');
        if (teknikerlerResponse.ok) {
          const teknikerlerData = await teknikerlerResponse.json();
          setTeknikerler(teknikerlerData);
        }
        
        // Malzemeleri getir
        const malzemelerResponse = await fetch('/api/malzemeler');
        if (malzemelerResponse.ok) {
          const malzemelerData = await malzemelerResponse.json();
          setMalzemeler(malzemelerData);
        }
      } catch (error) {
        console.error("Hata:", error);
      }
    };
    
    fetchTeknikerVeMalzemeler();
  }, [session]);
  
  // Arızayı iptal et
  const handleIptalEt = async () => {
    if (!ariza) return;
    
    if (!confirm("Bu arıza kaydını iptal etmek istediğinizden emin misiniz?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/arizalar/${ariza.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Arıza silinirken bir hata oluştu");
      }
      
      toast({
        title: "Başarılı",
        description: "Arıza kaydı iptal edildi",
      });
      
      // Daireye geri dön
      if (ariza.daire) {
        router.push(`/dashboard/projeler/${ariza.daire.blok.proje.id}/bloklar/${ariza.daire.blok.id}/daireler/${ariza.daire.id}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Arıza iptal edilirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Randevu durumunu güncelle
  const updateRandevuDurum = async (randevuId: string, yeniDurum: string, sonuc?: string) => {
    try {
      const response = await fetch(`/api/randevular/${randevuId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          durum: yeniDurum,
          sonuc
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Randevu güncellenirken bir hata oluştu");
      }
      
      // Verileri yenile
      const arizaResponse = await fetch(`/api/arizalar/${params.id}`);
      if (arizaResponse.ok) {
        const arizaData = await arizaResponse.json();
        setAriza(arizaData);
      }
      
      const randevularResponse = await fetch(`/api/randevular?arizaId=${params.id}`);
      if (randevularResponse.ok) {
        const randevularData = await randevularResponse.json();
        setRandevular(randevularData);
      }
      
      toast({
        title: "Başarılı",
        description: "Randevu durumu güncellendi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Randevu güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Randevuyu iptal et
  const cancelRandevu = async (randevuId: string) => {
    updateRandevuDurum(randevuId, "İptal Edildi");
  };
  
  // Randevuyu tamamla
  // const completeRandevu = async (randevuId: string) => {
  //   updateRandevuDurum(randevuId, "Tamamlandı");
  // };
  
  // Kısmi çözüm işaretle
  const markPartialSolution = async (randevuId: string) => {
    updateRandevuDurum(randevuId, "Kısmı Çözüm");
  };
  
  // Çözüm ekle (randevu tamamla)
  const handleCozumEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!seciliRandevuId) return;
    
    try {
      const response = await fetch(`/api/randevular/${seciliRandevuId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          durum: cozumDurum,
          sonuc: cozumSonuc,
          malzemeler: kullanılanMalzemeler.length > 0 ? kullanılanMalzemeler : undefined
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Randevu güncellenirken bir hata oluştu");
      }
      
      // Arızayı yenile
      const arizaResponse = await fetch(`/api/arizalar/${params.id}`);
      if (arizaResponse.ok) {
        const arizaData = await arizaResponse.json();
        setAriza(arizaData);
      }
      
      // Randevuları yenile
      const randevularResponse = await fetch(`/api/randevular?arizaId=${params.id}`);
      if (randevularResponse.ok) {
        const randevularData = await randevularResponse.json();
        setRandevular(randevularData);
      }
      
      // Formu temizle ve modalı kapat
      resetCozumForm();
      setIsCozumModalOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Çözüm bilgileri kaydedildi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Çözüm eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Randevu tamamlama formunu aç
  const openCozumModal = (randevuId: string) => {
    setSeciliRandevuId(randevuId);
    setIsCozumModalOpen(true);
  };
  
  // Durum badge rengi
  const getDurumBadgeVariant = (durum: string) => {
    switch(durum) {
      case "Talep Alındı": return "secondary";
      case "Atandı": 
      case "Randevu Planlandı": return "default";
      case "Çözüm": return "success";
      case "Kısmı Çözüm": return "warning";
      case "İptal Edildi": return "destructive";
      default: return "default";
    }
  };
  
  // Öncelik badge rengi
  const getOncelikBadgeVariant = (oncelik: string) => {
    switch(oncelik) {
      case "Yüksek": return "destructive";
      case "Orta": return "warning";
      case "Düşük": return "secondary";
      default: return "secondary";
    }
  };
  
  // Randevu durum badge rengi
  const getRandevuDurumBadgeVariant = (durum: string) => {
    switch(durum) {
      case "Planlandı": return "secondary";
      case "Tamamlandı": return "success";
      case "Kısmı Çözüm": return "warning";
      case "İptal Edildi": return "destructive";
      default: return "secondary";
    }
  };
  
  // Formu sıfırla
  const resetRandevuForm = () => {
    setRandevuTarih("");
    setRandevuSaat("");
    setRandevuTeknikerIds([]);
    setRandevuNotlar("");
  };
  
  // Çözüm formunu sıfırla
  const resetCozumForm = () => {
    setSeciliRandevuId("");
    setCozumSonuc("");
    setCozumDurum("Tamamlandı");
    setKullanılanMalzemeler([]);
  };
  
  // Yeni malzeme ekle
  const addMalzeme = () => {
    if (kullanılanMalzemeler.length < malzemeler.length) {
      setKullanılanMalzemeler([
        ...kullanılanMalzemeler,
        { malzemeId: "", miktar: 1, birim: null, fiyat: 0 }
      ]);
    }
  };
  
  // Malzeme kaldır
  const removeMalzeme = (index: number) => {
    const yeniMalzemeler = [...kullanılanMalzemeler];
    yeniMalzemeler.splice(index, 1);
    setKullanılanMalzemeler(yeniMalzemeler);
  };
  
  // Malzeme güncelle
  const updateMalzeme = (index: number, field: string, value: any) => {
    const yeniMalzemeler = [...kullanılanMalzemeler];
    
    if (field === "malzemeId") {
      yeniMalzemeler[index].malzemeId = value;
      // Seçilen malzemenin birimini otomatik olarak ayarla
      const seciliMalzeme = malzemeler.find(m => m.id === value);
      if (seciliMalzeme && seciliMalzeme.birim) {
        yeniMalzemeler[index].birim = seciliMalzeme.birim;
      }
    } else if (field === "miktar") {
      yeniMalzemeler[index].miktar = parseFloat(value);
    } else if (field === "birim") {
      yeniMalzemeler[index].birim = value;
    } else if (field === "fiyat") {
      yeniMalzemeler[index].fiyat = parseFloat(value);
    }
    
    setKullanılanMalzemeler(yeniMalzemeler);
  };
  
  // Randevu oluştur
  const handleAddRandevu = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ariza) return;
    
    if (!randevuTarih || !randevuSaat) {
      toast({
        title: "Hata",
        description: "Tarih ve saat seçimi zorunludur",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Tarih ve saati birleştir
      const tarihSaat = `${randevuTarih}T${randevuSaat}:00`;
      
      const response = await fetch("/api/randevular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          arizaId: ariza.id,
          tarih: tarihSaat,
          teknikerIds: randevuTeknikerIds,
          notlar: randevuNotlar,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Randevu eklenirken bir hata oluştu");
      }
      
      // Arızayı yenile
      const arizaResponse = await fetch(`/api/arizalar/${params.id}`);
      if (arizaResponse.ok) {
        const arizaData = await arizaResponse.json();
        setAriza(arizaData);
      }
      
      // Randevuları yenile
      const randevularResponse = await fetch(`/api/randevular?arizaId=${params.id}`);
      if (randevularResponse.ok) {
        const randevularData = await randevularResponse.json();
        setRandevular(randevularData);
      }
      
      // Formu temizle ve modalı kapat
      resetRandevuForm();
      setIsRandevuModalOpen(false);
      
      toast({
        title: "Başarılı",
        description: "Randevu başarıyla oluşturuldu",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Randevu eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!ariza) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Arıza bulunamadı</h2>
        <p className="text-muted-foreground mb-4">
          Aradığınız arıza kaydı bulunamadı veya erişim yetkiniz yok.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard'a Dön
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-4">
      {/* Üst Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/projeler/${ariza.daire.blok.proje.id}/bloklar/${ariza.daire.blok.id}/daireler/${ariza.daire.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Arıza Detayı</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsRandevuModalOpen(true)}
            className="flex items-center"
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Randevu Oluştur
          </Button>
          <Badge variant={getDurumBadgeVariant(ariza.durum)}>{ariza.durum}</Badge>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sol Kolon - Arıza Bilgileri */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Arıza Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Açıklama</h3>
                <p className="text-base">{ariza.aciklama}</p>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="font-medium text-muted-foreground">Konum</h3>
                  </div>
                  <p className="mt-1 ml-6">
                    {ariza.daire.blok.proje.ad}, {ariza.daire.blok.ad}, Daire {ariza.daire.numara}
                    {ariza.daire.kat && `, Kat ${ariza.daire.kat}`}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="font-medium text-muted-foreground">Bildirim Tarihi</h3>
                  </div>
                  <p className="mt-1 ml-6">
                    {format(new Date(ariza.createdAt), "dd.MM.yyyy HH:mm", { locale: tr })}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {ariza.bildirenKisi && (
                  <div>
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium text-muted-foreground">Bildiren Kişi</h3>
                    </div>
                    <p className="mt-1 ml-6">{ariza.bildirenKisi}</p>
                  </div>
                )}
                
                {ariza.telefon && (
                  <div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium text-muted-foreground">Telefon</h3>
                    </div>
                    <p className="mt-1 ml-6">{ariza.telefon}</p>
                  </div>
                )}
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Arıza Tipi</h3>
                  <p>{ariza.arizaTipi?.ad || "-"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Öncelik</h3>
                  <Badge variant={getOncelikBadgeVariant(ariza.oncelik)}>{ariza.oncelik}</Badge>
                </div>
              </div>
              
              {ariza.ekbilgi && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Ek Bilgi</h3>
                  <p className="text-sm">{ariza.ekbilgi}</p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <Button variant="destructive" onClick={handleIptalEt}>
                  <XCircle className="h-4 w-4 mr-2" />
                  İptal Et
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sağ Kolon - Durum Bilgileri */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Durum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Mevcut Durum</h3>
                <Badge variant={getDurumBadgeVariant(ariza.durum)}>{ariza.durum}</Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Arıza Tipi</h3>
                <p>{ariza.arizaTipi?.ad || "-"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Öncelik</h3>
                <Badge variant={getOncelikBadgeVariant(ariza.oncelik)}>{ariza.oncelik}</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>İletişim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ariza.bildirenKisi && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Bildiren Kişi</h3>
                  <p>{ariza.bildirenKisi}</p>
                </div>
              )}
              
              {ariza.telefon && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Telefon</h3>
                  <p>{ariza.telefon}</p>
                </div>
              )}
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Ara
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Randevular Bölümü */}
      <div className="mt-6">
        <Tabs defaultValue="randevular">
          <TabsList>
            <TabsTrigger value="randevular">Randevular</TabsTrigger>
            <TabsTrigger value="zaman-cizelgesi">Zaman Çizelgesi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="randevular" className="mt-4">
            {randevular.length > 0 ? (
              <div className="space-y-4">
                {randevular.map((randevu) => (
                  <Card key={randevu.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getRandevuDurumBadgeVariant(randevu.durum)}>
                            {randevu.durum}
                          </Badge>
                          <span className="text-base font-medium">
                            {format(new Date(randevu.tarih), "dd.MM.yyyy HH:mm", { locale: tr })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {randevu.durum === "Planlandı" && (
                            <>
                              <Button variant="outline" size="sm">
                                <PencilLine className="h-4 w-4 mr-1" />
                                Yeniden Planla
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => cancelRandevu(randevu.id)}>
                                <XCircle className="h-4 w-4 mr-1" />
                                İptal Et
                              </Button>
                              <Button variant="default" size="sm" onClick={() => openCozumModal(randevu.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Çözüm Ekle
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {/* Tekniker Bilgileri */}
                        <div>
                          <h4 className="text-sm font-medium mb-1">Tekniker</h4>
                          {randevu.tekniker || (randevu.teknikerler?.length > 0) ? (
                            <div>
                              {randevu.tekniker && (
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-slate-500" />
                                  <span>{randevu.tekniker.adsoyad}</span>
                                </div>
                              )}
                              
                              {randevu.teknikerler?.length > 0 && (
                                <div className="space-y-1 mt-1">
                                  {randevu.teknikerler.map((teknikerBaglanti) => (
                                    <div key={teknikerBaglanti.id} className="flex items-center space-x-2">
                                      <User className="h-4 w-4 text-slate-500" />
                                      <span>{teknikerBaglanti.tekniker.adsoyad}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">Tekniker atanmadı</div>
                          )}
                        </div>
                        
                        {/* Randevu Notları */}
                        {randevu.notlar && (
                          <div className="md:col-span-2">
                            <h4 className="text-sm font-medium mb-1">Randevu Notları</h4>
                            <p className="text-sm">{randevu.notlar}</p>
                          </div>
                        )}
                        
                        {/* Sonuc */}
                        {randevu.sonuc && randevu.durum !== "Planlandı" && (
                          <div className="md:col-span-2 mt-3 pt-3 border-t">
                            <span className="text-sm font-medium">Sonuç:</span>
                            <p className="text-sm mt-1">{randevu.sonuc}</p>
                          </div>
                        )}
                        
                        {/* Kullanılan Malzemeler */}
                        {randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0 && (
                          <div className="md:col-span-2 mt-3 pt-3 border-t">
                            <span className="text-sm font-medium">Kullanılan Malzemeler:</span>
                            <div className="mt-2 border rounded-md overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-medium">Malzeme</th>
                                    <th className="px-3 py-2 text-right font-medium">Miktar</th>
                                    <th className="px-3 py-2 text-right font-medium">Birim Fiyat</th>
                                    <th className="px-3 py-2 text-right font-medium">Tutar</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {randevu.kullanilanMalzemeler.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                      <td className="px-3 py-2">{item.malzeme.ad}</td>
                                      <td className="px-3 py-2 text-right">{item.miktar} {item.birim || "adet"}</td>
                                      <td className="px-3 py-2 text-right">
                                        {new Intl.NumberFormat('tr-TR', { 
                                          style: 'currency', 
                                          currency: 'TRY',
                                          minimumFractionDigits: 2
                                        }).format(item.fiyat || 0)}
                                      </td>
                                      <td className="px-3 py-2 text-right font-medium">
                                        {new Intl.NumberFormat('tr-TR', { 
                                          style: 'currency', 
                                          currency: 'TRY',
                                          minimumFractionDigits: 2
                                        }).format((item.miktar * (item.fiyat || 0)))}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-slate-50 font-medium">
                                  <tr>
                                    <td colSpan={3} className="px-3 py-2 text-right">Toplam:</td>
                                    <td className="px-3 py-2 text-right">
                                      {new Intl.NumberFormat('tr-TR', { 
                                        style: 'currency', 
                                        currency: 'TRY',
                                        minimumFractionDigits: 2
                                      }).format(
                                        randevu.kullanilanMalzemeler.reduce((toplam, item) => {
                                          return toplam + (item.miktar * (item.fiyat || 0));
                                        }, 0)
                                      )}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-lg border">
                <Clock className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Henüz randevu planlanmadı</h3>
                <p className="text-sm text-muted-foreground mb-4">Bu arıza için henüz bir randevu oluşturulmadı</p>
                <Button onClick={() => setIsRandevuModalOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Randevu Oluştur
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="zaman-cizelgesi" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Zaman Çizelgesi</h3>
                <Button variant="outline" size="sm" onClick={() => setIsRandevuModalOpen(true)}>
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Randevu Oluştur
                </Button>
              </div>
              
              <div className="relative pl-6 pb-6 border-l-2 border-slate-200">
                <div className="absolute top-0 left-[-8px] w-4 h-4 bg-primary rounded-full"></div>
                <div className="ml-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {format(new Date(ariza.createdAt), "dd.MM.yyyy HH:mm", { locale: tr })}
                  </div>
                  <div className="font-medium">Arıza Kaydı Oluşturuldu</div>
                  <div className="text-sm mt-1">
                    {ariza.bildirenKisi ? `${ariza.bildirenKisi} tarafından bildirildi` : "Arıza kaydı oluşturuldu"}
                  </div>
                </div>
              </div>
              
              {randevular.length > 0 ? (
                randevular.map((randevu, index) => (
                  <div key={randevu.id} className="relative pl-6 pb-6 border-l-2 border-slate-200">
                    <div className="absolute top-0 left-[-8px] w-4 h-4 bg-slate-400 rounded-full"></div>
                    <div className="ml-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        {format(new Date(randevu.createdAt), "dd.MM.yyyy HH:mm", { locale: tr })}
                      </div>
                      <div className="font-medium">Randevu Oluşturuldu</div>
                      <div className="text-sm mt-1">
                        {format(new Date(randevu.tarih), "dd.MM.yyyy HH:mm", { locale: tr })} için
                        {randevu.tekniker ? ` ${randevu.tekniker.adsoyad} ` : " "}
                        tarafından planlandı
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-lg border mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Bu arıza için henüz randevu planlanmamış</p>
                  <Button size="sm" onClick={() => setIsRandevuModalOpen(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Randevu Planla
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Randevu Ekleme Modal */}
      <Dialog open={isRandevuModalOpen} onOpenChange={setIsRandevuModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Yeni Randevu Oluştur</DialogTitle>
            <DialogDescription>
              Arıza için yeni bir randevu oluşturun.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRandevu}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="randevu-tarih">Randevu Tarihi</Label>
                  <Input
                    id="randevu-tarih"
                    type="date"
                    value={randevuTarih}
                    onChange={(e) => setRandevuTarih(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="randevu-saat">Randevu Saati</Label>
                  <Input
                    id="randevu-saat"
                    type="time"
                    value={randevuSaat}
                    onChange={(e) => setRandevuSaat(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="randevu-tekniker">Tekniker(ler)</Label>
                  {randevuTeknikerIds.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {randevuTeknikerIds.length} tekniker seçildi
                    </div>
                  )}
                </div>
                
                <div className="mt-1 max-h-[200px] overflow-y-auto border rounded-md p-2">
                  {teknikerler.length > 0 ? (
                    <div className="space-y-2">
                      {teknikerler.map((tekniker) => (
                        <div key={tekniker.id} className="flex items-center p-1 hover:bg-slate-50 rounded">
                          <input
                            type="checkbox"
                            id={`tekniker-${tekniker.id}`}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                            checked={randevuTeknikerIds.includes(tekniker.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRandevuTeknikerIds([...randevuTeknikerIds, tekniker.id]);
                              } else {
                                setRandevuTeknikerIds(randevuTeknikerIds.filter(id => id !== tekniker.id));
                              }
                            }}
                          />
                          <label htmlFor={`tekniker-${tekniker.id}`} className="flex-1 text-sm cursor-pointer">
                            {tekniker.adsoyad} 
                            {tekniker.uzmanlikAlanlari && tekniker.uzmanlikAlanlari.length > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({tekniker.uzmanlikAlanlari.map(u => u.ad).join(", ")})
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      Tekniker bulunamadı
                    </div>
                  )}
                </div>
                
                {randevuTeknikerIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {randevuTeknikerIds.map(id => {
                      const tekniker = teknikerler.find(t => t.id === id);
                      return tekniker ? (
                        <div key={id} className="inline-flex items-center bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                          {tekniker.adsoyad}
                          <button 
                            type="button"
                            className="ml-1 hover:text-destructive"
                            onClick={() => setRandevuTeknikerIds(randevuTeknikerIds.filter(tId => tId !== id))}
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="randevu-notlar">Randevu Notları</Label>
                <Textarea
                  id="randevu-notlar"
                  value={randevuNotlar}
                  onChange={(e) => setRandevuNotlar(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRandevuModalOpen(false)}>
                İptal
              </Button>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Çözüm Ekleme Modal */}
      <Dialog open={isCozumModalOpen} onOpenChange={setIsCozumModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Çözüm Ekle</DialogTitle>
            <DialogDescription>
              Randevu sonucunu ve kullanılan malzemeleri ekleyin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCozumEkle}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="cozum-durum">Sonuç Durumu</Label>
                <Select value={cozumDurum} onValueChange={setCozumDurum}>
                  <SelectTrigger id="cozum-durum" className="mt-1">
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                    <SelectItem value="Kısmı Çözüm">Kısmı Çözüm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cozum-sonuc">Çözüm Açıklaması</Label>
                <Textarea
                  id="cozum-sonuc"
                  value={cozumSonuc}
                  onChange={(e) => setCozumSonuc(e.target.value)}
                  className="mt-1"
                  rows={3}
                  placeholder="Yapılan işlemler ve çözüm detayları..."
                  required
                />
              </div>
              
              {/* Malzeme Seçimi */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Kullanılan Malzemeler</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addMalzeme}
                    disabled={kullanılanMalzemeler.length >= malzemeler.length}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Malzeme Ekle
                  </Button>
                </div>
                
                {kullanılanMalzemeler.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {kullanılanMalzemeler.map((item, index) => (
                      <div key={index} className="flex flex-wrap items-center gap-2 p-2 border rounded-md">
                        <div className="flex-1 min-w-[200px]">
                          <Select 
                            value={item.malzemeId} 
                            onValueChange={(value) => updateMalzeme(index, "malzemeId", value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Malzeme seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {malzemeler.map((malzeme) => (
                                <SelectItem key={malzeme.id} value={malzeme.id}>
                                  {malzeme.ad}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-1">Miktar:</span>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={item.miktar.toString()}
                              onChange={(e) => updateMalzeme(index, "miktar", e.target.value)}
                              className="w-[80px] h-8"
                            />
                            
                            <span className="px-2">{item.birim || "adet"}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-1">Birim Fiyat (₺):</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.fiyat.toString()}
                              onChange={(e) => updateMalzeme(index, "fiyat", e.target.value)}
                              className="w-[100px] h-8"
                            />
                          </div>
                          
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeMalzeme(index)}
                            className="h-8 w-8 ml-2"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    Henüz malzeme eklenmedi
                  </div>
                )}
                
                {/* Toplam Tutar Özeti */}
                {kullanılanMalzemeler.length > 0 && (
                  <div className="mt-3 border-t pt-3 flex justify-between items-center">
                    <span className="font-medium">Toplam Tutar:</span>
                    <span className="font-bold text-lg">
                      {new Intl.NumberFormat('tr-TR', { 
                        style: 'currency', 
                        currency: 'TRY',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(
                        kullanılanMalzemeler.reduce((toplam, item) => {
                          return toplam + (item.miktar * item.fiyat);
                        }, 0)
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCozumModalOpen(false)}>
                İptal
              </Button>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 