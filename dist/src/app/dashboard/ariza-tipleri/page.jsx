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
exports.default = ArizaTipleriPage;
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
function ArizaTipleriPage() {
    var _this = this;
    var session = (0, react_2.useSession)().data;
    var router = (0, navigation_1.useRouter)();
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)([]), arizaTipleri = _a[0], setArizaTipleri = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(false), isAddOpen = _c[0], setIsAddOpen = _c[1];
    var _d = (0, react_1.useState)(false), isEditOpen = _d[0], setIsEditOpen = _d[1];
    var _e = (0, react_1.useState)(false), isDeleteOpen = _e[0], setIsDeleteOpen = _e[1];
    var _f = (0, react_1.useState)(null), selectedArizaTipi = _f[0], setSelectedArizaTipi = _f[1];
    // Form state
    var _g = (0, react_1.useState)(""), ad = _g[0], setAd = _g[1];
    var _h = (0, react_1.useState)(""), ekbilgi = _h[0], setEkbilgi = _h[1];
    // Arıza tiplerini getir
    (0, react_1.useEffect)(function () {
        var fetchArizaTipleri = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, fetch("/api/ariza-tipleri")];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Arıza tipleri getirilemedi");
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setArizaTipleri(data);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Hata:", error_1);
                        toast({
                            title: "Hata",
                            description: "Arıza tipleri yüklenirken bir hata oluştu",
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
            fetchArizaTipleri();
        }
    }, [session, toast]);
    // Yeni arıza tipi ekle
    var handleAddArizaTipi = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, arizaTipleriResponse, arizaTipleriData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/ariza-tipleri", {
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
                        throw new Error(data.message || "Arıza tipi eklenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/ariza-tipleri")];
                case 4:
                    arizaTipleriResponse = _a.sent();
                    return [4 /*yield*/, arizaTipleriResponse.json()];
                case 5:
                    arizaTipleriData = _a.sent();
                    setArizaTipleri(arizaTipleriData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsAddOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Arıza tipi başarıyla eklendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Hata:", error_2);
                    toast({
                        title: "Hata",
                        description: error_2.message || "Arıza tipi eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Arıza tipi düzenle
    var handleEditArizaTipi = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, arizaTipleriResponse, arizaTipleriData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedArizaTipi)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/ariza-tipleri/".concat(selectedArizaTipi.id), {
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
                        throw new Error(data.message || "Arıza tipi güncellenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/ariza-tipleri")];
                case 4:
                    arizaTipleriResponse = _a.sent();
                    return [4 /*yield*/, arizaTipleriResponse.json()];
                case 5:
                    arizaTipleriData = _a.sent();
                    setArizaTipleri(arizaTipleriData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsEditOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Arıza tipi başarıyla güncellendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error("Hata:", error_3);
                    toast({
                        title: "Hata",
                        description: error_3.message || "Arıza tipi güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Arıza tipi sil
    var handleDeleteArizaTipi = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, arizaTipleriResponse, arizaTipleriData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedArizaTipi)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/ariza-tipleri/".concat(selectedArizaTipi.id), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Arıza tipi silinirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/ariza-tipleri")];
                case 4:
                    arizaTipleriResponse = _a.sent();
                    return [4 /*yield*/, arizaTipleriResponse.json()];
                case 5:
                    arizaTipleriData = _a.sent();
                    setArizaTipleri(arizaTipleriData);
                    // Modal'ı kapat
                    setIsDeleteOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Arıza tipi başarıyla silindi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error("Hata:", error_4);
                    toast({
                        title: "Hata",
                        description: error_4.message || "Arıza tipi silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Form değerlerini seçilen arıza tipi ile doldur
    var editArizaTipi = function (arizaTipi) {
        setSelectedArizaTipi(arizaTipi);
        setAd(arizaTipi.ad);
        setEkbilgi(arizaTipi.ekbilgi || "");
        setIsEditOpen(true);
    };
    // Silme modal'ını aç
    var deleteArizaTipi = function (arizaTipi) {
        setSelectedArizaTipi(arizaTipi);
        setIsDeleteOpen(true);
    };
    // Form değerlerini temizle
    var resetForm = function () {
        setAd("");
        setEkbilgi("");
        setSelectedArizaTipi(null);
    };
    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Arıza Tipleri Yönetimi</h2>
        <dialog_1.Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button onClick={function () { return resetForm(); }}>Yeni Arıza Tipi</button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent>
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Yeni Arıza Tipi Ekle</dialog_1.DialogTitle>
              <dialog_1.DialogDescription>
                Arıza tipi bilgilerini doldurun ve ekle butonuna tıklayın.
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>
            <form onSubmit={handleAddArizaTipi}>
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
          <card_1.CardTitle>Arıza Tipleri</card_1.CardTitle>
          <card_1.CardDescription>
            Sistemdeki tüm arıza tipleri
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          {arizaTipleri.length === 0 ? (<div className="text-center p-4 text-muted-foreground">
              Henüz arıza tipi bulunmamaktadır.
            </div>) : (<div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">Ad</th>
                    <th className="p-2 text-left">Ek Bilgi</th>
                    <th className="p-2 text-left">Oluşturulma Tarihi</th>
                    <th className="p-2 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {arizaTipleri.map(function (arizaTipi) { return (<tr key={arizaTipi.id} className="border-b">
                      <td className="p-2">{arizaTipi.ad}</td>
                      <td className="p-2">{arizaTipi.ekbilgi || "-"}</td>
                      <td className="p-2">{new Date(arizaTipi.createdAt).toLocaleDateString()}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button_1.Button variant="outline" size="sm" onClick={function () { return editArizaTipi(arizaTipi); }}>
                            Düzenle
                          </button_1.Button>
                          <button_1.Button variant="destructive" size="sm" onClick={function () { return deleteArizaTipi(arizaTipi); }}>
                            Sil
                          </button_1.Button>
                        </div>
                      </td>
                    </tr>); })}
                </tbody>
              </table>
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
      
      {/* Düzenleme Modal */}
      <dialog_1.Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Arıza Tipi Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Arıza tipi bilgilerini güncelleyin.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleEditArizaTipi}>
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
            <dialog_1.DialogTitle>Arıza Tipi Sil</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Bu işlem geri alınamaz. Arıza tipini silmek istediğinize emin misiniz?
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedArizaTipi === null || selectedArizaTipi === void 0 ? void 0 : selectedArizaTipi.ad}</strong> arıza tipini silmek üzeresiniz.
            </p>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setIsDeleteOpen(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button type="button" variant="destructive" onClick={handleDeleteArizaTipi}>
              Sil
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
