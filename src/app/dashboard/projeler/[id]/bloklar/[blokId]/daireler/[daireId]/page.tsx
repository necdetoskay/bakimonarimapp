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
import { 
  ArrowLeft, Building2, Home, AlertTriangle, Edit, Trash2, Plus, 
  Clock, Calendar, User, Phone, Wrench, Calendar as CalendarIcon, 
  CheckCircle, CheckSquare, XCircle, CalendarDays, CalendarPlus, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import useSWR from "swr";

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
  randevular: Randevu[];
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
  oncekiRandevuId: string | null;
  oncekiRandevu: Randevu | null;
  sonrakiRandevu: Randevu | null;
  createdAt: string;
  updatedAt: string;
  kullanilanMalzemeler: RandevuMalzeme[];
};

// Fetch fonksiyonu
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Veri çekerken bir hata oluştu");
    throw error;
  }
  return res.json();
};

// Arıza masrafını hesapla
const hesaplaArizaMasrafi = (ariza: Ariza): number => {
  if (!ariza.randevular || ariza.randevular.length === 0) return 0;
  
  let toplamMasraf = 0;
  
  // Tüm randevulardaki kullanılan malzemelerin masraflarını topla
  ariza.randevular.forEach(randevu => {
    if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
      randevu.kullanilanMalzemeler.forEach(malzeme => {
        toplamMasraf += malzeme.miktar * (malzeme.fiyat || 0);
      });
    }
  });
  
  return toplamMasraf;
};

