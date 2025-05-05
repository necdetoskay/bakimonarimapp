"use client";

import { Suspense, useMemo } from 'react';
import { useSession } from "next-auth/react";
import useSWR from "swr";
import dynamic from 'next/dynamic';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';

// Lazy loaded components
const ArizaStats = dynamic(() => import('@/components/dashboard/stats/ArizaStats'));
const ArizaBarChart = dynamic(() => import('@/components/dashboard/charts/ArizaBarChart'));
const ArizaPieChart = dynamic(() => import('@/components/dashboard/charts/ArizaPieChart'));
const ArizaAreaChart = dynamic(() => import('@/components/dashboard/charts/ArizaAreaChart'));
const RecentArizalar = dynamic(() => import('@/components/dashboard/tables/RecentArizalar'));
const PendingRandevular = dynamic(() => import('@/components/dashboard/tables/PendingRandevular'));

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: arizalar = [] } = useSWR('/api/arizalar', fetcher);
  const { data: randevular = [] } = useSWR('/api/randevular', fetcher);

  // Arıza tipleri dağılımı
  const arizaTipleriData = useMemo(() => {
    const tiplerMap = new Map();
    arizalar.forEach((ariza: any) => {
      const tip = ariza.arizaTipi?.ad || 'Diğer';
      tiplerMap.set(tip, (tiplerMap.get(tip) || 0) + 1);
    });
    return Array.from(tiplerMap.entries()).map(([name, value]) => ({ name, value }));
  }, [arizalar]);

  // Son 30 günlük arıza trendi
  const arizaTrendData = useMemo(() => {
    const last30Days = [...Array(30)].map((_, i) => {
      const date = subDays(new Date(), 29 - i);
      const gun = format(date, 'dd MMM', { locale: tr });
      const ariza = arizalar.filter((a: any) => 
        format(new Date(a.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ).length;
      const cozulen = arizalar.filter((a: any) => 
        format(new Date(a.updatedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
        a.durum === 'Çözüldü'
      ).length;
      return { gun, ariza, cozulen };
    });
    return last30Days;
  }, [arizalar]);

  return (
    <div className="space-y-6 p-6">
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <ArizaStats arizalar={arizalar} />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <RecentArizalar arizalar={arizalar} />
        </Suspense>
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <PendingRandevular randevular={randevular} />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <ArizaPieChart data={arizaTipleriData} title="Arıza Tipleri Dağılımı" />
        </Suspense>
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <ArizaBarChart data={arizaTipleriData} title="Arıza Tipleri İstatistikleri" />
        </Suspense>
      </div>

      <Suspense fallback={<div>Yükleniyor...</div>}>
        <ArizaAreaChart data={arizaTrendData} title="Son 30 Gün Arıza Trendi" />
      </Suspense>
    </div>
  );
}