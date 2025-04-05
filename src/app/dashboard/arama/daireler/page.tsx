"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Proje = {
  id: string;
  ad: string;
  ekbilgi: string | null;
  adres: string | null;
  konum: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Blok = {
  id: string;
  ad: string;
  ekbilgi: string | null;
  projeId: string;
  proje: Proje;
  createdAt: Date;
  updatedAt: Date;
};

type Daire = {
  id: string;
  numara: string;
  kat: string | null;
  ekbilgi: string | null;
  blokId: string;
  blok: Blok;
  createdAt: Date;
  updatedAt: Date;
};

export default function DaireAramaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  
  const [daireler, setDaireler] = useState<Daire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      toast({
        title: "Yetki Hatası",
        description: "Bu sayfayı görüntülemek için giriş yapmalısınız.",
        variant: "destructive",
      });
      router.push("/");
      return;
    }
    
    const fetchDaireler = async () => {
      try {
        const response = await fetch("/api/daireler");
        
        if (!response.ok) {
          throw new Error("Daireler yüklenirken bir hata oluştu");
        }
        
        const data = await response.json();
        setDaireler(data);
      } catch (error) {
        console.error("Daireler yüklenirken hata:", error);
        toast({
          title: "Hata",
          description: "Daireler yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDaireler();
  }, [session, router, toast, status]);
  
  // Filtreleme işlemi
  const filteredDaireler = daireler.filter((daire) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      daire.numara.toLowerCase().includes(searchLower) ||
      (daire.kat && daire.kat.toLowerCase().includes(searchLower)) ||
      (daire.ekbilgi && daire.ekbilgi.toLowerCase().includes(searchLower)) ||
      (daire.blok?.ad && daire.blok.ad.toLowerCase().includes(searchLower)) ||
      (daire.blok?.proje?.ad && daire.blok.proje.ad.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daire Arama</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daire Arama</CardTitle>
          <CardDescription>
            Daire, kat, blok veya proje bilgisine göre arama yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="border rounded-md">
              {filteredDaireler.length === 0 ? (
                <div className="py-24 text-center text-muted-foreground">
                  Sonuç bulunamadı
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Daire No</TableHead>
                        <TableHead>Kat</TableHead>
                        <TableHead>Ek Bilgi</TableHead>
                        <TableHead>Blok</TableHead>
                        <TableHead>Proje</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDaireler.map((daire) => (
                        <TableRow key={daire.id}>
                          <TableCell>{daire.numara}</TableCell>
                          <TableCell>{daire.kat || "-"}</TableCell>
                          <TableCell>{daire.ekbilgi || "-"}</TableCell>
                          <TableCell>{daire.blok?.ad || "-"}</TableCell>
                          <TableCell>{daire.blok?.proje?.ad || "-"}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(
                                `/dashboard/projeler/${daire.blok?.projeId}/bloklar/${daire.blokId}/daireler/${daire.id}`
                              )}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Detay
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 