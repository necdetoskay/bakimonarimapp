"use strict";
"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = StatsOverview;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var swr_1 = __importDefault(require("swr"));
var link_1 = __importDefault(require("next/link"));
var arizaUtils_1 = require("@/utils/arizaUtils");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var checkbox_1 = require("@/components/ui/checkbox");
var use_toast_1 = require("@/hooks/use-toast");
var navigation_1 = require("next/navigation");
function StatsOverview() {
    var _this = this;
    var _a = (0, react_1.useState)(true), isLoading = _a[0], setIsLoading = _a[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var router = (0, navigation_1.useRouter)();
    // Dialog ve Form Durumları
    var _b = (0, react_1.useState)(false), projeDialogOpen = _b[0], setProjeDialogOpen = _b[1];
    var _c = (0, react_1.useState)(false), arizaDialogOpen = _c[0], setArizaDialogOpen = _c[1];
    var _d = (0, react_1.useState)(false), teknikerDialogOpen = _d[0], setTeknikerDialogOpen = _d[1];
    // Yönlendirme seçenekleri
    var _e = (0, react_1.useState)(false), redirectToProje = _e[0], setRedirectToProje = _e[1];
    var _f = (0, react_1.useState)(false), redirectToAriza = _f[0], setRedirectToAriza = _f[1];
    var _g = (0, react_1.useState)(false), redirectToTekniker = _g[0], setRedirectToTekniker = _g[1];
    // Form verileri
    var _h = (0, react_1.useState)({ ad: '', adres: '' }), projeForm = _h[0], setProjeForm = _h[1];
    var _j = (0, react_1.useState)({
        aciklama: '',
        oncelik: 'Normal',
        projeId: '',
        blokId: '',
        daireId: '',
        arizaTuruId: '',
        bildiren: '',
        bildirenTelefon: '',
        not: ''
    }), arizaForm = _j[0], setArizaForm = _j[1];
    var _k = (0, react_1.useState)({ adsoyad: '', telefon: '' }), teknikerForm = _k[0], setTeknikerForm = _k[1];
    // SWR ile veri çekme
    var _l = (0, swr_1.default)("/api/projeler", arizaUtils_1.fetcher, { revalidateOnFocus: false, dedupingInterval: 60000 }), _m = _l.data, projeler = _m === void 0 ? [] : _m, projelerError = _l.error;
    var _o = (0, swr_1.default)("/api/teknikerler", arizaUtils_1.fetcher, { revalidateOnFocus: false, dedupingInterval: 60000 }), _p = _o.data, teknikerler = _p === void 0 ? [] : _p, teknikerlerError = _o.error;
    var _q = (0, swr_1.default)("/api/randevular", arizaUtils_1.fetcher, { revalidateOnFocus: false, dedupingInterval: 60000 }), _r = _q.data, randevular = _r === void 0 ? [] : _r, randevularError = _q.error;
    // Form işlemleri için gerekli veriler
    var _s = (0, swr_1.default)("/api/ariza-tipleri", arizaUtils_1.fetcher).data, arizaTipleri = _s === void 0 ? [] : _s;
    var _t = (0, swr_1.default)("/api/daireler", arizaUtils_1.fetcher).data, daireler = _t === void 0 ? [] : _t;
    // Proje değiştiğinde blokları getir
    var _u = (0, react_1.useState)([]), secilenProjeninBloklari = _u[0], setSecilenProjeninBloklari = _u[1];
    // Blok değiştiğinde daireleri getir
    var _v = (0, react_1.useState)([]), secilenBlokunDaireleri = _v[0], setSecilenBlokunDaireleri = _v[1];
    (0, react_1.useEffect)(function () {
        // Proje seçildiğinde ilgili blokları getir
        if (arizaForm.projeId) {
            var seciliProje = projeler.find(function (p) { return p.id === arizaForm.projeId; });
            if (seciliProje && seciliProje.bloklar) {
                setSecilenProjeninBloklari(seciliProje.bloklar);
            }
            else {
                // Blokları API'den çek
                fetch("/api/bloklar?projeId=".concat(arizaForm.projeId))
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                    setSecilenProjeninBloklari(data);
                })
                    .catch(function (err) {
                    console.error("Bloklar yüklenirken hata:", err);
                    setSecilenProjeninBloklari([]);
                });
            }
        }
        else {
            setSecilenProjeninBloklari([]);
        }
        // Blok seçildiğinde ilgili daireleri getir
        if (arizaForm.blokId) {
            fetch("/api/daireler?blokId=".concat(arizaForm.blokId))
                .then(function (res) { return res.json(); })
                .then(function (data) {
                setSecilenBlokunDaireleri(data);
            })
                .catch(function (err) {
                console.error("Daireler yüklenirken hata:", err);
                setSecilenBlokunDaireleri([]);
            });
        }
        else {
            setSecilenBlokunDaireleri([]);
        }
    }, [arizaForm.projeId, arizaForm.blokId]);
    // Veri yükleme durumunu kontrol et
    (0, react_1.useEffect)(function () {
        if (projeler.length > 0 &&
            teknikerler.length > 0 &&
            randevular.length > 0 &&
            !projelerError &&
            !teknikerlerError &&
            !randevularError) {
            setIsLoading(false);
        }
        else if (
        // Eğer hiç veri yoksa veya hata olduysa
        (projelerError || teknikerlerError || randevularError)) {
            setIsLoading(false);
        }
    }, [projeler, teknikerler, randevular, projelerError, teknikerlerError, randevularError]);
    // Bugünkü randevuları hesapla
    var bugunRandevular = randevular.filter(function (randevu) {
        var randevuTarihi = new Date(randevu.tarih);
        var bugun = new Date();
        return randevuTarihi.toDateString() === bugun.toDateString();
    }).length;
    // Form işlemleri
    var handleProjeSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch('/api/projeler', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(projeForm)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    toast({
                        title: "Proje başarıyla eklendi",
                        description: "".concat(projeForm.ad, " isimli proje olu\u015Fturuldu."),
                    });
                    // Form alanlarını sıfırla
                    setProjeForm({ ad: '', adres: '' });
                    setProjeDialogOpen(false);
                    // Yönlendirme gerekiyorsa yap
                    if (redirectToProje) {
                        router.push('/dashboard/projeler');
                    }
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    error = _a.sent();
                    toast({
                        title: "Hata",
                        description: error.message || "Proje eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "İşlem sırasında bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleArizaSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, error, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!arizaForm.aciklama || !arizaForm.projeId || !arizaForm.daireId || !arizaForm.arizaTuruId) {
                        toast({
                            title: "Eksik bilgi",
                            description: "Lütfen zorunlu alanları doldurun",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch('/api/arizalar', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(arizaForm)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast({
                        title: "Arıza kaydedildi",
                        description: "Arıza bilgileri başarıyla kaydedildi",
                    });
                    // Form alanlarını sıfırla
                    setArizaForm({
                        aciklama: '',
                        oncelik: 'Normal',
                        projeId: '',
                        blokId: '',
                        daireId: '',
                        arizaTuruId: '',
                        bildiren: '',
                        bildirenTelefon: '',
                        not: ''
                    });
                    setArizaDialogOpen(false);
                    // Yönlendirme gerekiyorsa yap
                    if (redirectToAriza) {
                        router.push('/dashboard/arizalar');
                    }
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    error = _a.sent();
                    toast({
                        title: "Hata",
                        description: error.message || "Arıza eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "İşlem sırasında bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleTeknikerSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch('/api/teknikerler', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(teknikerForm)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    toast({
                        title: "Tekniker başarıyla eklendi",
                        description: "".concat(teknikerForm.adsoyad, " isimli tekniker olu\u015Fturuldu."),
                    });
                    // Form alanlarını sıfırla
                    setTeknikerForm({ adsoyad: '', telefon: '' });
                    setTeknikerDialogOpen(false);
                    // Yönlendirme gerekiyorsa yap
                    if (redirectToTekniker) {
                        router.push('/dashboard/teknikerler');
                    }
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    error = _a.sent();
                    toast({
                        title: "Hata",
                        description: error.message || "Tekniker eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_3 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "İşlem sırasında bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    if (isLoading) {
        return (<>
        <card_1.Card className="animate-pulse">
          <card_1.CardHeader className="h-12 bg-slate-100"></card_1.CardHeader>
          <card_1.CardContent className="h-40 bg-slate-50"></card_1.CardContent>
        </card_1.Card>
        <card_1.Card className="animate-pulse">
          <card_1.CardHeader className="h-12 bg-slate-100"></card_1.CardHeader>
          <card_1.CardContent className="h-40 bg-slate-50"></card_1.CardContent>
        </card_1.Card>
        <card_1.Card className="animate-pulse">
          <card_1.CardHeader className="h-12 bg-slate-100"></card_1.CardHeader>
          <card_1.CardContent className="h-40 bg-slate-50"></card_1.CardContent>
        </card_1.Card>
      </>);
    }
    return (<>
      {/* Proje ve Blok Sayısı */}
      <card_1.Card>
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle className="text-lg">Projeler ve Bloklar</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg flex-1 mr-2">
              <lucide_react_1.Building2 className="h-8 w-8 text-primary mb-2"/>
              <span className="text-2xl font-bold">{projeler.length}</span>
              <span className="text-xs text-muted-foreground">Proje</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg flex-1 ml-2">
              <lucide_react_1.Home className="h-8 w-8 text-primary mb-2"/>
              <span className="text-2xl font-bold">
                {projeler.reduce(function (total, proje) { var _a; return total + (((_a = proje.bloklar) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0)}
              </span>
              <span className="text-xs text-muted-foreground">Blok</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {projeler.slice(0, 3).map(function (proje) { return (<link_1.default href={"/dashboard/projeler/".concat(proje.id)} key={proje.id}>
                <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                  <div className="flex items-center">
                    <lucide_react_1.Building2 className="h-4 w-4 mr-2 text-muted-foreground"/>
                    <span>{proje.ad}</span>
                  </div>
                  <lucide_react_1.ChevronRight className="h-4 w-4 text-muted-foreground"/>
                </div>
              </link_1.default>); })}
          </div>
        </card_1.CardContent>
      </card_1.Card>
      
      {/* Tekniker Performansı */}
      <card_1.Card>
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle className="text-lg">Tekniker Performansı</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            {teknikerler.slice(0, 4).map(function (tekniker) {
            // Bu teknikerin randevularını bul
            var teknikerRandevular = randevular.filter(function (r) { return r.teknikerId === tekniker.id; });
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
      
      {/* Hızlı İşlemler */}
      <card_1.Card>
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle className="text-lg">Hızlı İşlemler</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-2">
          {/* Yeni Proje Ekle */}
          <dialog_1.Dialog open={projeDialogOpen} onOpenChange={setProjeDialogOpen}>
            <dialog_1.DialogTrigger asChild>
              <button_1.Button variant="outline" className="w-full justify-start">
                <lucide_react_1.Building2 className="h-4 w-4 mr-2"/>
                <lucide_react_1.Plus className="h-3 w-3 mr-1"/>
                Yeni Proje Ekle
              </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[425px]">
              <dialog_1.DialogHeader>
                <dialog_1.DialogTitle>Yeni Proje Ekle</dialog_1.DialogTitle>
                <dialog_1.DialogDescription>
                  Yeni bir proje oluşturmak için gerekli bilgileri girin.
                </dialog_1.DialogDescription>
              </dialog_1.DialogHeader>
              <form onSubmit={handleProjeSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="proje-ad" className="text-right">
                      Proje Adı
                    </label_1.Label>
                    <input_1.Input id="proje-ad" className="col-span-3" value={projeForm.ad} onChange={function (e) { return setProjeForm(__assign(__assign({}, projeForm), { ad: e.target.value })); }} required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="proje-adres" className="text-right">
                      Adres
                    </label_1.Label>
                    <textarea_1.Textarea id="proje-adres" className="col-span-3" value={projeForm.adres} onChange={function (e) { return setProjeForm(__assign(__assign({}, projeForm), { adres: e.target.value })); }} required/>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <checkbox_1.Checkbox id="proje-redirect" checked={redirectToProje} onCheckedChange={function (checked) {
            return setRedirectToProje(checked);
        }}/>
                    <label htmlFor="proje-redirect" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      İşlem sonrası proje sayfasına yönlendir
                    </label>
                  </div>
                </div>
                <dialog_1.DialogFooter>
                  <button_1.Button type="submit">Kaydet</button_1.Button>
                </dialog_1.DialogFooter>
              </form>
            </dialog_1.DialogContent>
          </dialog_1.Dialog>
          
          {/* Arıza Ekle */}
          <dialog_1.Dialog open={arizaDialogOpen} onOpenChange={setArizaDialogOpen}>
            <dialog_1.DialogTrigger asChild>
              <button_1.Button variant="outline" className="w-full justify-start">
                <lucide_react_1.Wrench className="h-4 w-4 mr-2"/>
                <lucide_react_1.Plus className="h-3 w-3 mr-1"/>
                Arıza Ekle
              </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[600px]">
              <dialog_1.DialogHeader>
                <dialog_1.DialogTitle>Yeni Arıza Ekle</dialog_1.DialogTitle>
                <dialog_1.DialogDescription>
                  Yeni bir arıza kaydı oluşturmak için bilgileri girin.
                </dialog_1.DialogDescription>
              </dialog_1.DialogHeader>
              <form onSubmit={handleArizaSubmit}>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                  {/* Konum Bilgileri - Proje */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="ariza-proje" className="text-right">
                      Proje <span className="text-red-500">*</span>
                    </label_1.Label>
                    <select id="ariza-proje" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={arizaForm.projeId} onChange={function (e) { return setArizaForm(__assign(__assign({}, arizaForm), { projeId: e.target.value, blokId: '', daireId: '' })); }} required>
                      <option value="">Proje Seçin</option>
                      {projeler.map(function (proje) { return (<option key={proje.id} value={proje.id}>{proje.ad}</option>); })}
                    </select>
                  </div>
                  
                  {/* Konum Bilgileri - Blok */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="ariza-blok" className="text-right">
                      Blok <span className="text-red-500">*</span>
                    </label_1.Label>
                    <select id="ariza-blok" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={arizaForm.blokId} onChange={function (e) { return setArizaForm(__assign(__assign({}, arizaForm), { blokId: e.target.value, daireId: '' })); }} disabled={!arizaForm.projeId} required>
                      <option value="">Blok Seçin</option>
                      {secilenProjeninBloklari.map(function (blok) { return (<option key={blok.id} value={blok.id}>{blok.ad}</option>); })}
                    </select>
                  </div>
                  
                  {/* Konum Bilgileri - Daire */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="ariza-daire" className="text-right">
                      Daire <span className="text-red-500">*</span>
                    </label_1.Label>
                    <select id="ariza-daire" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={arizaForm.daireId} onChange={function (e) { return setArizaForm(__assign(__assign({}, arizaForm), { daireId: e.target.value })); }} disabled={!arizaForm.blokId} required>
                      <option value="">Daire Seçin</option>
                      {secilenBlokunDaireleri.map(function (daire) { return (<option key={daire.id} value={daire.id}>
                          {daire.numara} {daire.sahibi ? "- ".concat(daire.sahibi) : ''}
                        </option>); })}
                    </select>
                  </div>
                  
                  {/* Arıza Bilgileri */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="ariza-turu" className="text-right">
                      Arıza Türü <span className="text-red-500">*</span>
                    </label_1.Label>
                    <select id="ariza-turu" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={arizaForm.arizaTuruId} onChange={function (e) { return setArizaForm(__assign(__assign({}, arizaForm), { arizaTuruId: e.target.value })); }} required>
                      <option value="">Arıza Türü Seçin</option>
                      {arizaTipleri.map(function (tip) { return (<option key={tip.id} value={tip.id}>{tip.ad}</option>); })}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="ariza-aciklama" className="text-right">
                      Açıklama <span className="text-red-500">*</span>
                    </label_1.Label>
                    <textarea_1.Textarea id="ariza-aciklama" className="col-span-3" value={arizaForm.aciklama} onChange={function (e) { return setArizaForm(__assign(__assign({}, arizaForm), { aciklama: e.target.value })); }} required/>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="ariza-oncelik" className="text-right">
                      Öncelik
                    </label_1.Label>
                    <select id="ariza-oncelik" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={arizaForm.oncelik} onChange={function (e) { return setArizaForm(__assign(__assign({}, arizaForm), { oncelik: e.target.value })); }}>
                      <option value="Düşük">Düşük</option>
                      <option value="Normal">Normal</option>
                      <option value="Yüksek">Yüksek</option>
                      <option value="Acil">Acil</option>
                    </select>
                  </div>
                  
                  {/* Bildiren Kişi Bilgileri */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="ariza-bildiren" className="text-right">
                      Bildiren Kişi
                    </label_1.Label>
                    <input_1.Input id="ariza-bildiren" className="col-span-3" value={arizaForm.bildiren} onChange={function (e) { return setArizaForm(__assign(__assign({}, arizaForm), { bildiren: e.target.value })); }} placeholder="Arızayı bildiren kişinin adı soyadı"/>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="ariza-telefon" className="text-right">
                      Telefon
                    </label_1.Label>
                    <input_1.Input id="ariza-telefon" className="col-span-3" value={arizaForm.bildirenTelefon} onChange={function (e) { return setArizaForm(__assign(__assign({}, arizaForm), { bildirenTelefon: e.target.value })); }} placeholder="İletişim telefon numarası"/>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="ariza-not" className="text-right">
                      Ek Not
                    </label_1.Label>
                    <textarea_1.Textarea id="ariza-not" className="col-span-3" value={arizaForm.not} onChange={function (e) { return setArizaForm(__assign(__assign({}, arizaForm), { not: e.target.value })); }} placeholder="Arıza ile ilgili ek bilgiler..."/>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-auto">
                    <checkbox_1.Checkbox id="ariza-redirect" checked={redirectToAriza} onCheckedChange={function (checked) {
            return setRedirectToAriza(checked);
        }}/>
                    <label htmlFor="ariza-redirect" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      İşlem sonrası arıza sayfasına yönlendir
                    </label>
                  </div>
                </div>
                <dialog_1.DialogFooter>
                  <button_1.Button type="submit">Kaydet</button_1.Button>
                </dialog_1.DialogFooter>
              </form>
            </dialog_1.DialogContent>
          </dialog_1.Dialog>
          
          {/* Tekniker Ekle */}
          <dialog_1.Dialog open={teknikerDialogOpen} onOpenChange={setTeknikerDialogOpen}>
            <dialog_1.DialogTrigger asChild>
              <button_1.Button variant="outline" className="w-full justify-start">
                <lucide_react_1.User className="h-4 w-4 mr-2"/>
                <lucide_react_1.Plus className="h-3 w-3 mr-1"/>
                Tekniker Ekle
              </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[425px]">
              <dialog_1.DialogHeader>
                <dialog_1.DialogTitle>Yeni Tekniker Ekle</dialog_1.DialogTitle>
                <dialog_1.DialogDescription>
                  Yeni bir tekniker eklemek için gerekli bilgileri girin.
                </dialog_1.DialogDescription>
              </dialog_1.DialogHeader>
              <form onSubmit={handleTeknikerSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="tekniker-adsoyad" className="text-right">
                      Ad Soyad
                    </label_1.Label>
                    <input_1.Input id="tekniker-adsoyad" className="col-span-3" value={teknikerForm.adsoyad} onChange={function (e) { return setTeknikerForm(__assign(__assign({}, teknikerForm), { adsoyad: e.target.value })); }} required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label_1.Label htmlFor="tekniker-telefon" className="text-right">
                      Telefon
                    </label_1.Label>
                    <input_1.Input id="tekniker-telefon" className="col-span-3" value={teknikerForm.telefon} onChange={function (e) { return setTeknikerForm(__assign(__assign({}, teknikerForm), { telefon: e.target.value })); }} required/>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <checkbox_1.Checkbox id="tekniker-redirect" checked={redirectToTekniker} onCheckedChange={function (checked) {
            return setRedirectToTekniker(checked);
        }}/>
                    <label htmlFor="tekniker-redirect" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      İşlem sonrası tekniker sayfasına yönlendir
                    </label>
                  </div>
                </div>
                <dialog_1.DialogFooter>
                  <button_1.Button type="submit">Kaydet</button_1.Button>
                </dialog_1.DialogFooter>
              </form>
            </dialog_1.DialogContent>
          </dialog_1.Dialog>
          
          <hr className="my-2"/>
          
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <h4 className="font-medium flex items-center text-amber-800">
              <lucide_react_1.AlertCircle className="h-4 w-4 mr-2"/>
              Bugünkü Görevler
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              {bugunRandevular > 0 ?
            "".concat(bugunRandevular, " randevu planlanm\u0131\u015F durumda. Takvimi kontrol etmeyi unutmay\u0131n.") :
            'Bugün için planlanmış randevu bulunmuyor.'}
            </p>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </>);
}
