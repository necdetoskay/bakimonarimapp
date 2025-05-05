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
exports.default = ProjeDetay;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_2 = require("next-auth/react");
var swr_1 = __importStar(require("swr"));
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var dialog_1 = require("@/components/ui/dialog");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var use_toast_1 = require("@/hooks/use-toast");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var lucide_react_1 = require("lucide-react");
var link_1 = __importDefault(require("next/link"));
// Fetch fonksiyonu
var fetcher = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var res, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(url)];
            case 1:
                res = _a.sent();
                if (!res.ok) {
                    error = new Error('Veri çekerken bir hata oluştu');
                    throw error;
                }
                return [2 /*return*/, res.json()];
        }
    });
}); };
function ProjeDetay() {
    var _this = this;
    var params = (0, navigation_1.useParams)();
    var projeId = params.id;
    var router = (0, navigation_1.useRouter)();
    var _a = (0, react_2.useSession)(), session = _a.data, status = _a.status;
    var toast = (0, use_toast_1.useToast)().toast;
    // SWR ile proje verilerini çekme
    var _b = (0, swr_1.default)(status === "authenticated" ? "/api/projeler/".concat(projeId) : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000 // 10 saniye içinde tekrar sorgu yapılmasını engeller
    }), proje = _b.data, projeError = _b.error, projeLoading = _b.isLoading;
    // SWR ile blok verilerini çekme
    var _c = (0, swr_1.default)(status === "authenticated" ? "/api/bloklar?projeId=".concat(projeId) : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000
    }), bloklar = _c.data, bloklarError = _c.error, bloklarLoading = _c.isLoading;
    // Blok kartı için daire sayısını tutan state
    var _d = (0, react_1.useState)({}), blokDaireCounts = _d[0], setBlokDaireCounts = _d[1];
    // Blokların daire sayılarını getir
    (0, react_1.useEffect)(function () {
        if (bloklar && bloklar.length > 0) {
            var fetchDaireSayilari = function () { return __awaiter(_this, void 0, void 0, function () {
                var counts, _i, bloklar_1, blok, response, data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            counts = {};
                            _i = 0, bloklar_1 = bloklar;
                            _a.label = 1;
                        case 1:
                            if (!(_i < bloklar_1.length)) return [3 /*break*/, 9];
                            blok = bloklar_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 7, , 8]);
                            return [4 /*yield*/, fetch("/api/daireler?blokId=".concat(blok.id))];
                        case 3:
                            response = _a.sent();
                            if (!response.ok) return [3 /*break*/, 5];
                            return [4 /*yield*/, response.json()];
                        case 4:
                            data = _a.sent();
                            counts[blok.id] = data.length;
                            return [3 /*break*/, 6];
                        case 5:
                            counts[blok.id] = 0;
                            _a.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_1 = _a.sent();
                            console.error("Daire say\u0131s\u0131 al\u0131n\u0131rken hata: ".concat(blok.id), error_1);
                            counts[blok.id] = 0;
                            return [3 /*break*/, 8];
                        case 8:
                            _i++;
                            return [3 /*break*/, 1];
                        case 9:
                            setBlokDaireCounts(counts);
                            return [2 /*return*/];
                    }
                });
            }); };
            fetchDaireSayilari();
        }
    }, [bloklar]);
    var isLoading = status === "loading" || projeLoading || bloklarLoading;
    var _e = (0, react_1.useState)(false), isAddBlokOpen = _e[0], setIsAddBlokOpen = _e[1];
    var _f = (0, react_1.useState)(false), isEditBlokOpen = _f[0], setIsEditBlokOpen = _f[1];
    var _g = (0, react_1.useState)(false), isDeleteBlokOpen = _g[0], setIsDeleteBlokOpen = _g[1];
    var _h = (0, react_1.useState)(null), selectedBlok = _h[0], setSelectedBlok = _h[1];
    // Form durumları
    var _j = (0, react_1.useState)(""), yeniBlokAd = _j[0], setYeniBlokAd = _j[1];
    var _k = (0, react_1.useState)(""), yeniBlokEkbilgi = _k[0], setYeniBlokEkbilgi = _k[1];
    var _l = (0, react_1.useState)(""), editBlokAd = _l[0], setEditBlokAd = _l[1];
    var _m = (0, react_1.useState)(""), editBlokEkbilgi = _m[0], setEditBlokEkbilgi = _m[1];
    // Yeni blok ekleme
    var handleAddBlok = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, yeniBlok_1, errorData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!yeniBlokAd) {
                        toast({
                            title: "Hata",
                            description: "Blok adı zorunludur",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch("/api/bloklar", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                ad: yeniBlokAd,
                                projeId: projeId,
                                ekbilgi: yeniBlokEkbilgi || null,
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    yeniBlok_1 = _a.sent();
                    // SWR önbelleğini doğrudan güncelle ve mevcut verilere yeni bloğu ekle
                    (0, swr_1.mutate)("/api/bloklar?projeId=".concat(projeId), function (eskiVeri) {
                        if (Array.isArray(eskiVeri)) {
                            return __spreadArray([yeniBlok_1], eskiVeri, true);
                        }
                        return [yeniBlok_1];
                    }, false // false: Önce veriyi güncelleyip sonra sunucudan yeniden doğrulama yapma
                    );
                    // Ekstra güvenlik için 500ms sonra tekrar mutate çağrısı yap
                    setTimeout(function () {
                        (0, swr_1.mutate)("/api/bloklar?projeId=".concat(projeId));
                    }, 500);
                    setYeniBlokAd("");
                    setYeniBlokEkbilgi("");
                    setIsAddBlokOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Blok başarıyla eklendi",
                    });
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    errorData = _a.sent();
                    toast({
                        title: "Hata",
                        description: errorData.message || "Blok eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "Blok eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Blok düzenleme
    var handleEditBlok = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, guncellenenBlok_1, errorData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedBlok || !editBlokAd) {
                        toast({
                            title: "Hata",
                            description: "Blok adı zorunludur",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch("/api/bloklar/".concat(selectedBlok.id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                ad: editBlokAd,
                                ekbilgi: editBlokEkbilgi || null,
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    guncellenenBlok_1 = _a.sent();
                    // SWR önbelleğini doğrudan güncelle
                    (0, swr_1.mutate)("/api/bloklar?projeId=".concat(projeId), function (eskiVeri) {
                        if (Array.isArray(eskiVeri)) {
                            return eskiVeri.map(function (blok) {
                                return blok.id === selectedBlok.id ? guncellenenBlok_1 : blok;
                            });
                        }
                        return eskiVeri;
                    }, false);
                    // Ekstra güvenlik için 500ms sonra tekrar mutate çağrısı yap
                    setTimeout(function () {
                        (0, swr_1.mutate)("/api/bloklar?projeId=".concat(projeId));
                    }, 500);
                    setEditBlokAd("");
                    setEditBlokEkbilgi("");
                    setSelectedBlok(null);
                    setIsEditBlokOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Blok başarıyla güncellendi",
                    });
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    errorData = _a.sent();
                    toast({
                        title: "Hata",
                        description: errorData.message || "Blok güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_3 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "Blok güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Blok silme
    var handleDeleteBlok = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedBlok)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/bloklar/".concat(selectedBlok.id), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    // SWR önbelleğini doğrudan güncelle
                    (0, swr_1.mutate)("/api/bloklar?projeId=".concat(projeId), function (eskiVeri) {
                        if (Array.isArray(eskiVeri)) {
                            return eskiVeri.filter(function (blok) { return blok.id !== selectedBlok.id; });
                        }
                        return eskiVeri;
                    }, false);
                    // Ekstra güvenlik için 500ms sonra tekrar mutate çağrısı yap
                    setTimeout(function () {
                        (0, swr_1.mutate)("/api/bloklar?projeId=".concat(projeId));
                    }, 500);
                    setSelectedBlok(null);
                    setIsDeleteBlokOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Blok başarıyla silindi",
                    });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    errorData = _a.sent();
                    toast({
                        title: "Hata",
                        description: errorData.message || "Blok silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "Blok silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Düzenleme modalını aç
    var openEditBlokModal = function (blok) {
        setSelectedBlok(blok);
        setEditBlokAd(blok.ad);
        setEditBlokEkbilgi(blok.ekbilgi || "");
        setIsEditBlokOpen(true);
    };
    // Silme modalını aç
    var openDeleteBlokModal = function (blok) {
        setSelectedBlok(blok);
        setIsDeleteBlokOpen(true);
    };
    // İlave state'ler ekleyelim
    var _o = (0, react_1.useState)(false), isEditProjeOpen = _o[0], setIsEditProjeOpen = _o[1];
    var _p = (0, react_1.useState)(false), isDeleteProjeOpen = _p[0], setIsDeleteProjeOpen = _p[1];
    var _q = (0, react_1.useState)({ ad: "", adres: "", ekbilgi: "", image: "" }), editProjeData = _q[0], setEditProjeData = _q[1];
    var _r = (0, react_1.useState)(null), selectedImageFile = _r[0], setSelectedImageFile = _r[1];
    var _s = (0, react_1.useState)(null), imagePreview = _s[0], setImagePreview = _s[1];
    // useEffect ile proje verisi geldiğinde edit formunu dolduralım
    (0, react_1.useEffect)(function () {
        if (proje) {
            setEditProjeData({
                ad: proje.ad,
                adres: proje.adres,
                ekbilgi: proje.ekbilgi || "",
                image: proje.image || ""
            });
            setImagePreview(proje.image || null);
        }
    }, [proje]);
    // Dosya seçme işleyicisi
    var handleFileChange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        // Dosya boyutu kontrolü (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Hata",
                description: "Dosya boyutu 5MB'dan büyük olamaz",
                variant: "destructive",
            });
            return;
        }
        // Dosya tipi kontrolü
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            toast({
                title: "Hata",
                description: "Sadece JPEG ve PNG dosyaları yüklenebilir",
                variant: "destructive",
            });
            return;
        }
        setSelectedImageFile(file);
        // Dosya önizleme URL'i oluştur
        var previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };
    // Resim kaldırma
    var handleRemoveImage = function () {
        setSelectedImageFile(null);
        setImagePreview(null);
        setEditProjeData(__assign(__assign({}, editProjeData), { image: "" }));
    };
    // Resim yükleme
    var uploadImage = function () { return __awaiter(_this, void 0, void 0, function () {
        var formData, response, error, data, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedImageFile)
                        return [2 /*return*/, editProjeData.image];
                    formData = new FormData();
                    formData.append("file", selectedImageFile);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/upload", {
                            method: "POST",
                            body: formData
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    error = _a.sent();
                    throw new Error(error.message || "Resim yüklenirken bir hata oluştu");
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    data = _a.sent();
                    return [2 /*return*/, data.url];
                case 6:
                    error_5 = _a.sent();
                    console.error("Resim yükleme hatası:", error_5);
                    toast({
                        title: "Hata",
                        description: "Resim yüklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [2 /*return*/, editProjeData.image]; // Hata durumunda mevcut resmi kullan
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Proje düzenleme fonksiyonu
    var handleEditProje = function () { return __awaiter(_this, void 0, void 0, function () {
        var imageUrl, response, errorData, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editProjeData.ad || !editProjeData.adres) {
                        toast({
                            title: "Hata",
                            description: "Proje adı ve adresi zorunludur",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    imageUrl = editProjeData.image;
                    if (!selectedImageFile) return [3 /*break*/, 3];
                    toast({
                        title: "İşleniyor",
                        description: "Resim yükleniyor, lütfen bekleyin...",
                    });
                    return [4 /*yield*/, uploadImage()];
                case 2:
                    imageUrl = _a.sent();
                    if (!imageUrl && selectedImageFile) {
                        // Resim yükleme başarısız oldu ve bir dosya seçilmiş
                        return [2 /*return*/];
                    }
                    _a.label = 3;
                case 3: return [4 /*yield*/, fetch("/api/projeler/".concat(projeId), {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(__assign(__assign({}, editProjeData), { image: imageUrl })),
                    })];
                case 4:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 5];
                    // SWR önbelleğini yenile
                    (0, swr_1.mutate)("/api/projeler/".concat(projeId));
                    // Kaynakları temizle
                    if (imagePreview && selectedImageFile) {
                        URL.revokeObjectURL(imagePreview);
                    }
                    setSelectedImageFile(null);
                    setIsEditProjeOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Proje başarıyla güncellendi",
                    });
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, response.json()];
                case 6:
                    errorData = _a.sent();
                    toast({
                        title: "Hata",
                        description: errorData.message || "Proje güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_6 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "Proje güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    // Proje silme işlemi
    var handleDeleteProje = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/projeler/".concat(projeId), {
                            method: "DELETE",
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 2];
                    toast({
                        title: "Başarılı",
                        description: "Proje başarıyla silindi",
                    });
                    router.push("/dashboard/projeler");
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    toast({
                        title: "Hata",
                        description: errorData.message || "Proje silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_7 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "Proje silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    if (isLoading) {
        return (<div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Yükleniyor...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>);
    }
    if (projeError || bloklarError) {
        return (<div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bir hata oluştu</h2>
          <p>Veri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>
          <button_1.Button className="mt-4" onClick={function () { return router.push("/dashboard/projeler"); }}>
            Projelere Dön
          </button_1.Button>
        </div>
      </div>);
    }
    if (!proje) {
        return (<div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Proje bulunamadı</h2>
          <p>İstediğiniz proje bilgileri bulunamadı.</p>
          <button_1.Button className="mt-4" onClick={function () { return router.push("/dashboard/projeler"); }}>
            Projelere Dön
          </button_1.Button>
        </div>
      </div>);
    }
    return (<div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button_1.Button variant="ghost" size="sm" asChild className="mb-0">
            <link_1.default href="/dashboard/projeler">
              <span className="mr-1">←</span> Geri
            </link_1.default>
          </button_1.Button>
          <h1 className="text-2xl font-bold">{proje.ad}</h1>
        </div>
        <div className="flex gap-2">
          <button_1.Button variant="outline" size="sm" onClick={function () { return setIsEditProjeOpen(true); }}>
            <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
            Düzenle
          </button_1.Button>
          <button_1.Button variant="destructive" size="sm" onClick={function () { return setIsDeleteProjeOpen(true); }}>
            <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
            Sil
          </button_1.Button>
        </div>
      </div>

      {/* Proje Bilgisi Kartı */}
      <card_1.Card className="mb-8">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg">Proje Bilgisi</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sol taraf - Proje bilgileri */}
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="font-medium text-sm text-gray-500">Adres:</h3>
                <p>{proje.adres}</p>
              </div>
              {proje.ekbilgi && (<div>
                  <h3 className="font-medium text-sm text-gray-500">Açıklama:</h3>
                  <p>{proje.ekbilgi}</p>
                </div>)}
              <div>
                <h3 className="font-medium text-sm text-gray-500">Blok Sayısı:</h3>
                <p>{(bloklar === null || bloklar === void 0 ? void 0 : bloklar.length) || 0}</p>
              </div>
            </div>
            
            {/* Sağ taraf - Proje resmi */}
            <div className="w-full lg:w-1/3 flex items-center justify-center">
              {proje.image && proje.image.trim() !== "" ? (<div className="relative rounded-lg overflow-hidden w-full aspect-video">
                  <img src={proje.image} alt={"".concat(proje.ad, " projesi")} className="object-cover w-full h-full"/>
                </div>) : (<div className="bg-gray-100 rounded-lg w-full aspect-video flex items-center justify-center">
                  <lucide_react_1.Building2 className="h-16 w-16 text-gray-300"/>
                  <span className="sr-only">Proje resmi bulunmuyor</span>
                </div>)}
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Bloklar Bölümü */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bloklar</h2>
          <button_1.Button onClick={function () { return setIsAddBlokOpen(true); }}>
            <lucide_react_1.PlusCircle className="h-4 w-4 mr-2"/>
            Yeni Blok Ekle
          </button_1.Button>
        </div>

        {!bloklar || bloklar.length === 0 ? (<div className="text-center py-8 bg-gray-50 rounded-lg">
            <lucide_react_1.Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4"/>
            <h2 className="text-xl font-bold mb-2">Henüz blok bulunmuyor</h2>
            <p className="text-gray-500 mb-4">Bu projeye blok ekleyerek başlayın.</p>
            <button_1.Button onClick={function () { return setIsAddBlokOpen(true); }}>
              <lucide_react_1.PlusCircle className="h-4 w-4 mr-2"/>
              Blok Ekle
            </button_1.Button>
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bloklar.map(function (blok) { return (<link_1.default href={"/dashboard/projeler/".concat(projeId, "/bloklar/").concat(blok.id)} key={blok.id}>
                <card_1.Card className="hover:shadow-md transition-shadow h-full">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <lucide_react_1.Building2 className="h-5 w-5 text-gray-600"/>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{blok.ad}</h3>
                        <p className="text-sm text-gray-500">{blok.ekbilgi || "Açıklama bulunmuyor"}</p>
                        <div className="mt-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {blokDaireCounts[blok.id] || 0} Daire
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button_1.Button size="sm" variant="ghost" onClick={function (e) { e.preventDefault(); openEditBlokModal(blok); }}>
                        <lucide_react_1.Edit className="h-4 w-4"/>
                      </button_1.Button>
                      <button_1.Button size="sm" variant="ghost" className="text-red-500" onClick={function (e) { e.preventDefault(); openDeleteBlokModal(blok); }}>
                        <lucide_react_1.Trash2 className="h-4 w-4"/>
                      </button_1.Button>
                    </div>
                  </div>
                </card_1.Card>
              </link_1.default>); })}
          </div>)}
      </div>

      {/* Blok Ekleme Dialog */}
      <dialog_1.Dialog open={isAddBlokOpen} onOpenChange={setIsAddBlokOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Yeni Blok Ekle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>Blok bilgilerini girin.</dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label_1.Label htmlFor="blokAd">Blok Adı *</label_1.Label>
              <input_1.Input id="blokAd" value={yeniBlokAd} onChange={function (e) { return setYeniBlokAd(e.target.value); }} placeholder="Blok adını girin (örn: A Blok)"/>
            </div>
            <div className="grid gap-2">
              <label_1.Label htmlFor="blokEkbilgi">Ek Bilgi</label_1.Label>
              <textarea_1.Textarea id="blokEkbilgi" value={yeniBlokEkbilgi} onChange={function (e) { return setYeniBlokEkbilgi(e.target.value); }} placeholder="Blok ek bilgisi girin (opsiyonel)" rows={3}/>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={function () { return setIsAddBlokOpen(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button onClick={handleAddBlok}>Ekle</button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Blok Düzenleme Dialog */}
      <dialog_1.Dialog open={isEditBlokOpen} onOpenChange={setIsEditBlokOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Blok Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>Blok bilgilerini güncelleyin.</dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label_1.Label htmlFor="editBlokAd">Blok Adı *</label_1.Label>
              <input_1.Input id="editBlokAd" value={editBlokAd} onChange={function (e) { return setEditBlokAd(e.target.value); }} placeholder="Blok adını girin (örn: A Blok)"/>
            </div>
            <div className="grid gap-2">
              <label_1.Label htmlFor="editBlokEkbilgi">Ek Bilgi</label_1.Label>
              <textarea_1.Textarea id="editBlokEkbilgi" value={editBlokEkbilgi} onChange={function (e) { return setEditBlokEkbilgi(e.target.value); }} placeholder="Blok ek bilgisi girin (opsiyonel)" rows={3}/>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={function () { return setIsEditBlokOpen(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button onClick={handleEditBlok}>Güncelle</button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Blok Silme AlertDialog */}
      <alert_dialog_1.AlertDialog open={isDeleteBlokOpen} onOpenChange={setIsDeleteBlokOpen}>
        <alert_dialog_1.AlertDialogContent>
          <alert_dialog_1.AlertDialogHeader>
            <alert_dialog_1.AlertDialogTitle>Blok Sil</alert_dialog_1.AlertDialogTitle>
            <alert_dialog_1.AlertDialogDescription>
              Bu işlem geri alınamaz. Bloğu silmek istediğinize emin misiniz?
              Blok silindiğinde, bloğa bağlı tüm daireler de silinecektir.
            </alert_dialog_1.AlertDialogDescription>
          </alert_dialog_1.AlertDialogHeader>
          <alert_dialog_1.AlertDialogFooter>
            <alert_dialog_1.AlertDialogCancel onClick={function () { return setIsDeleteBlokOpen(false); }}>İptal</alert_dialog_1.AlertDialogCancel>
            <alert_dialog_1.AlertDialogAction onClick={handleDeleteBlok} className="bg-red-500 hover:bg-red-600">
              Sil
            </alert_dialog_1.AlertDialogAction>
          </alert_dialog_1.AlertDialogFooter>
        </alert_dialog_1.AlertDialogContent>
      </alert_dialog_1.AlertDialog>

      {/* Proje Düzenleme Dialog */}
      <dialog_1.Dialog open={isEditProjeOpen} onOpenChange={setIsEditProjeOpen}>
        <dialog_1.DialogContent className="max-w-2xl">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Projeyi Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>Proje bilgilerini güncelleyin.</dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label_1.Label htmlFor="projeAd">Proje Adı *</label_1.Label>
                  <input_1.Input id="projeAd" value={editProjeData.ad} onChange={function (e) { return setEditProjeData(__assign(__assign({}, editProjeData), { ad: e.target.value })); }} placeholder="Proje adını girin"/>
                </div>
                <div className="grid gap-2">
                  <label_1.Label htmlFor="projeAdres">Adres *</label_1.Label>
                  <input_1.Input id="projeAdres" value={editProjeData.adres} onChange={function (e) { return setEditProjeData(__assign(__assign({}, editProjeData), { adres: e.target.value })); }} placeholder="Proje adresini girin"/>
                </div>
                <div className="grid gap-2">
                  <label_1.Label htmlFor="projeAciklama">Açıklama</label_1.Label>
                  <textarea_1.Textarea id="projeAciklama" value={editProjeData.ekbilgi} onChange={function (e) { return setEditProjeData(__assign(__assign({}, editProjeData), { ekbilgi: e.target.value })); }} placeholder="Proje açıklaması girin (opsiyonel)" rows={4}/>
                </div>
              </div>
              
              <div className="space-y-4">
                <label_1.Label>Proje Resmi</label_1.Label>
                <div className="border rounded-md p-4">
                  {imagePreview ? (<div className="space-y-3">
                      <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
                        <img src={imagePreview} alt="Proje resmi önizleme" className="object-cover w-full h-full"/>
                      </div>
                      <div className="flex gap-2">
                        <label htmlFor="projeResimDegistir" className="cursor-pointer text-xs text-blue-600 hover:text-blue-800">
                          Değiştir
                        </label>
                        <span className="text-gray-300">|</span>
                        <button type="button" onClick={handleRemoveImage} className="text-xs text-red-600 hover:text-red-800">
                          Kaldır
                        </button>
                      </div>
                    </div>) : (<div className="space-y-3">
                      <div className="aspect-video rounded-md bg-gray-100 flex items-center justify-center">
                        <lucide_react_1.Building2 className="h-16 w-16 text-gray-300"/>
                      </div>
                      <label htmlFor="projeResimDegistir" className="cursor-pointer block text-center text-sm text-blue-600 hover:text-blue-800">
                        Resim Ekle
                      </label>
                    </div>)}
                  <input id="projeResimDegistir" type="file" accept="image/jpeg, image/png" onChange={handleFileChange} className="hidden"/>
                  <p className="text-xs text-gray-500 mt-2">
                    En fazla 5MB boyutunda JPG veya PNG formatında bir resim yükleyin
                  </p>
                </div>
              </div>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={function () {
            // Kaynakları temizle
            if (imagePreview && selectedImageFile) {
                URL.revokeObjectURL(imagePreview);
            }
            setSelectedImageFile(null);
            setIsEditProjeOpen(false);
        }}>
              İptal
            </button_1.Button>
            <button_1.Button onClick={handleEditProje}>Güncelle</button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Proje Silme AlertDialog */}
      <alert_dialog_1.AlertDialog open={isDeleteProjeOpen} onOpenChange={setIsDeleteProjeOpen}>
        <alert_dialog_1.AlertDialogContent>
          <alert_dialog_1.AlertDialogHeader>
            <alert_dialog_1.AlertDialogTitle>Proje Sil</alert_dialog_1.AlertDialogTitle>
            <alert_dialog_1.AlertDialogDescription>
              Bu işlem geri alınamaz. Projeyi silmek istediğinize emin misiniz?
              Proje silindiğinde, projeye bağlı tüm bloklar ve daireler de silinecektir.
            </alert_dialog_1.AlertDialogDescription>
          </alert_dialog_1.AlertDialogHeader>
          <alert_dialog_1.AlertDialogFooter>
            <alert_dialog_1.AlertDialogCancel onClick={function () { return setIsDeleteProjeOpen(false); }}>İptal</alert_dialog_1.AlertDialogCancel>
            <alert_dialog_1.AlertDialogAction onClick={handleDeleteProje} className="bg-red-500 hover:bg-red-600">
              Sil
            </alert_dialog_1.AlertDialogAction>
          </alert_dialog_1.AlertDialogFooter>
        </alert_dialog_1.AlertDialogContent>
      </alert_dialog_1.AlertDialog>
    </div>);
}
