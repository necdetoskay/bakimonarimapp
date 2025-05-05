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
exports.default = RolesPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_2 = require("next-auth/react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var use_toast_1 = require("@/hooks/use-toast");
var checkbox_1 = require("@/components/ui/checkbox");
function RolesPage() {
    var _this = this;
    var _a, _b, _c, _d;
    var session = (0, react_2.useSession)().data;
    var router = (0, navigation_1.useRouter)();
    var toast = (0, use_toast_1.useToast)().toast;
    var _e = (0, react_1.useState)([]), roles = _e[0], setRoles = _e[1];
    var _f = (0, react_1.useState)([]), permissions = _f[0], setPermissions = _f[1];
    var _g = (0, react_1.useState)(true), isLoading = _g[0], setIsLoading = _g[1];
    var _h = (0, react_1.useState)(false), isAddOpen = _h[0], setIsAddOpen = _h[1];
    var _j = (0, react_1.useState)(false), isEditOpen = _j[0], setIsEditOpen = _j[1];
    var _k = (0, react_1.useState)(false), isDeleteOpen = _k[0], setIsDeleteOpen = _k[1];
    var _l = (0, react_1.useState)(null), selectedRole = _l[0], setSelectedRole = _l[1];
    // Form state
    var _m = (0, react_1.useState)(""), name = _m[0], setName = _m[1];
    var _o = (0, react_1.useState)(""), description = _o[0], setDescription = _o[1];
    var _p = (0, react_1.useState)([]), selectedPermissions = _p[0], setSelectedPermissions = _p[1];
    // Rolleri ve izinleri getir
    (0, react_1.useEffect)(function () {
        var fetchRoles = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, fetch("/api/roles")];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Roller getirilemedi");
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setRoles(data);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Hata:", error_1);
                        toast({
                            title: "Hata",
                            description: "Roller yüklenirken bir hata oluştu",
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
        var fetchPermissions = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("/api/permissions")];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("İzinler getirilemedi");
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setPermissions(data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Hata:", error_2);
                        toast({
                            title: "Hata",
                            description: "İzinler yüklenirken bir hata oluştu",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // Tüm kullanıcılar erişebilir
        if (session) {
            fetchRoles();
            fetchPermissions();
        }
    }, [session, toast]);
    // Yeni rol ekle
    var handleAddRole = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, rolesResponse, rolesData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/roles", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name: name,
                                description: description,
                                permissionIds: selectedPermissions
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Rol eklenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/roles")];
                case 4:
                    rolesResponse = _a.sent();
                    return [4 /*yield*/, rolesResponse.json()];
                case 5:
                    rolesData = _a.sent();
                    setRoles(rolesData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsAddOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Rol başarıyla eklendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error("Hata:", error_3);
                    toast({
                        title: "Hata",
                        description: error_3.message || "Rol eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Rol düzenle
    var handleEditRole = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, rolesResponse, rolesData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedRole)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/roles/".concat(selectedRole.id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name: name,
                                description: description,
                                permissionIds: selectedPermissions
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Rol güncellenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/roles")];
                case 4:
                    rolesResponse = _a.sent();
                    return [4 /*yield*/, rolesResponse.json()];
                case 5:
                    rolesData = _a.sent();
                    setRoles(rolesData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsEditOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Rol başarıyla güncellendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error("Hata:", error_4);
                    toast({
                        title: "Hata",
                        description: error_4.message || "Rol güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Rol sil
    var handleDeleteRole = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, rolesResponse, rolesData, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedRole)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/roles/".concat(selectedRole.id), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Rol silinirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/roles")];
                case 4:
                    rolesResponse = _a.sent();
                    return [4 /*yield*/, rolesResponse.json()];
                case 5:
                    rolesData = _a.sent();
                    setRoles(rolesData);
                    // Modal'ı kapat
                    setIsDeleteOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Rol başarıyla silindi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_5 = _a.sent();
                    console.error("Hata:", error_5);
                    toast({
                        title: "Hata",
                        description: error_5.message || "Rol silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Form değerlerini seçilen rol ile doldur
    var editRole = function (role) {
        setSelectedRole(role);
        setName(role.name);
        setDescription(role.description || "");
        setSelectedPermissions(role.permissions.map(function (p) { return p.id; }));
        setIsEditOpen(true);
    };
    // Silme modal'ını aç
    var deleteRole = function (role) {
        setSelectedRole(role);
        setIsDeleteOpen(true);
    };
    // Form değerlerini temizle
    var resetForm = function () {
        setName("");
        setDescription("");
        setSelectedPermissions([]);
        setSelectedRole(null);
    };
    // İzin seçimini değiştir
    var togglePermission = function (permissionId) {
        setSelectedPermissions(function (prev) {
            return prev.includes(permissionId)
                ? prev.filter(function (id) { return id !== permissionId; })
                : __spreadArray(__spreadArray([], prev, true), [permissionId], false);
        });
    };
    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Rol Yönetimi</h2>
        <dialog_1.Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button onClick={function () { return resetForm(); }}>Yeni Rol</button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent>
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Yeni Rol Ekle</dialog_1.DialogTitle>
              <dialog_1.DialogDescription>
                Rol bilgilerini ve izinlerini ayarlayın.
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>
            <form onSubmit={handleAddRole}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="name" className="text-right">
                    Rol Adı
                  </label_1.Label>
                  <input_1.Input id="name" value={name} onChange={function (e) { return setName(e.target.value); }} className="col-span-3" required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="description" className="text-right">
                    Açıklama
                  </label_1.Label>
                  <input_1.Input id="description" value={description} onChange={function (e) { return setDescription(e.target.value); }} className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label_1.Label className="text-right pt-2">
                    İzinler
                  </label_1.Label>
                  <div className="col-span-3 grid grid-cols-1 gap-2">
                    {permissions.map(function (permission) { return (<div key={permission.id} className="flex items-center space-x-2">
                        <checkbox_1.Checkbox id={"permission-".concat(permission.id)} checked={selectedPermissions.includes(permission.id)} onCheckedChange={function () { return togglePermission(permission.id); }}/>
                        <label_1.Label htmlFor={"permission-".concat(permission.id)} className="cursor-pointer">
                          {permission.name}{permission.description && " - ".concat(permission.description)}
                        </label_1.Label>
                      </div>); })}
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
          <card_1.CardTitle>Roller</card_1.CardTitle>
          <card_1.CardDescription>
            Sistem rolleri ve izinleri
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">Rol</th>
                  <th className="p-2 text-left">Açıklama</th>
                  <th className="p-2 text-left">İzinler</th>
                  <th className="p-2 text-left">Kullanıcı Sayısı</th>
                  <th className="p-2 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(function (role) { return (<tr key={role.id} className="border-b">
                    <td className="p-2">{role.name}</td>
                    <td className="p-2">{role.description}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map(function (permission) { return (<span key={permission.id} className="px-2 py-1 bg-slate-100 rounded-full text-xs">
                            {permission.name}
                          </span>); })}
                      </div>
                    </td>
                    <td className="p-2">{role._count.users}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button_1.Button variant="outline" size="sm" onClick={function () { return editRole(role); }}>
                          Düzenle
                        </button_1.Button>
                        <button_1.Button variant="destructive" size="sm" onClick={function () { return deleteRole(role); }} disabled={(role.name === "admin" || role.name === "user" || role._count.users > 0)}>
                          Sil
                        </button_1.Button>
                      </div>
                    </td>
                  </tr>); })}
              </tbody>
            </table>
          </div>
        </card_1.CardContent>
      </card_1.Card>
      
      {/* Düzenleme Modal */}
      <dialog_1.Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Rol Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Rol bilgilerini ve izinlerini güncelleyin.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleEditRole}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="edit-name" className="text-right">
                  Rol Adı
                </label_1.Label>
                <input_1.Input id="edit-name" value={name} onChange={function (e) { return setName(e.target.value); }} className="col-span-3" required disabled={(selectedRole === null || selectedRole === void 0 ? void 0 : selectedRole.name) === "admin" || (selectedRole === null || selectedRole === void 0 ? void 0 : selectedRole.name) === "user"}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="edit-description" className="text-right">
                  Açıklama
                </label_1.Label>
                <input_1.Input id="edit-description" value={description} onChange={function (e) { return setDescription(e.target.value); }} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label_1.Label className="text-right pt-2">
                  İzinler
                </label_1.Label>
                <div className="col-span-3 grid grid-cols-1 gap-2">
                  {permissions.map(function (permission) { return (<div key={permission.id} className="flex items-center space-x-2">
                      <checkbox_1.Checkbox id={"edit-permission-".concat(permission.id)} checked={selectedPermissions.includes(permission.id)} onCheckedChange={function () { return togglePermission(permission.id); }} disabled={(selectedRole === null || selectedRole === void 0 ? void 0 : selectedRole.name) === "admin"} // Admin rolünün izinlerini değiştirmeyi engelle
        />
                      <label_1.Label htmlFor={"edit-permission-".concat(permission.id)} className="cursor-pointer">
                        {permission.name}{permission.description && " - ".concat(permission.description)}
                      </label_1.Label>
                    </div>); })}
                </div>
              </div>
            </div>
            <dialog_1.DialogFooter>
              <button_1.Button type="button" variant="outline" onClick={function () { return setIsEditOpen(false); }}>
                İptal
              </button_1.Button>
              <button_1.Button type="submit" disabled={(selectedRole === null || selectedRole === void 0 ? void 0 : selectedRole.name) === "admin"}>
                Güncelle
              </button_1.Button>
            </dialog_1.DialogFooter>
          </form>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
      
      {/* Silme Modal */}
      <dialog_1.Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Rol Sil</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Bu işlem geri alınamaz. Rolü silmek istediğinize emin misiniz?
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedRole === null || selectedRole === void 0 ? void 0 : selectedRole.name}</strong> rolünü silmek üzeresiniz.
            </p>
            {((_b = (_a = selectedRole === null || selectedRole === void 0 ? void 0 : selectedRole._count) === null || _a === void 0 ? void 0 : _a.users) !== null && _b !== void 0 ? _b : 0) > 0 && (<p className="text-red-500 mt-2">
                Bu role sahip kullanıcılar olduğu için silinemez.
              </p>)}
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setIsDeleteOpen(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button type="button" variant="destructive" onClick={handleDeleteRole} disabled={(selectedRole === null || selectedRole === void 0 ? void 0 : selectedRole.name) === "admin" ||
            (selectedRole === null || selectedRole === void 0 ? void 0 : selectedRole.name) === "user" ||
            ((_d = (_c = selectedRole === null || selectedRole === void 0 ? void 0 : selectedRole._count) === null || _c === void 0 ? void 0 : _c.users) !== null && _d !== void 0 ? _d : 0) > 0}>
              Sil
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
