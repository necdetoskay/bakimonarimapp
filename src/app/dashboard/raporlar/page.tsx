"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, DownloadIcon, FileTextIcon, BarChart2, PieChart, Users, Building, WrenchIcon, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import { fetcher } from "@/utils/arizaUtils";
import { formatTarih, formatPara } from "@/utils/formatUtils";

export default function RaporlarPage() {
  // Aktif sekme durumu
  const [activeTab, setActiveTab] = useState("ozet");

  // Tarih filtreleri
  const [baslangicTarihi, setBaslangicTarihi] = useState(() => {
    const tarih = new Date();
    tarih.setMonth(tarih.getMonth() - 1); // Varsayılan olarak son 1 ay
    return tarih.toISOString().split('T')[0];
  });
  const [bitisTarihi, setBitisTarihi] = useState(() => {
    return new Date().toISOString().split('T')[0]; // Bugün
  });

  // Filtreleme tipi
  const [filtrelemeTipi, setFiltrelemeTipi] = useState("son30gun");

  // Filtreleme tipine göre tarihleri otomatik ayarla
  const tarihFiltresiniAyarla = (tip: string) => {
    const bugun = new Date();
    
    setFiltrelemeTipi(tip);
    
    switch (tip) {
      case "bugun":
        setBaslangicTarihi(bugun.toISOString().split('T')[0]);
        setBitisTarihi(bugun.toISOString().split('T')[0]);
        break;
      case "buhafta":
        const haftaBasi = new Date(bugun);
        haftaBasi.setDate(bugun.getDate() - bugun.getDay());
        setBaslangicTarihi(haftaBasi.toISOString().split('T')[0]);
        setBitisTarihi(bugun.toISOString().split('T')[0]);
        break;
      case "buay":
        const ayBasi = new Date(bugun.getFullYear(), bugun.getMonth(), 1);
        setBaslangicTarihi(ayBasi.toISOString().split('T')[0]);
        setBitisTarihi(bugun.toISOString().split('T')[0]);
        break;
      case "son30gun":
        const otuzGunOnce = new Date(bugun);
        otuzGunOnce.setDate(bugun.getDate() - 30);
        setBaslangicTarihi(otuzGunOnce.toISOString().split('T')[0]);
        setBitisTarihi(bugun.toISOString().split('T')[0]);
        break;
      case "son90gun":
        const doksanGunOnce = new Date(bugun);
        doksanGunOnce.setDate(bugun.getDate() - 90);
        setBaslangicTarihi(doksanGunOnce.toISOString().split('T')[0]);
        setBitisTarihi(bugun.toISOString().split('T')[0]);
        break;
      case "tumu":
        const birYilOnce = new Date(bugun);
        birYilOnce.setFullYear(bugun.getFullYear() - 1);
        setBaslangicTarihi(birYilOnce.toISOString().split('T')[0]);
        setBitisTarihi(bugun.toISOString().split('T')[0]);
        break;
      case "ozel":
        // Özel seçimde değişiklik yapma, kullanıcının girdiği değerleri koru
        break;
    }
  };

  // Veri çekme işlemleri
  const { data: arizalar = [], isLoading: arizalarLoading } = useSWR("/api/arizalar", fetcher);
  const { data: randevular = [], isLoading: randevularLoading } = useSWR("/api/randevular", fetcher);
  const { data: projeler = [], isLoading: projelerLoading } = useSWR("/api/projeler", fetcher);
  const { data: teknikerler = [], isLoading: teknikerlerLoading } = useSWR("/api/teknikerler", fetcher);
  const { data: arizaTipleri = [], isLoading: arizaTipleriLoading } = useSWR("/api/ariza-tipleri", fetcher);

  // Filtreleme için veri hazırlığı
  const filtreleVeri = () => {
    const baslangic = new Date(baslangicTarihi);
    const bitis = new Date(bitisTarihi);
    bitis.setHours(23, 59, 59, 999); // Bitiş tarihinin son saati
    
    const filtreli = {
      arizalar: arizalar.filter((ariza: any) => {
        const arizaTarihi = new Date(ariza.createdAt);
        return arizaTarihi >= baslangic && arizaTarihi <= bitis;
      }),
      randevular: randevular.filter((randevu: any) => {
        const randevuTarihi = new Date(randevu.tarih);
        return randevuTarihi >= baslangic && randevuTarihi <= bitis;
      })
    };
    
    return filtreli;
  };

  const filtreliVeri = filtreleVeri();

  // Rapor indirme fonksiyonu
  const raporuIndir = () => {
    // CSV veya PDF olarak rapor indirme mantığı
    alert("Rapor indirme özelliği hazırlanıyor...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Raporlar</h1>
        <Button onClick={raporuIndir} className="flex items-center gap-2">
          <DownloadIcon className="h-4 w-4" />
          Raporu İndir
        </Button>
      </div>

      {/* Filtre Kartı */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Tarih Filtresi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filtrelemeTipi === "bugun" ? "default" : "outline"} 
                size="sm"
                onClick={() => tarihFiltresiniAyarla("bugun")}
              >
                Bugün
              </Button>
              <Button 
                variant={filtrelemeTipi === "buhafta" ? "default" : "outline"} 
                size="sm"
                onClick={() => tarihFiltresiniAyarla("buhafta")}
              >
                Bu Hafta
              </Button>
              <Button 
                variant={filtrelemeTipi === "buay" ? "default" : "outline"} 
                size="sm"
                onClick={() => tarihFiltresiniAyarla("buay")}
              >
                Bu Ay
              </Button>
              <Button 
                variant={filtrelemeTipi === "son30gun" ? "default" : "outline"} 
                size="sm"
                onClick={() => tarihFiltresiniAyarla("son30gun")}
              >
                Son 30 Gün
              </Button>
              <Button 
                variant={filtrelemeTipi === "son90gun" ? "default" : "outline"} 
                size="sm"
                onClick={() => tarihFiltresiniAyarla("son90gun")}
              >
                Son 90 Gün
              </Button>
              <Button 
                variant={filtrelemeTipi === "tumu" ? "default" : "outline"} 
                size="sm"
                onClick={() => tarihFiltresiniAyarla("tumu")}
              >
                Tümü
              </Button>
              <Button 
                variant={filtrelemeTipi === "ozel" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFiltrelemeTipi("ozel")}
              >
                Özel
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="baslangic-tarihi">Başlangıç Tarihi</Label>
                <Input
                  id="baslangic-tarihi"
                  type="date"
                  value={baslangicTarihi}
                  onChange={(e) => {
                    setBaslangicTarihi(e.target.value);
                    setFiltrelemeTipi("ozel");
                  }}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="bitis-tarihi">Bitiş Tarihi</Label>
                <Input
                  id="bitis-tarihi"
                  type="date"
                  value={bitisTarihi}
                  onChange={(e) => {
                    setBitisTarihi(e.target.value);
                    setFiltrelemeTipi("ozel");
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raporlar Sekmeleri */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="ozet" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Özet
          </TabsTrigger>
          <TabsTrigger value="arizalar" className="flex items-center gap-2">
            <WrenchIcon className="h-4 w-4" />
            Arıza Raporları
          </TabsTrigger>
          <TabsTrigger value="maliyetler" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Maliyet Analizleri
          </TabsTrigger>
          <TabsTrigger value="teknikerler" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tekniker Performansı
          </TabsTrigger>
          <TabsTrigger value="projeler" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Proje Analizleri
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="ozet">
            <h2 className="text-xl font-semibold mb-4">Genel Bakış</h2>
            {/* Özet Rapor Bileşenleri */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <WrenchIcon className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-3xl font-bold">{filtreliVeri.arizalar.length}</span>
                    <span className="text-sm text-muted-foreground">Toplam Arıza</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Users className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-3xl font-bold">{filtreliVeri.randevular.length}</span>
                    <span className="text-sm text-muted-foreground">Toplam Randevu</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <DollarSign className="h-8 w-8 text-amber-500 mb-2" />
                    <span className="text-3xl font-bold">
                      {formatPara(filtreliVeri.randevular.reduce((total: number, randevu: any) => {
                        if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
                          return total + randevu.kullanilanMalzemeler.reduce((sum: number, malzeme: any) => {
                            return sum + (malzeme.miktar * malzeme.fiyat)
                          }, 0);
                        }
                        return total;
                      }, 0))}
                    </span>
                    <span className="text-sm text-muted-foreground">Toplam Maliyet</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <PieChart className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-3xl font-bold">
                      {filtreliVeri.arizalar.filter((ariza: any) => 
                        ariza.durum === "Çözüm" || ariza.durum === "Kısmı Çözüm"
                      ).length}
                    </span>
                    <span className="text-sm text-muted-foreground">Çözülen Arızalar</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Özet Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Arıza Durumlarına Göre Dağılım</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Aylık Arıza İstatistikleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="arizalar">
            <h2 className="text-xl font-semibold mb-4">Arıza Raporları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Arıza Türleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Çözüm Oranları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Öncelik Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Son Arızalar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Tarih</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Proje/Blok/Daire</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Arıza Türü</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Açıklama</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filtreliVeri.arizalar.slice(0, 5).map((ariza: any) => (
                        <tr key={ariza.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{formatTarih(ariza.createdAt)}</td>
                          <td className="p-4 align-middle">{ariza.daire?.blok?.proje?.ad || '-'} / {ariza.daire?.blok?.ad || '-'} / {ariza.daire?.numara || '-'}</td>
                          <td className="p-4 align-middle">{ariza.arizaTipi?.ad || '-'}</td>
                          <td className="p-4 align-middle max-w-xs truncate">{ariza.aciklama}</td>
                          <td className="p-4 align-middle">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              ariza.durum === "Çözüm" ? "bg-green-100 text-green-800" : 
                              ariza.durum === "Talep Alındı" ? "bg-blue-100 text-blue-800" : 
                              ariza.durum === "Randevu Planlandı" ? "bg-yellow-100 text-yellow-800" : 
                              ariza.durum === "İptal Edildi" ? "bg-red-100 text-red-800" : 
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {ariza.durum}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maliyetler">
            <h2 className="text-xl font-semibold mb-4">Maliyet Analizleri</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Arıza Türüne Göre Maliyetler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Aylık Maliyet Analizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">En Çok Harcama Yapılan Projeler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Proje</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Toplam Arıza</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Toplam Maliyet</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Ortalama Maliyet</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">Veri henüz hazırlanmadı</td>
                        <td className="p-4 align-middle">-</td>
                        <td className="p-4 align-middle">-</td>
                        <td className="p-4 align-middle">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teknikerler">
            <h2 className="text-xl font-semibold mb-4">Tekniker Performansı</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tekniker Çözüm Oranları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teknikerler.slice(0, 5).map((tekniker: any) => {
                      // Tekniker randevuları
                      const teknikerRandevular = filtreliVeri.randevular.filter((r: any) => r.teknikerId === tekniker.id);
                      const tamamlananRandevu = teknikerRandevular.filter((r: any) => 
                        r.durum === "Tamamlandı" || r.durum === "Kısmı Çözüm"
                      ).length;
                      const performansYuzde = teknikerRandevular.length ? 
                        Math.round((tamamlananRandevu / teknikerRandevular.length) * 100) : 0;
                      
                      return (
                        <div key={tekniker.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{tekniker.adsoyad}</span>
                            <span className="text-sm text-muted-foreground">{performansYuzde}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-1000 ease-in-out" 
                              style={{ width: `${performansYuzde}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{tamamlananRandevu} tamamlanan</span>
                            <span>{teknikerRandevular.length} toplam</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ortalama Çözüm Süreleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tekniker Performans Tablosu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Tekniker</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Atanan Görev</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Tamamlanan</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Çözüm Oranı</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Ort. Çözüm Süresi</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {teknikerler.slice(0, 5).map((tekniker: any) => {
                        // Tekniker randevuları
                        const teknikerRandevular = filtreliVeri.randevular.filter((r: any) => r.teknikerId === tekniker.id);
                        const tamamlananRandevu = teknikerRandevular.filter((r: any) => 
                          r.durum === "Tamamlandı" || r.durum === "Kısmı Çözüm"
                        ).length;
                        const performansYuzde = teknikerRandevular.length ? 
                          Math.round((tamamlananRandevu / teknikerRandevular.length) * 100) : 0;
                        
                        return (
                          <tr key={tekniker.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{tekniker.adsoyad}</td>
                            <td className="p-4 align-middle">{teknikerRandevular.length}</td>
                            <td className="p-4 align-middle">{tamamlananRandevu}</td>
                            <td className="p-4 align-middle">{performansYuzde}%</td>
                            <td className="p-4 align-middle">Hesaplanmadı</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projeler">
            <h2 className="text-xl font-semibold mb-4">Proje Analizleri</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Proje Bazlı Arıza Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Blok Bazlı Arıza Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Proje Karşılaştırma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Proje</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Arıza Sayısı</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Çözülen Arızalar</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Çözüm Oranı</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Toplam Maliyet</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">Veri henüz hazırlanmadı</td>
                        <td className="p-4 align-middle">-</td>
                        <td className="p-4 align-middle">-</td>
                        <td className="p-4 align-middle">-</td>
                        <td className="p-4 align-middle">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 