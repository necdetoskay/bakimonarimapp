"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { fetcher, hesaplaArizaMasrafi } from "@/utils/arizaUtils";
import { formatPara } from "@/utils/formatUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Veri tipi tanımlamaları
interface CostDataItem {
  name: string;
  maliyet: number;
}

export default function CostAnalysis() {
  const [costData, setCostData] = useState<CostDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Verileri çek
  const { data: arizalar = [], error: arizalarError } = useSWR(
    "/api/arizalar", 
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  const { data: arizaTipleri = [], error: arizaTipleriError } = useSWR(
    "/api/ariza-tipleri", 
    fetcher,
    { revalidateOnFocus: false }
  );

  // Veri hazırlandığında loading durumunu güncelle
  useEffect(() => {
    if (
      arizalar.length > 0 && 
      arizaTipleri.length > 0 && 
      !arizalarError && 
      !arizaTipleriError
    ) {
      processData();
    } else if (arizalarError || arizaTipleriError) {
      setIsLoading(false);
    }
  }, [arizalar, arizaTipleri, arizalarError, arizaTipleriError]);

  // Maliyet verilerini hazırla
  const processData = () => {
    // Arıza tipi bazında maliyetleri hesapla
    const costByType: Record<string, number> = {};
    
    // Önce tüm tipleri sıfır olarak başlat
    arizaTipleri.forEach((tip: any) => {
      costByType[tip.ad] = 0;
    });
    
    // Sonra arızalardan maliyetleri hesapla
    arizalar.forEach((ariza: any) => {
      const tipAdi = ariza.arizaTipi?.ad || "Diğer";
      const maliyet = hesaplaArizaMasrafi(ariza);
      
      if (!costByType[tipAdi]) {
        costByType[tipAdi] = 0;
      }
      
      costByType[tipAdi] += maliyet;
    });
    
    // Veriyi görselleştirme için uygun formata dönüştür
    const data = Object.entries(costByType)
      .map(([name, maliyet]) => ({ name, maliyet }))
      .sort((a, b) => b.maliyet - a.maliyet); // Büyükten küçüğe sırala
    
    setCostData(data);
    setIsLoading(false);
  };

  // Tooltip içeriğini özelleştir
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-primary">{formatPara(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (costData.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-muted-foreground">Henüz maliyet verisi bulunmuyor.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={costData}
        margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis 
          tickFormatter={(value) => `${value.toLocaleString('tr-TR')} ₺`}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="maliyet" 
          animationDuration={1500}
          animationBegin={200}
          radius={[4, 4, 0, 0]}
        >
          {costData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
} 