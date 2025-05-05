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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProjelerPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_2 = require("next-auth/react");
var swr_1 = __importStar(require("swr"));
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var use_toast_1 = require("@/hooks/use-toast");
var lucide_react_1 = require("lucide-react");
var link_1 = __importDefault(require("next/link"));
var lucide_react_2 = require("lucide-react");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
// Fetch fonksiyonu tanımlama
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
// Yer tutucu resim değeri
var placeholderImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";
var ProjectCard = function (_a) {
    var proje = _a.proje, handleOpenEditProject = _a.handleOpenEditProject, deleteProje = _a.deleteProje, blokSayisi = _a.blokSayisi;
    return (<link_1.default href={"/dashboard/projeler/".concat(proje.id)} className="group block">
      <div className="h-72 w-full overflow-hidden rounded-xl shadow-md transition-all duration-200 hover:shadow-lg relative">
        {/* Resim Alanı - Sabit yükseklik ve genişlik */}
        <div className="absolute inset-0 h-full w-full">
          {proje.image && proje.image.trim() !== "" ? (<div className="h-40 w-full overflow-hidden">
              <img src={proje.image} alt={proje.ad} className="w-full h-full object-cover"/>
            </div>) : (<div className="h-40 w-full relative bg-slate-100">
              <img src={placeholderImage} alt="Varsayılan proje resmi" className="w-full h-full object-cover opacity-80"/>
              <div className="absolute inset-0 flex items-center justify-center bg-slate-200/30">
                <lucide_react_1.Building2 className="h-20 w-20 text-slate-400"/>
              </div>
            </div>)}
        
          {/* Karartma Katmanı - Sadece resim üzerinde */}
          <div className="absolute inset-0 h-40 bg-gradient-to-t from-black/75 via-black/40 to-transparent"></div>
        </div>
        
        {/* İçerik - Altta sabit konumlu */}
        <div className="relative pt-40 h-full flex flex-col justify-between p-4">
          <div>
            {/* Proje Adı ve İşlem Butonları - Yan Yana */}
            <div className="flex items-center justify-between mb-1 px-3 py-1 rounded-md">
              <div className="flex items-center gap-2">
                <lucide_react_1.Building2 className="h-4 w-4 text-slate-700"/>
                <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">{proje.ad}</h3>
              </div>
              
              {/* İşlem Butonları - Adın Yanına Taşındı */}
              <div className="flex gap-1">
                <button_1.Button variant="ghost" size="icon" className="opacity-90 hover:opacity-100 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary rounded-md transform transition-all duration-200 hover:scale-110 hover:shadow-md h-8 w-8" onClick={function (e) {
            e.preventDefault();
            e.stopPropagation();
            handleOpenEditProject(proje);
        }}>
                  <lucide_react_1.Edit className="h-4 w-4"/>
                </button_1.Button>
                <button_1.Button variant="ghost" size="icon" className="opacity-90 hover:opacity-100 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 rounded-md transform transition-all duration-200 hover:scale-110 hover:shadow-md h-8 w-8" onClick={function (e) {
            e.preventDefault();
            e.stopPropagation();
            deleteProje(proje);
        }}>
                  <lucide_react_1.Trash2 className="h-4 w-4"/>
                </button_1.Button>
              </div>
            </div>
            
            <p className="text-sm text-slate-700 mb-2 line-clamp-1">{proje.adres}</p>
            <div className="flex items-center gap-1 mb-3">
              <div className="bg-primary/80 text-white rounded-md px-2 py-1 text-xs font-medium">
                {blokSayisi} Blok
              </div>
            </div>
            {proje.ekbilgi && (<p className="text-sm text-slate-600 line-clamp-2 mb-2">{proje.ekbilgi}</p>)}
          </div>
        </div>
      </div>
    </link_1.default>);
};
function ProjelerPage() {
    var _this = this;
    var _a = (0, react_2.useSession)(), session = _a.data, status = _a.status;
    var router = (0, navigation_1.useRouter)();
    var toast = (0, use_toast_1.useToast)().toast;
    // useSWR hook'u ile veri çekme
    var _b = (0, swr_1.default)(status === "authenticated" ? '/api/projeler' : null, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000 // 10 saniye içinde tekrar sorgu yapılmasını engeller
    }), projeler = _b.data, error = _b.error, isLoadingProjeler = _b.isLoading;
    var isLoading = status === "loading" || isLoadingProjeler;
    // Projelerin blok sayılarını tutacak state
    var _c = (0, react_1.useState)({}), blokSayilari = _c[0], setBlokSayilari = _c[1];
    // Projelerin blok sayılarını çek
    (0, react_1.useEffect)(function () {
        if (projeler && projeler.length > 0) {
            var fetchBlokSayilari = function () { return __awaiter(_this, void 0, void 0, function () {
                var yeniBlokSayilari, _i, projeler_1, proje, response, data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            yeniBlokSayilari = {};
                            _i = 0, projeler_1 = projeler;
                            _a.label = 1;
                        case 1:
                            if (!(_i < projeler_1.length)) return [3 /*break*/, 9];
                            proje = projeler_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 7, , 8]);
                            return [4 /*yield*/, fetch("/api/bloklar?projeId=".concat(proje.id))];
                        case 3:
                            response = _a.sent();
                            if (!response.ok) return [3 /*break*/, 5];
                            return [4 /*yield*/, response.json()];
                        case 4:
                            data = _a.sent();
                            yeniBlokSayilari[proje.id] = data.length;
                            return [3 /*break*/, 6];
                        case 5:
                            yeniBlokSayilari[proje.id] = 0;
                            _a.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_1 = _a.sent();
                            console.error("Blok say\u0131s\u0131 al\u0131n\u0131rken hata: ".concat(proje.id), error_1);
                            yeniBlokSayilari[proje.id] = 0;
                            return [3 /*break*/, 8];
                        case 8:
                            _i++;
                            return [3 /*break*/, 1];
                        case 9:
                            setBlokSayilari(yeniBlokSayilari);
                            return [2 /*return*/];
                    }
                });
            }); };
            fetchBlokSayilari();
        }
    }, [projeler]);
    var _d = (0, react_1.useState)(false), isAddingProject = _d[0], setIsAddingProject = _d[1];
    var _e = (0, react_1.useState)(false), isEditing = _e[0], setIsEditing = _e[1];
    var _f = (0, react_1.useState)(null), selectedProje = _f[0], setSelectedProje = _f[1];
    var _g = (0, react_1.useState)(false), uploadingImage = _g[0], setUploadingImage = _g[1];
    var _h = (0, react_1.useState)("grid"), tabView = _h[0], setTabView = _h[1];
    var _j = (0, react_1.useState)(false), isDeleteDialogOpen = _j[0], setIsDeleteDialogOpen = _j[1];
    // Form state
    var _k = (0, react_1.useState)({ ad: "", adres: "", ekbilgi: "" }), newProject = _k[0], setNewProject = _k[1];
    var _l = (0, react_1.useState)(null), editProject = _l[0], setEditProject = _l[1];
    // Input refs
    var addFileInputRef = (0, react_1.useRef)(null);
    var editFileInputRef = (0, react_1.useRef)(null);
    // Form modalları açıldığında veya kapandığında önizlemeyi temizle
    (0, react_1.useEffect)(function () {
        if (!isAddingProject) {
            // Ekleme formu kapandığında temizle
            setNewProject({ ad: "", adres: "", ekbilgi: "" });
            if (addFileInputRef.current)
                addFileInputRef.current.value = "";
        }
        if (!isEditing) {
            // Düzenleme formu kapandığında temizle
            setEditProject(null);
            if (editFileInputRef.current)
                editFileInputRef.current.value = "";
        }
        if (!isAddingProject && !isEditing) {
            // Her iki form da kapalıysa seçili projeyi temizle
            setSelectedProje(null);
        }
    }, [isAddingProject, isEditing]);
    // Düzenleme modalı açıldığında file input'u sıfırla
    (0, react_1.useEffect)(function () {
        if (isEditing && editFileInputRef.current) {
            editFileInputRef.current.value = "";
        }
    }, [isEditing]);
    // Ekleme modalı açıldığında file input'u sıfırla
    (0, react_1.useEffect)(function () {
        if (isAddingProject && addFileInputRef.current) {
            addFileInputRef.current.value = "";
        }
    }, [isAddingProject]);
    // Resim yükleme fonksiyonu
    var handleImageUpload = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var formData, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUploadingImage(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    formData = new FormData();
                    formData.append("file", file);
                    return [4 /*yield*/, fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || "Resim yüklenirken bir hata oluştu");
                    }
                    setUploadingImage(false);
                    return [2 /*return*/, data.url];
                case 4:
                    error_2 = _a.sent();
                    setUploadingImage(false);
                    throw new Error(error_2.message || "Resim yüklenirken bir hata oluştu");
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Dosya seçildiğinde çalışacak fonksiyon
    var handleFileChange = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file, previewUrl, imageUrl, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    // Dosya tipi kontrolü
                    if (file.type !== "image/jpeg" && file.type !== "image/png") {
                        toast({
                            title: "Hata",
                            description: "Sadece JPG ve PNG dosyaları yüklenebilir",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    // Dosya boyutu kontrolü (5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        toast({
                            title: "Hata",
                            description: "Dosya boyutu 5MB'dan küçük olmalıdır",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    previewUrl = URL.createObjectURL(file);
                    // Eğer selectedProje null ise yeni bir obje oluştur
                    if (!selectedProje) {
                        setSelectedProje({
                            id: "",
                            ad: "",
                            adres: "",
                            konum: null,
                            image: previewUrl,
                            ekbilgi: null,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                    }
                    else {
                        // Var olan selectedProje'yi güncelle
                        setSelectedProje(__assign(__assign({}, selectedProje), { image: previewUrl }));
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handleImageUpload(file)];
                case 2:
                    imageUrl = _b.sent();
                    // selectedProje state'ini güncelle
                    if (!selectedProje) {
                        setSelectedProje({
                            id: "",
                            ad: "",
                            adres: "",
                            konum: null,
                            image: imageUrl,
                            ekbilgi: null,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                    }
                    else {
                        setSelectedProje(__assign(__assign({}, selectedProje), { image: imageUrl }));
                    }
                    toast({
                        title: "Başarılı",
                        description: "Resim başarıyla yüklendi",
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _b.sent();
                    console.error("Resim yükleme hatası:", error_3);
                    toast({
                        title: "Hata",
                        description: error_3.message,
                        variant: "destructive",
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Resmi kaldır - Eski fonksiyon, siliniyor
    var handleRemoveImage = function () {
        setSelectedProje(null);
        if (addFileInputRef.current)
            addFileInputRef.current.value = "";
        if (editFileInputRef.current)
            editFileInputRef.current.value = "";
    };
    // Düzenleme formunda resmi sil
    var handleRemoveEditImage = function () {
        if (editProject) {
            setEditProject(__assign(__assign({}, editProject), { image: null }));
        }
        if (selectedProje) {
            setSelectedProje(__assign(__assign({}, selectedProje), { image: null }));
        }
        toast({
            title: "Bilgi",
            description: "Proje resmi kaldırıldı. Kaydetmek için 'Güncelle' butonuna tıklayın.",
        });
    };
    // Yeni ekleme formunda resmi sil
    var handleRemoveAddImage = function () {
        if (selectedProje) {
            setSelectedProje(__assign(__assign({}, selectedProje), { image: null }));
        }
        toast({
            title: "Bilgi",
            description: "Resim kaldırıldı.",
        });
    };
    // Yeni proje ekle
    var handleAddProject = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newProject.ad || !newProject.adres) {
                        toast({
                            title: "Hata",
                            description: "Proje adı ve adresi zorunludur.",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/projeler", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(__assign(__assign({}, newProject), { image: selectedProje === null || selectedProje === void 0 ? void 0 : selectedProje.image })),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast({
                        title: "Başarılı",
                        description: "Proje başarıyla eklendi.",
                    });
                    // SWR cache'ini yenile
                    (0, swr_1.mutate)('/api/projeler');
                    setNewProject({ ad: "", adres: "", ekbilgi: "" });
                    setIsAddingProject(false);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    errorData = _a.sent();
                    toast({
                        title: "Hata",
                        description: errorData.message || "Proje eklenirken bir hata oluştu.",
                        variant: "destructive",
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "Proje eklenirken bir hata oluştu.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Proje düzenle
    var handleEditProject = function () { return __awaiter(_this, void 0, void 0, function () {
        var imageValue, response, errorData, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(editProject === null || editProject === void 0 ? void 0 : editProject.ad) || !(editProject === null || editProject === void 0 ? void 0 : editProject.adres)) {
                        toast({
                            title: "Hata",
                            description: "Proje adı ve adresi zorunludur.",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    imageValue = (selectedProje === null || selectedProje === void 0 ? void 0 : selectedProje.image) !== undefined
                        ? selectedProje.image
                        : editProject.image;
                    return [4 /*yield*/, fetch("/api/projeler/".concat(editProject.id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(__assign(__assign({}, editProject), { image: imageValue })),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast({
                        title: "Başarılı",
                        description: "Proje başarıyla güncellendi.",
                    });
                    // SWR cache'ini yenile
                    (0, swr_1.mutate)('/api/projeler');
                    setEditProject(null);
                    setIsEditing(false);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    errorData = _a.sent();
                    toast({
                        title: "Hata",
                        description: errorData.message || "Proje güncellenirken bir hata oluştu.",
                        variant: "destructive",
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_5 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "Proje güncellenirken bir hata oluştu.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Proje sil
    var handleDeleteProject = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedProje)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/projeler/".concat(selectedProje.id), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    // SWR cache'ini güncelle
                    (0, swr_1.mutate)('/api/projeler');
                    // Modal'ı kapat
                    setIsAddingProject(false);
                    toast({
                        title: "Başarılı",
                        description: "Proje başarıyla silindi",
                    });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    errorData = _a.sent();
                    toast({
                        title: "Hata",
                        description: errorData.message || "Proje silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_6 = _a.sent();
                    toast({
                        title: "Hata",
                        description: "Proje silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Düzenleme modal'ını aç
    var handleOpenEditProject = function (proje) {
        // Mevcut proje bilgilerini derin kopyalama yaparak ayarla
        var projeKopyasi = JSON.parse(JSON.stringify(proje));
        setSelectedProje(projeKopyasi);
        setEditProject(projeKopyasi);
        setIsEditing(true);
    };
    // Silme modal'ını aç
    var deleteProje = function (proje) {
        setSelectedProje(proje);
        setIsDeleteDialogOpen(true);
    };
    // Form değerlerini temizle
    var resetForm = function () {
        setSelectedProje(null);
        setEditProject(null);
        setIsEditing(false);
        if (addFileInputRef.current)
            addFileInputRef.current.value = "";
        if (editFileInputRef.current)
            editFileInputRef.current.value = "";
    };
    // Proje arama için state
    var _m = (0, react_1.useState)(""), searchQuery = _m[0], setSearchQuery = _m[1];
    // Filtrelenmiş projeler
    var filteredProjects = projeler ? projeler.filter(function (proje) { return proje.ad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proje.adres.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proje.ekbilgi && proje.ekbilgi.toLowerCase().includes(searchQuery.toLowerCase())); }) : [];
    if (isLoading) {
        return (<div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Yükleniyor...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>);
    }
    if (error) {
        return (<div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bir hata oluştu</h2>
          <p>Projeler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </div>);
    }
    return (<div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projeler</h1>
        <button_1.Button onClick={function () { return setIsAddingProject(true); }}>
          <lucide_react_1.Plus className="mr-2 h-4 w-4"/> Yeni Proje Ekle
        </button_1.Button>
      </div>
      
      {/* Arama Alanı */}
      <div className="mb-6">
        <div className="relative">
          <lucide_react_2.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Proje ara..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
        </div>
      </div>
      
      {isLoading ? (<div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-lg font-medium mt-4">Yükleniyor...</h2>
          </div>
        </div>) : error ? (<div className="text-center py-10">
          <p className="text-lg text-red-500">Veri yüklenirken bir hata oluştu.</p>
        </div>) : filteredProjects.length === 0 ? (<div className="text-center py-12">
          <lucide_react_1.Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4"/>
          <h2 className="text-2xl font-bold mb-2">Proje bulunamadı</h2>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "Arama kriterinize uygun proje bulunamadı." : "Henüz proje eklemediğiniz görünüyor."}
          </p>
          <button_1.Button onClick={function () { return setIsAddingProject(true); }}>
            <lucide_react_1.Plus className="mr-2 h-4 w-4"/> Proje Ekle
          </button_1.Button>
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(function (proje) { return (<ProjectCard key={proje.id} proje={proje} handleOpenEditProject={handleOpenEditProject} deleteProje={deleteProje} blokSayisi={blokSayilari[proje.id] || 0}/>); })}
        </div>)}
      
      <dialog_1.Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
        <dialog_1.DialogContent className="sm:max-w-[500px]">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Yeni Proje Ekle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>Proje bilgilerini doldurun.</dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Resim Seçimi & Önizleme */}
            <div className="grid gap-2">
              <label_1.Label>Proje Resmi</label_1.Label>
              <div className="flex flex-col items-center gap-3">
                {(selectedProje === null || selectedProje === void 0 ? void 0 : selectedProje.image) ? (<div className="relative w-full">
                    <img src={selectedProje.image} alt="Proje Resmi" className="w-full h-48 object-cover rounded-md"/>
                    <button_1.Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full w-8 h-8 bg-black/50 hover:bg-red-600/90" onClick={function () {
                if (selectedProje) {
                    setSelectedProje(__assign(__assign({}, selectedProje), { image: null }));
                }
                toast({
                    title: "Bilgi",
                    description: "Resim kaldırıldı.",
                });
            }}>
                      <lucide_react_1.X className="h-4 w-4"/>
                    </button_1.Button>
                  </div>) : (<label htmlFor="dropzone-file-add" className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center w-full h-48 cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center">
                      <lucide_react_1.Image className="h-8 w-8 text-gray-400 mb-2"/>
                      <p className="text-sm text-gray-500 text-center">Resim yüklemek için tıklayın ya da sürükleyin</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max. 5MB)</p>
                    </div>
                    <input id="dropzone-file-add" ref={addFileInputRef} type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange}/>
                  </label>)}
                
                <div className="flex justify-center gap-2 w-full">
                  {(selectedProje === null || selectedProje === void 0 ? void 0 : selectedProje.image) && (<button_1.Button variant="outline" onClick={function () { var _a; return (_a = addFileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={uploadingImage} className="w-full">
                      {uploadingImage ? (<div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>Yükleniyor...</span>
                        </div>) : (<div className="flex items-center gap-2">
                          <lucide_react_1.Upload className="h-4 w-4"/>
                          <span>Resim Değiştir</span>
                        </div>)}
                    </button_1.Button>)}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <label_1.Label htmlFor="projectName">Proje Adı *</label_1.Label>
              <input_1.Input id="projectName" value={newProject.ad} onChange={function (e) { return setNewProject(__assign(__assign({}, newProject), { ad: e.target.value })); }} placeholder="Proje adını girin"/>
            </div>
            <div className="grid gap-2">
              <label_1.Label htmlFor="projectAddress">Adres *</label_1.Label>
              <input_1.Input id="projectAddress" value={newProject.adres} onChange={function (e) { return setNewProject(__assign(__assign({}, newProject), { adres: e.target.value })); }} placeholder="Proje adresini girin"/>
            </div>
            <div className="grid gap-2">
              <label_1.Label htmlFor="projectDescription">Açıklama</label_1.Label>
              <textarea_1.Textarea id="projectDescription" value={newProject.ekbilgi || ""} onChange={function (e) { return setNewProject(__assign(__assign({}, newProject), { ekbilgi: e.target.value })); }} placeholder="Proje açıklaması girin (opsiyonel)" rows={3}/>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={function () { return setIsAddingProject(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button onClick={handleAddProject}>Ekle</button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      <dialog_1.Dialog open={isEditing} onOpenChange={setIsEditing}>
        <dialog_1.DialogContent className="sm:max-w-[500px]">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Proje Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>Proje bilgilerini güncelleyin.</dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          {editProject && (<div className="grid gap-4 py-4">
              {/* Resim Seçimi & Önizleme */}
              <div className="grid gap-2">
                <label_1.Label>Proje Resmi</label_1.Label>
                <div className="flex flex-col items-center gap-3">
                  {(selectedProje === null || selectedProje === void 0 ? void 0 : selectedProje.image) || editProject.image ? (<div className="relative w-full">
                      <img src={(selectedProje === null || selectedProje === void 0 ? void 0 : selectedProje.image) || editProject.image || ""} alt="Proje Resmi" className="w-full h-48 object-cover rounded-md"/>
                      <button_1.Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full w-8 h-8 bg-black/50 hover:bg-red-600/90" onClick={function () {
                    // Resmi sil
                    if (editProject) {
                        setEditProject(__assign(__assign({}, editProject), { image: null }));
                    }
                    if (selectedProje) {
                        setSelectedProje(__assign(__assign({}, selectedProje), { image: null }));
                    }
                    toast({
                        title: "Bilgi",
                        description: "Proje resmi kaldırıldı. Kaydetmek için 'Güncelle' butonuna tıklayın.",
                    });
                }}>
                        <lucide_react_1.X className="h-4 w-4"/>
                      </button_1.Button>
                    </div>) : (<label htmlFor="dropzone-file-edit" className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center w-full h-48 cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center">
                        <lucide_react_1.Image className="h-8 w-8 text-gray-400 mb-2"/>
                        <p className="text-sm text-gray-500 text-center">Resim yüklemek için tıklayın ya da sürükleyin</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max. 5MB)</p>
                      </div>
                      <input id="dropzone-file-edit" ref={editFileInputRef} type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange}/>
                    </label>)}
                  
                  <div className="flex justify-center gap-2 w-full">
                    {((selectedProje === null || selectedProje === void 0 ? void 0 : selectedProje.image) || editProject.image) && (<button_1.Button variant="outline" onClick={function () { var _a; return (_a = editFileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={uploadingImage} className="w-full">
                        {uploadingImage ? (<div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span>Yükleniyor...</span>
                          </div>) : (<div className="flex items-center gap-2">
                            <lucide_react_1.Upload className="h-4 w-4"/>
                            <span>Resim Değiştir</span>
                          </div>)}
                      </button_1.Button>)}
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label_1.Label htmlFor="editProjectName">Proje Adı *</label_1.Label>
                <input_1.Input id="editProjectName" value={editProject.ad} onChange={function (e) { return setEditProject(__assign(__assign({}, editProject), { ad: e.target.value })); }} placeholder="Proje adını girin"/>
              </div>
              <div className="grid gap-2">
                <label_1.Label htmlFor="editProjectAddress">Adres *</label_1.Label>
                <input_1.Input id="editProjectAddress" value={editProject.adres} onChange={function (e) { return setEditProject(__assign(__assign({}, editProject), { adres: e.target.value })); }} placeholder="Proje adresini girin"/>
              </div>
              <div className="grid gap-2">
                <label_1.Label htmlFor="editProjectDescription">Açıklama</label_1.Label>
                <textarea_1.Textarea id="editProjectDescription" value={editProject.ekbilgi || ""} onChange={function (e) { return setEditProject(__assign(__assign({}, editProject), { ekbilgi: e.target.value })); }} placeholder="Proje açıklaması girin (opsiyonel)" rows={3}/>
              </div>
            </div>)}
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={function () { return setIsEditing(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button onClick={handleEditProject}>Güncelle</button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
      
      {/* Proje Silme Dialog */}
      <alert_dialog_1.AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <alert_dialog_1.AlertDialogContent>
          <alert_dialog_1.AlertDialogHeader>
            <alert_dialog_1.AlertDialogTitle>Proje Sil</alert_dialog_1.AlertDialogTitle>
            <alert_dialog_1.AlertDialogDescription>
              Bu işlem geri alınamaz. Projeyi silmek istediğinize emin misiniz?
              Proje silindiğinde, projeye bağlı tüm bloklar ve daireler de silinecektir.
            </alert_dialog_1.AlertDialogDescription>
          </alert_dialog_1.AlertDialogHeader>
          <alert_dialog_1.AlertDialogFooter>
            <alert_dialog_1.AlertDialogCancel onClick={function () { return setIsDeleteDialogOpen(false); }}>İptal</alert_dialog_1.AlertDialogCancel>
            <alert_dialog_1.AlertDialogAction onClick={handleDeleteProject} className="bg-red-500 hover:bg-red-600">
              Sil
            </alert_dialog_1.AlertDialogAction>
          </alert_dialog_1.AlertDialogFooter>
        </alert_dialog_1.AlertDialogContent>
      </alert_dialog_1.AlertDialog>
    </div>);
}
