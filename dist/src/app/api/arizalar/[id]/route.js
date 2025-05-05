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
var next_auth_1 = require("next-auth");
var auth_1 = require("@/lib/auth");
var prisma = new client_1.PrismaClient();
// GET: Belirli bir arızayı getir
function GET(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var session, ariza, error_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _c.sent();
                    // Oturum kontrolü
                    if (!session) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekiyor" }, { status: 401 })];
                    }
                    return [4 /*yield*/, prisma.ariza.findUnique({
                            where: { id: params.id },
                            include: {
                                arizaTipi: true,
                                daire: {
                                    include: {
                                        blok: {
                                            include: {
                                                proje: true
                                            }
                                        }
                                    }
                                }
                            }
                        })];
                case 2:
                    ariza = _c.sent();
                    if (!ariza) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Arıza bulunamadı" }, { status: 404 })];
                    }
                    return [2 /*return*/, server_1.NextResponse.json(ariza)];
                case 3:
                    error_1 = _c.sent();
                    console.error("API Error:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Arıza alınırken bir hata oluştu" }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// PUT: Arıza bilgilerini güncelle
function PUT(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var session, _c, bildirenKisi, telefon, aciklama, arizaTipiId, oncelik, durum, ekbilgi, arizaKontrol, arizaTipiKontrol, data, guncellenenAriza, error_2;
        var params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _d.sent();
                    // Oturum kontrolü
                    if (!session) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekiyor" }, { status: 401 })];
                    }
                    return [4 /*yield*/, req.json()];
                case 2:
                    _c = _d.sent(), bildirenKisi = _c.bildirenKisi, telefon = _c.telefon, aciklama = _c.aciklama, arizaTipiId = _c.arizaTipiId, oncelik = _c.oncelik, durum = _c.durum, ekbilgi = _c.ekbilgi;
                    return [4 /*yield*/, prisma.ariza.findUnique({
                            where: { id: params.id }
                        })];
                case 3:
                    arizaKontrol = _d.sent();
                    if (!arizaKontrol) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Belirtilen arıza bulunamadı" }, { status: 404 })];
                    }
                    // Zorunlu alanları kontrol et
                    if (aciklama !== undefined && !aciklama) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Arıza açıklaması boş olamaz" }, { status: 400 })];
                    }
                    if (!arizaTipiId) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma.arizaTipi.findUnique({
                            where: { id: arizaTipiId }
                        })];
                case 4:
                    arizaTipiKontrol = _d.sent();
                    if (!arizaTipiKontrol) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Belirtilen arıza tipi bulunamadı" }, { status: 404 })];
                    }
                    _d.label = 5;
                case 5:
                    data = {};
                    if (bildirenKisi !== undefined)
                        data.bildirenKisi = bildirenKisi || null;
                    if (telefon !== undefined)
                        data.telefon = telefon || null;
                    if (aciklama !== undefined)
                        data.aciklama = aciklama;
                    if (arizaTipiId !== undefined)
                        data.arizaTipiId = arizaTipiId || null;
                    if (oncelik !== undefined)
                        data.oncelik = oncelik;
                    if (durum !== undefined)
                        data.durum = durum;
                    if (ekbilgi !== undefined)
                        data.ekbilgi = ekbilgi || null;
                    return [4 /*yield*/, prisma.ariza.update({
                            where: { id: params.id },
                            data: data,
                            include: {
                                arizaTipi: true,
                                daire: {
                                    include: {
                                        blok: {
                                            include: {
                                                proje: true
                                            }
                                        }
                                    }
                                }
                            }
                        })];
                case 6:
                    guncellenenAriza = _d.sent();
                    return [2 /*return*/, server_1.NextResponse.json(guncellenenAriza)];
                case 7:
                    error_2 = _d.sent();
                    console.error("API Error:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Arıza güncellenirken bir hata oluştu" }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// DELETE: Arızayı sil
function DELETE(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var session, arizaKontrol, error_3;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _c.sent();
                    // Oturum kontrolü
                    if (!session) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekiyor" }, { status: 401 })];
                    }
                    return [4 /*yield*/, prisma.ariza.findUnique({
                            where: { id: params.id }
                        })];
                case 2:
                    arizaKontrol = _c.sent();
                    if (!arizaKontrol) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Belirtilen arıza bulunamadı" }, { status: 404 })];
                    }
                    // Arızayı sil
                    return [4 /*yield*/, prisma.ariza.delete({
                            where: { id: params.id }
                        })];
                case 3:
                    // Arızayı sil
                    _c.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Arıza başarıyla silindi" })];
                case 4:
                    error_3 = _c.sent();
                    console.error("API Error:", error_3);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Arıza silinirken bir hata oluştu" }, { status: 500 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
