"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RaporlarPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var swr_1 = __importDefault(require("swr"));
var arizaUtils_1 = require("@/utils/arizaUtils");
var formatUtils_1 = require("@/utils/formatUtils");
function RaporlarPage() {
    // Aktif sekme durumu
    var _a = (0, react_1.useState)("ozet"), activeTab = _a[0], setActiveTab = _a[1];
    // Tarih filtreleri
    var _b = (0, react_1.useState)(function () {
        var tarih = new Date();
        tarih.setMonth(tarih.getMonth() - 1); // Varsayılan olarak son 1 ay
        return tarih.toISOString().split('T')[0];
    }), baslangicTarihi = _b[0], setBaslangicTarihi = _b[1];
    var _c = (0, react_1.useState)(function () {
        return new Date().toISOString().split('T')[0]; // Bugün
    }), bitisTarihi = _c[0], setBitisTarihi = _c[1];
    // Filtreleme tipi
    var _d = (0, react_1.useState)("son30gun"), filtrelemeTipi = _d[0], setFiltrelemeTipi = _d[1];
    // Filtreleme tipine göre tarihleri otomatik ayarla
    var tarihFiltresiniAyarla = function (tip) {
        var bugun = new Date();
        setFiltrelemeTipi(tip);
        switch (tip) {
            case "bugun":
                setBaslangicTarihi(bugun.toISOString().split('T')[0]);
                setBitisTarihi(bugun.toISOString().split('T')[0]);
                break;
            case "buhafta":
                var haftaBasi = new Date(bugun);
                haftaBasi.setDate(bugun.getDate() - bugun.getDay());
                setBaslangicTarihi(haftaBasi.toISOString().split('T')[0]);
                setBitisTarihi(bugun.toISOString().split('T')[0]);
                break;
            case "buay":
                var ayBasi = new Date(bugun.getFullYear(), bugun.getMonth(), 1);
                setBaslangicTarihi(ayBasi.toISOString().split('T')[0]);
                setBitisTarihi(bugun.toISOString().split('T')[0]);
                break;
            case "son30gun":
                var otuzGunOnce = new Date(bugun);
                otuzGunOnce.setDate(bugun.getDate() - 30);
                setBaslangicTarihi(otuzGunOnce.toISOString().split('T')[0]);
                setBitisTarihi(bugun.toISOString().split('T')[0]);
                break;
            case "son90gun":
                var doksanGunOnce = new Date(bugun);
                doksanGunOnce.setDate(bugun.getDate() - 90);
                setBaslangicTarihi(doksanGunOnce.toISOString().split('T')[0]);
                setBitisTarihi(bugun.toISOString().split('T')[0]);
                break;
            case "tumu":
                var birYilOnce = new Date(bugun);
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
    var _e = (0, swr_1.default)("/api/arizalar", arizaUtils_1.fetcher), _f = _e.data, arizalar = _f === void 0 ? [] : _f, arizalarLoading = _e.isLoading;
    var _g = (0, swr_1.default)("/api/randevular", arizaUtils_1.fetcher), _h = _g.data, randevular = _h === void 0 ? [] : _h, randevularLoading = _g.isLoading;
    var _j = (0, swr_1.default)("/api/projeler", arizaUtils_1.fetcher), _k = _j.data, projeler = _k === void 0 ? [] : _k, projelerLoading = _j.isLoading;
    var _l = (0, swr_1.default)("/api/teknikerler", arizaUtils_1.fetcher), _m = _l.data, teknikerler = _m === void 0 ? [] : _m, teknikerlerLoading = _l.isLoading;
    var _o = (0, swr_1.default)("/api/ariza-tipleri", arizaUtils_1.fetcher), _p = _o.data, arizaTipleri = _p === void 0 ? [] : _p, arizaTipleriLoading = _o.isLoading;
    // Filtreleme için veri hazırlığı
    var filtreleVeri = function () {
        var baslangic = new Date(baslangicTarihi);
        var bitis = new Date(bitisTarihi);
        bitis.setHours(23, 59, 59, 999); // Bitiş tarihinin son saati
        var filtreli = {
            arizalar: arizalar.filter(function (ariza) {
                var arizaTarihi = new Date(ariza.createdAt);
                return arizaTarihi >= baslangic && arizaTarihi <= bitis;
            }),
            randevular: randevular.filter(function (randevu) {
                var randevuTarihi = new Date(randevu.tarih);
                return randevuTarihi >= baslangic && randevuTarihi <= bitis;
            })
        };
        return filtreli;
    };
    var filtreliVeri = filtreleVeri();
    // Rapor indirme fonksiyonu
    var raporuIndir = function () {
        // CSV veya PDF olarak rapor indirme mantığı
        alert("Rapor indirme özelliği hazırlanıyor...");
    };
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Raporlar</h1>
        <button_1.Button onClick={raporuIndir} className="flex items-center gap-2">
          <lucide_react_1.DownloadIcon className="h-4 w-4"/>
          Raporu İndir
        </button_1.Button>
      </div>

      {/* Filtre Kartı */}
      <card_1.Card>
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle className="text-lg flex items-center">
            <lucide_react_1.CalendarIcon className="h-5 w-5 mr-2"/>
            Tarih Filtresi
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-wrap gap-2">
              <button_1.Button variant={filtrelemeTipi === "bugun" ? "default" : "outline"} size="sm" onClick={function () { return tarihFiltresiniAyarla("bugun"); }}>
                Bugün
              </button_1.Button>
              <button_1.Button variant={filtrelemeTipi === "buhafta" ? "default" : "outline"} size="sm" onClick={function () { return tarihFiltresiniAyarla("buhafta"); }}>
                Bu Hafta
              </button_1.Button>
              <button_1.Button variant={filtrelemeTipi === "buay" ? "default" : "outline"} size="sm" onClick={function () { return tarihFiltresiniAyarla("buay"); }}>
                Bu Ay
              </button_1.Button>
              <button_1.Button variant={filtrelemeTipi === "son30gun" ? "default" : "outline"} size="sm" onClick={function () { return tarihFiltresiniAyarla("son30gun"); }}>
                Son 30 Gün
              </button_1.Button>
              <button_1.Button variant={filtrelemeTipi === "son90gun" ? "default" : "outline"} size="sm" onClick={function () { return tarihFiltresiniAyarla("son90gun"); }}>
                Son 90 Gün
              </button_1.Button>
              <button_1.Button variant={filtrelemeTipi === "tumu" ? "default" : "outline"} size="sm" onClick={function () { return tarihFiltresiniAyarla("tumu"); }}>
                Tümü
              </button_1.Button>
              <button_1.Button variant={filtrelemeTipi === "ozel" ? "default" : "outline"} size="sm" onClick={function () { return setFiltrelemeTipi("ozel"); }}>
                Özel
              </button_1.Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label_1.Label htmlFor="baslangic-tarihi">Başlangıç Tarihi</label_1.Label>
                <input_1.Input id="baslangic-tarihi" type="date" value={baslangicTarihi} onChange={function (e) {
            setBaslangicTarihi(e.target.value);
            setFiltrelemeTipi("ozel");
        }}/>
              </div>
              <div className="flex-1">
                <label_1.Label htmlFor="bitis-tarihi">Bitiş Tarihi</label_1.Label>
                <input_1.Input id="bitis-tarihi" type="date" value={bitisTarihi} onChange={function (e) {
            setBitisTarihi(e.target.value);
            setFiltrelemeTipi("ozel");
        }}/>
              </div>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Raporlar Sekmeleri */}
      <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <tabs_1.TabsList className="w-full justify-start">
          <tabs_1.TabsTrigger value="ozet" className="flex items-center gap-2">
            <lucide_react_1.BarChart2 className="h-4 w-4"/>
            Özet
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="arizalar" className="flex items-center gap-2">
            <lucide_react_1.WrenchIcon className="h-4 w-4"/>
            Arıza Raporları
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="maliyetler" className="flex items-center gap-2">
            <lucide_react_1.DollarSign className="h-4 w-4"/>
            Maliyet Analizleri
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="teknikerler" className="flex items-center gap-2">
            <lucide_react_1.Users className="h-4 w-4"/>
            Tekniker Performansı
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="projeler" className="flex items-center gap-2">
            <lucide_react_1.Building className="h-4 w-4"/>
            Proje Analizleri
          </tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <div className="mt-6">
          <tabs_1.TabsContent value="ozet">
            <h2 className="text-xl font-semibold mb-4">Genel Bakış</h2>
            {/* Özet Rapor Bileşenleri */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <card_1.Card>
                <card_1.CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <lucide_react_1.WrenchIcon className="h-8 w-8 text-blue-500 mb-2"/>
                    <span className="text-3xl font-bold">{filtreliVeri.arizalar.length}</span>
                    <span className="text-sm text-muted-foreground">Toplam Arıza</span>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
              <card_1.Card>
                <card_1.CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <lucide_react_1.Users className="h-8 w-8 text-green-500 mb-2"/>
                    <span className="text-3xl font-bold">{filtreliVeri.randevular.length}</span>
                    <span className="text-sm text-muted-foreground">Toplam Randevu</span>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
              <card_1.Card>
                <card_1.CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <lucide_react_1.DollarSign className="h-8 w-8 text-amber-500 mb-2"/>
                    <span className="text-3xl font-bold">
                      {(0, formatUtils_1.formatPara)(filtreliVeri.randevular.reduce(function (total, randevu) {
            if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
                return total + randevu.kullanilanMalzemeler.reduce(function (sum, malzeme) {
                    return sum + (malzeme.miktar * malzeme.fiyat);
                }, 0);
            }
            return total;
        }, 0))}
                    </span>
                    <span className="text-sm text-muted-foreground">Toplam Maliyet</span>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
              <card_1.Card>
                <card_1.CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <lucide_react_1.PieChart className="h-8 w-8 text-purple-500 mb-2"/>
                    <span className="text-3xl font-bold">
                      {filtreliVeri.arizalar.filter(function (ariza) {
            return ariza.durum === "Çözüm" || ariza.durum === "Kısmı Çözüm";
        }).length}
                    </span>
                    <span className="text-sm text-muted-foreground">Çözülen Arızalar</span>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </div>
            
            {/* Özet Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle>Arıza Durumlarına Göre Dağılım</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle>Aylık Arıza İstatistikleri</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="arizalar">
            <h2 className="text-xl font-semibold mb-4">Arıza Raporları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-lg">Arıza Türleri</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-lg">Çözüm Oranları</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-lg">Öncelik Dağılımı</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </div>
            
            <card_1.Card>
              <card_1.CardHeader className="pb-2">
                <card_1.CardTitle className="text-lg">Son Arızalar</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
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
                      {filtreliVeri.arizalar.slice(0, 5).map(function (ariza) {
            var _a, _b, _c, _d, _e, _f, _g;
            return (<tr key={ariza.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{(0, formatUtils_1.formatTarih)(ariza.createdAt)}</td>
                          <td className="p-4 align-middle">{((_c = (_b = (_a = ariza.daire) === null || _a === void 0 ? void 0 : _a.blok) === null || _b === void 0 ? void 0 : _b.proje) === null || _c === void 0 ? void 0 : _c.ad) || '-'} / {((_e = (_d = ariza.daire) === null || _d === void 0 ? void 0 : _d.blok) === null || _e === void 0 ? void 0 : _e.ad) || '-'} / {((_f = ariza.daire) === null || _f === void 0 ? void 0 : _f.numara) || '-'}</td>
                          <td className="p-4 align-middle">{((_g = ariza.arizaTipi) === null || _g === void 0 ? void 0 : _g.ad) || '-'}</td>
                          <td className="p-4 align-middle max-w-xs truncate">{ariza.aciklama}</td>
                          <td className="p-4 align-middle">
                            <span className={"px-2 py-1 rounded-full text-xs ".concat(ariza.durum === "Çözüm" ? "bg-green-100 text-green-800" :
                    ariza.durum === "Talep Alındı" ? "bg-blue-100 text-blue-800" :
                        ariza.durum === "Randevu Planlandı" ? "bg-yellow-100 text-yellow-800" :
                            ariza.durum === "İptal Edildi" ? "bg-red-100 text-red-800" :
                                "bg-gray-100 text-gray-800")}>
                              {ariza.durum}
                            </span>
                          </td>
                        </tr>);
        })}
                    </tbody>
                  </table>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="maliyetler">
            <h2 className="text-xl font-semibold mb-4">Maliyet Analizleri</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-lg">Arıza Türüne Göre Maliyetler</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-lg">Aylık Maliyet Analizi</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </div>
            
            <card_1.Card>
              <card_1.CardHeader className="pb-2">
                <card_1.CardTitle className="text-lg">En Çok Harcama Yapılan Projeler</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
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
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="teknikerler">
            <h2 className="text-xl font-semibold mb-4">Tekniker Performansı</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-lg">Tekniker Çözüm Oranları</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="space-y-4">
                    {teknikerler.slice(0, 5).map(function (tekniker) {
            // Tekniker randevuları
            var teknikerRandevular = filtreliVeri.randevular.filter(function (r) { return r.teknikerId === tekniker.id; });
            var tamamlananRandevu = teknikerRandevular.filter(function (r) {
                return r.durum === "Tamamlandı" || r.durum === "Kısmı Çözüm";
            }).length;
            var performansYuzde = teknikerRandevular.length ?
                Math.round((tamamlananRandevu / teknikerRandevular.length) * 100) : 0;
            return (<div key={tekniker.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{tekniker.adsoyad}</span>
                            <span className="text-sm text-muted-foreground">{performansYuzde}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full transition-all duration-1000 ease-in-out" style={{ width: "".concat(performansYuzde, "%") }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{tamamlananRandevu} tamamlanan</span>
                            <span>{teknikerRandevular.length} toplam</span>
                          </div>
                        </div>);
        })}
                  </div>
                </card_1.CardContent>
              </card_1.Card>
              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-lg">Ortalama Çözüm Süreleri</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </div>
            
            <card_1.Card>
              <card_1.CardHeader className="pb-2">
                <card_1.CardTitle className="text-lg">Tekniker Performans Tablosu</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
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
                      {teknikerler.slice(0, 5).map(function (tekniker) {
            // Tekniker randevuları
            var teknikerRandevular = filtreliVeri.randevular.filter(function (r) { return r.teknikerId === tekniker.id; });
            var tamamlananRandevu = teknikerRandevular.filter(function (r) {
                return r.durum === "Tamamlandı" || r.durum === "Kısmı Çözüm";
            }).length;
            var performansYuzde = teknikerRandevular.length ?
                Math.round((tamamlananRandevu / teknikerRandevular.length) * 100) : 0;
            return (<tr key={tekniker.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{tekniker.adsoyad}</td>
                            <td className="p-4 align-middle">{teknikerRandevular.length}</td>
                            <td className="p-4 align-middle">{tamamlananRandevu}</td>
                            <td className="p-4 align-middle">{performansYuzde}%</td>
                            <td className="p-4 align-middle">Hesaplanmadı</td>
                          </tr>);
        })}
                    </tbody>
                  </table>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="projeler">
            <h2 className="text-xl font-semibold mb-4">Proje Analizleri</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-lg">Proje Bazlı Arıza Dağılımı</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
              <card_1.Card>
                <card_1.CardHeader className="pb-2">
                  <card_1.CardTitle className="text-lg">Blok Bazlı Arıza Dağılımı</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Grafik henüz oluşturulmadı
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </div>
            
            <card_1.Card>
              <card_1.CardHeader className="pb-2">
                <card_1.CardTitle className="text-lg">Proje Karşılaştırma</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
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
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>
        </div>
      </tabs_1.Tabs>
    </div>);
}
