"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import Link from "next/link";
import { format, parseISO, subMonths, subDays, addMonths, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  Wrench, 
  Calendar, 
  DollarSign, 
  User, 
  Building2, 
  CheckCircle2, 
  Clock, 
  BarChart4, 
  RefreshCw, 
  AlertCircle, 
  Home,
  Plus,
  ArrowRight,
  ChevronRight,
  Eye,
  Pencil,
  Trash
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

// Veri getirme fonksiyonu
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Veri çekerken bir hata oluştu");
  }
  return res.json();
};

// Arıza tipine göre ikon döndüren fonksiyon
const getArizaIcon = (tip: string) => {
  switch (tip?.toLowerCase()) {
    case "su":
      return "💧";
    case "elektrik":
      return "⚡";
    case "ısıtma":
      return "🔥";
    case "kapı":
      return "🚪";
    case "asansör":
      return "🔼";
    default:
      return "🔧";
  }
};

// Durum badge'i için renk döndüren fonksiyon
const getDurumBadgeVariant = (durum: string) => {
  switch(durum) {
    case "Talep Alındı": return "secondary";
    case "Randevu Planlandı": return "warning";
    case "Randevu Yeniden Planlandı": return "warning";
    case "Kısmı Çözüm": return "default";
    case "Çözüm": return "success";
    case "İptal Edildi": return "destructive";
    default: return "secondary";
  }
};

// Arıza toplam masrafını hesapla
const hesaplaArizaMasrafi = (ariza: any): number => {
  if (!ariza.randevular || ariza.randevular.length === 0) return 0;
  
  let toplamMasraf = 0;
  
  ariza.randevular.forEach((randevu: any) => {
    if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
      randevu.kullanilanMalzemeler.forEach((malzeme: any) => {
        toplamMasraf += malzeme.miktar * (malzeme.fiyat || 0);
      });
    }
  });
  
  return toplamMasraf;
};

// Grafik verileri için tiplemeler
interface ChartDataItem {
  name: string;
  value: number;
}

