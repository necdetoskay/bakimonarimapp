"use client";

import { useMemo } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from 'lucide-react';
import Link from 'next/link';

interface RecentArizalarProps {
  arizalar: any[];
  limit?: number;
}

export default function RecentArizalar({ arizalar, limit = 5 }: RecentArizalarProps) {
  const getDurumBadgeVariant = (durum: string) => {
    switch (durum.toLowerCase()) {
      case 'çözüldü':
        return 'success';
      case 'beklemede':
        return 'warning';
      case 'iptal':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const recentArizalar = useMemo(() => {
    return arizalar
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [arizalar, limit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Arızalar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentArizalar.map((ariza) => (
            <div key={ariza.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{ariza.aciklama}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant={getDurumBadgeVariant(ariza.durum)}>{ariza.durum}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(ariza.createdAt), 'dd MMM yyyy', { locale: tr })}
                  </span>
                </div>
              </div>
              <Link href={`/dashboard/arizalar/${ariza.id}`}>
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
