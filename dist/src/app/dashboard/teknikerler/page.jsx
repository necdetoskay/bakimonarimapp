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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeknikerlerPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_2 = require("next-auth/react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var checkbox_1 = require("@/components/ui/checkbox");
var use_toast_1 = require("@/hooks/use-toast");
function TeknikerlerPage() {
    var _this = this;
    var session = (0, react_2.useSession)().data;
    var router = (0, navigation_1.useRouter)();
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)([]), teknikerler = _a[0], setTeknikerler = _a[1];
    var _b = (0, react_1.useState)([]), uzmanlikAlanlari = _b[0], setUzmanlikAlanlari = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(false), isAddOpen = _d[0], setIsAddOpen = _d[1];
    var _e = (0, react_1.useState)(false), isEditOpen = _e[0], setIsEditOpen = _e[1];
    var _f = (0, react_1.useState)(false), isDeleteOpen = _f[0], setIsDeleteOpen = _f[1];
    var _g = (0, react_1.useState)(null), selectedTekniker = _g[0], setSelectedTekniker = _g[1];
    // Form state
    var _h = (0, react_1.useState)(""), adsoyad = _h[0], setAdsoyad = _h[1];
    var _j = (0, react_1.useState)(""), telefon = _j[0], setTelefon = _j[1];
    var _k = (0, react_1.useState)(""), ekbilgi = _k[0], setEkbilgi = _k[1];
    var _l = (0, react_1.useState)([]), selectedUzmanlikAlanlari = _l[0], setSelectedUzmanlikAlanlari = _l[1];
    // Tekniker ve Uzmanlık alanlarını getir
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var teknikerlerResponse, teknikerlerData, uzmanlikAlanlariResponse, uzmanlikAlanlariData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, fetch("/api/teknikerler")];
                    case 1:
                        teknikerlerResponse = _a.sent();
                        if (!teknikerlerResponse.ok) {
                            throw new Error("Teknikerler getirilemedi");
                        }
                        return [4 /*yield*/, teknikerlerResponse.json()];
                    case 2:
                        teknikerlerData = _a.sent();
                        setTeknikerler(teknikerlerData);
                        return [4 /*yield*/, fetch("/api/uzmanlik-alanlari")];
                    case 3:
                        uzmanlikAlanlariResponse = _a.sent();
                        if (!uzmanlikAlanlariResponse.ok) {
                            throw new Error("Uzmanlık alanları getirilemedi");
                        }
                        return [4 /*yield*/, uzmanlikAlanlariResponse.json()];
                    case 4:
                        uzmanlikAlanlariData = _a.sent();
                        setUzmanlikAlanlari(uzmanlikAlanlariData);
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        console.error("Hata:", error_1);
                        toast({
                            title: "Hata",
                            description: "Veriler yüklenirken bir hata oluştu",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        if (session) {
            fetchData();
        }
    }, [session, toast]);
    // Uzmanlık alanı checkbox durumu değiştiğinde
    var handleUzmanlikAlaniToggle = function (uzmanlikAlaniId) {
        setSelectedUzmanlikAlanlari(function (prev) {
            if (prev.includes(uzmanlikAlaniId)) {
                return prev.filter(function (id) { return id !== uzmanlikAlaniId; });
            }
            else {
                return __spreadArray(__spreadArray([], prev, true), [uzmanlikAlaniId], false);
            }
        });
    };
    // Yeni tekniker ekle
    var handleAddTekniker = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, teknikerlerResponse, teknikerlerData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/teknikerler", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                adsoyad: adsoyad,
                                telefon: telefon,
                                ekbilgi: ekbilgi,
                                uzmanlikAlanlariIds: selectedUzmanlikAlanlari
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Tekniker eklenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/teknikerler")];
                case 4:
                    teknikerlerResponse = _a.sent();
                    return [4 /*yield*/, teknikerlerResponse.json()];
                case 5:
                    teknikerlerData = _a.sent();
                    setTeknikerler(teknikerlerData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsAddOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Tekniker başarıyla eklendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Hata:", error_2);
                    toast({
                        title: "Hata",
                        description: error_2.message || "Tekniker eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Tekniker düzenle
    var handleEditTekniker = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, teknikerlerResponse, teknikerlerData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedTekniker)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/teknikerler/".concat(selectedTekniker.id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                adsoyad: adsoyad,
                                telefon: telefon,
                                ekbilgi: ekbilgi,
                                uzmanlikAlanlariIds: selectedUzmanlikAlanlari
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Tekniker güncellenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/teknikerler")];
                case 4:
                    teknikerlerResponse = _a.sent();
                    return [4 /*yield*/, teknikerlerResponse.json()];
                case 5:
                    teknikerlerData = _a.sent();
                    setTeknikerler(teknikerlerData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsEditOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Tekniker başarıyla güncellendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error("Hata:", error_3);
                    toast({
                        title: "Hata",
                        description: error_3.message || "Tekniker güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Tekniker sil
    var handleDeleteTekniker = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, teknikerlerResponse, teknikerlerData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedTekniker)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/teknikerler/".concat(selectedTekniker.id), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Tekniker silinirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/teknikerler")];
                case 4:
                    teknikerlerResponse = _a.sent();
                    return [4 /*yield*/, teknikerlerResponse.json()];
                case 5:
                    teknikerlerData = _a.sent();
                    setTeknikerler(teknikerlerData);
                    // Modal'ı kapat
                    setIsDeleteOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Tekniker başarıyla silindi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error("Hata:", error_4);
                    toast({
                        title: "Hata",
                        description: error_4.message || "Tekniker silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Form değerlerini seçilen tekniker ile doldur
    var editTekniker = function (tekniker) {
        setSelectedTekniker(tekniker);
        setAdsoyad(tekniker.adsoyad);
        setTelefon(tekniker.telefon || "");
        setEkbilgi(tekniker.ekbilgi || "");
        // Seçili uzmanlık alanlarını ayarla
        var uzmanlikAlanlariIds = tekniker.uzmanlikAlanlari.map(function (alan) { return alan.id; });
        setSelectedUzmanlikAlanlari(uzmanlikAlanlariIds);
        setIsEditOpen(true);
    };
    // Silme modal'ını aç
    var deleteTekniker = function (tekniker) {
        setSelectedTekniker(tekniker);
        setIsDeleteOpen(true);
    };
    // Form değerlerini temizle
    var resetForm = function () {
        setAdsoyad("");
        setTelefon("");
        setEkbilgi("");
        setSelectedUzmanlikAlanlari([]);
        setSelectedTekniker(null);
    };
    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Tekniker Yönetimi</h2>
        <dialog_1.Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button onClick={function () { return resetForm(); }}>Yeni Tekniker</button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent className="max-w-md">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Yeni Tekniker Ekle</dialog_1.DialogTitle>
              <dialog_1.DialogDescription>
                Tekniker bilgilerini doldurun ve ekle butonuna tıklayın.
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>
            <form onSubmit={handleAddTekniker}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="adsoyad" className="text-right">
                    Ad Soyad
                  </label_1.Label>
                  <input_1.Input id="adsoyad" value={adsoyad} onChange={function (e) { return setAdsoyad(e.target.value); }} className="col-span-3" required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="telefon" className="text-right">
                    Telefon
                  </label_1.Label>
                  <input_1.Input id="telefon" value={telefon} onChange={function (e) { return setTelefon(e.target.value); }} className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label_1.Label htmlFor="ekbilgi" className="text-right pt-2">
                    Ek Bilgi
                  </label_1.Label>
                  <textarea_1.Textarea id="ekbilgi" value={ekbilgi} onChange={function (e) { return setEkbilgi(e.target.value); }} className="col-span-3" rows={4}/>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label_1.Label className="text-right pt-2">
                    Uzmanlık Alanları
                  </label_1.Label>
                  <div className="col-span-3 space-y-3">
                    {uzmanlikAlanlari.map(function (alan) { return (<div key={alan.id} className="flex items-center space-x-2">
                        <checkbox_1.Checkbox id={"uzmanlik-".concat(alan.id)} checked={selectedUzmanlikAlanlari.includes(alan.id)} onCheckedChange={function () { return handleUzmanlikAlaniToggle(alan.id); }}/>
                        <label_1.Label htmlFor={"uzmanlik-".concat(alan.id)} className="text-sm cursor-pointer">
                          {alan.ad}
                        </label_1.Label>
                      </div>); })}
                    {uzmanlikAlanlari.length === 0 && (<div className="text-sm text-muted-foreground">
                        Henüz uzmanlık alanı bulunmamaktadır.
                      </div>)}
                  </div>
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
          <card_1.CardTitle>Teknikerler</card_1.CardTitle>
          <card_1.CardDescription>
            Sistemdeki tüm teknikerler
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          {teknikerler.length === 0 ? (<div className="text-center p-4 text-muted-foreground">
              Henüz tekniker bulunmamaktadır.
            </div>) : (<div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">Ad Soyad</th>
                    <th className="p-2 text-left">Telefon</th>
                    <th className="p-2 text-left">Uzmanlık Alanları</th>
                    <th className="p-2 text-left">Ek Bilgi</th>
                    <th className="p-2 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {teknikerler.map(function (tekniker) { return (<tr key={tekniker.id} className="border-b">
                      <td className="p-2">{tekniker.adsoyad}</td>
                      <td className="p-2">{tekniker.telefon || "-"}</td>
                      <td className="p-2">
                        {tekniker.uzmanlikAlanlari.length > 0 ? (<div className="flex flex-wrap gap-1">
                            {tekniker.uzmanlikAlanlari.map(function (alan) { return (<span key={alan.id} className="inline-block px-2 py-1 text-xs bg-slate-100 rounded">
                                {alan.ad}
                              </span>); })}
                          </div>) : "-"}
                      </td>
                      <td className="p-2">{tekniker.ekbilgi || "-"}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button_1.Button variant="outline" size="sm" onClick={function () { return editTekniker(tekniker); }}>
                            Düzenle
                          </button_1.Button>
                          <button_1.Button variant="destructive" size="sm" onClick={function () { return deleteTekniker(tekniker); }}>
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
        <dialog_1.DialogContent className="max-w-md">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Tekniker Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Tekniker bilgilerini güncelleyin.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleEditTekniker}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="edit-adsoyad" className="text-right">
                  Ad Soyad
                </label_1.Label>
                <input_1.Input id="edit-adsoyad" value={adsoyad} onChange={function (e) { return setAdsoyad(e.target.value); }} className="col-span-3" required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="edit-telefon" className="text-right">
                  Telefon
                </label_1.Label>
                <input_1.Input id="edit-telefon" value={telefon} onChange={function (e) { return setTelefon(e.target.value); }} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label_1.Label htmlFor="edit-ekbilgi" className="text-right pt-2">
                  Ek Bilgi
                </label_1.Label>
                <textarea_1.Textarea id="edit-ekbilgi" value={ekbilgi} onChange={function (e) { return setEkbilgi(e.target.value); }} className="col-span-3" rows={4}/>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label_1.Label className="text-right pt-2">
                  Uzmanlık Alanları
                </label_1.Label>
                <div className="col-span-3 space-y-3">
                  {uzmanlikAlanlari.map(function (alan) { return (<div key={alan.id} className="flex items-center space-x-2">
                      <checkbox_1.Checkbox id={"edit-uzmanlik-".concat(alan.id)} checked={selectedUzmanlikAlanlari.includes(alan.id)} onCheckedChange={function () { return handleUzmanlikAlaniToggle(alan.id); }}/>
                      <label_1.Label htmlFor={"edit-uzmanlik-".concat(alan.id)} className="text-sm cursor-pointer">
                        {alan.ad}
                      </label_1.Label>
                    </div>); })}
                </div>
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
            <dialog_1.DialogTitle>Tekniker Sil</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Bu işlem geri alınamaz. Teknikeri silmek istediğinize emin misiniz?
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedTekniker === null || selectedTekniker === void 0 ? void 0 : selectedTekniker.adsoyad}</strong> adlı teknikeri silmek üzeresiniz.
            </p>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setIsDeleteOpen(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button type="button" variant="destructive" onClick={handleDeleteTekniker}>
              Sil
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
