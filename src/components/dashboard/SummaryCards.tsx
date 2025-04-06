"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/utils/arizaUtils";
import useSWR from "swr";
import { formatPara } from "@/utils/formatUtils";

interface SummaryData {
  arizalar: any[];
  randevular: any[];
  masraflar: number;
}

export default function SummaryCards() {
  const { data: arizalar, error: arizaError, isLoading: arizaLoading } = useSWR('/api/arizalar', fetcher);
  const { data: randevular, error: randevuError, isLoading: randevuLoading } = useSWR('/api/randevular', fetcher);
  
  const [summaryData, setSummaryData] = useState<SummaryData>({
    arizalar: [],
    randevular: [],
    masraflar: 0
  });
  
  useEffect(() => {
    if (arizalar && randevular) {
      // Bugünün tarihini al
      const bugun = new Date();
      bugun.setHours(0, 0, 0, 0);
      
      // Bugün olan randevuları filtrele
      const bugunRandevular = randevular.filter((randevu: any) => {
        const randevuTarihi = new Date(randevu.tarih);
        randevuTarihi.setHours(0, 0, 0, 0);
        return randevuTarihi.getTime() === bugun.getTime();
      });
      
      // Açık arızaları filtrele
      const acikArizalar = arizalar.filter((ariza: any) => 
        ariza.durum !== "Çözüm" && ariza.durum !== "İptal Edildi"
      );
      
      // Tamamlanan arızaları filtrele
      const tamamlananArizalar = arizalar.filter((ariza: any) => 
        ariza.durum === "Çözüm"
      );
      
      // Toplam masrafları hesapla
      let toplamMasraf = 0;
      randevular.forEach((randevu: any) => {
        if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
          randevu.kullanilanMalzemeler.forEach((malzeme: any) => {
            toplamMasraf += malzeme.miktar * (malzeme.fiyat || 0);
          });
        }
      });
      
      setSummaryData({
        arizalar: acikArizalar,
        randevular: bugunRandevular,
        masraflar: toplamMasraf
      });
    }
  }, [arizalar, randevular]);
  
  const loading = arizaLoading || randevuLoading;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Açık Arızalar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Açık Arızalar</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-1/2" />
          ) : (
            <div className="text-2xl font-bold">{summaryData.arizalar.length}</div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Bekleyen arıza talepleri sayısı
          </p>
        </CardFooter>
      </Card>

      {/* Bugünkü Randevular */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bugünkü Randevular</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-1/2" />
          ) : (
            <div className="text-2xl font-bold">{summaryData.randevular.length}</div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Bugün için planlanan randevular
          </p>
        </CardFooter>
      </Card>

      {/* Çözülmüş Arızalar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Çözülmüş Arızalar</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-1/2" />
          ) : (
            <div className="text-2xl font-bold">
              {arizalar?.filter((ariza: any) => ariza.durum === "Çözüm").length || 0}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Başarıyla çözülmüş arıza sayısı
          </p>
        </CardFooter>
      </Card>

      {/* Toplam Giderler */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Giderler</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="text-2xl font-bold">{formatPara(summaryData.masraflar)}</div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Toplam malzeme giderleri
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 