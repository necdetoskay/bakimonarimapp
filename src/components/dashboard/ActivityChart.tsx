"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetcher } from "@/utils/arizaUtils";
import useSWR from "swr";
import { format, subDays } from "date-fns";
import { tr } from "date-fns/locale";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartItem {
  gun: string;
  ariza: number;
  cozulen: number;
  tarih: string;
}

export default function ActivityChart() {
  const [areaData, setAreaData] = useState<AreaChartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // SWR ile veri çekme
  const { data: arizalar = [], error: arizalarError } = useSWR(
    `/api/arizalar`,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 30000 // 30 saniye
    }
  );

  useEffect(() => {
    if (arizalar.length > 0 && !arizalarError) {
      // Son 30 günlük arızalar
      const son30GunArizalari = arizalar.filter((ariza: any) => {
        const createdAt = new Date(ariza.createdAt);
        const simdi = new Date();
        const otuzGunOnce = new Date(simdi);
        otuzGunOnce.setDate(simdi.getDate() - 30);
        return createdAt >= otuzGunOnce;
      });

      // Son 30 gün için area chart data
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
      setIsLoading(false);
    }
  }, [arizalar, arizalarError]);
  
  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Aylık Aktivite</CardTitle>
          <CardDescription>Son 30 günlük arıza ve çözüm aktivitesi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
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
  );
} 