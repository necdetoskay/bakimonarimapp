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
exports.default = DaireAramaPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var react_2 = require("next-auth/react");
var use_toast_1 = require("@/hooks/use-toast");
var table_1 = require("@/components/ui/table");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var skeleton_1 = require("@/components/ui/skeleton");
function DaireAramaPage() {
    var _this = this;
    var router = (0, navigation_1.useRouter)();
    var _a = (0, react_2.useSession)(), session = _a.data, status = _a.status;
    var toast = (0, use_toast_1.useToast)().toast;
    var _b = (0, react_1.useState)([]), daireler = _b[0], setDaireler = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(""), searchTerm = _d[0], setSearchTerm = _d[1];
    (0, react_1.useEffect)(function () {
        if (status === "loading")
            return;
        if (!session) {
            toast({
                title: "Yetki Hatası",
                description: "Bu sayfayı görüntülemek için giriş yapmalısınız.",
                variant: "destructive",
            });
            router.push("/");
            return;
        }
        var fetchDaireler = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, fetch("/api/daireler")];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Daireler yüklenirken bir hata oluştu");
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setDaireler(data);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Daireler yüklenirken hata:", error_1);
                        toast({
                            title: "Hata",
                            description: "Daireler yüklenirken bir hata oluştu.",
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
        fetchDaireler();
    }, [session, router, toast, status]);
    // Filtreleme işlemi
    var filteredDaireler = daireler.filter(function (daire) {
        var _a, _b, _c;
        var searchLower = searchTerm.toLowerCase();
        return (daire.numara.toLowerCase().includes(searchLower) ||
            (daire.kat && daire.kat.toLowerCase().includes(searchLower)) ||
            (daire.ekbilgi && daire.ekbilgi.toLowerCase().includes(searchLower)) ||
            (((_a = daire.blok) === null || _a === void 0 ? void 0 : _a.ad) && daire.blok.ad.toLowerCase().includes(searchLower)) ||
            (((_c = (_b = daire.blok) === null || _b === void 0 ? void 0 : _b.proje) === null || _c === void 0 ? void 0 : _c.ad) && daire.blok.proje.ad.toLowerCase().includes(searchLower)));
    });
    return (<div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daire Arama</h1>
      </div>
      
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Daire Arama</card_1.CardTitle>
          <card_1.CardDescription>
            Daire, kat, blok veya proje bilgisine göre arama yapın
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="mb-4">
            <input_1.Input type="text" placeholder="Ara..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="max-w-sm"/>
          </div>
          
          {isLoading ? (<div className="space-y-2">
              <skeleton_1.Skeleton className="h-8 w-full"/>
              <skeleton_1.Skeleton className="h-8 w-full"/>
              <skeleton_1.Skeleton className="h-8 w-full"/>
              <skeleton_1.Skeleton className="h-8 w-full"/>
              <skeleton_1.Skeleton className="h-8 w-full"/>
            </div>) : (<div className="border rounded-md">
              {filteredDaireler.length === 0 ? (<div className="py-24 text-center text-muted-foreground">
                  Sonuç bulunamadı
                </div>) : (<div className="overflow-x-auto">
                  <table_1.Table>
                    <table_1.TableHeader>
                      <table_1.TableRow>
                        <table_1.TableHead>Daire No</table_1.TableHead>
                        <table_1.TableHead>Kat</table_1.TableHead>
                        <table_1.TableHead>Ek Bilgi</table_1.TableHead>
                        <table_1.TableHead>Blok</table_1.TableHead>
                        <table_1.TableHead>Proje</table_1.TableHead>
                        <table_1.TableHead>İşlemler</table_1.TableHead>
                      </table_1.TableRow>
                    </table_1.TableHeader>
                    <table_1.TableBody>
                      {filteredDaireler.map(function (daire) {
                    var _a, _b, _c;
                    return (<table_1.TableRow key={daire.id}>
                          <table_1.TableCell>{daire.numara}</table_1.TableCell>
                          <table_1.TableCell>{daire.kat || "-"}</table_1.TableCell>
                          <table_1.TableCell>{daire.ekbilgi || "-"}</table_1.TableCell>
                          <table_1.TableCell>{((_a = daire.blok) === null || _a === void 0 ? void 0 : _a.ad) || "-"}</table_1.TableCell>
                          <table_1.TableCell>{((_c = (_b = daire.blok) === null || _b === void 0 ? void 0 : _b.proje) === null || _c === void 0 ? void 0 : _c.ad) || "-"}</table_1.TableCell>
                          <table_1.TableCell>
                            <button_1.Button variant="outline" size="sm" onClick={function () {
                            var _a;
                            return router.push("/dashboard/projeler/".concat((_a = daire.blok) === null || _a === void 0 ? void 0 : _a.projeId, "/bloklar/").concat(daire.blokId, "/daireler/").concat(daire.id));
                        }}>
                              <lucide_react_1.Eye className="h-4 w-4 mr-1"/>
                              Detay
                            </button_1.Button>
                          </table_1.TableCell>
                        </table_1.TableRow>);
                })}
                    </table_1.TableBody>
                  </table_1.Table>
                </div>)}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