interface AreaChartItem {
  gun: string;
  ariza: number;
  cozulen: number;
  tarih: string;
  tam_tarih: Date;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [pieData, setPieData] = useState<ChartDataItem[]>([]);
  const [areaData, setAreaData] = useState<AreaChartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // SWR ile veri çekme
  const { data: arizalar = [], error: arizalarError, mutate: mutateArizalar } = useSWR(
    session ? `/api/arizalar` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 30000 // 30 saniye
    }
  );

  const { data: arizaTipleri = [], error: arizaTipleriError } = useSWR(
    session ? "/api/ariza-tipleri" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: teknikerler = [], error: teknikerlerError } = useSWR(
    session ? "/api/teknikerler" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: randevular = [], error: randevularError } = useSWR(
    session ? "/api/randevular" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: projeler = [], error: projelerError } = useSWR(
    session ? "/api/projeler" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Veri yükleme durumunu kontrol et
  useEffect(() => {
    if (
      arizalar.length > 0 &&
      !arizalarError &&
      !arizaTipleriError &&
      !teknikerlerError &&
      !randevularError &&
      !projelerError
    ) {
      setIsLoading(false);
    }
  }, [arizalar, arizalarError, arizaTipleriError, teknikerlerError, randevularError, projelerError]);

  // Dashboard metrikleri
  const acikArizalar = arizalar.filter((ariza: any) => 
    ariza.durum !== "Çözüm" && ariza.durum !== "İptal Edildi"
  ).length;

  const bugunRandevular = randevular.filter((randevu: any) => {
    const randevuTarihi = new Date(randevu.tarih);
    const bugun = new Date();
    return randevuTarihi.toDateString() === bugun.toDateString();
  }).length;

  const cozulenArizalar = arizalar.filter((ariza: any) => ariza.durum === "Çözüm").length;

  // Toplam maliyet hesabı
  const toplamMasraf = arizalar.reduce((total: number, ariza: any) => {
    return total + hesaplaArizaMasrafi(ariza);
  }, 0);

  // Grafik verilerini hazırla - bağımlılıkları dikkatle belirle
  useEffect(() => {
    if (!arizalar.length) return;
    
    // 1. Arıza tipleri dağılımı için pasta grafik verisi
    const arizaTipGruplari: Record<string, number> = {};
    arizalar.forEach((ariza: any) => {
      const tipAdi = ariza.arizaTipi?.ad || "Diğer";
      if (!arizaTipGruplari[tipAdi]) {
        arizaTipGruplari[tipAdi] = 0;
      }
      arizaTipGruplari[tipAdi]++;
    });

    const pieChartData: ChartDataItem[] = Object.entries(arizaTipGruplari).map(([name, value]) => ({
      name,
      value
    }));
    setPieData(pieChartData);

    // 2. Son 30 günlük arıza aktivitesi için alan grafik verisi
    const son30GunArizalari = arizalar.filter((ariza: any) => {
      const createdAt = new Date(ariza.createdAt);
      const simdi = new Date();
      const otuzGunOnce = new Date(simdi);
      otuzGunOnce.setDate(simdi.getDate() - 30);
      return createdAt >= otuzGunOnce;
    });

    const son30Gun: AreaChartItem[] = Array.from({ length: 30 }).map((_, i) => {
      const tarih = subDays(new Date(), 29 - i);
      const gun = format(tarih, 'dd.MM');
      
      // O güne ait arızaları bul
      const gunArizalar = son30GunArizalari.filter((ariza: any) => {
        const createdAt = new Date(ariza.createdAt);
        return createdAt.toDateString() === tarih.toDateString();
      });
      
      // O güne ait çözülen arızaları bul
      const cozulenler = gunArizalar.filter((ariza: any) => 
        ariza.durum === "Çözüm"
      ).length;
      
      return {
        gun,
        ariza: gunArizalar.length,
        cozulen: cozulenler,
        tarih: format(tarih, 'd MMMM', { locale: tr }),
        tam_tarih: tarih,
      };
    });
    setAreaData(son30Gun);
  }, [arizalar]); // Sadece arizalar değiştiğinde çalış

  // Veri yükleniyor ekranı
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Dashboard yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        
        <div className="flex space-x-2">
          <Link href="/dashboard/analytics">
            <Button variant="outline" size="sm" className="mr-2">
              <BarChart4 className="h-4 w-4 mr-2" />
              Analitik Dashboard
            </Button>
          </Link>
          <Button onClick={() => mutateArizalar()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>
      </div>
      
      {/* Özet Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50">
            <CardTitle className="text-sm font-medium">Açık Arızalar</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{acikArizalar}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Bekleyen ve planlanan arıza sayısı
              </p>
              <Badge variant="outline" className="animate-pulse">Aktif</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-yellow-50">
            <CardTitle className="text-sm font-medium">Bugünkü Randevular</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{bugunRandevular}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {format(new Date(), "d MMMM yyyy", { locale: tr })}
              </p>
              <Badge variant="outline">{bugunRandevular > 0 ? 'Plan Var' : 'Boş'}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
            <CardTitle className="text-sm font-medium">Çözülen Arızalar</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{cozulenArizalar}</div>
            <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
                Toplam çözülen arıza sayısı
            </p>
              <Badge variant="outline">%{Math.round((cozulenArizalar / (arizalar.length || 1)) * 100)}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50">
            <CardTitle className="text-sm font-medium">Toplam Masraf</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(toplamMasraf)}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Tüm arızaların toplam maliyeti
              </p>
              <Badge variant="outline">Güncel</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Ana İçerik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Arıza Tipleri Dağılımı */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Arıza Tipleri Dağılımı</CardTitle>
            <CardDescription>Arıza tiplerinin dağılımı ve sayıları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      `${value} adet`, `${name}`
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Son 30 gün aktivite grafiği */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Aylık Aktivite</CardTitle>
            <CardDescription>Son 30 günlük arıza ve çözüm aktivitesi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={areaData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="gun" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value, index) => index % 5 === 0 ? value : ''}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => {
                      const item = areaData.find(item => item.gun === value);
                      return item ? item.tarih : value;
                    }}
                    formatter={(value: any, name: any) => [
                      value, 
                      name === 'ariza' ? 'Yeni Arıza' : 'Çözülen Arıza'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ariza" 
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8"
                    name="Yeni Arıza"
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cozulen" 
                    stackId="2"
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="Çözülen Arıza"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Son Eklenen Arızalar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Son Eklenen Arızalar</CardTitle>
            <CardDescription>En son eklenen 10 arıza kaydı</CardDescription>
          </div>
          <Link href="/dashboard/arizalar">
            <Button variant="outline" size="sm">
              Tümünü Gör
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Arıza Tipi</th>
                  <th className="py-3 px-4 text-left font-medium">Açıklama</th>
                  <th className="py-3 px-4 text-left font-medium">Konum</th>
                  <th className="py-3 px-4 text-left font-medium">Durum</th>
                  <th className="py-3 px-4 text-left font-medium">Tarih</th>
                  <th className="py-3 px-4 text-left font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {arizalar.slice(0, 10).map((ariza: any, index: number) => (
                  <tr key={ariza.id} className={index % 2 === 1 ? 'bg-slate-50' : ''}>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{getArizaIcon(ariza.arizaTipi?.ad)}</span>
                        <span>{ariza.arizaTipi?.ad || "Genel"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-[200px] truncate" title={ariza.aciklama}>
                        {ariza.aciklama}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {ariza.daire?.blok?.ad}-{ariza.daire?.numara}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={getDurumBadgeVariant(ariza.durum)}>{ariza.durum}</Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                      {format(new Date(ariza.createdAt), "dd.MM.yyyy")}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/arizalar/${ariza.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/projeler/${ariza.daire?.blok?.projeId}/bloklar/${ariza.daire?.blokId}/daireler/${ariza.daireId}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Home className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Durum ve Performans Özeti */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <Link href="/dashboard/projeler">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                Yeni Proje Ekle
              </Button>
            </Link>
            
            <Link href="/dashboard/arizalar">
              <Button variant="outline" className="w-full justify-start">
                <Wrench className="h-4 w-4 mr-2" />
                Arıza Ekle
              </Button>
            </Link>
            
            <Link href="/dashboard/teknikerler">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Tekniker Ekle
              </Button>
            </Link>
            
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
      </div>
    </div>
  );
} 