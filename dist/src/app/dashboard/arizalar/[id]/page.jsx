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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArizaDetayPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_2 = require("next-auth/react");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var use_toast_1 = require("@/hooks/use-toast");
var lucide_react_1 = require("lucide-react");
var link_1 = __importDefault(require("next/link"));
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var tabs_1 = require("@/components/ui/tabs");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
function ArizaDetayPage(_a) {
    var _this = this;
    var _b, _c;
    var params = _a.params;
    var session = (0, react_2.useSession)().data;
    var router = (0, navigation_1.useRouter)();
    var toast = (0, use_toast_1.useToast)().toast;
    var _d = (0, react_1.useState)(null), ariza = _d[0], setAriza = _d[1];
    var _e = (0, react_1.useState)([]), randevular = _e[0], setRandevular = _e[1];
    var _f = (0, react_1.useState)(true), isLoading = _f[0], setIsLoading = _f[1];
    // Randevu form state
    var _g = (0, react_1.useState)(false), isRandevuModalOpen = _g[0], setIsRandevuModalOpen = _g[1];
    var _h = (0, react_1.useState)(""), randevuTarih = _h[0], setRandevuTarih = _h[1];
    var _j = (0, react_1.useState)(""), randevuSaat = _j[0], setRandevuSaat = _j[1];
    var _k = (0, react_1.useState)([]), randevuTeknikerIds = _k[0], setRandevuTeknikerIds = _k[1];
    var _l = (0, react_1.useState)(""), randevuNotlar = _l[0], setRandevuNotlar = _l[1];
    // Çözüm form state
    var _m = (0, react_1.useState)(false), isCozumModalOpen = _m[0], setIsCozumModalOpen = _m[1];
    var _o = (0, react_1.useState)(""), seciliRandevuId = _o[0], setSeciliRandevuId = _o[1];
    var _p = (0, react_1.useState)(""), cozumSonuc = _p[0], setCozumSonuc = _p[1];
    var _q = (0, react_1.useState)("Tamamlandı"), cozumDurum = _q[0], setCozumDurum = _q[1];
    var _r = (0, react_1.useState)([]), kullanılanMalzemeler = _r[0], setKullanılanMalzemeler = _r[1];
    // Tekniker ve malzemeler
    var _s = (0, react_1.useState)([]), teknikerler = _s[0], setTeknikerler = _s[1];
    var _t = (0, react_1.useState)([]), malzemeler = _t[0], setMalzemeler = _t[1];
    // Arıza ve randevu verilerini getir
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var arizaResponse, arizaData, randevularResponse, randevularData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, 7, 8]);
                        if (!session)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch("/api/arizalar/".concat(params.id))];
                    case 1:
                        arizaResponse = _a.sent();
                        if (!arizaResponse.ok) {
                            if (arizaResponse.status === 404) {
                                router.push("/dashboard");
                                return [2 /*return*/];
                            }
                            throw new Error("Arıza detayları getirilemedi");
                        }
                        return [4 /*yield*/, arizaResponse.json()];
                    case 2:
                        arizaData = _a.sent();
                        setAriza(arizaData);
                        return [4 /*yield*/, fetch("/api/randevular?arizaId=".concat(params.id))];
                    case 3:
                        randevularResponse = _a.sent();
                        if (!randevularResponse.ok) return [3 /*break*/, 5];
                        return [4 /*yield*/, randevularResponse.json()];
                    case 4:
                        randevularData = _a.sent();
                        setRandevular(randevularData);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_1 = _a.sent();
                        console.error("Hata:", error_1);
                        toast({
                            title: "Hata",
                            description: "Veriler yüklenirken bir hata oluştu",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [session, params.id, router, toast]);
    // Tekniker ve malzemeleri getir
    (0, react_1.useEffect)(function () {
        var fetchTeknikerVeMalzemeler = function () { return __awaiter(_this, void 0, void 0, function () {
            var teknikerlerResponse, teknikerlerData, malzemelerResponse, malzemelerData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!session)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch('/api/teknikerler')];
                    case 1:
                        teknikerlerResponse = _a.sent();
                        if (!teknikerlerResponse.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, teknikerlerResponse.json()];
                    case 2:
                        teknikerlerData = _a.sent();
                        setTeknikerler(teknikerlerData);
                        _a.label = 3;
                    case 3: return [4 /*yield*/, fetch('/api/malzemeler')];
                    case 4:
                        malzemelerResponse = _a.sent();
                        if (!malzemelerResponse.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, malzemelerResponse.json()];
                    case 5:
                        malzemelerData = _a.sent();
                        setMalzemeler(malzemelerData);
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        console.error("Hata:", error_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        fetchTeknikerVeMalzemeler();
    }, [session]);
    // Arızayı iptal et
    var handleIptalEt = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ariza)
                        return [2 /*return*/];
                    if (!confirm("Bu arıza kaydını iptal etmek istediğinizden emin misiniz?")) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/arizalar/".concat(ariza.id), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.error || "Arıza silinirken bir hata oluştu");
                case 4:
                    toast({
                        title: "Başarılı",
                        description: "Arıza kaydı iptal edildi",
                    });
                    // Daireye geri dön
                    if (ariza.daire) {
                        router.push("/dashboard/projeler/".concat(ariza.daire.blok.proje.id, "/bloklar/").concat(ariza.daire.blok.id, "/daireler/").concat(ariza.daire.id));
                    }
                    else {
                        router.push("/dashboard");
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("Hata:", error_3);
                    toast({
                        title: "Hata",
                        description: error_3.message || "Arıza iptal edilirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Randevu durumunu güncelle
    var updateRandevuDurum = function (randevuId, yeniDurum, sonuc) { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, arizaResponse, arizaData, randevularResponse, randevularData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    return [4 /*yield*/, fetch("/api/randevular/".concat(randevuId), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                durum: yeniDurum,
                                sonuc: sonuc
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    errorData = _a.sent();
                    throw new Error(errorData.error || "Randevu güncellenirken bir hata oluştu");
                case 3: return [4 /*yield*/, fetch("/api/arizalar/".concat(params.id))];
                case 4:
                    arizaResponse = _a.sent();
                    if (!arizaResponse.ok) return [3 /*break*/, 6];
                    return [4 /*yield*/, arizaResponse.json()];
                case 5:
                    arizaData = _a.sent();
                    setAriza(arizaData);
                    _a.label = 6;
                case 6: return [4 /*yield*/, fetch("/api/randevular?arizaId=".concat(params.id))];
                case 7:
                    randevularResponse = _a.sent();
                    if (!randevularResponse.ok) return [3 /*break*/, 9];
                    return [4 /*yield*/, randevularResponse.json()];
                case 8:
                    randevularData = _a.sent();
                    setRandevular(randevularData);
                    _a.label = 9;
                case 9:
                    toast({
                        title: "Başarılı",
                        description: "Randevu durumu güncellendi",
                    });
                    return [3 /*break*/, 11];
                case 10:
                    error_4 = _a.sent();
                    console.error("Hata:", error_4);
                    toast({
                        title: "Hata",
                        description: error_4.message || "Randevu güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    // Randevuyu iptal et
    var cancelRandevu = function (randevuId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            updateRandevuDurum(randevuId, "İptal Edildi");
            return [2 /*return*/];
        });
    }); };
    // Randevuyu tamamla
    // const completeRandevu = async (randevuId: string) => {
    //   updateRandevuDurum(randevuId, "Tamamlandı");
    // };
    // Kısmi çözüm işaretle
    var markPartialSolution = function (randevuId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            updateRandevuDurum(randevuId, "Kısmı Çözüm");
            return [2 /*return*/];
        });
    }); };
    // Çözüm ekle (randevu tamamla)
    var handleCozumEkle = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, arizaResponse, arizaData, randevularResponse, randevularData, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!seciliRandevuId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, , 12]);
                    return [4 /*yield*/, fetch("/api/randevular/".concat(seciliRandevuId), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                durum: cozumDurum,
                                sonuc: cozumSonuc,
                                malzemeler: kullanılanMalzemeler.length > 0 ? kullanılanMalzemeler : undefined
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.message || "Randevu güncellenirken bir hata oluştu");
                case 4: return [4 /*yield*/, fetch("/api/arizalar/".concat(params.id))];
                case 5:
                    arizaResponse = _a.sent();
                    if (!arizaResponse.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, arizaResponse.json()];
                case 6:
                    arizaData = _a.sent();
                    setAriza(arizaData);
                    _a.label = 7;
                case 7: return [4 /*yield*/, fetch("/api/randevular?arizaId=".concat(params.id))];
                case 8:
                    randevularResponse = _a.sent();
                    if (!randevularResponse.ok) return [3 /*break*/, 10];
                    return [4 /*yield*/, randevularResponse.json()];
                case 9:
                    randevularData = _a.sent();
                    setRandevular(randevularData);
                    _a.label = 10;
                case 10:
                    // Formu temizle ve modalı kapat
                    resetCozumForm();
                    setIsCozumModalOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Çözüm bilgileri kaydedildi",
                    });
                    return [3 /*break*/, 12];
                case 11:
                    error_5 = _a.sent();
                    console.error("Hata:", error_5);
                    toast({
                        title: "Hata",
                        description: error_5.message || "Çözüm eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); };
    // Randevu tamamlama formunu aç
    var openCozumModal = function (randevuId) {
        setSeciliRandevuId(randevuId);
        setIsCozumModalOpen(true);
    };
    // Durum badge rengi
    var getDurumBadgeVariant = function (durum) {
        switch (durum) {
            case "Talep Alındı": return "secondary";
            case "Atandı":
            case "Randevu Planlandı": return "default";
            case "Çözüm": return "success";
            case "Kısmı Çözüm": return "warning";
            case "İptal Edildi": return "destructive";
            default: return "default";
        }
    };
    // Öncelik badge rengi
    var getOncelikBadgeVariant = function (oncelik) {
        switch (oncelik) {
            case "Yüksek": return "destructive";
            case "Orta": return "warning";
            case "Düşük": return "secondary";
            default: return "secondary";
        }
    };
    // Randevu durum badge rengi
    var getRandevuDurumBadgeVariant = function (durum) {
        switch (durum) {
            case "Planlandı": return "secondary";
            case "Tamamlandı": return "success";
            case "Kısmı Çözüm": return "warning";
            case "İptal Edildi": return "destructive";
            default: return "secondary";
        }
    };
    // Formu sıfırla
    var resetRandevuForm = function () {
        setRandevuTarih("");
        setRandevuSaat("");
        setRandevuTeknikerIds([]);
        setRandevuNotlar("");
    };
    // Çözüm formunu sıfırla
    var resetCozumForm = function () {
        setSeciliRandevuId("");
        setCozumSonuc("");
        setCozumDurum("Tamamlandı");
        setKullanılanMalzemeler([]);
    };
    // Yeni malzeme ekle
    var addMalzeme = function () {
        if (kullanılanMalzemeler.length < malzemeler.length) {
            setKullanılanMalzemeler(__spreadArray(__spreadArray([], kullanılanMalzemeler, true), [
                { malzemeId: "", miktar: 1, birim: null, fiyat: 0 }
            ], false));
        }
    };
    // Malzeme kaldır
    var removeMalzeme = function (index) {
        var yeniMalzemeler = __spreadArray([], kullanılanMalzemeler, true);
        yeniMalzemeler.splice(index, 1);
        setKullanılanMalzemeler(yeniMalzemeler);
    };
    // Malzeme güncelle
    var updateMalzeme = function (index, field, value) {
        var yeniMalzemeler = __spreadArray([], kullanılanMalzemeler, true);
        if (field === "malzemeId") {
            yeniMalzemeler[index].malzemeId = value;
            // Seçilen malzemenin birimini otomatik olarak ayarla
            var seciliMalzeme = malzemeler.find(function (m) { return m.id === value; });
            if (seciliMalzeme && seciliMalzeme.birim) {
                yeniMalzemeler[index].birim = seciliMalzeme.birim;
            }
        }
        else if (field === "miktar") {
            yeniMalzemeler[index].miktar = parseFloat(value);
        }
        else if (field === "birim") {
            yeniMalzemeler[index].birim = value;
        }
        else if (field === "fiyat") {
            yeniMalzemeler[index].fiyat = parseFloat(value);
        }
        setKullanılanMalzemeler(yeniMalzemeler);
    };
    // Randevu oluştur
    var handleAddRandevu = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var tarihSaat, response, errorData, arizaResponse, arizaData, randevularResponse, randevularData, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!ariza)
                        return [2 /*return*/];
                    if (!randevuTarih || !randevuSaat) {
                        toast({
                            title: "Hata",
                            description: "Tarih ve saat seçimi zorunludur",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, , 12]);
                    tarihSaat = "".concat(randevuTarih, "T").concat(randevuSaat, ":00");
                    return [4 /*yield*/, fetch("/api/randevular", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                arizaId: ariza.id,
                                tarih: tarihSaat,
                                teknikerIds: randevuTeknikerIds,
                                notlar: randevuNotlar,
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.error || "Randevu eklenirken bir hata oluştu");
                case 4: return [4 /*yield*/, fetch("/api/arizalar/".concat(params.id))];
                case 5:
                    arizaResponse = _a.sent();
                    if (!arizaResponse.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, arizaResponse.json()];
                case 6:
                    arizaData = _a.sent();
                    setAriza(arizaData);
                    _a.label = 7;
                case 7: return [4 /*yield*/, fetch("/api/randevular?arizaId=".concat(params.id))];
                case 8:
                    randevularResponse = _a.sent();
                    if (!randevularResponse.ok) return [3 /*break*/, 10];
                    return [4 /*yield*/, randevularResponse.json()];
                case 9:
                    randevularData = _a.sent();
                    setRandevular(randevularData);
                    _a.label = 10;
                case 10:
                    // Formu temizle ve modalı kapat
                    resetRandevuForm();
                    setIsRandevuModalOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Randevu başarıyla oluşturuldu",
                    });
                    return [3 /*break*/, 12];
                case 11:
                    error_6 = _a.sent();
                    console.error("Hata:", error_6);
                    toast({
                        title: "Hata",
                        description: error_6.message || "Randevu eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); };
    if (isLoading) {
        return (<div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>);
    }
    if (!ariza) {
        return (<div className="flex flex-col items-center justify-center h-full">
        <lucide_react_1.AlertTriangle className="h-12 w-12 text-amber-500 mb-4"/>
        <h2 className="text-2xl font-bold mb-2">Arıza bulunamadı</h2>
        <p className="text-muted-foreground mb-4">
          Aradığınız arıza kaydı bulunamadı veya erişim yetkiniz yok.
        </p>
        <button_1.Button asChild>
          <link_1.default href="/dashboard">
            <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
            Dashboard'a Dön
          </link_1.default>
        </button_1.Button>
      </div>);
    }
    return (<div className="container mx-auto py-4">
      {/* Üst Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button_1.Button variant="outline" size="icon" asChild>
            <link_1.default href={"/dashboard/projeler/".concat(ariza.daire.blok.proje.id, "/bloklar/").concat(ariza.daire.blok.id, "/daireler/").concat(ariza.daire.id)}>
              <lucide_react_1.ArrowLeft className="h-4 w-4"/>
            </link_1.default>
          </button_1.Button>
          <h1 className="text-2xl font-bold">Arıza Detayı</h1>
        </div>
        <div className="flex gap-2">
          <button_1.Button variant="outline" onClick={function () { return setIsRandevuModalOpen(true); }} className="flex items-center">
            <lucide_react_1.CalendarDays className="h-4 w-4 mr-2"/>
            Randevu Oluştur
          </button_1.Button>
          <badge_1.Badge variant={getDurumBadgeVariant(ariza.durum)}>{ariza.durum}</badge_1.Badge>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sol Kolon - Arıza Bilgileri */}
        <div className="md:col-span-2">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Arıza Bilgileri</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Açıklama</h3>
                <p className="text-base">{ariza.aciklama}</p>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <div className="flex items-center text-sm">
                    <lucide_react_1.MapPin className="h-4 w-4 mr-2 text-muted-foreground"/>
                    <h3 className="font-medium text-muted-foreground">Konum</h3>
                  </div>
                  <p className="mt-1 ml-6">
                    {ariza.daire.blok.proje.ad}, {ariza.daire.blok.ad}, Daire {ariza.daire.numara}
                    {ariza.daire.kat && ", Kat ".concat(ariza.daire.kat)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center text-sm">
                    <lucide_react_1.Calendar className="h-4 w-4 mr-2 text-muted-foreground"/>
                    <h3 className="font-medium text-muted-foreground">Bildirim Tarihi</h3>
                  </div>
                  <p className="mt-1 ml-6">
                    {(0, date_fns_1.format)(new Date(ariza.createdAt), "dd.MM.yyyy HH:mm", { locale: locale_1.tr })}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {ariza.bildirenKisi && (<div>
                    <div className="flex items-center text-sm">
                      <lucide_react_1.User className="h-4 w-4 mr-2 text-muted-foreground"/>
                      <h3 className="font-medium text-muted-foreground">Bildiren Kişi</h3>
                    </div>
                    <p className="mt-1 ml-6">{ariza.bildirenKisi}</p>
                  </div>)}
                
                {ariza.telefon && (<div>
                    <div className="flex items-center text-sm">
                      <lucide_react_1.Phone className="h-4 w-4 mr-2 text-muted-foreground"/>
                      <h3 className="font-medium text-muted-foreground">Telefon</h3>
                    </div>
                    <p className="mt-1 ml-6">{ariza.telefon}</p>
                  </div>)}
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Arıza Tipi</h3>
                  <p>{((_b = ariza.arizaTipi) === null || _b === void 0 ? void 0 : _b.ad) || "-"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Öncelik</h3>
                  <badge_1.Badge variant={getOncelikBadgeVariant(ariza.oncelik)}>{ariza.oncelik}</badge_1.Badge>
                </div>
              </div>
              
              {ariza.ekbilgi && (<div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Ek Bilgi</h3>
                  <p className="text-sm">{ariza.ekbilgi}</p>
                </div>)}
              
              <div className="pt-4 border-t">
                <button_1.Button variant="destructive" onClick={handleIptalEt}>
                  <lucide_react_1.XCircle className="h-4 w-4 mr-2"/>
                  İptal Et
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>
        
        {/* Sağ Kolon - Durum Bilgileri */}
        <div>
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Durum</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Mevcut Durum</h3>
                <badge_1.Badge variant={getDurumBadgeVariant(ariza.durum)}>{ariza.durum}</badge_1.Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Arıza Tipi</h3>
                <p>{((_c = ariza.arizaTipi) === null || _c === void 0 ? void 0 : _c.ad) || "-"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Öncelik</h3>
                <badge_1.Badge variant={getOncelikBadgeVariant(ariza.oncelik)}>{ariza.oncelik}</badge_1.Badge>
              </div>
            </card_1.CardContent>
          </card_1.Card>
          
          <card_1.Card className="mt-4">
            <card_1.CardHeader>
              <card_1.CardTitle>İletişim</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              {ariza.bildirenKisi && (<div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Bildiren Kişi</h3>
                  <p>{ariza.bildirenKisi}</p>
                </div>)}
              
              {ariza.telefon && (<div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Telefon</h3>
                  <p>{ariza.telefon}</p>
                </div>)}
              
              <div className="pt-2">
                <button_1.Button variant="outline" className="w-full">
                  <lucide_react_1.Phone className="h-4 w-4 mr-2"/>
                  Ara
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>
      
      {/* Randevular Bölümü */}
      <div className="mt-6">
        <tabs_1.Tabs defaultValue="randevular">
          <tabs_1.TabsList>
            <tabs_1.TabsTrigger value="randevular">Randevular</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="zaman-cizelgesi">Zaman Çizelgesi</tabs_1.TabsTrigger>
          </tabs_1.TabsList>
          
          <tabs_1.TabsContent value="randevular" className="mt-4">
            {randevular.length > 0 ? (<div className="space-y-4">
                {randevular.map(function (randevu) {
                var _a, _b;
                return (<card_1.Card key={randevu.id}>
                    <card_1.CardContent className="p-4">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <badge_1.Badge variant={getRandevuDurumBadgeVariant(randevu.durum)}>
                            {randevu.durum}
                          </badge_1.Badge>
                          <span className="text-base font-medium">
                            {(0, date_fns_1.format)(new Date(randevu.tarih), "dd.MM.yyyy HH:mm", { locale: locale_1.tr })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {randevu.durum === "Planlandı" && (<>
                              <button_1.Button variant="outline" size="sm">
                                <lucide_react_1.PencilLine className="h-4 w-4 mr-1"/>
                                Yeniden Planla
                              </button_1.Button>
                              <button_1.Button variant="destructive" size="sm" onClick={function () { return cancelRandevu(randevu.id); }}>
                                <lucide_react_1.XCircle className="h-4 w-4 mr-1"/>
                                İptal Et
                              </button_1.Button>
                              <button_1.Button variant="default" size="sm" onClick={function () { return openCozumModal(randevu.id); }}>
                                <lucide_react_1.CheckCircle className="h-4 w-4 mr-1"/>
                                Çözüm Ekle
                              </button_1.Button>
                            </>)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {/* Tekniker Bilgileri */}
                        <div>
                          <h4 className="text-sm font-medium mb-1">Tekniker</h4>
                          {randevu.tekniker || (((_a = randevu.teknikerler) === null || _a === void 0 ? void 0 : _a.length) > 0) ? (<div>
                              {randevu.tekniker && (<div className="flex items-center space-x-2">
                                  <lucide_react_1.User className="h-4 w-4 text-slate-500"/>
                                  <span>{randevu.tekniker.adsoyad}</span>
                                </div>)}
                              
                              {((_b = randevu.teknikerler) === null || _b === void 0 ? void 0 : _b.length) > 0 && (<div className="space-y-1 mt-1">
                                  {randevu.teknikerler.map(function (teknikerBaglanti) { return (<div key={teknikerBaglanti.id} className="flex items-center space-x-2">
                                      <lucide_react_1.User className="h-4 w-4 text-slate-500"/>
                                      <span>{teknikerBaglanti.tekniker.adsoyad}</span>
                                    </div>); })}
                                </div>)}
                            </div>) : (<div className="text-sm text-muted-foreground">Tekniker atanmadı</div>)}
                        </div>
                        
                        {/* Randevu Notları */}
                        {randevu.notlar && (<div className="md:col-span-2">
                            <h4 className="text-sm font-medium mb-1">Randevu Notları</h4>
                            <p className="text-sm">{randevu.notlar}</p>
                          </div>)}
                        
                        {/* Sonuc */}
                        {randevu.sonuc && randevu.durum !== "Planlandı" && (<div className="md:col-span-2 mt-3 pt-3 border-t">
                            <span className="text-sm font-medium">Sonuç:</span>
                            <p className="text-sm mt-1">{randevu.sonuc}</p>
                          </div>)}
                        
                        {/* Kullanılan Malzemeler */}
                        {randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0 && (<div className="md:col-span-2 mt-3 pt-3 border-t">
                            <span className="text-sm font-medium">Kullanılan Malzemeler:</span>
                            <div className="mt-2 border rounded-md overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                  <locale_1.tr>
                                    <th className="px-3 py-2 text-left font-medium">Malzeme</th>
                                    <th className="px-3 py-2 text-right font-medium">Miktar</th>
                                    <th className="px-3 py-2 text-right font-medium">Birim Fiyat</th>
                                    <th className="px-3 py-2 text-right font-medium">Tutar</th>
                                  </locale_1.tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {randevu.kullanilanMalzemeler.map(function (item) { return (<locale_1.tr key={item.id} className="hover:bg-slate-50">
                                      <td className="px-3 py-2">{item.malzeme.ad}</td>
                                      <td className="px-3 py-2 text-right">{item.miktar} {item.birim || "adet"}</td>
                                      <td className="px-3 py-2 text-right">
                                        {new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                                minimumFractionDigits: 2
                            }).format(item.fiyat || 0)}
                                      </td>
                                      <td className="px-3 py-2 text-right font-medium">
                                        {new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                                minimumFractionDigits: 2
                            }).format((item.miktar * (item.fiyat || 0)))}
                                      </td>
                                    </locale_1.tr>); })}
                                </tbody>
                                <tfoot className="bg-slate-50 font-medium">
                                  <locale_1.tr>
                                    <td colSpan={3} className="px-3 py-2 text-right">Toplam:</td>
                                    <td className="px-3 py-2 text-right">
                                      {new Intl.NumberFormat('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                            minimumFractionDigits: 2
                        }).format(randevu.kullanilanMalzemeler.reduce(function (toplam, item) {
                            return toplam + (item.miktar * (item.fiyat || 0));
                        }, 0))}
                                    </td>
                                  </locale_1.tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>)}
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>);
            })}
              </div>) : (<div className="text-center py-12 bg-slate-50 rounded-lg border">
                <lucide_react_1.Clock className="h-12 w-12 mx-auto text-slate-400 mb-4"/>
                <h3 className="text-lg font-medium mb-2">Henüz randevu planlanmadı</h3>
                <p className="text-sm text-muted-foreground mb-4">Bu arıza için henüz bir randevu oluşturulmadı</p>
                <button_1.Button onClick={function () { return setIsRandevuModalOpen(true); }}>
                  <lucide_react_1.Calendar className="h-4 w-4 mr-2"/>
                  Randevu Oluştur
                </button_1.Button>
              </div>)}
          </tabs_1.TabsContent>
          
          <tabs_1.TabsContent value="zaman-cizelgesi" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Zaman Çizelgesi</h3>
                <button_1.Button variant="outline" size="sm" onClick={function () { return setIsRandevuModalOpen(true); }}>
                  <lucide_react_1.CalendarDays className="h-4 w-4 mr-1"/>
                  Randevu Oluştur
                </button_1.Button>
              </div>
              
              <div className="relative pl-6 pb-6 border-l-2 border-slate-200">
                <div className="absolute top-0 left-[-8px] w-4 h-4 bg-primary rounded-full"></div>
                <div className="ml-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {(0, date_fns_1.format)(new Date(ariza.createdAt), "dd.MM.yyyy HH:mm", { locale: locale_1.tr })}
                  </div>
                  <div className="font-medium">Arıza Kaydı Oluşturuldu</div>
                  <div className="text-sm mt-1">
                    {ariza.bildirenKisi ? "".concat(ariza.bildirenKisi, " taraf\u0131ndan bildirildi") : "Arıza kaydı oluşturuldu"}
                  </div>
                </div>
              </div>
              
              {randevular.length > 0 ? (randevular.map(function (randevu, index) { return (<div key={randevu.id} className="relative pl-6 pb-6 border-l-2 border-slate-200">
                    <div className="absolute top-0 left-[-8px] w-4 h-4 bg-slate-400 rounded-full"></div>
                    <div className="ml-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        {(0, date_fns_1.format)(new Date(randevu.createdAt), "dd.MM.yyyy HH:mm", { locale: locale_1.tr })}
                      </div>
                      <div className="font-medium">Randevu Oluşturuldu</div>
                      <div className="text-sm mt-1">
                        {(0, date_fns_1.format)(new Date(randevu.tarih), "dd.MM.yyyy HH:mm", { locale: locale_1.tr })} için
                        {randevu.tekniker ? " ".concat(randevu.tekniker.adsoyad, " ") : " "}
                        tarafından planlandı
                      </div>
                    </div>
                  </div>); })) : (<div className="text-center py-6 bg-slate-50 rounded-lg border mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Bu arıza için henüz randevu planlanmamış</p>
                  <button_1.Button size="sm" onClick={function () { return setIsRandevuModalOpen(true); }}>
                    <lucide_react_1.Calendar className="h-4 w-4 mr-2"/>
                    Randevu Planla
                  </button_1.Button>
                </div>)}
            </div>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </div>
      
      {/* Randevu Ekleme Modal */}
      <dialog_1.Dialog open={isRandevuModalOpen} onOpenChange={setIsRandevuModalOpen}>
        <dialog_1.DialogContent className="sm:max-w-[525px]">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Yeni Randevu Oluştur</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Arıza için yeni bir randevu oluşturun.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleAddRandevu}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="randevu-tarih">Randevu Tarihi</label_1.Label>
                  <input_1.Input id="randevu-tarih" type="date" value={randevuTarih} onChange={function (e) { return setRandevuTarih(e.target.value); }} className="mt-1" required/>
                </div>
                <div>
                  <label_1.Label htmlFor="randevu-saat">Randevu Saati</label_1.Label>
                  <input_1.Input id="randevu-saat" type="time" value={randevuSaat} onChange={function (e) { return setRandevuSaat(e.target.value); }} className="mt-1" required/>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label_1.Label htmlFor="randevu-tekniker">Tekniker(ler)</label_1.Label>
                  {randevuTeknikerIds.length > 0 && (<div className="text-xs text-muted-foreground">
                      {randevuTeknikerIds.length} tekniker seçildi
                    </div>)}
                </div>
                
                <div className="mt-1 max-h-[200px] overflow-y-auto border rounded-md p-2">
                  {teknikerler.length > 0 ? (<div className="space-y-2">
                      {teknikerler.map(function (tekniker) { return (<div key={tekniker.id} className="flex items-center p-1 hover:bg-slate-50 rounded">
                          <input type="checkbox" id={"tekniker-".concat(tekniker.id)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2" checked={randevuTeknikerIds.includes(tekniker.id)} onChange={function (e) {
                    if (e.target.checked) {
                        setRandevuTeknikerIds(__spreadArray(__spreadArray([], randevuTeknikerIds, true), [tekniker.id], false));
                    }
                    else {
                        setRandevuTeknikerIds(randevuTeknikerIds.filter(function (id) { return id !== tekniker.id; }));
                    }
                }}/>
                          <label htmlFor={"tekniker-".concat(tekniker.id)} className="flex-1 text-sm cursor-pointer">
                            {tekniker.adsoyad} 
                            {tekniker.uzmanlikAlanlari && tekniker.uzmanlikAlanlari.length > 0 && (<span className="text-xs text-muted-foreground ml-1">
                                ({tekniker.uzmanlikAlanlari.map(function (u) { return u.ad; }).join(", ")})
                              </span>)}
                          </label>
                        </div>); })}
                    </div>) : (<div className="text-center py-2 text-sm text-muted-foreground">
                      Tekniker bulunamadı
                    </div>)}
                </div>
                
                {randevuTeknikerIds.length > 0 && (<div className="mt-2 flex flex-wrap gap-1">
                    {randevuTeknikerIds.map(function (id) {
                var tekniker = teknikerler.find(function (t) { return t.id === id; });
                return tekniker ? (<div key={id} className="inline-flex items-center bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                          {tekniker.adsoyad}
                          <button type="button" className="ml-1 hover:text-destructive" onClick={function () { return setRandevuTeknikerIds(randevuTeknikerIds.filter(function (tId) { return tId !== id; })); }}>
                            <lucide_react_1.XCircle className="h-3 w-3"/>
                          </button>
                        </div>) : null;
            })}
                  </div>)}
              </div>
              
              <div>
                <label_1.Label htmlFor="randevu-notlar">Randevu Notları</label_1.Label>
                <textarea_1.Textarea id="randevu-notlar" value={randevuNotlar} onChange={function (e) { return setRandevuNotlar(e.target.value); }} className="mt-1" rows={3}/>
              </div>
            </div>
            
            <dialog_1.DialogFooter>
              <button_1.Button type="button" variant="outline" onClick={function () { return setIsRandevuModalOpen(false); }}>
                İptal
              </button_1.Button>
              <button_1.Button type="submit">Kaydet</button_1.Button>
            </dialog_1.DialogFooter>
          </form>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
      
      {/* Çözüm Ekleme Modal */}
      <dialog_1.Dialog open={isCozumModalOpen} onOpenChange={setIsCozumModalOpen}>
        <dialog_1.DialogContent className="sm:max-w-[525px]">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Çözüm Ekle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Randevu sonucunu ve kullanılan malzemeleri ekleyin.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleCozumEkle}>
            <div className="grid gap-4 py-4">
              <div>
                <label_1.Label htmlFor="cozum-durum">Sonuç Durumu</label_1.Label>
                <select_1.Select value={cozumDurum} onValueChange={setCozumDurum}>
                  <select_1.SelectTrigger id="cozum-durum" className="mt-1">
                    <select_1.SelectValue placeholder="Durum seçin"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Tamamlandı">Tamamlandı</select_1.SelectItem>
                    <select_1.SelectItem value="Kısmı Çözüm">Kısmı Çözüm</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              
              <div>
                <label_1.Label htmlFor="cozum-sonuc">Çözüm Açıklaması</label_1.Label>
                <textarea_1.Textarea id="cozum-sonuc" value={cozumSonuc} onChange={function (e) { return setCozumSonuc(e.target.value); }} className="mt-1" rows={3} placeholder="Yapılan işlemler ve çözüm detayları..." required/>
              </div>
              
              {/* Malzeme Seçimi */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label_1.Label>Kullanılan Malzemeler</label_1.Label>
                  <button_1.Button type="button" variant="outline" size="sm" onClick={addMalzeme} disabled={kullanılanMalzemeler.length >= malzemeler.length} className="h-8">
                    <lucide_react_1.Plus className="h-4 w-4 mr-1"/>
                    Malzeme Ekle
                  </button_1.Button>
                </div>
                
                {kullanılanMalzemeler.length > 0 ? (<div className="space-y-2 mt-2">
                    {kullanılanMalzemeler.map(function (item, index) { return (<div key={index} className="flex flex-wrap items-center gap-2 p-2 border rounded-md">
                        <div className="flex-1 min-w-[200px]">
                          <select_1.Select value={item.malzemeId} onValueChange={function (value) { return updateMalzeme(index, "malzemeId", value); }}>
                            <select_1.SelectTrigger className="h-8">
                              <select_1.SelectValue placeholder="Malzeme seçin"/>
                            </select_1.SelectTrigger>
                            <select_1.SelectContent>
                              {malzemeler.map(function (malzeme) { return (<select_1.SelectItem key={malzeme.id} value={malzeme.id}>
                                  {malzeme.ad}
                                </select_1.SelectItem>); })}
                            </select_1.SelectContent>
                          </select_1.Select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-1">Miktar:</span>
                            <input_1.Input type="number" min="0.01" step="0.01" value={item.miktar.toString()} onChange={function (e) { return updateMalzeme(index, "miktar", e.target.value); }} className="w-[80px] h-8"/>
                            
                            <span className="px-2">{item.birim || "adet"}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-1">Birim Fiyat (₺):</span>
                            <input_1.Input type="number" min="0" step="0.01" value={item.fiyat.toString()} onChange={function (e) { return updateMalzeme(index, "fiyat", e.target.value); }} className="w-[100px] h-8"/>
                          </div>
                          
                          <button_1.Button type="button" variant="ghost" size="icon" onClick={function () { return removeMalzeme(index); }} className="h-8 w-8 ml-2">
                            <lucide_react_1.Trash2 className="h-4 w-4 text-red-500"/>
                          </button_1.Button>
                        </div>
                      </div>); })}
                  </div>) : (<div className="text-center py-2 text-sm text-muted-foreground">
                    Henüz malzeme eklenmedi
                  </div>)}
                
                {/* Toplam Tutar Özeti */}
                {kullanılanMalzemeler.length > 0 && (<div className="mt-3 border-t pt-3 flex justify-between items-center">
                    <span className="font-medium">Toplam Tutar:</span>
                    <span className="font-bold text-lg">
                      {new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(kullanılanMalzemeler.reduce(function (toplam, item) {
                return toplam + (item.miktar * item.fiyat);
            }, 0))}
                    </span>
                  </div>)}
              </div>
            </div>
            
            <dialog_1.DialogFooter>
              <button_1.Button type="button" variant="outline" onClick={function () { return setIsCozumModalOpen(false); }}>
                İptal
              </button_1.Button>
              <button_1.Button type="submit">Kaydet</button_1.Button>
            </dialog_1.DialogFooter>
          </form>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
