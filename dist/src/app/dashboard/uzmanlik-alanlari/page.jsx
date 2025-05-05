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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UzmanlikAlanlariPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_2 = require("next-auth/react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var use_toast_1 = require("@/hooks/use-toast");
var lucide_react_1 = require("lucide-react");
function UzmanlikAlanlariPage() {
    var _this = this;
    var session = (0, react_2.useSession)().data;
    var router = (0, navigation_1.useRouter)();
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)([]), uzmanlikAlanlari = _a[0], setUzmanlikAlanlari = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(false), isAddOpen = _c[0], setIsAddOpen = _c[1];
    var _d = (0, react_1.useState)(false), isEditOpen = _d[0], setIsEditOpen = _d[1];
    var _e = (0, react_1.useState)(false), isDeleteOpen = _e[0], setIsDeleteOpen = _e[1];
    var _f = (0, react_1.useState)(null), selectedUzmanlikAlani = _f[0], setSelectedUzmanlikAlani = _f[1];
    // Form state
    var _g = (0, react_1.useState)(""), ad = _g[0], setAd = _g[1];
    var _h = (0, react_1.useState)(""), ekbilgi = _h[0], setEkbilgi = _h[1];
    // Uzmanlık alanlarını getir
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, fetch("/api/uzmanlik-alanlari")];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Uzmanlık alanları getirilemedi");
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setUzmanlikAlanlari(data);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Hata:", error_1);
                        toast({
                            title: "Hata",
                            description: "Veriler yüklenirken bir hata oluştu",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        if (session) {
            fetchData();
        }
    }, [session, toast]);
    // Yeni uzmanlık alanı ekle
    var handleAddUzmanlikAlani = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, uzmanlikAlanlariResponse, uzmanlikAlanlariData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/uzmanlik-alanlari", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ ad: ad, ekbilgi: ekbilgi }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || "Uzmanlık alanı eklenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/uzmanlik-alanlari")];
                case 4:
                    uzmanlikAlanlariResponse = _a.sent();
                    return [4 /*yield*/, uzmanlikAlanlariResponse.json()];
                case 5:
                    uzmanlikAlanlariData = _a.sent();
                    setUzmanlikAlanlari(uzmanlikAlanlariData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsAddOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Uzmanlık alanı başarıyla eklendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Hata:", error_2);
                    toast({
                        title: "Hata",
                        description: error_2.message || "Uzmanlık alanı eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Uzmanlık alanı düzenle
    var handleEditUzmanlikAlani = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, uzmanlikAlanlariResponse, uzmanlikAlanlariData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedUzmanlikAlani)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/uzmanlik-alanlari/".concat(selectedUzmanlikAlani.id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ ad: ad, ekbilgi: ekbilgi }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || "Uzmanlık alanı güncellenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/uzmanlik-alanlari")];
                case 4:
                    uzmanlikAlanlariResponse = _a.sent();
                    return [4 /*yield*/, uzmanlikAlanlariResponse.json()];
                case 5:
                    uzmanlikAlanlariData = _a.sent();
                    setUzmanlikAlanlari(uzmanlikAlanlariData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsEditOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Uzmanlık alanı başarıyla güncellendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error("Hata:", error_3);
                    toast({
                        title: "Hata",
                        description: error_3.message || "Uzmanlık alanı güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Uzmanlık alanı sil
    var handleDeleteUzmanlikAlani = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, uzmanlikAlanlariResponse, uzmanlikAlanlariData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedUzmanlikAlani)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/uzmanlik-alanlari/".concat(selectedUzmanlikAlani.id), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || "Uzmanlık alanı silinirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/uzmanlik-alanlari")];
                case 4:
                    uzmanlikAlanlariResponse = _a.sent();
                    return [4 /*yield*/, uzmanlikAlanlariResponse.json()];
                case 5:
                    uzmanlikAlanlariData = _a.sent();
                    setUzmanlikAlanlari(uzmanlikAlanlariData);
                    // Modal'ı kapat
                    setIsDeleteOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Uzmanlık alanı başarıyla silindi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error("Hata:", error_4);
                    toast({
                        title: "Hata",
                        description: error_4.message || "Uzmanlık alanı silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Form değerlerini seçilen uzmanlık alanı ile doldur
    var editUzmanlikAlani = function (uzmanlikAlani) {
        setSelectedUzmanlikAlani(uzmanlikAlani);
        setAd(uzmanlikAlani.ad);
        setEkbilgi(uzmanlikAlani.ekbilgi || "");
        setIsEditOpen(true);
    };
    // Silme modal'ını aç
    var deleteUzmanlikAlani = function (uzmanlikAlani) {
        setSelectedUzmanlikAlani(uzmanlikAlani);
        setIsDeleteOpen(true);
    };
    // Form değerlerini temizle
    var resetForm = function () {
        setAd("");
        setEkbilgi("");
        setSelectedUzmanlikAlani(null);
    };
    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Uzmanlık Alanları</h2>
        <dialog_1.Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button onClick={function () { return resetForm(); }}>Yeni Uzmanlık Alanı</button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent>
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Yeni Uzmanlık Alanı Ekle</dialog_1.DialogTitle>
              <dialog_1.DialogDescription>
                Uzmanlık alanı bilgilerini doldurun ve ekle butonuna tıklayın.
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>
            <form onSubmit={handleAddUzmanlikAlani}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="ad" className="text-right">
                    Ad
                  </label_1.Label>
                  <input_1.Input id="ad" value={ad} onChange={function (e) { return setAd(e.target.value); }} className="col-span-3" required/>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label_1.Label htmlFor="ekbilgi" className="text-right pt-2">
                    Ek Bilgi
                  </label_1.Label>
                  <textarea_1.Textarea id="ekbilgi" value={ekbilgi} onChange={function (e) { return setEkbilgi(e.target.value); }} className="col-span-3" rows={4}/>
                </div>
              </div>
              <dialog_1.DialogFooter>
                <button_1.Button type="button" variant="outline" onClick={function () { return setIsAddOpen(false); }}>
                  İptal
                </button_1.Button>
                <button_1.Button type="submit">Ekle</button_1.Button>
              </dialog_1.DialogFooter>
            </form>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </div>
      
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardDescription>
            Sistemdeki tüm uzmanlık alanları
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="bg-slate-100 p-6">
          {uzmanlikAlanlari.length === 0 ? (<div className="text-center p-4 bg-white rounded-md text-muted-foreground">
              Henüz uzmanlık alanı bulunmamaktadır.
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uzmanlikAlanlari.map(function (uzmanlikAlani) { return (<card_1.Card key={uzmanlikAlani.id} className="overflow-hidden h-full bg-white shadow-sm relative">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-lg">{uzmanlikAlani.ad}</card_1.CardTitle>
                    {uzmanlikAlani.teknikerler && uzmanlikAlani.teknikerler.length > 0 && (<card_1.CardDescription>
                        {uzmanlikAlani.teknikerler.length} tekniker tarafından kullanılıyor
                      </card_1.CardDescription>)}
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <p className="text-sm text-gray-600">
                      {uzmanlikAlani.ekbilgi || "Ek bilgi bulunmamaktadır."}
                    </p>
                  </card_1.CardContent>
                  <div className="absolute bottom-3 right-3 flex space-x-1">
                    <button_1.Button variant="ghost" size="icon" onClick={function () { return editUzmanlikAlani(uzmanlikAlani); }} className="h-8 w-8 text-slate-600 hover:text-slate-900">
                      <lucide_react_1.Edit className="h-4 w-4"/>
                    </button_1.Button>
                    <button_1.Button variant="ghost" size="icon" onClick={function () { return deleteUzmanlikAlani(uzmanlikAlani); }} className="h-8 w-8 text-rose-600 hover:text-rose-900">
                      <lucide_react_1.Trash2 className="h-4 w-4"/>
                    </button_1.Button>
                  </div>
                </card_1.Card>); })}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
      
      {/* Düzenleme Modal */}
      <dialog_1.Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Uzmanlık Alanı Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Uzmanlık alanı bilgilerini güncelleyin.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleEditUzmanlikAlani}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="edit-ad" className="text-right">
                  Ad
                </label_1.Label>
                <input_1.Input id="edit-ad" value={ad} onChange={function (e) { return setAd(e.target.value); }} className="col-span-3" required/>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label_1.Label htmlFor="edit-ekbilgi" className="text-right pt-2">
                  Ek Bilgi
                </label_1.Label>
                <textarea_1.Textarea id="edit-ekbilgi" value={ekbilgi} onChange={function (e) { return setEkbilgi(e.target.value); }} className="col-span-3" rows={4}/>
              </div>
            </div>
            <dialog_1.DialogFooter>
              <button_1.Button type="button" variant="outline" onClick={function () { return setIsEditOpen(false); }}>
                İptal
              </button_1.Button>
              <button_1.Button type="submit">Güncelle</button_1.Button>
            </dialog_1.DialogFooter>
          </form>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
      
      {/* Silme Modal */}
      <dialog_1.Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Uzmanlık Alanı Sil</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Bu işlem geri alınamaz. Uzmanlık alanını silmek istediğinize emin misiniz?
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedUzmanlikAlani === null || selectedUzmanlikAlani === void 0 ? void 0 : selectedUzmanlikAlani.ad}</strong> adlı uzmanlık alanını silmek üzeresiniz.
            </p>
            {(selectedUzmanlikAlani === null || selectedUzmanlikAlani === void 0 ? void 0 : selectedUzmanlikAlani.teknikerler) && selectedUzmanlikAlani.teknikerler.length > 0 && (<p className="text-red-500 mt-2">
                Bu uzmanlık alanı {selectedUzmanlikAlani.teknikerler.length} tekniker tarafından kullanılıyor.
                Silmeden önce ilişkiyi kaldırmalısınız.
              </p>)}
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setIsDeleteOpen(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button type="button" variant="destructive" onClick={handleDeleteUzmanlikAlani}>
              Sil
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
