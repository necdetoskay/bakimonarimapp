"use client";

import { useMemo } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

interface PendingRandevularProps {
  randevular: any[];
  limit?: number;
}

export default function PendingRandevular({ randevular, limit = 5 }: PendingRandevularProps) {
  const pendingRandevular = useMemo(() => {
    return randevular
      .filter(r => r.durum === 'Planlandı')
      .sort((a, b) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime())
      .slice(0, limit);
  }, [randevular, limit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yaklaşan Randevular</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRandevular.map((randevu) => (
            <div key={randevu.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {randevu.ariza?.aciklama || 'Arıza bilgisi bulunamadı'}
                </p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(randevu.tarih), 'dd MMM yyyy HH:mm', { locale: tr })}
                  </span>
                  {randevu.tekniker && (
                    <Badge variant="outline">{randevu.tekniker.adsoyad}</Badge>
                  )}
                </div>
              </div>
              <Link href={`/dashboard/randevular/${randevu.id}`}>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
