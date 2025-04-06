"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDurumBadgeVariant, getArizaIcon, fetcher } from "@/utils/arizaUtils";
import useSWR from "swr";
import Link from "next/link";
import { format } from "date-fns";
import { Eye, Home, ChevronRight } from "lucide-react";

export default function RecentFaults() {
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
    if (!arizalarError) {
      setIsLoading(false);
    }
  }, [arizalarError]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Son Eklenen Arızalar</CardTitle>
            <CardDescription>En son eklenen 10 arıza kaydı</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Arızaları tarihe göre sırala (en yeniden en eskiye)
  const sortedArizalar = [...arizalar].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Son Eklenen Arızalar</CardTitle>
          <CardDescription>En son eklenen 10 arıza kaydı</CardDescription>
        </div>
        <Link href="/dashboard/arizalar">
          <Button variant="outline" size="sm">
            Tümünü Gör
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium">Arıza Tipi</th>
                <th className="py-3 px-4 text-left font-medium">Açıklama</th>
                <th className="py-3 px-4 text-left font-medium">Konum</th>
                <th className="py-3 px-4 text-left font-medium">Durum</th>
                <th className="py-3 px-4 text-left font-medium">Tarih</th>
                <th className="py-3 px-4 text-left font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedArizalar.slice(0, 10).map((ariza: any, index: number) => (
                <tr key={ariza.id} className={index % 2 === 1 ? 'bg-slate-50' : ''}>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2">{getArizaIcon(ariza.arizaTipi?.ad)}</span>
                      <span>{ariza.arizaTipi?.ad || "Genel"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-[200px] truncate" title={ariza.aciklama}>
                      {ariza.aciklama}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {ariza.daire?.blok?.ad}-{ariza.daire?.numara}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={getDurumBadgeVariant(ariza.durum)}>{ariza.durum}</Badge>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                    {format(new Date(ariza.createdAt), "dd.MM.yyyy")}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/arizalar/${ariza.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/projeler/${ariza.daire?.blok?.projeId}/bloklar/${ariza.daire?.blokId}/daireler/${ariza.daireId}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Home className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 