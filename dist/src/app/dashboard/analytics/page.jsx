"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnalyticsDashboard;
var react_1 = require("react");
var react_2 = require("next-auth/react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var link_1 = __importDefault(require("next/link"));
var swr_1 = __importDefault(require("swr"));
var arizaUtils_1 = require("@/utils/arizaUtils");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var dynamic_1 = __importDefault(require("next/dynamic"));
// Grafik bileşenlerini dinamik olarak yükle
var CostAnalysis = (0, dynamic_1.default)(function () { return Promise.resolve().then(function () { return __importStar(require("@/components/dashboard/CostAnalysis")); }); }, {
    ssr: false,
    loading: function () { return <div className="h-80 w-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>; }
});
// Analytics Dashboard sayfası
function AnalyticsDashboard() {
    var session = (0, react_2.useSession)().data;
    var _a = (0, react_1.useState)("genel"), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)('month'), period = _c[0], setPeriod = _c[1];
    // SWR ile veri çekme
    var _d = (0, swr_1.default)(session ? "/api/arizalar" : null, arizaUtils_1.fetcher, { revalidateOnFocus: false }), _e = _d.data, arizalar = _e === void 0 ? [] : _e, arizalarError = _d.error;
    var _f = (0, swr_1.default)(session ? "/api/randevular" : null, arizaUtils_1.fetcher, { revalidateOnFocus: false }), _g = _f.data, randevular = _g === void 0 ? [] : _g, randevularError = _f.error;
    var _h = (0, swr_1.default)(session ? "/api/projeler" : null, arizaUtils_1.fetcher, { revalidateOnFocus: false }), _j = _h.data, projeler = _j === void 0 ? [] : _j, projelerError = _h.error;
    // Veri yükleme durumunu kontrol et
    (0, react_1.useEffect)(function () {
        if (arizalar.length > 0 &&
            !arizalarError &&
            !randevularError &&
            !projelerError) {
            setIsLoading(false);
        }
        else if ((arizalarError || randevularError || projelerError)) {
            setIsLoading(false);
        }
    }, [arizalar, arizalarError, randevularError, projelerError]);
    // Analitik hesaplamalar
    var calculateMetrics = function () {
        // Tamamlanma süresi (gün olarak)
        var tamamlanmaSureleri = arizalar
            .filter(function (ariza) { return ariza.durum === "Çözüm"; })
            .map(function (ariza) {
            var _a;
            var baslangic = new Date(ariza.createdAt);
            var sonRandevu = (_a = ariza.randevular) === null || _a === void 0 ? void 0 : _a.sort(function (a, b) {
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            })[0];
            if (sonRandevu) {
                var bitis = new Date(sonRandevu.updatedAt);
                var gunFarki = Math.ceil((bitis.getTime() - baslangic.getTime()) / (1000 * 60 * 60 * 24));
                return gunFarki;
            }
            return null;
        })
            .filter(Boolean);
        var ortTamamlanmaSuresi = tamamlanmaSureleri.length
            ? (tamamlanmaSureleri.reduce(function (a, b) { return a + b; }, 0) / tamamlanmaSureleri.length).toFixed(1)
            : 0;
        // İlk yanıt süresi (saat olarak)
        var ilkYanitSureleri = arizalar
            .filter(function (ariza) { var _a; return ((_a = ariza.randevular) === null || _a === void 0 ? void 0 : _a.length) > 0; })
            .map(function (ariza) {
            var _a;
            var baslangic = new Date(ariza.createdAt);
            var ilkRandevu = (_a = ariza.randevular) === null || _a === void 0 ? void 0 : _a.sort(function (a, b) {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            })[0];
            if (ilkRandevu) {
                var ilkYanit = new Date(ilkRandevu.createdAt);
                var saatFarki = (ilkYanit.getTime() - baslangic.getTime()) / (1000 * 60 * 60);
                return saatFarki;
            }
            return null;
        })
            .filter(Boolean);
        var ortIlkYanitSuresi = ilkYanitSureleri.length
            ? (ilkYanitSureleri.reduce(function (a, b) { return a + b; }, 0) / ilkYanitSureleri.length).toFixed(1)
            : 0;
        // Çözüm oranı
        var cozulenArizalar = arizalar.filter(function (ariza) { return ariza.durum === "Çözüm"; }).length;
        var cozumOrani = arizalar.length
            ? ((cozulenArizalar / arizalar.length) * 100).toFixed(1)
            : 0;
        // Aylık arıza sayısı
        var buAy = arizalar.filter(function (ariza) {
            var tarih = new Date(ariza.createdAt);
            var bugun = new Date();
            return tarih.getMonth() === bugun.getMonth() && tarih.getFullYear() === bugun.getFullYear();
        }).length;
        // Ortalama malzeme maliyeti
        var toplamMaliyet = 0;
        var malzemeKullanilanRandevuSayisi = 0;
        randevular.forEach(function (randevu) {
            var _a;
            if (((_a = randevu.kullanilanMalzemeler) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                var randevuMaliyeti_1 = 0;
                randevu.kullanilanMalzemeler.forEach(function (malzeme) {
                    randevuMaliyeti_1 += malzeme.miktar * (malzeme.fiyat || 0);
                });
                if (randevuMaliyeti_1 > 0) {
                    toplamMaliyet += randevuMaliyeti_1;
                    malzemeKullanilanRandevuSayisi++;
                }
            }
        });
        var ortMalzameMaliyeti = malzemeKullanilanRandevuSayisi
            ? (toplamMaliyet / malzemeKullanilanRandevuSayisi).toFixed(0)
            : 0;
        return {
            ortTamamlanmaSuresi: ortTamamlanmaSuresi,
            ortIlkYanitSuresi: ortIlkYanitSuresi,
            cozumOrani: cozumOrani,
            buAy: buAy,
            ortMalzameMaliyeti: ortMalzameMaliyeti,
            toplamMaliyet: toplamMaliyet.toFixed(0)
        };
    };
    var metrics = isLoading ? null : calculateMetrics();
    // Veri yükleniyor ekranı
    if (isLoading) {
        return (<div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Analitik verileri yükleniyor...</p>
      </div>);
    }
    return (<div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <link_1.default href="/dashboard">
              <button_1.Button variant="ghost" size="sm">
                <lucide_react_1.ArrowLeft className="h-4 w-4 mr-1"/>
                Geri
              </button_1.Button>
            </link_1.default>
            <h2 className="text-3xl font-bold tracking-tight">Analitik Dashboard</h2>
          </div>
          <p className="text-muted-foreground">
            Bakım ve arıza verilerinizin detaylı analizi.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button_1.Button variant="outline" size="sm">
            <lucide_react_1.DownloadIcon className="h-4 w-4 mr-2"/>
            Rapor İndir
          </button_1.Button>
        </div>
      </div>
      
      {/* Ana Metrikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Ortalama Çözüm Süresi
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{metrics === null || metrics === void 0 ? void 0 : metrics.ortTamamlanmaSuresi} gün</div>
            <p className="text-xs text-muted-foreground">
              Arızanın alınmasından çözülmesine kadar
            </p>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              İlk Yanıt Süresi
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{metrics === null || metrics === void 0 ? void 0 : metrics.ortIlkYanitSuresi} saat</div>
            <p className="text-xs text-muted-foreground">
              Arıza bildirimi ile ilk randevunun planlanması
            </p>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Çözüm Oranı
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">%{metrics === null || metrics === void 0 ? void 0 : metrics.cozumOrani}</div>
            <p className="text-xs text-muted-foreground">
              Toplam arızaların çözülme oranı
            </p>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Bu Ay Açılan Arızalar
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{metrics === null || metrics === void 0 ? void 0 : metrics.buAy}</div>
            <p className="text-xs text-muted-foreground">
              {(0, date_fns_1.format)(new Date(), "MMMM yyyy", { locale: locale_1.tr })}
            </p>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Ort. Malzeme Maliyeti
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(metrics === null || metrics === void 0 ? void 0 : metrics.ortMalzameMaliyeti))}
            </div>
            <p className="text-xs text-muted-foreground">
              Randevu başına
            </p>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Toplam Maliyet
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(metrics === null || metrics === void 0 ? void 0 : metrics.toplamMaliyet))}
            </div>
            <p className="text-xs text-muted-foreground">
              Tüm malzemeler
            </p>
          </card_1.CardContent>
        </card_1.Card>
      </div>
      
      {/* Filtreleme Seçenekleri ve Tab İçerikleri */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <tabs_1.Tabs defaultValue="genel" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <tabs_1.TabsList className="mb-4">
              <tabs_1.TabsTrigger value="genel">Genel Bakış</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="maliyetler">Maliyetler</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="performans">Performans</tabs_1.TabsTrigger>
            </tabs_1.TabsList>
            
            <div className="flex justify-end mb-4">
              <div className="flex items-center space-x-2">
                <button_1.Button variant={period === 'week' ? "default" : "outline"} size="sm" onClick={function () { return setPeriod('week'); }}>
                  Haftalık
                </button_1.Button>
                <button_1.Button variant={period === 'month' ? "default" : "outline"} size="sm" onClick={function () { return setPeriod('month'); }}>
                  Aylık
                </button_1.Button>
                <button_1.Button variant={period === 'year' ? "default" : "outline"} size="sm" onClick={function () { return setPeriod('year'); }}>
                  Yıllık
                </button_1.Button>
              </div>
            </div>
            
            {/* Tab İçerikleri - Tabs içinde olmalı */}
            <tabs_1.TabsContent value="genel" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Ana Trendler */}
                <card_1.Card className="col-span-1">
                  <card_1.CardHeader>
                    <card_1.CardTitle>Arıza Trendi</card_1.CardTitle>
                    <card_1.CardDescription>Son dönem arıza bildirimleri</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent className="h-80">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <lucide_react_1.BarChart4 className="h-16 w-16 opacity-20"/>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
                
                {/* Seçili Dönem Performansı */}
                <card_1.Card className="col-span-1">
                  <card_1.CardHeader>
                    <card_1.CardTitle>Performans Metrikleri</card_1.CardTitle>
                    <card_1.CardDescription>
                      {period === 'week' ? 'Bu hafta' : period === 'month' ? 'Bu ay' : 'Bu yıl'} performans özeti
                    </card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent className="h-80">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <lucide_react_1.TrendingUpIcon className="h-16 w-16 opacity-20"/>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </div>
            </tabs_1.TabsContent>
            
            <tabs_1.TabsContent value="maliyetler" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Maliyet Analizi */}
                <card_1.Card className="col-span-2">
                  <card_1.CardHeader>
                    <card_1.CardTitle>Arıza Tipi Bazında Maliyet Analizi</card_1.CardTitle>
                    <card_1.CardDescription>Arıza tiplerine göre oluşan toplam maliyetler</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent className="h-80">
                    <CostAnalysis />
                  </card_1.CardContent>
                </card_1.Card>
              </div>
            </tabs_1.TabsContent>
            
            <tabs_1.TabsContent value="performans" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Tekniker Performansı */}
                <card_1.Card className="col-span-1">
                  <card_1.CardHeader>
                    <card_1.CardTitle>Tekniker Performansı</card_1.CardTitle>
                    <card_1.CardDescription>Tekniker bazında çözüm süreleri ve oranları</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent className="h-80">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <lucide_react_1.CalendarIcon className="h-16 w-16 opacity-20"/>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
                
                {/* Proje Bazlı Arızalar */}
                <card_1.Card className="col-span-1">
                  <card_1.CardHeader>
                    <card_1.CardTitle>Proje Analizi</card_1.CardTitle>
                    <card_1.CardDescription>Proje bazında arıza dağılımı</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent className="h-80">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <lucide_react_1.PieChartIcon className="h-16 w-16 opacity-20"/>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </div>
            </tabs_1.TabsContent>
          </tabs_1.Tabs>
        </div>
      </div>
    </div>);
}
