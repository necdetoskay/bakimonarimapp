"use strict";
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
exports.GET = GET;
exports.PUT = PUT;
exports.DELETE = DELETE;
var client_1 = require("@prisma/client");
var server_1 = require("next/server");
var next_1 = require("next-auth/next");
var auth_1 = require("@/lib/auth");
var prisma = new client_1.PrismaClient();
// Tekniker detayını getir
function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var session, id, tekniker, error_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, next_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _c.sent();
                    // Yalnızca oturum açmış kullanıcılar erişebilir
                    if (!session) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Bu işlem için giriş yapmanız gerekiyor" }, { status: 401 })];
                    }
                    id = params.id;
                    return [4 /*yield*/, prisma.tekniker.findUnique({
                            where: { id: id },
                            include: {
                                uzmanlikAlanlari: true,
                            },
                        })];
                case 2:
                    tekniker = _c.sent();
                    if (!tekniker) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Tekniker bulunamadı" }, { status: 404 })];
                    }
                    return [2 /*return*/, server_1.NextResponse.json(tekniker)];
                case 3:
                    error_1 = _c.sent();
                    console.error("Tekniker detayı getirilirken hata:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Tekniker detayı getirilirken bir hata oluştu" }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Tekniker güncelle
function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var session, id, _c, adsoyad, telefon, ekbilgi, uzmanlikAlanlariIds, tekniker, updatedTekniker, error_2;
        var params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, next_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _d.sent();
                    // Yalnızca oturum açmış kullanıcılar erişebilir
                    if (!session) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Bu işlem için giriş yapmanız gerekiyor" }, { status: 401 })];
                    }
                    id = params.id;
                    return [4 /*yield*/, request.json()];
                case 2:
                    _c = _d.sent(), adsoyad = _c.adsoyad, telefon = _c.telefon, ekbilgi = _c.ekbilgi, uzmanlikAlanlariIds = _c.uzmanlikAlanlariIds;
                    return [4 /*yield*/, prisma.tekniker.findUnique({
                            where: { id: id },
                            include: {
                                uzmanlikAlanlari: true,
                            },
                        })];
                case 3:
                    tekniker = _d.sent();
                    if (!tekniker) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Tekniker bulunamadı" }, { status: 404 })];
                    }
                    // Validasyon
                    if (!adsoyad) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Tekniker adı ve soyadı gereklidir" }, { status: 400 })];
                    }
                    return [4 /*yield*/, prisma.tekniker.update({
                            where: { id: id },
                            data: {
                                adsoyad: adsoyad,
                                telefon: telefon,
                                ekbilgi: ekbilgi,
                                uzmanlikAlanlari: {
                                    // Önce mevcut ilişkileri temizle
                                    set: [],
                                    // Sonra yeni ilişkileri kur
                                    connect: uzmanlikAlanlariIds && uzmanlikAlanlariIds.length > 0
                                        ? uzmanlikAlanlariIds.map(function (id) { return ({ id: id }); })
                                        : []
                                }
                            },
                            include: {
                                uzmanlikAlanlari: true,
                            },
                        })];
                case 4:
                    updatedTekniker = _d.sent();
                    return [2 /*return*/, server_1.NextResponse.json(updatedTekniker)];
                case 5:
                    error_2 = _d.sent();
                    console.error("Tekniker güncelleme hatası:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Tekniker güncellenirken bir hata oluştu" }, { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Tekniker sil
function DELETE(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var session, id, tekniker, error_3;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, next_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _c.sent();
                    // Yalnızca oturum açmış kullanıcılar erişebilir
                    if (!session) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Bu işlem için giriş yapmanız gerekiyor" }, { status: 401 })];
                    }
                    id = params.id;
                    return [4 /*yield*/, prisma.tekniker.findUnique({
                            where: { id: id },
                        })];
                case 2:
                    tekniker = _c.sent();
                    if (!tekniker) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Tekniker bulunamadı" }, { status: 404 })];
                    }
                    // Teknikeri sil
                    return [4 /*yield*/, prisma.tekniker.delete({
                            where: { id: id },
                        })];
                case 3:
                    // Teknikeri sil
                    _c.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Tekniker başarıyla silindi" }, { status: 200 })];
                case 4:
                    error_3 = _c.sent();
                    console.error("Tekniker silme hatası:", error_3);
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Tekniker silinirken bir hata oluştu" }, { status: 500 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
