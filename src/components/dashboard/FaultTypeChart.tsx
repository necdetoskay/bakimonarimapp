"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetcher } from "@/utils/arizaUtils";
import useSWR from "swr";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ChartDataItem {
  name: string;
  value: number;
}

export default function FaultTypeChart() {
  const [pieData, setPieData] = useState<ChartDataItem[]>([]);
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
      // Arıza tiplerine göre gruplandırma
      const arizaTipGruplari: Record<string, number> = {};
      arizalar.forEach((ariza: any) => {
        const tipAdi = ariza.arizaTipi?.ad || "Diğer";
        if (!arizaTipGruplari[tipAdi]) {
          arizaTipGruplari[tipAdi] = 0;
        }
        arizaTipGruplari[tipAdi]++;
      });

      // Pasta grafik için veri hazırlığı
      const chartData = Object.entries(arizaTipGruplari).map(([name, value]) => ({
        name,
        value
      }));

      setPieData(chartData);
      setIsLoading(false);
    }
  }, [arizalar, arizalarError]);

  // Pasta grafik renkleri
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Arıza Tipleri Dağılımı</CardTitle>
          <CardDescription>Arıza tiplerinin dağılımı ve sayıları</CardDescription>
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
  );
} 