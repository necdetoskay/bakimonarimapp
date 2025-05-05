"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnalyticsDashboard;
var react_1 = require("react");
var react_2 = require("next-auth/react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var use_toast_1 = require("@/hooks/use-toast");
var swr_1 = __importDefault(require("swr"));
var link_1 = __importDefault(require("next/link"));
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var lucide_react_1 = require("lucide-react");
var recharts_1 = require("recharts");
// Veri getirme fonksiyonu
var fetcher = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(url)];
            case 1:
                res = _a.sent();
                if (!res.ok) {
                    throw new Error("Veri çekerken bir hata oluştu");
                }
                return [2 /*return*/, res.json()];
        }
    });
}); };
// Arıza tipine göre ikon döndüren fonksiyon
var getArizaIcon = function (tip) {
    switch (tip === null || tip === void 0 ? void 0 : tip.toLowerCase()) {
        case "su":
            return "💧";
        case "elektrik":
            return "⚡";
        case "ısıtma":
            return "🔥";
        case "kapı":
            return "🚪";
        case "asansör":
            return "🔼";
        default:
            return "🔧";
    }
};
// Durum badge'i için renk döndüren fonksiyon
var getDurumBadgeVariant = function (durum) {
    switch (durum) {
        case "Talep Alındı": return "secondary";
        case "Randevu Planlandı": return "warning";
        case "Randevu Yeniden Planlandı": return "warning";
        case "Kısmı Çözüm": return "default";
        case "Çözüm": return "success";
        case "İptal Edildi": return "destructive";
        default: return "secondary";
    }
};
// Arıza toplam masrafını hesapla
var hesaplaArizaMasrafi = function (ariza) {
    if (!ariza.randevular || ariza.randevular.length === 0)
        return 0;
    var toplamMasraf = 0;
    ariza.randevular.forEach(function (randevu) {
        if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
            randevu.kullanilanMalzemeler.forEach(function (malzeme) {
                toplamMasraf += malzeme.miktar * (malzeme.fiyat || 0);
            });
        }
    });
    return toplamMasraf;
};
function AnalyticsDashboard() {
    var session = (0, react_2.useSession)().data;
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)([]), pieData = _a[0], setPieData = _a[1];
    var _b = (0, react_1.useState)([]), areaData = _b[0], setAreaData = _b[1];
    var _c = (0, react_1.useState)([]), costData = _c[0], setCostData = _c[1];
    var _d = (0, react_1.useState)(true), isLoading = _d[0], setIsLoading = _d[1];
    // SWR ile veri çekme
    var _e = (0, swr_1.default)(session ? "/api/arizalar" : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30000 // 30 saniye
    }), _f = _e.data, arizalar = _f === void 0 ? [] : _f, arizalarError = _e.error, mutateArizalar = _e.mutate;
    var _g = (0, swr_1.default)(session ? "/api/ariza-tipleri" : null, fetcher, { revalidateOnFocus: false }), _h = _g.data, arizaTipleri = _h === void 0 ? [] : _h, arizaTipleriError = _g.error;
    var _j = (0, swr_1.default)(session ? "/api/randevular" : null, fetcher, { revalidateOnFocus: false }), _k = _j.data, randevular = _k === void 0 ? [] : _k, randevularError = _j.error;
    // Veri yükleme durumunu kontrol et
    (0, react_1.useEffect)(function () {
        if (arizalar.length > 0 &&
            !arizalarError &&
            !arizaTipleriError &&
            !randevularError) {
            setIsLoading(false);
        }
    }, [arizalar, arizalarError, arizaTipleriError, randevularError]);
    // Grafik verilerini hazırla - verilerin değişmesi durumunda
    (0, react_1.useEffect)(function () {
        if (!arizalar.length)
            return;
        // 1. Arıza tipleri dağılımı için pasta grafik verisi
        var arizaTipGruplari = {};
        arizalar.forEach(function (ariza) {
            var _a;
            var tipAdi = ((_a = ariza.arizaTipi) === null || _a === void 0 ? void 0 : _a.ad) || "Diğer";
            if (!arizaTipGruplari[tipAdi]) {
                arizaTipGruplari[tipAdi] = 0;
            }
            arizaTipGruplari[tipAdi]++;
        });
        var pieChartData = Object.entries(arizaTipGruplari).map(function (_a) {
            var name = _a[0], value = _a[1];
            return ({
                name: name,
                value: value
            });
        });
        setPieData(pieChartData);
        // 2. Son 30 günlük arıza aktivitesi için alan grafik verisi
        var son30GunArizalari = arizalar.filter(function (ariza) {
            var createdAt = new Date(ariza.createdAt);
            var simdi = new Date();
            var otuzGunOnce = new Date(simdi);
            otuzGunOnce.setDate(simdi.getDate() - 30);
            return createdAt >= otuzGunOnce;
        });
        var son30Gun = Array.from({ length: 30 }).map(function (_, i) {
            var tarih = (0, date_fns_1.subDays)(new Date(), 29 - i);
            var gun = (0, date_fns_1.format)(tarih, 'dd.MM');
            // O güne ait arızaları bul
            var gunArizalar = son30GunArizalari.filter(function (ariza) {
                var createdAt = new Date(ariza.createdAt);
                return createdAt.toDateString() === tarih.toDateString();
            });
            // O güne ait çözülen arızaları bul
            var cozulenler = gunArizalar.filter(function (ariza) {
                return ariza.durum === "Çözüm";
            }).length;
            return {
                gun: gun,
                ariza: gunArizalar.length,
                cozulen: cozulenler,
                tarih: (0, date_fns_1.format)(tarih, 'd MMMM', { locale: locale_1.tr }),
            };
        });
        setAreaData(son30Gun);
        // 3. Maliyet verileri için grafik
        var tiplerMaliyet = {};
        arizalar.forEach(function (ariza) {
            var _a;
            var tipAdi = ((_a = ariza.arizaTipi) === null || _a === void 0 ? void 0 : _a.ad) || "Diğer";
            var maliyet = hesaplaArizaMasrafi(ariza);
            if (!tiplerMaliyet[tipAdi]) {
                tiplerMaliyet[tipAdi] = 0;
            }
            tiplerMaliyet[tipAdi] += maliyet;
        });
        var maliyetVerisi = Object.entries(tiplerMaliyet).map(function (_a) {
            var name = _a[0], value = _a[1];
            return ({
                name: name,
                maliyet: value
            });
        });
        setCostData(maliyetVerisi);
    }, [arizalar]);
    // Dashboard metrikleri
    var acikArizalar = arizalar.filter(function (ariza) {
        return ariza.durum !== "Çözüm" && ariza.durum !== "İptal Edildi";
    }).length;
    var bugunRandevular = randevular.filter(function (randevu) {
        var randevuTarihi = new Date(randevu.tarih);
        var bugun = new Date();
        return randevuTarihi.toDateString() === bugun.toDateString();
    }).length;
    var cozulenArizalar = arizalar.filter(function (ariza) { return ariza.durum === "Çözüm"; }).length;
    // Toplam maliyet hesabı
    var toplamMasraf = arizalar.reduce(function (total, ariza) {
        return total + hesaplaArizaMasrafi(ariza);
    }, 0);
    // Veri yükleniyor ekranı
    if (isLoading) {
        return (<div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Dashboard yükleniyor...</p>
      </div>);
    }
    // Pasta grafik renkleri
    var COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    return (<div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <link_1.default href="/dashboard">
            <button_1.Button variant="ghost" size="sm" className="mb-2">
              <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/> Ana Dashboard
            </button_1.Button>
          </link_1.default>
          <h2 className="text-3xl font-bold tracking-tight">Analitik Dashboard</h2>
          <p className="text-muted-foreground">Detaylı arıza ve maliyet analizleri</p>
        </div>
        
        <div className="flex space-x-2">
          <button_1.Button onClick={function () { return mutateArizalar(); }} variant="outline" size="sm">
            <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
            Yenile
          </button_1.Button>
        </div>
      </div>
      
      {/* Özet Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <card_1.Card className="overflow-hidden">
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50">
            <card_1.CardTitle className="text-sm font-medium">Açık Arızalar</card_1.CardTitle>
            <lucide_react_1.AlertCircle className="h-4 w-4 text-red-500"/>
          </card_1.CardHeader>
          <card_1.CardContent className="pt-4">
            <div className="text-2xl font-bold">{acikArizalar}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Bekleyen ve planlanan arıza sayısı
              </p>
              <badge_1.Badge variant="outline" className="animate-pulse">Aktif</badge_1.Badge>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card className="overflow-hidden">
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-yellow-50">
            <card_1.CardTitle className="text-sm font-medium">Bugünkü Randevular</card_1.CardTitle>
            <lucide_react_1.Calendar className="h-4 w-4 text-yellow-500"/>
          </card_1.CardHeader>
          <card_1.CardContent className="pt-4">
            <div className="text-2xl font-bold">{bugunRandevular}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {(0, date_fns_1.format)(new Date(), "d MMMM yyyy", { locale: locale_1.tr })}
              </p>
              <badge_1.Badge variant="outline">{bugunRandevular > 0 ? 'Plan Var' : 'Boş'}</badge_1.Badge>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card className="overflow-hidden">
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
            <card_1.CardTitle className="text-sm font-medium">Çözülen Arızalar</card_1.CardTitle>
            <lucide_react_1.CheckCircle2 className="h-4 w-4 text-green-500"/>
          </card_1.CardHeader>
          <card_1.CardContent className="pt-4">
            <div className="text-2xl font-bold">{cozulenArizalar}</div>
            <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
                Toplam çözülen arıza sayısı
            </p>
              <badge_1.Badge variant="outline">%{Math.round((cozulenArizalar / (arizalar.length || 1)) * 100)}</badge_1.Badge>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card className="overflow-hidden">
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50">
            <card_1.CardTitle className="text-sm font-medium">Toplam Masraf</card_1.CardTitle>
            <lucide_react_1.DollarSign className="h-4 w-4 text-blue-500"/>
          </card_1.CardHeader>
          <card_1.CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(toplamMasraf)}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Tüm arızaların toplam maliyeti
              </p>
              <badge_1.Badge variant="outline">Güncel</badge_1.Badge>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
      
      {/* Ana İçerik - Recharts Grafikleri */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Arıza Tipleri Dağılımı - PieChart */}
        <card_1.Card className="col-span-3">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-lg">Arıza Tipleri Dağılımı</card_1.CardTitle>
            <card_1.CardDescription>Arıza tiplerinin dağılımı ve sayıları</card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="h-[300px] w-full">
              <recharts_1.ResponsiveContainer width="100%" height="100%">
                <recharts_1.PieChart>
                  <recharts_1.Pie data={pieData} cx="50%" cy="50%" labelLine={true} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={function (_a) {
        var name = _a.name, percent = _a.percent;
        return "".concat(name, ": ").concat((percent * 100).toFixed(0), "%");
    }} animationDuration={1000} animationBegin={200}>
                    {pieData.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[index % COLORS.length]}/>); })}
                  </recharts_1.Pie>
                  <recharts_1.Tooltip formatter={function (value, name) { return [
            "".concat(value, " adet"),
            "".concat(name)
        ]; }}/>
                </recharts_1.PieChart>
              </recharts_1.ResponsiveContainer>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        {/* Son 30 gün aktivite grafiği - AreaChart */}
        <card_1.Card className="col-span-4">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-lg">Aylık Aktivite</card_1.CardTitle>
            <card_1.CardDescription>Son 30 günlük arıza ve çözüm aktivitesi</card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="h-[300px] w-full">
              <recharts_1.ResponsiveContainer width="100%" height="100%">
                <recharts_1.AreaChart data={areaData} margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 20,
        }}>
                  <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                  <recharts_1.XAxis dataKey="gun" tick={{ fontSize: 12 }} tickFormatter={function (value, index) { return index % 5 === 0 ? value : ''; }}/>
                  <recharts_1.YAxis tick={{ fontSize: 12 }}/>
                  <recharts_1.Tooltip labelFormatter={function (value) {
            var item = areaData.find(function (item) { return item.gun === value; });
            return item ? item.tarih : value;
        }} formatter={function (value, name) { return [
            value,
            name === 'ariza' ? 'Yeni Arıza' : 'Çözülen Arıza'
        ]; }}/>
                  <recharts_1.Area type="monotone" dataKey="ariza" stackId="1" stroke="#8884d8" fill="#8884d8" name="Yeni Arıza" animationDuration={1500}/>
                  <recharts_1.Area type="monotone" dataKey="cozulen" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Çözülen Arıza" animationDuration={1500}/>
                </recharts_1.AreaChart>
              </recharts_1.ResponsiveContainer>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
      
      {/* Maliyet Analizi - BarChart */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg">Maliyet Analizi</card_1.CardTitle>
          <card_1.CardDescription>Arıza tiplerinin toplam maliyetleri</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="h-[350px] w-full">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
              <recharts_1.BarChart data={costData} margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
        }}>
                <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                <recharts_1.XAxis dataKey="name"/>
                <recharts_1.YAxis tickFormatter={function (value) {
            return new Intl.NumberFormat('tr-TR', {
                notation: 'compact',
                compactDisplay: 'short',
                style: 'currency',
                currency: 'TRY'
            }).format(Number(value));
        }}/>
                <recharts_1.Tooltip formatter={function (value) {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY'
            }).format(Number(value));
        }}/>
                <recharts_1.Legend />
                <recharts_1.Bar dataKey="maliyet" name="Toplam Maliyet" fill="#8884d8" animationDuration={1500} radius={[5, 5, 0, 0]}/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Bağlantı */}
      <div className="flex justify-center mt-8">
        <link_1.default href="/dashboard">
          <button_1.Button variant="outline">
            Ana Dashboard'a Dön
            <lucide_react_1.ChevronRight className="ml-2 h-4 w-4"/>
          </button_1.Button>
        </link_1.default>
      </div>
    </div>);
}
