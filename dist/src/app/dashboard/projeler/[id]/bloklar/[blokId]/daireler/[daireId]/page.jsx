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
exports.default = DaireDetayPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_2 = require("next-auth/react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var use_toast_1 = require("@/hooks/use-toast");
var lucide_react_1 = require("lucide-react");
var link_1 = __importDefault(require("next/link"));
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var swr_1 = __importDefault(require("swr"));
// Fetch fonksiyonu
var fetcher = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var res, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(url)];
            case 1:
                res = _a.sent();
                if (!res.ok) {
                    error = new Error("Veri çekerken bir hata oluştu");
                    throw error;
                }
                return [2 /*return*/, res.json()];
        }
    });
}); };
// Arıza masrafını hesapla
var hesaplaArizaMasrafi = function (ariza) {
    if (!ariza.randevular || ariza.randevular.length === 0)
        return 0;
    var toplamMasraf = 0;
    // Tüm randevulardaki kullanılan malzemelerin masraflarını topla
    ariza.randevular.forEach(function (randevu) {
        if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
            randevu.kullanilanMalzemeler.forEach(function (malzeme) {
                toplamMasraf += malzeme.miktar * (malzeme.fiyat || 0);
            });
        }
    });
    return toplamMasraf;
};
function DaireDetayPage(_a) {
    var _this = this;
    var _b;
    var params = _a.params;
    var session = (0, react_2.useSession)().data;
    var router = (0, navigation_1.useRouter)();
    var toast = (0, use_toast_1.useToast)().toast;
    // SWR ile veri getirme - performans için caching etkinleştirme
    var _c = (0, swr_1.default)(session ? "/api/daireler/".concat(params.daireId) : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000
    }), daire = _c.data, daireError = _c.error;
    var _d = (0, swr_1.default)(session && daire ? "/api/bloklar/".concat(params.blokId) : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000
    }), blok = _d.data, blokError = _d.error;
    var _e = (0, swr_1.default)(session && blok ? "/api/projeler/".concat(params.id) : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000
    }), proje = _e.data, projeError = _e.error;
    var _f = (0, swr_1.default)(session && daire ? "/api/arizalar?daireId=".concat(params.daireId) : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000
    }), _g = _f.data, arizalar = _g === void 0 ? [] : _g, arizalarError = _f.error, mutateArizalar = _f.mutate;
    // useEffect yerine SWR kullanarak arıza tiplerini getir - yalnızca açıldığında
    var _h = (0, swr_1.default)(session ? "/api/ariza-tipleri" : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60000 // 1 dakika - bu nadiren değişir
    }), _j = _h.data, arizaTipleri = _j === void 0 ? [] : _j, arizaTipleriError = _h.error;
    // Tekniker ve malzeme verilerini lazy loading ile getirme
    var _k = (0, react_1.useState)(false), teknikerlerLoaded = _k[0], setTeknikerlerLoaded = _k[1];
    var _l = (0, swr_1.default)(session && teknikerlerLoaded ? "/api/teknikerler" : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60000 // 1 dakika - bu nadiren değişir
    }), _m = _l.data, teknikerler = _m === void 0 ? [] : _m, teknikerlerError = _l.error;
    var _o = (0, swr_1.default)(session && teknikerlerLoaded ? "/api/malzemeler" : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60000 // 1 dakika - bu nadiren değişir
    }), _p = _o.data, malzemeler = _p === void 0 ? [] : _p, malzemelerError = _o.error;
    var _q = (0, react_1.useState)(true), isLoading = _q[0], setIsLoading = _q[1];
    var _r = (0, react_1.useState)(false), isAddArizaOpen = _r[0], setIsAddArizaOpen = _r[1];
    // Edit arıza state
    var _s = (0, react_1.useState)(false), isEditArizaOpen = _s[0], setIsEditArizaOpen = _s[1];
    var _t = (0, react_1.useState)(null), editingAriza = _t[0], setEditingAriza = _t[1];
    var _u = (0, react_1.useState)(""), editBildirenKisi = _u[0], setEditBildirenKisi = _u[1];
    var _v = (0, react_1.useState)(""), editTelefon = _v[0], setEditTelefon = _v[1];
    var _w = (0, react_1.useState)(""), editAciklama = _w[0], setEditAciklama = _w[1];
    var _x = (0, react_1.useState)(""), editArizaTipiId = _x[0], setEditArizaTipiId = _x[1];
    var _y = (0, react_1.useState)(""), editOncelik = _y[0], setEditOncelik = _y[1];
    var _z = (0, react_1.useState)(""), editDurum = _z[0], setEditDurum = _z[1];
    var _0 = (0, react_1.useState)(""), editEkbilgi = _0[0], setEditEkbilgi = _0[1];
    // Arıza form state
    var _1 = (0, react_1.useState)(""), bildirenKisi = _1[0], setBildirenKisi = _1[1];
    var _2 = (0, react_1.useState)(""), telefon = _2[0], setTelefon = _2[1];
    var _3 = (0, react_1.useState)(""), aciklama = _3[0], setAciklama = _3[1];
    var _4 = (0, react_1.useState)(""), arizaTipiId = _4[0], setArizaTipiId = _4[1];
    var _5 = (0, react_1.useState)("Orta"), oncelik = _5[0], setOncelik = _5[1];
    var _6 = (0, react_1.useState)(""), ekbilgi = _6[0], setEkbilgi = _6[1];
    // Randevu states
    var _7 = (0, react_1.useState)([]), randevular = _7[0], setRandevular = _7[1];
    var _8 = (0, react_1.useState)(false), isRandevuModalOpen = _8[0], setIsRandevuModalOpen = _8[1];
    var _9 = (0, react_1.useState)(false), isRandevuEditModalOpen = _9[0], setIsRandevuEditModalOpen = _9[1];
    var _10 = (0, react_1.useState)(null), selectedAriza = _10[0], setSelectedAriza = _10[1];
    var _11 = (0, react_1.useState)(null), selectedRandevu = _11[0], setSelectedRandevu = _11[1];
    var _12 = (0, react_1.useState)(""), randevuTarih = _12[0], setRandevuTarih = _12[1];
    var _13 = (0, react_1.useState)(""), randevuSaat = _13[0], setRandevuSaat = _13[1];
    var _14 = (0, react_1.useState)(""), randevuTeknikerId = _14[0], setRandevuTeknikerId = _14[1];
    var _15 = (0, react_1.useState)(""), randevuNotlar = _15[0], setRandevuNotlar = _15[1];
    var _16 = (0, react_1.useState)(false), randevuOnaylandi = _16[0], setRandevuOnaylandi = _16[1];
    var _17 = (0, react_1.useState)([]), secilenMalzemeler = _17[0], setSecilenMalzemeler = _17[1];
    // Yükleme durumunu izleme
    (0, react_1.useEffect)(function () {
        // Ana veri yüklendiğinde isLoading'i güncelle
        if (daire && (blokError || blok) && (projeError || proje) && (arizalarError || arizalar) && (arizaTipleriError || arizaTipleri)) {
            setIsLoading(false);
        }
    }, [daire, blok, proje, arizalar, arizaTipleri, blokError, projeError, arizalarError, arizaTipleriError]);
    // Randevuyu açmadan önce teknikerleri ve malzemeleri yüklememek için lazy loading
    var prepareRandevuModal = function (ariza) {
        setSelectedAriza(ariza);
        setTeknikerlerLoaded(true); // Teknikerler ve malzemeleri şimdi yükle
        fetchRandevular(ariza.id);
        resetRandevuForm();
        setIsRandevuModalOpen(true);
    };
    // Arıza için randevuları getir - sadece açıldığında
    var fetchRandevular = function (arizaId) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch("/api/randevular?arizaId=".concat(arizaId))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setRandevular(data);
                    return [2 /*return*/, data];
                case 3: return [2 /*return*/, []];
                case 4:
                    error_1 = _a.sent();
                    console.error("Randevular getirilirken hata:", error_1);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Yeni arıza ekle
    var handleAddAriza = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/arizalar", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                daireId: params.daireId,
                                bildirenKisi: bildirenKisi,
                                telefon: telefon,
                                aciklama: aciklama,
                                arizaTipiId: arizaTipiId || null,
                                oncelik: oncelik,
                                ekbilgi: ekbilgi
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.error || "Arıza eklenirken bir hata oluştu");
                case 4:
                    // SWR önbelleğini güncelle
                    mutateArizalar();
                    // Formu temizle ve modalı kapat
                    resetArizaForm();
                    setIsAddArizaOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Arıza kaydı başarıyla oluşturuldu",
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error("Hata:", error_2);
                    toast({
                        title: "Hata",
                        description: error_2.message || "Arıza eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Formu temizle
    var resetArizaForm = function () {
        setBildirenKisi("");
        setTelefon("");
        setAciklama("");
        setArizaTipiId("");
        setOncelik("Orta");
        setEkbilgi("");
    };
    // Öncelik badge rengi
    var getOncelikBadgeVariant = function (oncelik) {
        switch (oncelik) {
            case "Yüksek": return "destructive";
            case "Orta": return "default";
            case "Düşük": return "secondary";
            default: return "default";
        }
    };
    // Durum badge rengi
    var getDurumBadgeVariant = function (durum) {
        switch (durum) {
            case "Talep Alındı": return "secondary";
            case "Randevu Planlandı": return "warning";
            case "Randevu Yeniden Planlandı": return "warning";
            case "Kısmı Çözüm": return "default";
            case "Çözüm": return "success";
            case "İptal Edildi": return "destructive";
            // Eski durumların geri uyumluluk için korunması
            case "Bekliyor": return "secondary";
            case "İşleniyor": return "warning";
            case "Tamamlandı": return "success";
            default: return "secondary";
        }
    };
    // Arıza düzenleme formunu aç
    var handleEditAriza = function (ariza) {
        setEditingAriza(ariza);
        setEditBildirenKisi(ariza.bildirenKisi || "");
        setEditTelefon(ariza.telefon || "");
        setEditAciklama(ariza.aciklama);
        setEditArizaTipiId(ariza.arizaTipiId || "");
        setEditOncelik(ariza.oncelik);
        setEditDurum(ariza.durum);
        setEditEkbilgi(ariza.ekbilgi || "");
        setIsEditArizaOpen(true);
    };
    // Arıza düzenleme
    var handleEditArizaSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!editingAriza)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/arizalar/".concat(editingAriza.id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                bildirenKisi: editBildirenKisi,
                                telefon: editTelefon,
                                aciklama: editAciklama,
                                arizaTipiId: editArizaTipiId || null,
                                oncelik: editOncelik,
                                durum: editDurum,
                                ekbilgi: editEkbilgi
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.error || "Arıza güncellenirken bir hata oluştu");
                case 4:
                    // SWR önbelleğini güncelle
                    mutateArizalar();
                    // Modalı kapat
                    setIsEditArizaOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Arıza kaydı başarıyla güncellendi",
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("Hata:", error_3);
                    toast({
                        title: "Hata",
                        description: error_3.message || "Arıza güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Randevu ekle modalını aç
    var openRandevuModal = function (ariza) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            prepareRandevuModal(ariza);
            return [2 /*return*/];
        });
    }); };
    // Randevu formunu sıfırla
    var resetRandevuForm = function () {
        setRandevuTarih("");
        setRandevuSaat("");
        setRandevuTeknikerId("");
        setRandevuNotlar("");
        setSecilenMalzemeler([]);
        setRandevuOnaylandi(false);
    };
    // Randevu ekle
    var handleAddRandevu = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var tarihSaat, response, errorData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedAriza)
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
                    _a.trys.push([1, 5, , 6]);
                    tarihSaat = "".concat(randevuTarih, "T").concat(randevuSaat, ":00");
                    return [4 /*yield*/, fetch("/api/randevular", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                arizaId: selectedAriza.id,
                                tarih: tarihSaat,
                                teknikerId: randevuTeknikerId || null,
                                notlar: randevuNotlar,
                                malzemeler: secilenMalzemeler.length > 0 ? secilenMalzemeler : undefined
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.error || "Randevu eklenirken bir hata oluştu");
                case 4:
                    // SWR önbelleğini güncelle
                    mutateArizalar();
                    // Modalı kapat
                    setIsRandevuModalOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Randevu başarıyla oluşturuldu",
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    console.error("Hata:", error_4);
                    toast({
                        title: "Hata",
                        description: error_4.message || "Randevu eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Randevu durumunu güncelle
    var updateRandevuDurum = function (randevuId, yeniDurum, sonuc) { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
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
                case 3:
                    // SWR önbelleğini güncelle
                    mutateArizalar();
                    if (!selectedAriza) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchRandevular(selectedAriza.id)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    toast({
                        title: "Başarılı",
                        description: "Randevu durumu güncellendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_5 = _a.sent();
                    console.error("Hata:", error_5);
                    toast({
                        title: "Hata",
                        description: error_5.message || "Randevu güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Randevuyu iptal et
    var cancelRandevu = function (randevuId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateRandevuDurum(randevuId, "İptal Edildi")];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    // Randevuyu tamamla
    var completeRandevu = function (randevuId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Bu randevuyu tamamlanmış olarak işaretlemek istediğinize emin misiniz?")) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateRandevuDurum(randevuId, "Tamamlandı", "Arıza başarıyla giderildi.")];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    // Kısmi çözüm işaretle
    var markPartialSolution = function (randevuId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Bu randevuyu kısmi çözüm olarak işaretlemek istediğinize emin misiniz?")) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateRandevuDurum(randevuId, "Kısmı Çözüm", "Arıza kısmen giderildi, ek işlem gerekiyor.")];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    // Yeni malzeme ekle
    var addMalzeme = function () {
        if (secilenMalzemeler.length < malzemeler.length) {
            setSecilenMalzemeler(__spreadArray(__spreadArray([], secilenMalzemeler, true), [
                { malzemeId: "", miktar: 1, birim: null }
            ], false));
        }
    };
    // Malzeme kaldır
    var removeMalzeme = function (index) {
        var yeniMalzemeler = __spreadArray([], secilenMalzemeler, true);
        yeniMalzemeler.splice(index, 1);
        setSecilenMalzemeler(yeniMalzemeler);
    };
    // Malzeme güncelle
    var updateMalzeme = function (index, field, value) {
        var yeniMalzemeler = __spreadArray([], secilenMalzemeler, true);
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
        setSecilenMalzemeler(yeniMalzemeler);
    };
    // Randevu durum badge rengi
    var getRandevuDurumBadgeVariant = function (durum) {
        switch (durum) {
            case "Planlandı": return "secondary";
            case "Tamamlandı": return "success";
            case "Kısmı Çözüm": return "default";
            case "İptal Edildi": return "destructive";
            default: return "secondary";
        }
    };
    // Arıza sil
    var handleDeleteAriza = function (arizaId) { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Kullanıcıya onay sor
                    if (!confirm("Bu arıza kaydını silmek istediğinize emin misiniz?")) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/arizalar/".concat(arizaId), {
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
                    // SWR önbelleğini güncelle
                    mutateArizalar();
                    toast({
                        title: "Başarılı",
                        description: "Arıza kaydı başarıyla silindi",
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_6 = _a.sent();
                    console.error("Hata:", error_6);
                    toast({
                        title: "Hata",
                        description: error_6.message || "Arıza silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Hata durumlarını kontrol et
    var isError = daireError || blokError || projeError || arizalarError || arizaTipleriError;
    if (isLoading) {
        return (<div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Daire bilgileri yükleniyor...</p>
      </div>);
    }
    if (isError) {
        return (<div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="p-4 bg-red-50 rounded-lg text-red-600">
          <h3 className="font-medium text-lg">Veri yüklenirken bir hata oluştu</h3>
          <p className="text-sm">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
        </div>
        <button_1.Button variant="outline" onClick={function () { return router.push("/dashboard/projeler/".concat(params.id, "/bloklar/").concat(params.blokId)); }}>
          <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
          Geri Dön
        </button_1.Button>
      </div>);
    }
    if (!daire) {
        return (<div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="p-4 bg-amber-50 rounded-lg text-amber-600">
          <h3 className="font-medium text-lg">Daire bulunamadı</h3>
          <p className="text-sm">Aradığınız daire kaydı mevcut değil veya erişim izniniz yok.</p>
        </div>
        <button_1.Button variant="outline" onClick={function () { return router.push("/dashboard/projeler/".concat(params.id, "/bloklar/").concat(params.blokId)); }}>
          <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
          Bloğa Dön
        </button_1.Button>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Üst kısım */}
      <div className="flex items-center space-x-2">
        <button_1.Button variant="ghost" size="sm" asChild>
          <link_1.default href={"/dashboard/projeler/".concat(params.id, "/bloklar/").concat(params.blokId)}>
            <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
            Geri
          </link_1.default>
        </button_1.Button>
        <h2 className="text-3xl font-bold tracking-tight">{daire.numara} Nolu Daire</h2>
        
        <div className="ml-auto flex space-x-2">
          <button_1.Button variant="outline" size="sm">
            <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
            Düzenle
          </button_1.Button>
          <button_1.Button variant="destructive" size="sm">
            <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
            Sil
          </button_1.Button>
        </div>
      </div>
      
      {/* Daire Bilgileri */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Daire Bilgileri</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Proje:</h4>
              <p className="flex items-center gap-1 text-gray-600">
                <lucide_react_1.Building2 className="h-4 w-4"/>
                {(proje === null || proje === void 0 ? void 0 : proje.ad) || ((_b = blok === null || blok === void 0 ? void 0 : blok.proje) === null || _b === void 0 ? void 0 : _b.ad) || "Bilinmiyor"}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Blok:</h4>
              <p className="flex items-center gap-1 text-gray-600">
                <lucide_react_1.Building2 className="h-4 w-4"/>
                {(blok === null || blok === void 0 ? void 0 : blok.ad) || "Bilinmiyor"}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Daire Numarası:</h4>
              <p className="flex items-center gap-1 text-gray-600">
                <lucide_react_1.Home className="h-4 w-4"/>
                {daire.numara}
              </p>
            </div>
            
            {daire.kat && (<div>
                <h4 className="font-medium text-gray-700">Kat:</h4>
                <p className="text-gray-600">{daire.kat}</p>
              </div>)}
            
            {daire.ekbilgi && (<div className="col-span-1 md:col-span-2">
                <h4 className="font-medium text-gray-700">Açıklama:</h4>
                <p className="text-gray-600">{daire.ekbilgi}</p>
              </div>)}
          </div>
        </card_1.CardContent>
      </card_1.Card>
      
      {/* Arızalar Bölümü */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Arızalar</h3>
          <dialog_1.Dialog open={isAddArizaOpen} onOpenChange={setIsAddArizaOpen}>
            <dialog_1.DialogTrigger asChild>
              <button_1.Button onClick={function () { return resetArizaForm(); }}>
                <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                Yeni Arıza Kaydı
              </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="sm:max-w-[525px]">
              <dialog_1.DialogHeader>
                <dialog_1.DialogTitle>Yeni Arıza Kaydı</dialog_1.DialogTitle>
                <dialog_1.DialogDescription>
                  Arıza bilgilerini doldurun ve kaydet butonuna tıklayın.
                </dialog_1.DialogDescription>
              </dialog_1.DialogHeader>
              <form onSubmit={handleAddAriza}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label_1.Label htmlFor="bildiren-kisi">Bildiren Kişi</label_1.Label>
                      <input_1.Input id="bildiren-kisi" value={bildirenKisi} onChange={function (e) { return setBildirenKisi(e.target.value); }} className="mt-1"/>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label_1.Label htmlFor="telefon">Telefon</label_1.Label>
                      <input_1.Input id="telefon" value={telefon} onChange={function (e) { return setTelefon(e.target.value); }} className="mt-1"/>
                    </div>
                  </div>
                  
                  <div>
                    <label_1.Label htmlFor="aciklama">Arıza Açıklaması</label_1.Label>
                    <textarea_1.Textarea id="aciklama" value={aciklama} onChange={function (e) { return setAciklama(e.target.value); }} className="mt-1" rows={3} required/>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label_1.Label htmlFor="ariza-tipi">Arıza Tipi</label_1.Label>
                      <select_1.Select value={arizaTipiId} onValueChange={setArizaTipiId}>
                        <select_1.SelectTrigger id="ariza-tipi" className="mt-1">
                          <select_1.SelectValue placeholder="Arıza tipi seçin"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          {arizaTipleri.map(function (tip) { return (<select_1.SelectItem key={tip.id} value={tip.id}>
                              {tip.ad}
                            </select_1.SelectItem>); })}
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                    <div>
                      <label_1.Label htmlFor="oncelik">Öncelik</label_1.Label>
                      <select_1.Select value={oncelik} onValueChange={setOncelik}>
                        <select_1.SelectTrigger id="oncelik" className="mt-1">
                          <select_1.SelectValue placeholder="Öncelik seçin"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          <select_1.SelectItem value="Düşük">Düşük</select_1.SelectItem>
                          <select_1.SelectItem value="Orta">Orta</select_1.SelectItem>
                          <select_1.SelectItem value="Yüksek">Yüksek</select_1.SelectItem>
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                  </div>
                  
                  <div>
                    <label_1.Label htmlFor="ekbilgi">Ek Bilgi (Opsiyonel)</label_1.Label>
                    <textarea_1.Textarea id="ekbilgi" value={ekbilgi} onChange={function (e) { return setEkbilgi(e.target.value); }} className="mt-1" rows={2}/>
                  </div>
                </div>
                
                <dialog_1.DialogFooter>
                  <button_1.Button type="button" variant="outline" onClick={function () { return setIsAddArizaOpen(false); }}>
                    İptal
                  </button_1.Button>
                  <button_1.Button type="submit">Kaydet</button_1.Button>
                </dialog_1.DialogFooter>
              </form>
            </dialog_1.DialogContent>
          </dialog_1.Dialog>
        </div>
        
        {arizalar.length === 0 ? (<div className="text-center py-8">
            <lucide_react_1.AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground"/>
            <p className="mt-2 text-lg font-medium">Henüz arıza kaydı bulunmuyor.</p>
            <p className="text-sm text-muted-foreground">
              Yeni bir arıza kaydı oluşturmak için "Yeni Arıza Kaydı" butonuna tıklayın.
            </p>
          </div>) : (<div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {arizalar.map(function (ariza) {
                var _a;
                return (<card_1.Card key={ariza.id} className="overflow-hidden h-full">
                  <card_1.CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                    <div>
                      <card_1.CardTitle className="text-lg font-semibold">
                        {((_a = ariza.arizaTipi) === null || _a === void 0 ? void 0 : _a.ad) || "Genel Arıza"}
                      </card_1.CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Bildirim: {(0, date_fns_1.format)(new Date(ariza.createdAt), "d MMMM yyyy", { locale: locale_1.tr })}
                      </p>
                    </div>
                    <badge_1.Badge variant={getDurumBadgeVariant(ariza.durum)}>{ariza.durum}</badge_1.Badge>
                  </card_1.CardHeader>
                  <card_1.CardContent className="pb-1">
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-wrap gap-3">
                        {ariza.bildirenKisi && (<div className="flex items-center">
                            <lucide_react_1.User className="h-4 w-4 mr-1 text-muted-foreground"/>
                            <span className="text-sm">{ariza.bildirenKisi}</span>
                          </div>)}
                        {ariza.telefon && (<div className="flex items-center">
                            <lucide_react_1.Phone className="h-4 w-4 mr-1 text-muted-foreground"/>
                            <span className="text-sm">{ariza.telefon}</span>
                          </div>)}
                      </div>
                      <p className="mt-1 line-clamp-2">{ariza.aciklama}</p>
                      {ariza.ekbilgi && (<p className="text-sm text-muted-foreground mt-1 line-clamp-1">{ariza.ekbilgi}</p>)}
                      
                      {/* Toplam masraf bilgisini ekleyelim */}
                      {ariza.randevular && ariza.randevular.length > 0 && (<div className="flex items-center mt-2 pt-2 border-t border-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span className="text-sm font-medium">
                            Toplam Masraf: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(hesaplaArizaMasrafi(ariza))}
                          </span>
                        </div>)}
                    </div>
                  </card_1.CardContent>
                  <card_1.CardFooter className="flex justify-end pt-0 mt-auto">
                    <div className="flex space-x-2">
                      <button_1.Button variant="ghost" size="sm" onClick={function () { return handleEditAriza(ariza); }}>
                        <lucide_react_1.Edit className="h-4 w-4 mr-1"/>
                        Düzenle
                      </button_1.Button>
                      <button_1.Button variant="ghost" size="sm" onClick={function () { return handleDeleteAriza(ariza.id); }}>
                        <lucide_react_1.Trash2 className="h-4 w-4 mr-1"/>
                        Sil
                      </button_1.Button>
                      <button_1.Button variant="default" size="sm" asChild>
                        <link_1.default href={"/dashboard/arizalar/".concat(ariza.id)}>
                          <lucide_react_1.ArrowRight className="h-4 w-4 mr-1"/>
                          Detay
                        </link_1.default>
                      </button_1.Button>
                    </div>
                  </card_1.CardFooter>
                </card_1.Card>);
            })}
            </div>
          </div>)}
      </div>
      
      {/* Arıza Düzenleme Modal */}
      <dialog_1.Dialog open={isEditArizaOpen} onOpenChange={setIsEditArizaOpen}>
        <dialog_1.DialogContent className="sm:max-w-[525px]">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Arıza Kaydını Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Arıza bilgilerini güncelleyin ve kaydet butonuna tıklayın.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleEditArizaSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label_1.Label htmlFor="edit-bildiren-kisi">Bildiren Kişi</label_1.Label>
                  <input_1.Input id="edit-bildiren-kisi" value={editBildirenKisi} onChange={function (e) { return setEditBildirenKisi(e.target.value); }} className="mt-1"/>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label_1.Label htmlFor="edit-telefon">Telefon</label_1.Label>
                  <input_1.Input id="edit-telefon" value={editTelefon} onChange={function (e) { return setEditTelefon(e.target.value); }} className="mt-1"/>
                </div>
              </div>
              
              <div>
                <label_1.Label htmlFor="edit-aciklama">Arıza Açıklaması</label_1.Label>
                <textarea_1.Textarea id="edit-aciklama" value={editAciklama} onChange={function (e) { return setEditAciklama(e.target.value); }} className="mt-1" rows={3} required/>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="edit-ariza-tipi">Arıza Tipi</label_1.Label>
                  <select_1.Select value={editArizaTipiId} onValueChange={setEditArizaTipiId}>
                    <select_1.SelectTrigger id="edit-ariza-tipi" className="mt-1">
                      <select_1.SelectValue placeholder="Arıza tipi seçin"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      {arizaTipleri.map(function (tip) { return (<select_1.SelectItem key={tip.id} value={tip.id}>
                          {tip.ad}
                        </select_1.SelectItem>); })}
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>
                <div>
                  <label_1.Label htmlFor="edit-oncelik">Öncelik</label_1.Label>
                  <select_1.Select value={editOncelik} onValueChange={setEditOncelik}>
                    <select_1.SelectTrigger id="edit-oncelik" className="mt-1">
                      <select_1.SelectValue placeholder="Öncelik seçin"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="Düşük">Düşük</select_1.SelectItem>
                      <select_1.SelectItem value="Orta">Orta</select_1.SelectItem>
                      <select_1.SelectItem value="Yüksek">Yüksek</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>
              </div>
              
              <div>
                <label_1.Label htmlFor="edit-durum">Durum</label_1.Label>
                <select_1.Select value={editDurum} onValueChange={setEditDurum}>
                  <select_1.SelectTrigger id="edit-durum" className="mt-1">
                    <select_1.SelectValue placeholder="Durum seçin"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Talep Alındı">Talep Alındı</select_1.SelectItem>
                    <select_1.SelectItem value="Randevu Planlandı">Randevu Planlandı</select_1.SelectItem>
                    <select_1.SelectItem value="Randevu Yeniden Planlandı">Randevu Yeniden Planlandı</select_1.SelectItem>
                    <select_1.SelectItem value="Kısmı Çözüm">Kısmı Çözüm</select_1.SelectItem>
                    <select_1.SelectItem value="Çözüm">Çözüm</select_1.SelectItem>
                    <select_1.SelectItem value="İptal Edildi">İptal Edildi</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              
              <div>
                <label_1.Label htmlFor="edit-ekbilgi">Ek Bilgi (Opsiyonel)</label_1.Label>
                <textarea_1.Textarea id="edit-ekbilgi" value={editEkbilgi} onChange={function (e) { return setEditEkbilgi(e.target.value); }} className="mt-1" rows={2}/>
              </div>
            </div>
            
            <dialog_1.DialogFooter>
              <button_1.Button type="button" variant="outline" onClick={function () { return setIsEditArizaOpen(false); }}>
                İptal
              </button_1.Button>
              <button_1.Button type="submit">Güncelle</button_1.Button>
            </dialog_1.DialogFooter>
          </form>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
      
      {/* Randevu Ekle Modal */}
      <dialog_1.Dialog open={isRandevuModalOpen} onOpenChange={setIsRandevuModalOpen}>
        <dialog_1.DialogContent className="sm:max-w-[525px]">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Yeni Randevu Kaydı</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Randevu bilgilerini doldurun ve kaydet butonuna tıklayın.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleAddRandevu}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label_1.Label htmlFor="randevu-tarih">Randevu Tarihi</label_1.Label>
                  <input_1.Input id="randevu-tarih" type="date" value={randevuTarih} onChange={function (e) { return setRandevuTarih(e.target.value); }} className="mt-1"/>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label_1.Label htmlFor="randevu-saat">Randevu Saati</label_1.Label>
                  <input_1.Input id="randevu-saat" type="time" value={randevuSaat} onChange={function (e) { return setRandevuSaat(e.target.value); }} className="mt-1"/>
                </div>
              </div>
              
              <div>
                <label_1.Label htmlFor="randevu-tekniker">Randevu Teknikeri</label_1.Label>
                <select_1.Select value={randevuTeknikerId} onValueChange={setRandevuTeknikerId}>
                  <select_1.SelectTrigger id="randevu-tekniker" className="mt-1">
                    <select_1.SelectValue placeholder="Randevu teknikerini seçin"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {teknikerler.map(function (tekniker) { return (<select_1.SelectItem key={tekniker.id} value={tekniker.id}>
                        {tekniker.adsoyad}
                      </select_1.SelectItem>); })}
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              
              <div>
                <label_1.Label htmlFor="randevu-notlar">Randevu Notları</label_1.Label>
                <textarea_1.Textarea id="randevu-notlar" value={randevuNotlar} onChange={function (e) { return setRandevuNotlar(e.target.value); }} className="mt-1" rows={3}/>
              </div>
              
              {/* Malzeme Seçimi */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label_1.Label>Kullanılacak Malzemeler</label_1.Label>
                  <button_1.Button type="button" variant="outline" size="sm" onClick={addMalzeme} disabled={secilenMalzemeler.length >= malzemeler.length} className="h-8">
                    <lucide_react_1.Plus className="h-4 w-4 mr-1"/>
                    Malzeme Ekle
                  </button_1.Button>
                </div>
                
                {secilenMalzemeler.length > 0 ? (<div className="space-y-2 mt-2">
                    {secilenMalzemeler.map(function (item, index) { return (<div key={index} className="flex flex-wrap items-center gap-2 p-2 border rounded-md">
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
                        
                        <div className="flex items-center">
                          <input_1.Input type="number" min="0.01" step="0.01" value={item.miktar.toString()} onChange={function (e) { return updateMalzeme(index, "miktar", e.target.value); }} className="w-[80px] h-8"/>
                          
                          <span className="px-2">{item.birim || "adet"}</span>
                          
                          <button_1.Button type="button" variant="ghost" size="icon" onClick={function () { return removeMalzeme(index); }} className="h-8 w-8">
                            <lucide_react_1.Trash2 className="h-4 w-4 text-red-500"/>
                          </button_1.Button>
                        </div>
                      </div>); })}
                  </div>) : (<div className="text-center py-2 text-sm text-muted-foreground">
                    Henüz malzeme eklenmedi
                  </div>)}
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
    </div>);
}
