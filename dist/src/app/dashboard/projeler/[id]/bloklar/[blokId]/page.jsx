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
exports.default = BlokDetayPage;
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
var link_1 = __importDefault(require("next/link"));
function BlokDetayPage(_a) {
    var _this = this;
    var _b;
    var params = _a.params;
    var session = (0, react_2.useSession)().data;
    var router = (0, navigation_1.useRouter)();
    var toast = (0, use_toast_1.useToast)().toast;
    var _c = (0, react_1.useState)(null), blok = _c[0], setBlok = _c[1];
    var _d = (0, react_1.useState)(null), proje = _d[0], setProje = _d[1];
    var _e = (0, react_1.useState)([]), daireler = _e[0], setDaireler = _e[1];
    var _f = (0, react_1.useState)(true), isLoading = _f[0], setIsLoading = _f[1];
    var _g = (0, react_1.useState)(false), isAddDaireOpen = _g[0], setIsAddDaireOpen = _g[1];
    var _h = (0, react_1.useState)(false), isEditDaireOpen = _h[0], setIsEditDaireOpen = _h[1];
    var _j = (0, react_1.useState)(false), isDeleteDaireOpen = _j[0], setIsDeleteDaireOpen = _j[1];
    var _k = (0, react_1.useState)(null), selectedDaire = _k[0], setSelectedDaire = _k[1];
    // Daire form state
    var _l = (0, react_1.useState)(""), daireNumara = _l[0], setDaireNumara = _l[1];
    var _m = (0, react_1.useState)(""), daireKat = _m[0], setDaireKat = _m[1];
    var _o = (0, react_1.useState)(""), daireEkbilgi = _o[0], setDaireEkbilgi = _o[1];
    // Blok ve daireleri getir
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var blokResponse, blokData, projeResponse, projeData, dairelerResponse, dairelerData, _a, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 11, 12, 13]);
                        if (!session)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch("/api/bloklar/".concat(params.blokId))];
                    case 1:
                        blokResponse = _d.sent();
                        if (!blokResponse.ok) {
                            if (blokResponse.status === 404) {
                                router.push("/dashboard/projeler/".concat(params.id));
                                return [2 /*return*/];
                            }
                            throw new Error("Blok getirilemedi");
                        }
                        return [4 /*yield*/, blokResponse.json()];
                    case 2:
                        blokData = _d.sent();
                        setBlok(blokData);
                        return [4 /*yield*/, fetch("/api/projeler/".concat(params.id))];
                    case 3:
                        projeResponse = _d.sent();
                        if (!projeResponse.ok) return [3 /*break*/, 5];
                        return [4 /*yield*/, projeResponse.json()];
                    case 4:
                        projeData = _d.sent();
                        setProje(projeData);
                        _d.label = 5;
                    case 5: return [4 /*yield*/, fetch("/api/daireler?blokId=".concat(params.blokId))];
                    case 6:
                        dairelerResponse = _d.sent();
                        if (!dairelerResponse.ok) return [3 /*break*/, 8];
                        return [4 /*yield*/, dairelerResponse.json()];
                    case 7:
                        dairelerData = _d.sent();
                        setDaireler(dairelerData);
                        return [3 /*break*/, 10];
                    case 8:
                        _b = (_a = console).error;
                        _c = ["Daireler getirilemedi:"];
                        return [4 /*yield*/, dairelerResponse.text()];
                    case 9:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        _d.label = 10;
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        error_1 = _d.sent();
                        console.error("Hata:", error_1);
                        toast({
                            title: "Hata",
                            description: "Veriler yüklenirken bir hata oluştu",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 13];
                    case 12:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [session, params.blokId, params.id, router, toast]);
    // Yeni daire ekle
    var handleAddDaire = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, dairelerResponse, dairelerData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/daireler", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                numara: daireNumara,
                                kat: daireKat,
                                ekbilgi: daireEkbilgi,
                                blokId: params.blokId
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || "Daire eklenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/daireler?blokId=".concat(params.blokId))];
                case 4:
                    dairelerResponse = _a.sent();
                    return [4 /*yield*/, dairelerResponse.json()];
                case 5:
                    dairelerData = _a.sent();
                    setDaireler(dairelerData);
                    // Formu temizle ve modal'ı kapat
                    resetDaireForm();
                    setIsAddDaireOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Daire başarıyla eklendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Hata:", error_2);
                    toast({
                        title: "Hata",
                        description: error_2.message || "Daire eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Daire güncelle
    var handleUpdateDaire = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, dairelerResponse, dairelerData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedDaire)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/daireler/".concat(selectedDaire.id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                numara: daireNumara,
                                kat: daireKat,
                                ekbilgi: daireEkbilgi
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || "Daire güncellenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/daireler?blokId=".concat(params.blokId))];
                case 4:
                    dairelerResponse = _a.sent();
                    return [4 /*yield*/, dairelerResponse.json()];
                case 5:
                    dairelerData = _a.sent();
                    setDaireler(dairelerData);
                    // Formu temizle ve modal'ı kapat
                    resetDaireForm();
                    setIsEditDaireOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Daire başarıyla güncellendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error("Hata:", error_3);
                    toast({
                        title: "Hata",
                        description: error_3.message || "Daire güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Daire sil
    var handleDeleteDaire = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, dairelerResponse, dairelerData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedDaire)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/daireler/".concat(selectedDaire.id), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || "Daire silinirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/daireler?blokId=".concat(params.blokId))];
                case 4:
                    dairelerResponse = _a.sent();
                    return [4 /*yield*/, dairelerResponse.json()];
                case 5:
                    dairelerData = _a.sent();
                    setDaireler(dairelerData);
                    // Modal'ı kapat
                    setIsDeleteDaireOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Daire başarıyla silindi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error("Hata:", error_4);
                    toast({
                        title: "Hata",
                        description: error_4.message || "Daire silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Form değerlerini daireyle doldur
    var editDaire = function (daire) {
        setSelectedDaire(daire);
        setDaireNumara(daire.numara);
        setDaireKat(daire.kat || "");
        setDaireEkbilgi(daire.ekbilgi || "");
        setIsEditDaireOpen(true);
    };
    // Silme modal'ını aç
    var deleteDaire = function (daire) {
        setSelectedDaire(daire);
        setIsDeleteDaireOpen(true);
    };
    // Formu temizle
    var resetDaireForm = function () {
        setDaireNumara("");
        setDaireKat("");
        setDaireEkbilgi("");
        setSelectedDaire(null);
    };
    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }
    if (!blok) {
        return <div className="text-center p-10">Blok bulunamadı.</div>;
    }
    return (<div className="space-y-6">
      {/* Üst kısım */}
      <div className="flex items-center space-x-2">
        <button_1.Button variant="ghost" size="sm" asChild>
          <link_1.default href={"/dashboard/projeler/".concat(params.id)}>
            <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
            Geri
          </link_1.default>
        </button_1.Button>
        <h2 className="text-3xl font-bold tracking-tight">{blok.ad} Blok</h2>
      </div>
      
      {/* Blok Bilgileri */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold mb-4">Blok Bilgisi</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700">Proje:</h4>
            <p className="flex items-center gap-1 text-gray-600">
              <lucide_react_1.Building2 className="h-4 w-4"/>
              {proje ? proje.ad : ((_b = blok.proje) === null || _b === void 0 ? void 0 : _b.ad) || "Bilinmiyor"}
            </p>
          </div>
          
          {blok.ekbilgi && (<div>
              <h4 className="font-medium text-gray-700">Açıklama:</h4>
              <p className="text-gray-600">{blok.ekbilgi}</p>
            </div>)}
          
          <div>
            <h4 className="font-medium text-gray-700">Daire Sayısı:</h4>
            <p className="text-gray-600">{daireler.length}</p>
          </div>
        </div>
      </div>
      
      {/* Daireler Başlık */}
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-xl font-semibold">Daireler</h3>
        <dialog_1.Dialog open={isAddDaireOpen} onOpenChange={setIsAddDaireOpen}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button onClick={function () { return resetDaireForm(); }}>
              <lucide_react_1.PlusCircle className="h-4 w-4 mr-2"/>
              Yeni Daire Ekle
            </button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent>
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Yeni Daire Ekle</dialog_1.DialogTitle>
              <dialog_1.DialogDescription>
                Daire bilgilerini doldurun ve ekle butonuna tıklayın.
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>
            <form onSubmit={handleAddDaire}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label_1.Label htmlFor="daire-numara">Daire No</label_1.Label>
                    <input_1.Input id="daire-numara" value={daireNumara} onChange={function (e) { return setDaireNumara(e.target.value); }} className="w-full mt-1" required/>
                  </div>
                  
                  <div>
                    <label_1.Label htmlFor="daire-kat">Kat</label_1.Label>
                    <input_1.Input id="daire-kat" value={daireKat} onChange={function (e) { return setDaireKat(e.target.value); }} className="w-full mt-1" placeholder="Örn: 1, 2, 3..."/>
                  </div>
                </div>
                
                <div>
                  <label_1.Label htmlFor="daire-ekbilgi">Ek Bilgi</label_1.Label>
                  <textarea_1.Textarea id="daire-ekbilgi" value={daireEkbilgi} onChange={function (e) { return setDaireEkbilgi(e.target.value); }} className="w-full mt-1" rows={3} placeholder="Oda sayısı, metrekare vb."/>
                </div>
              </div>
              
              <dialog_1.DialogFooter>
                <button_1.Button type="button" variant="outline" onClick={function () { return setIsAddDaireOpen(false); }}>
                  İptal
                </button_1.Button>
                <button_1.Button type="submit">Ekle</button_1.Button>
              </dialog_1.DialogFooter>
            </form>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </div>
      
      {/* Daireler Listesi */}
      {daireler.length === 0 ? (<div className="text-center p-10 border rounded-lg bg-slate-50">
          <lucide_react_1.Home className="mx-auto h-10 w-10 text-slate-400"/>
          <h3 className="mt-4 text-lg font-medium">Henüz daire bulunmamaktadır</h3>
          <p className="mt-2 text-sm text-slate-500">
            Yeni bir daire eklemek için "Yeni Daire Ekle" butonuna tıklayın.
          </p>
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daireler.map(function (daire) { return (<card_1.Card key={daire.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <link_1.default href={"/dashboard/projeler/".concat(params.id, "/bloklar/").concat(params.blokId, "/daireler/").concat(daire.id)}>
                <card_1.CardHeader className="bg-slate-50 border-b">
                  <card_1.CardTitle className="flex items-center">
                    <lucide_react_1.Home className="h-5 w-5 mr-2"/>
                    {daire.numara} Nolu Daire
                  </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent className="p-4">
                  <div className="space-y-2">
                    {daire.kat && (<div className="flex items-center text-sm text-slate-700">
                        <lucide_react_1.MapPin className="h-3.5 w-3.5 mr-1"/>
                        <span>Kat: {daire.kat}</span>
                      </div>)}
                    <p className="text-sm text-slate-600 min-h-[40px]">
                      {daire.ekbilgi || "Ek bilgi bulunmuyor."}
                    </p>
                  </div>
                </card_1.CardContent>
              </link_1.default>
              <card_1.CardFooter className="flex justify-between border-t pt-4">
                <button_1.Button variant="outline" size="sm" onClick={function () { return editDaire(daire); }}>
                  <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
                  Düzenle
                </button_1.Button>
                <button_1.Button variant="destructive" size="sm" onClick={function () { return deleteDaire(daire); }}>
                  <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                  Sil
                </button_1.Button>
              </card_1.CardFooter>
            </card_1.Card>); })}
        </div>)}
      
      {/* Daire Düzenleme Modal */}
      <dialog_1.Dialog open={isEditDaireOpen} onOpenChange={setIsEditDaireOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Daire Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Daire bilgilerini güncelleyin ve güncelle butonuna tıklayın.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleUpdateDaire}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label_1.Label htmlFor="edit-daire-numara">Daire No</label_1.Label>
                  <input_1.Input id="edit-daire-numara" value={daireNumara} onChange={function (e) { return setDaireNumara(e.target.value); }} className="w-full mt-1" required/>
                </div>
                
                <div>
                  <label_1.Label htmlFor="edit-daire-kat">Kat</label_1.Label>
                  <input_1.Input id="edit-daire-kat" value={daireKat} onChange={function (e) { return setDaireKat(e.target.value); }} className="w-full mt-1" placeholder="Örn: 1, 2, 3..."/>
                </div>
              </div>
              
              <div>
                <label_1.Label htmlFor="edit-daire-ekbilgi">Ek Bilgi</label_1.Label>
                <textarea_1.Textarea id="edit-daire-ekbilgi" value={daireEkbilgi} onChange={function (e) { return setDaireEkbilgi(e.target.value); }} className="w-full mt-1" rows={3}/>
              </div>
            </div>
            
            <dialog_1.DialogFooter>
              <button_1.Button type="button" variant="outline" onClick={function () { return setIsEditDaireOpen(false); }}>
                İptal
              </button_1.Button>
              <button_1.Button type="submit">Güncelle</button_1.Button>
            </dialog_1.DialogFooter>
          </form>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
      
      {/* Daire Silme Modal */}
      <dialog_1.Dialog open={isDeleteDaireOpen} onOpenChange={setIsDeleteDaireOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Daire Sil</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Bu işlem geri alınamaz. Daireyi silmek istediğinize emin misiniz?
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedDaire === null || selectedDaire === void 0 ? void 0 : selectedDaire.numara}</strong> nolu daireyi silmek üzeresiniz.
            </p>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setIsDeleteDaireOpen(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button type="button" variant="destructive" onClick={handleDeleteDaire}>
              Sil
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
