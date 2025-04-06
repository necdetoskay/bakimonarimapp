"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import Link from "next/link";
import { format, subDays } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  Wrench, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle,
  ChevronRight,
  ArrowLeft
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
  AreaChart,
  Area
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

interface ChartDataItem {
  name: string;
  value: number;
}

interface AreaChartItem {
  gun: string;
  ariza: number;
  cozulen: number;
  tarih: string;
}

interface CostDataItem {
  name: string;
  maliyet: number;
}

export default function AnalyticsDashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [pieData, setPieData] = useState<ChartDataItem[]>([]);
  const [areaData, setAreaData] = useState<AreaChartItem[]>([]);
  const [costData, setCostData] = useState<CostDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const { data: randevular = [], error: randevularError } = useSWR(
    session ? "/api/randevular" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Veri yükleme durumunu kontrol et
  useEffect(() => {
    if (
      arizalar.length > 0 &&
      !arizalarError &&
      !arizaTipleriError &&
      !randevularError
    ) {
      setIsLoading(false);
    }
  }, [arizalar, arizalarError, arizaTipleriError, randevularError]);

  // Grafik verilerini hazırla - verilerin değişmesi durumunda
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
      };
    });
    setAreaData(son30Gun);

    // 3. Maliyet verileri için grafik
    const tiplerMaliyet: Record<string, number> = {};
    arizalar.forEach((ariza: any) => {
      const tipAdi = ariza.arizaTipi?.ad || "Diğer";
      const maliyet = hesaplaArizaMasrafi(ariza);
      
      if (!tiplerMaliyet[tipAdi]) {
        tiplerMaliyet[tipAdi] = 0;
      }
      
      tiplerMaliyet[tipAdi] += maliyet;
    });

    const maliyetVerisi: CostDataItem[] = Object.entries(tiplerMaliyet).map(([name, value]) => ({
      name,
      maliyet: value
    }));
    setCostData(maliyetVerisi);
  }, [arizalar]);

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

  // Veri yükleniyor ekranı
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Dashboard yükleniyor...</p>
      </div>
    );
  }

  // Pasta grafik renkleri
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" /> Ana Dashboard
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Analitik Dashboard</h2>
          <p className="text-muted-foreground">Detaylı arıza ve maliyet analizleri</p>
        </div>
        
        <div className="flex space-x-2">
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
      
      {/* Ana İçerik - Recharts Grafikleri */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Arıza Tipleri Dağılımı - PieChart */}
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
        
        {/* Son 30 gün aktivite grafiği - AreaChart */}
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
      
      {/* Maliyet Analizi - BarChart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Maliyet Analizi</CardTitle>
          <CardDescription>Arıza tiplerinin toplam maliyetleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={costData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('tr-TR', {
                      notation: 'compact',
                      compactDisplay: 'short',
                      style: 'currency',
                      currency: 'TRY'
                    }).format(Number(value))
                  }
                />
                <Tooltip 
                  formatter={(value: any) => 
                    new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY'
                    }).format(Number(value))
                  }
                />
                <Legend />
                <Bar 
                  dataKey="maliyet" 
                  name="Toplam Maliyet" 
                  fill="#8884d8" 
                  animationDuration={1500}
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bağlantı */}
      <div className="flex justify-center mt-8">
        <Link href="/dashboard">
          <Button variant="outline">
            Ana Dashboard'a Dön
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
} 