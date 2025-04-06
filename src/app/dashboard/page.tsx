"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { BarChart4, RefreshCw } from "lucide-react";
import Link from "next/link";
import SummaryCards from "@/components/dashboard/SummaryCards";
import FaultTypeChart from "@/components/dashboard/FaultTypeChart";
import ActivityChart from "@/components/dashboard/ActivityChart";
import RecentFaults from "@/components/dashboard/RecentFaults";
import StatsOverview from "@/components/dashboard/StatsOverview";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { fetcher } from "@/utils/arizaUtils";
import useSWR from "swr";

export default function Dashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // SWR ile temel verileri çek - dashboard sayfasında yenile butonuna basıldığında kullanılacak
  const { mutate: mutateArizalar } = useSWR(
    session ? `/api/arizalar` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 30000 // 30 saniye
    }
  );

  // Sayfa yüklendiğinde loading durumunu güncelle
  useEffect(() => {
    // Kısa bir gösterim süresi ver
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Tüm veri yenileme fonksiyonu
  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Tüm verileri yenile
    mutateArizalar();
    
    toast({
      title: "Veriler yenileniyor",
      description: "Dashboard verileri güncelleniyor...",
      duration: 3000,
    });
    
    // Yenileme sonrası loading durumunu güncelle
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
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
          <Button onClick={handleRefreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>
      </div>
      
      {/* Özet Kartları Bileşeni */}
      <SummaryCards />
      
      {/* Ana İçerik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Arıza Tipleri Dağılımı */}
        <div className="col-span-3">
          <FaultTypeChart />
        </div>
        
        {/* Son 30 gün aktivite grafiği */}
        <div className="col-span-4">
          <ActivityChart />
        </div>
      </div>
      
      {/* Son Eklenen Arızalar */}
      <RecentFaults />
      
      {/* Durum ve Performans Özeti */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsOverview />
      </div>
    </div>
  );
} 