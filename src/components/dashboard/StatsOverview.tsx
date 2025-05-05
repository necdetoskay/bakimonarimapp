"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, User, Wrench, ChevronRight, AlertCircle, Home, Plus } from "lucide-react";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/utils/arizaUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function StatsOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  
  // Dialog ve Form Durumları
  const [projeDialogOpen, setProjeDialogOpen] = useState(false);
  const [arizaDialogOpen, setArizaDialogOpen] = useState(false);
  const [teknikerDialogOpen, setTeknikerDialogOpen] = useState(false);
  
  // Yönlendirme seçenekleri
  const [redirectToProje, setRedirectToProje] = useState(false);
  const [redirectToAriza, setRedirectToAriza] = useState(false);
  const [redirectToTekniker, setRedirectToTekniker] = useState(false);
  
  // Form verileri
  const [projeForm, setProjeForm] = useState({ ad: '', adres: '' });
  const [arizaForm, setArizaForm] = useState({ 
    aciklama: '', 
    oncelik: 'Normal',
    projeId: '',
    blokId: '',
    daireId: '',
    arizaTuruId: '',
    bildiren: '',
    bildirenTelefon: '',
    not: ''
  });
  const [teknikerForm, setTeknikerForm] = useState({ adsoyad: '', telefon: '' });
  
  // SWR ile veri çekme
  const { data: projeler = [], error: projelerError } = useSWR(
    "/api/projeler",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
  
  const { data: teknikerler = [], error: teknikerlerError } = useSWR(
    "/api/teknikerler",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
  
  const { data: randevular = [], error: randevularError } = useSWR(
    "/api/randevular",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
  
  // Form işlemleri için gerekli veriler
  const { data: arizaTipleri = [] } = useSWR("/api/ariza-tipleri", fetcher);
  const { data: daireler = [] } = useSWR("/api/daireler", fetcher);
  
  // Proje değiştiğinde blokları getir
  const [secilenProjeninBloklari, setSecilenProjeninBloklari] = useState<any[]>([]);
  
  // Blok değiştiğinde daireleri getir
  const [secilenBlokunDaireleri, setSecilenBlokunDaireleri] = useState<any[]>([]);
  
  useEffect(() => {
    // Proje seçildiğinde ilgili blokları getir
    if (arizaForm.projeId) {
      const seciliProje = projeler.find((p: any) => p.id === arizaForm.projeId);
      if (seciliProje && seciliProje.bloklar) {
        setSecilenProjeninBloklari(seciliProje.bloklar);
      } else {
        // Blokları API'den çek
        fetch(`/api/bloklar?projeId=${arizaForm.projeId}`)
          .then(res => res.json())
          .then(data => {
            setSecilenProjeninBloklari(data);
          })
          .catch(err => {
            console.error("Bloklar yüklenirken hata:", err);
            setSecilenProjeninBloklari([]);
          });
      }
    } else {
      setSecilenProjeninBloklari([]);
    }
    
    // Blok seçildiğinde ilgili daireleri getir
    if (arizaForm.blokId) {
      fetch(`/api/daireler?blokId=${arizaForm.blokId}`)
        .then(res => res.json())
        .then(data => {
          setSecilenBlokunDaireleri(data);
        })
        .catch(err => {
          console.error("Daireler yüklenirken hata:", err);
          setSecilenBlokunDaireleri([]);
        });
    } else {
      setSecilenBlokunDaireleri([]);
    }
    
  }, [arizaForm.projeId, arizaForm.blokId]);
  
  // Veri yükleme durumunu kontrol et
  useEffect(() => {
    if (
      projeler.length > 0 &&
      teknikerler.length > 0 &&
      randevular.length > 0 &&
      !projelerError &&
      !teknikerlerError &&
      !randevularError
    ) {
      setIsLoading(false);
    } else if (
      // Eğer hiç veri yoksa veya hata olduysa
      (projelerError || teknikerlerError || randevularError)
    ) {
      setIsLoading(false);
    }
  }, [projeler, teknikerler, randevular, projelerError, teknikerlerError, randevularError]);
  
  // Bugünkü randevuları hesapla
  const bugunRandevular = randevular.filter((randevu: any) => {
    const randevuTarihi = new Date(randevu.tarih);
    const bugun = new Date();
    return randevuTarihi.toDateString() === bugun.toDateString();
  }).length;
  
  // Form işlemleri
  const handleProjeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/projeler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projeForm)
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Proje başarıyla eklendi",
          description: `${projeForm.ad} isimli proje oluşturuldu.`,
        });
        
        // Form alanlarını sıfırla
        setProjeForm({ ad: '', adres: '' });
        setProjeDialogOpen(false);
        
        // Yönlendirme gerekiyorsa yap
        if (redirectToProje) {
          router.push('/dashboard/projeler');
        }
      } else {
        const error = await response.json();
        toast({
          title: "Hata",
          description: error.message || "Proje eklenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  const handleArizaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!arizaForm.aciklama || !arizaForm.projeId || !arizaForm.daireId || !arizaForm.arizaTuruId) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen zorunlu alanları doldurun",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch('/api/arizalar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arizaForm)
      });
      
      if (response.ok) {
        toast({
          title: "Arıza kaydedildi",
          description: "Arıza bilgileri başarıyla kaydedildi",
        });
        
        // Form alanlarını sıfırla
        setArizaForm({ 
          aciklama: '', 
          oncelik: 'Normal',
          projeId: '',
          blokId: '',
          daireId: '',
          arizaTuruId: '',
          bildiren: '',
          bildirenTelefon: '',
          not: ''
        });
        setArizaDialogOpen(false);
        
        // Yönlendirme gerekiyorsa yap
        if (redirectToAriza) {
          router.push('/dashboard/arizalar');
        }
      } else {
        const error = await response.json();
        toast({
          title: "Hata",
          description: error.message || "Arıza eklenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  const handleTeknikerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/teknikerler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teknikerForm)
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Tekniker başarıyla eklendi",
          description: `${teknikerForm.adsoyad} isimli tekniker oluşturuldu.`,
        });
        
        // Form alanlarını sıfırla
        setTeknikerForm({ adsoyad: '', telefon: '' });
        setTeknikerDialogOpen(false);
        
        // Yönlendirme gerekiyorsa yap
        if (redirectToTekniker) {
          router.push('/dashboard/teknikerler');
        }
      } else {
        const error = await response.json();
        toast({
          title: "Hata",
          description: error.message || "Tekniker eklenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <>
        <Card className="animate-pulse">
          <CardHeader className="h-12 bg-slate-100"></CardHeader>
          <CardContent className="h-40 bg-slate-50"></CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="h-12 bg-slate-100"></CardHeader>
          <CardContent className="h-40 bg-slate-50"></CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="h-12 bg-slate-100"></CardHeader>
          <CardContent className="h-40 bg-slate-50"></CardContent>
        </Card>
      </>
    );
  }
  
  return (
    <>
      {/* Proje ve Blok Sayısı */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Projeler ve Bloklar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg flex-1 mr-2">
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <span className="text-2xl font-bold">{projeler.length}</span>
              <span className="text-xs text-muted-foreground">Proje</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg flex-1 ml-2">
              <Home className="h-8 w-8 text-primary mb-2" />
              <span className="text-2xl font-bold">
                {projeler.reduce((total: number, proje: any) => total + (proje.bloklar?.length || 0), 0)}
              </span>
              <span className="text-xs text-muted-foreground">Blok</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {projeler.slice(0, 3).map((proje: any) => (
              <Link href={`/dashboard/projeler/${proje.id}`} key={proje.id}>
                <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{proje.ad}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Tekniker Performansı */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tekniker Performansı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teknikerler.slice(0, 4).map((tekniker: any) => {
              // Bu teknikerin randevularını bul
              const teknikerRandevular = randevular.filter((r: any) => r.teknikerId === tekniker.id);
              const tamamlananRandevu = teknikerRandevular.filter((r: any) => 
                r.durum === "Tamamlandı" || r.durum === "Kısmı Çözüm"
              ).length;
              const performansYuzde = teknikerRandevular.length ? 
                Math.round((tamamlananRandevu / teknikerRandevular.length) * 100) : 0;
              
              return (
                <div key={tekniker.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{tekniker.adsoyad}</span>
                    <span className="text-sm text-muted-foreground">{performansYuzde}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000 ease-in-out" 
                      style={{ width: `${performansYuzde}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{tamamlananRandevu} tamamlanan</span>
                    <span>{teknikerRandevular.length} toplam</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Hızlı İşlemler */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Yeni Proje Ekle */}
          <Dialog open={projeDialogOpen} onOpenChange={setProjeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                <Plus className="h-3 w-3 mr-1" />
                Yeni Proje Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Yeni Proje Ekle</DialogTitle>
                <DialogDescription>
                  Yeni bir proje oluşturmak için gerekli bilgileri girin.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleProjeSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="proje-ad" className="text-right">
                      Proje Adı
                    </Label>
                    <Input
                      id="proje-ad"
                      className="col-span-3"
                      value={projeForm.ad}
                      onChange={(e) => setProjeForm({...projeForm, ad: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="proje-adres" className="text-right">
                      Adres
                    </Label>
                    <Textarea
                      id="proje-adres"
                      className="col-span-3"
                      value={projeForm.adres}
                      onChange={(e) => setProjeForm({...projeForm, adres: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <Checkbox 
                      id="proje-redirect" 
                      checked={redirectToProje}
                      onCheckedChange={(checked) => 
                        setRedirectToProje(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="proje-redirect"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      İşlem sonrası proje sayfasına yönlendir
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Kaydet</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Arıza Ekle */}
          <Dialog open={arizaDialogOpen} onOpenChange={setArizaDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Wrench className="h-4 w-4 mr-2" />
                <Plus className="h-3 w-3 mr-1" />
                Arıza Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Yeni Arıza Ekle</DialogTitle>
                <DialogDescription>
                  Yeni bir arıza kaydı oluşturmak için bilgileri girin.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleArizaSubmit}>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                  {/* Konum Bilgileri - Proje */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ariza-proje" className="text-right">
                      Proje <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="ariza-proje"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={arizaForm.projeId}
                      onChange={(e) => setArizaForm({...arizaForm, projeId: e.target.value, blokId: '', daireId: ''})}
                      required
                    >
                      <option value="">Proje Seçin</option>
                      {projeler.map((proje: any) => (
                        <option key={proje.id} value={proje.id}>{proje.ad}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Konum Bilgileri - Blok */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ariza-blok" className="text-right">
                      Blok <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="ariza-blok"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={arizaForm.blokId}
                      onChange={(e) => setArizaForm({...arizaForm, blokId: e.target.value, daireId: ''})}
                      disabled={!arizaForm.projeId}
                      required
                    >
                      <option value="">Blok Seçin</option>
                      {secilenProjeninBloklari.map((blok: any) => (
                        <option key={blok.id} value={blok.id}>{blok.ad}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Konum Bilgileri - Daire */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ariza-daire" className="text-right">
                      Daire <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="ariza-daire"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={arizaForm.daireId}
                      onChange={(e) => setArizaForm({...arizaForm, daireId: e.target.value})}
                      disabled={!arizaForm.blokId}
                      required
                    >
                      <option value="">Daire Seçin</option>
                      {secilenBlokunDaireleri.map((daire: any) => (
                        <option key={daire.id} value={daire.id}>
                          {daire.numara} {daire.sahibi ? `- ${daire.sahibi}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Arıza Bilgileri */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ariza-turu" className="text-right">
                      Arıza Türü <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="ariza-turu"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={arizaForm.arizaTuruId}
                      onChange={(e) => setArizaForm({...arizaForm, arizaTuruId: e.target.value})}
                      required
                    >
                      <option value="">Arıza Türü Seçin</option>
                      {arizaTipleri.map((tip: any) => (
                        <option key={tip.id} value={tip.id}>{tip.ad}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ariza-aciklama" className="text-right">
                      Açıklama <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="ariza-aciklama"
                      className="col-span-3"
                      value={arizaForm.aciklama}
                      onChange={(e) => setArizaForm({...arizaForm, aciklama: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ariza-oncelik" className="text-right">
                      Öncelik
                    </Label>
                    <select
                      id="ariza-oncelik"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={arizaForm.oncelik}
                      onChange={(e) => setArizaForm({...arizaForm, oncelik: e.target.value})}
                    >
                      <option value="Düşük">Düşük</option>
                      <option value="Normal">Normal</option>
                      <option value="Yüksek">Yüksek</option>
                      <option value="Acil">Acil</option>
                    </select>
                  </div>
                  
                  {/* Bildiren Kişi Bilgileri */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ariza-bildiren" className="text-right">
                      Bildiren Kişi
                    </Label>
                    <Input
                      id="ariza-bildiren"
                      className="col-span-3"
                      value={arizaForm.bildiren}
                      onChange={(e) => setArizaForm({...arizaForm, bildiren: e.target.value})}
                      placeholder="Arızayı bildiren kişinin adı soyadı"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ariza-telefon" className="text-right">
                      Telefon
                    </Label>
                    <Input
                      id="ariza-telefon"
                      className="col-span-3"
                      value={arizaForm.bildirenTelefon}
                      onChange={(e) => setArizaForm({...arizaForm, bildirenTelefon: e.target.value})}
                      placeholder="İletişim telefon numarası"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ariza-not" className="text-right">
                      Ek Not
                    </Label>
                    <Textarea
                      id="ariza-not"
                      className="col-span-3"
                      value={arizaForm.not}
                      onChange={(e) => setArizaForm({...arizaForm, not: e.target.value})}
                      placeholder="Arıza ile ilgili ek bilgiler..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-auto">
                    <Checkbox 
                      id="ariza-redirect" 
                      checked={redirectToAriza}
                      onCheckedChange={(checked) => 
                        setRedirectToAriza(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="ariza-redirect"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      İşlem sonrası arıza sayfasına yönlendir
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Kaydet</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Tekniker Ekle */}
          <Dialog open={teknikerDialogOpen} onOpenChange={setTeknikerDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                <Plus className="h-3 w-3 mr-1" />
                Tekniker Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Yeni Tekniker Ekle</DialogTitle>
                <DialogDescription>
                  Yeni bir tekniker eklemek için gerekli bilgileri girin.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTeknikerSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tekniker-adsoyad" className="text-right">
                      Ad Soyad
                    </Label>
                    <Input
                      id="tekniker-adsoyad"
                      className="col-span-3"
                      value={teknikerForm.adsoyad}
                      onChange={(e) => setTeknikerForm({...teknikerForm, adsoyad: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tekniker-telefon" className="text-right">
                      Telefon
                    </Label>
                    <Input
                      id="tekniker-telefon"
                      className="col-span-3"
                      value={teknikerForm.telefon}
                      onChange={(e) => setTeknikerForm({...teknikerForm, telefon: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <Checkbox 
                      id="tekniker-redirect" 
                      checked={redirectToTekniker}
                      onCheckedChange={(checked) => 
                        setRedirectToTekniker(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="tekniker-redirect"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      İşlem sonrası tekniker sayfasına yönlendir
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Kaydet</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <hr className="my-2" />
          
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <h4 className="font-medium flex items-center text-amber-800">
              <AlertCircle className="h-4 w-4 mr-2" />
              Bugünkü Görevler
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              {bugunRandevular > 0 ? 
                `${bugunRandevular} randevu planlanmış durumda. Takvimi kontrol etmeyi unutmayın.` : 
                'Bugün için planlanmış randevu bulunmuyor.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
