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
exports.default = UsersPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_2 = require("next-auth/react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var use_toast_1 = require("@/hooks/use-toast");
var select_1 = require("@/components/ui/select");
function UsersPage() {
    var _this = this;
    var session = (0, react_2.useSession)().data;
    var router = (0, navigation_1.useRouter)();
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
    var _b = (0, react_1.useState)([]), roles = _b[0], setRoles = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(false), isAddOpen = _d[0], setIsAddOpen = _d[1];
    var _e = (0, react_1.useState)(false), isEditOpen = _e[0], setIsEditOpen = _e[1];
    var _f = (0, react_1.useState)(false), isDeleteOpen = _f[0], setIsDeleteOpen = _f[1];
    var _g = (0, react_1.useState)(null), selectedUser = _g[0], setSelectedUser = _g[1];
    // Form state
    var _h = (0, react_1.useState)(""), name = _h[0], setName = _h[1];
    var _j = (0, react_1.useState)(""), email = _j[0], setEmail = _j[1];
    var _k = (0, react_1.useState)(""), password = _k[0], setPassword = _k[1];
    var _l = (0, react_1.useState)(""), roleId = _l[0], setRoleId = _l[1];
    // Kullanıcıları getir
    (0, react_1.useEffect)(function () {
        var fetchUsers = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, fetch("/api/users")];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Kullanıcılar getirilemedi");
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setUsers(data);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Hata:", error_1);
                        toast({
                            title: "Hata",
                            description: "Kullanıcılar yüklenirken bir hata oluştu",
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
        var fetchRoles = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
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
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Hata:", error_2);
                        toast({
                            title: "Hata",
                            description: "Roller yüklenirken bir hata oluştu",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // Tüm kullanıcılar erişebilir
        if (session) {
            fetchUsers();
            fetchRoles();
        }
    }, [session, toast]);
    // Yeni kullanıcı ekle
    var handleAddUser = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, usersResponse, usersData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/users", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ name: name, email: email, password: password, roleId: roleId }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Kullanıcı eklenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/users")];
                case 4:
                    usersResponse = _a.sent();
                    return [4 /*yield*/, usersResponse.json()];
                case 5:
                    usersData = _a.sent();
                    setUsers(usersData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsAddOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Kullanıcı başarıyla eklendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error("Hata:", error_3);
                    toast({
                        title: "Hata",
                        description: error_3.message || "Kullanıcı eklenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Kullanıcı düzenle
    var handleEditUser = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var updateData, response, data, usersResponse, usersData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedUser)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    updateData = { name: name, email: email, roleId: roleId };
                    // Şifre girilmişse ekle
                    if (password.trim()) {
                        updateData.password = password;
                    }
                    return [4 /*yield*/, fetch("/api/users/".concat(selectedUser.id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(updateData),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Kullanıcı güncellenirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/users")];
                case 4:
                    usersResponse = _a.sent();
                    return [4 /*yield*/, usersResponse.json()];
                case 5:
                    usersData = _a.sent();
                    setUsers(usersData);
                    // Formu temizle ve modal'ı kapat
                    resetForm();
                    setIsEditOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Kullanıcı başarıyla güncellendi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error("Hata:", error_4);
                    toast({
                        title: "Hata",
                        description: error_4.message || "Kullanıcı güncellenirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Kullanıcı sil
    var handleDeleteUser = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, usersResponse, usersData, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedUser)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("/api/users/".concat(selectedUser.id), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.message || "Kullanıcı silinirken bir hata oluştu");
                    }
                    return [4 /*yield*/, fetch("/api/users")];
                case 4:
                    usersResponse = _a.sent();
                    return [4 /*yield*/, usersResponse.json()];
                case 5:
                    usersData = _a.sent();
                    setUsers(usersData);
                    // Modal'ı kapat
                    setIsDeleteOpen(false);
                    toast({
                        title: "Başarılı",
                        description: "Kullanıcı başarıyla silindi",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_5 = _a.sent();
                    console.error("Hata:", error_5);
                    toast({
                        title: "Hata",
                        description: error_5.message || "Kullanıcı silinirken bir hata oluştu",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Form değerlerini seçilen kullanıcı ile doldur
    var editUser = function (user) {
        setSelectedUser(user);
        setName(user.name || "");
        setEmail(user.email);
        setPassword(""); // Şifreyi temizle
        setRoleId(user.role.id);
        setIsEditOpen(true);
    };
    // Silme modal'ını aç
    var deleteUser = function (user) {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };
    // Form değerlerini temizle
    var resetForm = function () {
        setName("");
        setEmail("");
        setPassword("");
        setRoleId("");
        setSelectedUser(null);
    };
    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h2>
        <dialog_1.Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button onClick={function () { return resetForm(); }}>Yeni Kullanıcı</button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent>
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Yeni Kullanıcı Ekle</dialog_1.DialogTitle>
              <dialog_1.DialogDescription>
                Kullanıcı bilgilerini doldurun ve ekle butonuna tıklayın.
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="name" className="text-right">
                    İsim
                  </label_1.Label>
                  <input_1.Input id="name" value={name} onChange={function (e) { return setName(e.target.value); }} className="col-span-3" required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="email" className="text-right">
                    Email
                  </label_1.Label>
                  <input_1.Input id="email" type="email" value={email} onChange={function (e) { return setEmail(e.target.value); }} className="col-span-3" required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="password" className="text-right">
                    Şifre
                  </label_1.Label>
                  <input_1.Input id="password" type="password" value={password} onChange={function (e) { return setPassword(e.target.value); }} className="col-span-3" required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="role" className="text-right">
                    Rol
                  </label_1.Label>
                  <select_1.Select value={roleId} onValueChange={setRoleId} required>
                    <select_1.SelectTrigger className="col-span-3">
                      <select_1.SelectValue placeholder="Rol seçin"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectGroup>
                        <select_1.SelectLabel>Roller</select_1.SelectLabel>
                        {roles.map(function (role) { return (<select_1.SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </select_1.SelectItem>); })}
                      </select_1.SelectGroup>
                    </select_1.SelectContent>
                  </select_1.Select>
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
          <card_1.CardTitle>Kullanıcılar</card_1.CardTitle>
          <card_1.CardDescription>
            Sistemdeki tüm kullanıcılar ve rolleri
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">İsim</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Rol</th>
                  <th className="p-2 text-left">Kayıt Tarihi</th>
                  <th className="p-2 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map(function (user) { return (<tr key={user.id} className="border-b">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role.name}</td>
                    <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button_1.Button variant="outline" size="sm" onClick={function () { return editUser(user); }}>
                          Düzenle
                        </button_1.Button>
                        <button_1.Button variant="destructive" size="sm" onClick={function () { return deleteUser(user); }} disabled={user.email === "admin@example.com"} // Admin kullanıcısını silmeyi engelle
        >
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
            <dialog_1.DialogTitle>Kullanıcı Düzenle</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Kullanıcı bilgilerini güncelleyin.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="edit-name" className="text-right">
                  İsim
                </label_1.Label>
                <input_1.Input id="edit-name" value={name} onChange={function (e) { return setName(e.target.value); }} className="col-span-3" required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="edit-email" className="text-right">
                  Email
                </label_1.Label>
                <input_1.Input id="edit-email" type="email" value={email} onChange={function (e) { return setEmail(e.target.value); }} className="col-span-3" required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="edit-password" className="text-right">
                  Şifre
                </label_1.Label>
                <input_1.Input id="edit-password" type="password" value={password} onChange={function (e) { return setPassword(e.target.value); }} className="col-span-3" placeholder="Boş bırakırsanız değişmez"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="edit-role" className="text-right">
                  Rol
                </label_1.Label>
                <select_1.Select value={roleId} onValueChange={setRoleId} required disabled={(selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.email) === "admin@example.com"} // Admin kullanıcısının rolünü değiştirmeyi engelle
    >
                  <select_1.SelectTrigger className="col-span-3">
                    <select_1.SelectValue placeholder="Rol seçin"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectGroup>
                      <select_1.SelectLabel>Roller</select_1.SelectLabel>
                      {roles.map(function (role) { return (<select_1.SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </select_1.SelectItem>); })}
                    </select_1.SelectGroup>
                  </select_1.SelectContent>
                </select_1.Select>
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
            <dialog_1.DialogTitle>Kullanıcı Sil</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Bu işlem geri alınamaz. Kullanıcıyı silmek istediğinize emin misiniz?
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="py-4">
            <p>
              <strong>{selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.name}</strong> ({selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.email}) kullanıcısını silmek üzeresiniz.
            </p>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button type="button" variant="outline" onClick={function () { return setIsDeleteOpen(false); }}>
              İptal
            </button_1.Button>
            <button_1.Button type="button" variant="destructive" onClick={handleDeleteUser}>
              Sil
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
