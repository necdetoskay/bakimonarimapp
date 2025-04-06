"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, DownloadIcon, BarChart4, CalendarIcon, PieChartIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/utils/arizaUtils";
import { format, parseISO, subMonths, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import dynamic from "next/dynamic";

// Grafik bileşenlerini dinamik olarak yükle
const CostAnalysis = dynamic(() => import("@/components/dashboard/CostAnalysis"), { 
  ssr: false,
  loading: () => <div className="h-80 w-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
});

// Analytics Dashboard sayfası
export default function AnalyticsDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("genel");
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  // SWR ile veri çekme
  const { data: arizalar = [], error: arizalarError } = useSWR(
    session ? `/api/arizalar` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  const { data: randevular = [], error: randevularError } = useSWR(
    session ? `/api/randevular` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  const { data: projeler = [], error: projelerError } = useSWR(
    session ? `/api/projeler` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  // Veri yükleme durumunu kontrol et
  useEffect(() => {
    if (
      arizalar.length > 0 &&
      !arizalarError &&
      !randevularError &&
      !projelerError
    ) {
      setIsLoading(false);
    } else if (
      (arizalarError || randevularError || projelerError)
    ) {
      setIsLoading(false);
    }
  }, [arizalar, arizalarError, randevularError, projelerError]);
  
  // Analitik hesaplamalar
  const calculateMetrics = () => {
    // Tamamlanma süresi (gün olarak)
    const tamamlanmaSureleri = arizalar
      .filter((ariza: any) => ariza.durum === "Çözüm")
      .map((ariza: any) => {
        const baslangic = new Date(ariza.createdAt);
        const sonRandevu = ariza.randevular?.sort((a: any, b: any) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
        
        if (sonRandevu) {
          const bitis = new Date(sonRandevu.updatedAt);
          const gunFarki = Math.ceil((bitis.getTime() - baslangic.getTime()) / (1000 * 60 * 60 * 24));
          return gunFarki;
        }
        return null;
      })
      .filter(Boolean);
    
    const ortTamamlanmaSuresi = tamamlanmaSureleri.length 
      ? (tamamlanmaSureleri.reduce((a: any, b: any) => a + b, 0) / tamamlanmaSureleri.length).toFixed(1)
      : 0;
    
    // İlk yanıt süresi (saat olarak)
    const ilkYanitSureleri = arizalar
      .filter((ariza: any) => ariza.randevular?.length > 0)
      .map((ariza: any) => {
        const baslangic = new Date(ariza.createdAt);
        const ilkRandevu = ariza.randevular?.sort((a: any, b: any) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )[0];
        
        if (ilkRandevu) {
          const ilkYanit = new Date(ilkRandevu.createdAt);
          const saatFarki = (ilkYanit.getTime() - baslangic.getTime()) / (1000 * 60 * 60);
          return saatFarki;
        }
        return null;
      })
      .filter(Boolean);
    
    const ortIlkYanitSuresi = ilkYanitSureleri.length 
      ? (ilkYanitSureleri.reduce((a: any, b: any) => a + b, 0) / ilkYanitSureleri.length).toFixed(1)
      : 0;
    
    // Çözüm oranı
    const cozulenArizalar = arizalar.filter((ariza: any) => ariza.durum === "Çözüm").length;
    const cozumOrani = arizalar.length 
      ? ((cozulenArizalar / arizalar.length) * 100).toFixed(1)
      : 0;
    
    // Aylık arıza sayısı
    const buAy = arizalar.filter((ariza: any) => {
      const tarih = new Date(ariza.createdAt);
      const bugun = new Date();
      return tarih.getMonth() === bugun.getMonth() && tarih.getFullYear() === bugun.getFullYear();
    }).length;
    
    // Ortalama malzeme maliyeti
    let toplamMaliyet = 0;
    let malzemeKullanilanRandevuSayisi = 0;
    
    randevular.forEach((randevu: any) => {
      if (randevu.kullanilanMalzemeler?.length > 0) {
        let randevuMaliyeti = 0;
        randevu.kullanilanMalzemeler.forEach((malzeme: any) => {
          randevuMaliyeti += malzeme.miktar * (malzeme.fiyat || 0);
        });
        
        if (randevuMaliyeti > 0) {
          toplamMaliyet += randevuMaliyeti;
          malzemeKullanilanRandevuSayisi++;
        }
      }
    });
    
    const ortMalzameMaliyeti = malzemeKullanilanRandevuSayisi 
      ? (toplamMaliyet / malzemeKullanilanRandevuSayisi).toFixed(0)
      : 0;
    
    return {
      ortTamamlanmaSuresi,
      ortIlkYanitSuresi,
      cozumOrani,
      buAy,
      ortMalzameMaliyeti,
      toplamMaliyet: toplamMaliyet.toFixed(0)
    };
  };
  
  const metrics = isLoading ? null : calculateMetrics();
  
  // Veri yükleniyor ekranı
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Analitik verileri yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Geri
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Analitik Dashboard</h2>
          </div>
          <p className="text-muted-foreground">
            Bakım ve arıza verilerinizin detaylı analizi.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Rapor İndir
          </Button>
        </div>
      </div>
      
      {/* Ana Metrikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Ortalama Çözüm Süresi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.ortTamamlanmaSuresi} gün</div>
            <p className="text-xs text-muted-foreground">
              Arızanın alınmasından çözülmesine kadar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              İlk Yanıt Süresi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.ortIlkYanitSuresi} saat</div>
            <p className="text-xs text-muted-foreground">
              Arıza bildirimi ile ilk randevunun planlanması
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Çözüm Oranı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%{metrics?.cozumOrani}</div>
            <p className="text-xs text-muted-foreground">
              Toplam arızaların çözülme oranı
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Bu Ay Açılan Arızalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.buAy}</div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(), "MMMM yyyy", { locale: tr })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Ort. Malzeme Maliyeti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(metrics?.ortMalzameMaliyeti))}
            </div>
            <p className="text-xs text-muted-foreground">
              Randevu başına
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Maliyet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(metrics?.toplamMaliyet))}
            </div>
            <p className="text-xs text-muted-foreground">
              Tüm malzemeler
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtreleme Seçenekleri ve Tab İçerikleri */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs
            defaultValue="genel"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="genel">Genel Bakış</TabsTrigger>
              <TabsTrigger value="maliyetler">Maliyetler</TabsTrigger>
              <TabsTrigger value="performans">Performans</TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end mb-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant={period === 'week' ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriod('week')}
                >
                  Haftalık
                </Button>
                <Button 
                  variant={period === 'month' ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriod('month')}
                >
                  Aylık
                </Button>
                <Button 
                  variant={period === 'year' ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriod('year')}
                >
                  Yıllık
                </Button>
              </div>
            </div>
            
            {/* Tab İçerikleri - Tabs içinde olmalı */}
            <TabsContent value="genel" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Ana Trendler */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Arıza Trendi</CardTitle>
                    <CardDescription>Son dönem arıza bildirimleri</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <BarChart4 className="h-16 w-16 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Seçili Dönem Performansı */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Performans Metrikleri</CardTitle>
                    <CardDescription>
                      {period === 'week' ? 'Bu hafta' : period === 'month' ? 'Bu ay' : 'Bu yıl'} performans özeti
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <TrendingUpIcon className="h-16 w-16 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="maliyetler" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Maliyet Analizi */}
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Arıza Tipi Bazında Maliyet Analizi</CardTitle>
                    <CardDescription>Arıza tiplerine göre oluşan toplam maliyetler</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <CostAnalysis />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performans" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Tekniker Performansı */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Tekniker Performansı</CardTitle>
                    <CardDescription>Tekniker bazında çözüm süreleri ve oranları</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <CalendarIcon className="h-16 w-16 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Proje Bazlı Arızalar */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Proje Analizi</CardTitle>
                    <CardDescription>Proje bazında arıza dağılımı</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <PieChartIcon className="h-16 w-16 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 