export default function DaireDetayPage({ params }: { params: { id: string; blokId: string; daireId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  // SWR ile veri getirme - performans için caching etkinleştirme
  const { data: daire, error: daireError } = useSWR<Daire>(
    session ? `/api/daireler/${params.daireId}` : null, 
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 10000 
    }
  );

  const { data: blok, error: blokError } = useSWR<Blok>(
    session && daire ? `/api/bloklar/${params.blokId}` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 10000 
    }
  );

  const { data: proje, error: projeError } = useSWR<Proje>(
    session && blok ? `/api/projeler/${params.id}` : null,
    fetcher,
    { 
      revalidateOnFocus: false, 
      dedupingInterval: 10000 
    }
  );

  const { data: arizalar = [], error: arizalarError, mutate: mutateArizalar } = useSWR<Ariza[]>(
    session && daire ? `/api/arizalar?daireId=${params.daireId}` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 10000
    }
  );

  // useEffect yerine SWR kullanarak arıza tiplerini getir - yalnızca açıldığında
  const { data: arizaTipleri = [], error: arizaTipleriError } = useSWR<ArizaTipi[]>(
    session ? "/api/ariza-tipleri" : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 60000 // 1 dakika - bu nadiren değişir
    }
  );

  // Tekniker ve malzeme verilerini lazy loading ile getirme
  const [teknikerlerLoaded, setTeknikerlerLoaded] = useState(false);
  const { data: teknikerler = [], error: teknikerlerError } = useSWR<Tekniker[]>(
    session && teknikerlerLoaded ? "/api/teknikerler" : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 60000 // 1 dakika - bu nadiren değişir
    }
  );

  const { data: malzemeler = [], error: malzemelerError } = useSWR<Malzeme[]>(
    session && teknikerlerLoaded ? "/api/malzemeler" : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 60000 // 1 dakika - bu nadiren değişir
    }
  );
  
  const [isLoading, setIsLoading] = useState(true);
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
  
  // Randevu states
  const [randevular, setRandevular] = useState<Randevu[]>([]);
  const [isRandevuModalOpen, setIsRandevuModalOpen] = useState(false);
  const [isRandevuEditModalOpen, setIsRandevuEditModalOpen] = useState(false);
  const [selectedAriza, setSelectedAriza] = useState<Ariza | null>(null);
  const [selectedRandevu, setSelectedRandevu] = useState<Randevu | null>(null);
  const [randevuTarih, setRandevuTarih] = useState("");
  const [randevuSaat, setRandevuSaat] = useState("");
  const [randevuTeknikerId, setRandevuTeknikerId] = useState("");
  const [randevuNotlar, setRandevuNotlar] = useState("");
  const [randevuOnaylandi, setRandevuOnaylandi] = useState(false);
  const [secilenMalzemeler, setSecilenMalzemeler] = useState<Array<{
    malzemeId: string;
    miktar: number;
    birim: string | null;
  }>>([]);

  // Yükleme durumunu izleme
  useEffect(() => {
    // Ana veri yüklendiğinde isLoading'i güncelle
    if (daire && (blokError || blok) && (projeError || proje) && (arizalarError || arizalar) && (arizaTipleriError || arizaTipleri)) {
      setIsLoading(false);
    }
  }, [daire, blok, proje, arizalar, arizaTipleri, blokError, projeError, arizalarError, arizaTipleriError]);

  // Randevuyu açmadan önce teknikerleri ve malzemeleri yüklememek için lazy loading
  const prepareRandevuModal = (ariza: Ariza) => {
    setSelectedAriza(ariza);
    setTeknikerlerLoaded(true); // Teknikerler ve malzemeleri şimdi yükle
    fetchRandevular(ariza.id);
    resetRandevuForm();
    setIsRandevuModalOpen(true);
  };

  // Arıza için randevuları getir - sadece açıldığında
  const fetchRandevular = async (arizaId: string) => {
    try {
      const response = await fetch(`/api/randevular?arizaId=${arizaId}`);
      if (response.ok) {
        const data = await response.json();
        setRandevular(data);
        return data;
      }
      return [];
    } catch (error) {
      console.error("Randevular getirilirken hata:", error);
      return [];
    }
  };
  
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
      
      // SWR önbelleğini güncelle
      mutateArizalar();
      
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
  const handleEditAriza = (ariza: Ariza) => {
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
  const handleEditArizaSubmit = async (e: React.FormEvent) => {
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
      
      // SWR önbelleğini güncelle
      mutateArizalar();
      
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
  
  // Randevu ekle modalını aç
  const openRandevuModal = async (ariza: Ariza) => {
    prepareRandevuModal(ariza);
  };
  
  // Randevu formunu sıfırla
  const resetRandevuForm = () => {
    setRandevuTarih("");
    setRandevuSaat("");
    setRandevuTeknikerId("");
    setRandevuNotlar("");
    setSecilenMalzemeler([]);
    setRandevuOnaylandi(false);
  };
  
  // Randevu ekle
  const handleAddRandevu = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAriza) return;
    
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
          arizaId: selectedAriza.id,
          tarih: tarihSaat,
          teknikerId: randevuTeknikerId || null,
          notlar: randevuNotlar,
          malzemeler: secilenMalzemeler.length > 0 ? secilenMalzemeler : undefined
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Randevu eklenirken bir hata oluştu");
      }
      
      // SWR önbelleğini güncelle
      mutateArizalar();
      
      // Modalı kapat
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
      
      // SWR önbelleğini güncelle
      mutateArizalar();
      
      // Seçili arıza varsa randevuları yenile
      if (selectedAriza) {
        await fetchRandevular(selectedAriza.id);
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
    if (confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) {
      await updateRandevuDurum(randevuId, "İptal Edildi");
    }
  };
  
  // Randevuyu tamamla
  const completeRandevu = async (randevuId: string) => {
    if (confirm("Bu randevuyu tamamlanmış olarak işaretlemek istediğinize emin misiniz?")) {
      await updateRandevuDurum(randevuId, "Tamamlandı", "Arıza başarıyla giderildi.");
    }
  };
  
  // Kısmi çözüm işaretle
  const markPartialSolution = async (randevuId: string) => {
    if (confirm("Bu randevuyu kısmi çözüm olarak işaretlemek istediğinize emin misiniz?")) {
      await updateRandevuDurum(randevuId, "Kısmı Çözüm", "Arıza kısmen giderildi, ek işlem gerekiyor.");
    }
  };
  
  // Yeni malzeme ekle
  const addMalzeme = () => {
    if (secilenMalzemeler.length < malzemeler.length) {
      setSecilenMalzemeler([
        ...secilenMalzemeler,
        { malzemeId: "", miktar: 1, birim: null }
      ]);
    }
  };
  
  // Malzeme kaldır
  const removeMalzeme = (index: number) => {
    const yeniMalzemeler = [...secilenMalzemeler];
    yeniMalzemeler.splice(index, 1);
    setSecilenMalzemeler(yeniMalzemeler);
  };
  
  // Malzeme güncelle
  const updateMalzeme = (index: number, field: string, value: any) => {
    const yeniMalzemeler = [...secilenMalzemeler];
    
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
    }
    
    setSecilenMalzemeler(yeniMalzemeler);
  };
  
  // Randevu durum badge rengi
  const getRandevuDurumBadgeVariant = (durum: string) => {
    switch(durum) {
      case "Planlandı": return "secondary";
      case "Tamamlandı": return "success";
      case "Kısmı Çözüm": return "default";
      case "İptal Edildi": return "destructive";
      default: return "secondary";
    }
  };
  
  // Arıza sil
  const handleDeleteAriza = async (arizaId: string) => {
    // Kullanıcıya onay sor
    if (!confirm("Bu arıza kaydını silmek istediğinize emin misiniz?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/arizalar/${arizaId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Arıza silinirken bir hata oluştu");
      }
      
      // SWR önbelleğini güncelle
      mutateArizalar();
      
      toast({
        title: "Başarılı",
        description: "Arıza kaydı başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Arıza silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Hata durumlarını kontrol et
  const isError = daireError || blokError || projeError || arizalarError || arizaTipleriError;
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Daire bilgileri yükleniyor...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="p-4 bg-red-50 rounded-lg text-red-600">
          <h3 className="font-medium text-lg">Veri yüklenirken bir hata oluştu</h3>
          <p className="text-sm">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/dashboard/projeler/${params.id}/bloklar/${params.blokId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }
  
  if (!daire) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="p-4 bg-amber-50 rounded-lg text-amber-600">
          <h3 className="font-medium text-lg">Daire bulunamadı</h3>
          <p className="text-sm">Aradığınız daire kaydı mevcut değil veya erişim izniniz yok.</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/dashboard/projeler/${params.id}/bloklar/${params.blokId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Bloğa Dön
        </Button>
      </div>
    );
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
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-2 text-lg font-medium">Henüz arıza kaydı bulunmuyor.</p>
            <p className="text-sm text-muted-foreground">
              Yeni bir arıza kaydı oluşturmak için "Yeni Arıza Kaydı" butonuna tıklayın.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {arizalar.map((ariza) => (
                <Card key={ariza.id} className="overflow-hidden h-full">
                  <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {ariza.arizaTipi?.ad || "Genel Arıza"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Bildirim: {format(new Date(ariza.createdAt), "d MMMM yyyy", { locale: tr })}
                      </p>
                    </div>
                    <Badge variant={getDurumBadgeVariant(ariza.durum)}>{ariza.durum}</Badge>
                  </CardHeader>
                  <CardContent className="pb-1">
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-wrap gap-3">
                        {ariza.bildirenKisi && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{ariza.bildirenKisi}</span>
                          </div>
                        )}
                        {ariza.telefon && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{ariza.telefon}</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2">{ariza.aciklama}</p>
                      {ariza.ekbilgi && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{ariza.ekbilgi}</p>
                      )}
                      
                      {/* Toplam masraf bilgisini ekleyelim */}
                      {ariza.randevular && ariza.randevular.length > 0 && (
                        <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">
                            Toplam Masraf: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(hesaplaArizaMasrafi(ariza))}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0 mt-auto">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditAriza(ariza)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAriza(ariza.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Sil
                      </Button>
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/dashboard/arizalar/${ariza.id}`}>
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Detay
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
          <form onSubmit={handleEditArizaSubmit}>
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
      
      {/* Randevu Ekle Modal */}
      <Dialog open={isRandevuModalOpen} onOpenChange={setIsRandevuModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Yeni Randevu Kaydı</DialogTitle>
            <DialogDescription>
              Randevu bilgilerini doldurun ve kaydet butonuna tıklayın.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRandevu}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="randevu-tarih">Randevu Tarihi</Label>
                  <Input
                    id="randevu-tarih"
                    type="date"
                    value={randevuTarih}
                    onChange={(e) => setRandevuTarih(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="randevu-saat">Randevu Saati</Label>
                  <Input
                    id="randevu-saat"
                    type="time"
                    value={randevuSaat}
                    onChange={(e) => setRandevuSaat(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="randevu-tekniker">Randevu Teknikeri</Label>
                <Select value={randevuTeknikerId} onValueChange={setRandevuTeknikerId}>
                  <SelectTrigger id="randevu-tekniker" className="mt-1">
                    <SelectValue placeholder="Randevu teknikerini seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {teknikerler.map((tekniker) => (
                      <SelectItem key={tekniker.id} value={tekniker.id}>
                        {tekniker.adsoyad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              
              {/* Malzeme Seçimi */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Kullanılacak Malzemeler</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addMalzeme}
                    disabled={secilenMalzemeler.length >= malzemeler.length}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Malzeme Ekle
                  </Button>
                </div>
                
                {secilenMalzemeler.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {secilenMalzemeler.map((item, index) => (
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
                        
                        <div className="flex items-center">
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.miktar.toString()}
                            onChange={(e) => updateMalzeme(index, "miktar", e.target.value)}
                            className="w-[80px] h-8"
                          />
                          
                          <span className="px-2">{item.birim || "adet"}</span>
                          
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeMalzeme(index)}
                            className="h-8 w-8"
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
    </div>
  );
} 