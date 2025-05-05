"use client";

import { useMemo } from 'react';
import StatCard from '../cards/StatCard';
import { Wrench, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ArizaStatsProps {
  arizalar: any[];
}

export default function ArizaStats({ arizalar }: ArizaStatsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const last30Days = subDays(now, 30);
    
    const totalArizalar = arizalar.length;
    const cozulenArizalar = arizalar.filter(a => a.durum === 'Çözüldü').length;
    const bekleyenArizalar = arizalar.filter(a => a.durum === 'Beklemede').length;
    const acilArizalar = arizalar.filter(a => a.oncelik === 'Yüksek').length;
    
    const son30GunArizalar = arizalar.filter(a => 
      new Date(a.createdAt) >= last30Days
    ).length;

    const artisOrani = totalArizalar > 0 
      ? ((son30GunArizalar / totalArizalar) * 100) - 100 
      : 0;

    return {
      total: totalArizalar,
      cozulen: cozulenArizalar,
      bekleyen: bekleyenArizalar,
      acil: acilArizalar,
      trend: artisOrani
    };
  }, [arizalar]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Toplam Arıza"
        value={stats.total}
        icon={Wrench}
        trend={{
          value: stats.trend,
          isPositive: stats.trend > 0
        }}
      />
      <StatCard
        title="Çözülen Arızalar"
        value={stats.cozulen}
        icon={CheckCircle2}
        description={`${((stats.cozulen / stats.total) * 100).toFixed(1)}% başarı oranı`}
      />
      <StatCard
        title="Bekleyen Arızalar"
        value={stats.bekleyen}
        icon={Clock}
      />
      <StatCard
        title="Acil Arızalar"
        value={stats.acil}
        icon={AlertCircle}
      />
    </div>
  );
}
