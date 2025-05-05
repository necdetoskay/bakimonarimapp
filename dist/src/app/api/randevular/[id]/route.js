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
// GET: Belirli bir randevuyu getir
function GET(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var session, randevu, error_1;
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
                    return [4 /*yield*/, prisma.randevu.findUnique({
                            where: { id: params.id },
                            include: {
                                tekniker: true,
                                ariza: {
                                    include: {
                                        daire: {
                                            include: {
                                                blok: {
                                                    include: {
                                                        proje: true
                                                    }
                                                }
                                            }
                                        },
                                        arizaTipi: true
                                    }
                                },
                                kullanilanMalzemeler: {
                                    include: {
                                        malzeme: true
                                    }
                                },
                                oncekiRandevu: true,
                                sonrakiRandevu: true
                            }
                        })];
                case 2:
                    randevu = _c.sent();
                    if (!randevu) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Randevu bulunamadı" }, { status: 404 })];
                    }
                    return [2 /*return*/, server_1.NextResponse.json(randevu)];
                case 3:
                    error_1 = _c.sent();
                    console.error("API Error:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Randevu alınırken bir hata oluştu" }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// PUT: Randevu güncelleme
function PUT(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var session, _c, durum, sonuc, teknikerId, teknikerIds, malzemeler, randevuKontrol, data, guncellenenRandevu, _i, teknikerIds_1, teknikerId_1, _d, malzemeler_1, item, digerAktifRandevular, guncelRandevu, error_2;
        var params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 24, , 25]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _e.sent();
                    if (!session) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Bu işlem için giriş yapmanız gerekiyor" }, { status: 401 })];
                    }
                    return [4 /*yield*/, req.json()];
                case 2:
                    _c = _e.sent(), durum = _c.durum, sonuc = _c.sonuc, teknikerId = _c.teknikerId, teknikerIds = _c.teknikerIds, malzemeler = _c.malzemeler;
                    return [4 /*yield*/, prisma.randevu.findUnique({
                            where: { id: params.id },
                            include: { ariza: true }
                        })];
                case 3:
                    randevuKontrol = _e.sent();
                    if (!randevuKontrol) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Randevu bulunamadı" }, { status: 404 })];
                    }
                    data = {};
                    // Durum güncelleme
                    if (durum)
                        data.durum = durum;
                    // Sonuç güncelleme
                    if (sonuc !== undefined)
                        data.sonuc = sonuc;
                    // Tekniker güncelleme - tek tekniker
                    if (teknikerId !== undefined)
                        data.teknikerId = teknikerId || null;
                    return [4 /*yield*/, prisma.randevu.update({
                            where: { id: params.id },
                            data: data,
                            include: {
                                tekniker: true,
                                ariza: true,
                                teknikerler: {
                                    include: {
                                        tekniker: true
                                    }
                                }
                            }
                        })];
                case 4:
                    guncellenenRandevu = _e.sent();
                    if (!(teknikerIds && Array.isArray(teknikerIds))) return [3 /*break*/, 9];
                    // Önce mevcut bağlantıları sil
                    return [4 /*yield*/, prisma.randevuTekniker.deleteMany({
                            where: { randevuId: params.id }
                        })];
                case 5:
                    // Önce mevcut bağlantıları sil
                    _e.sent();
                    if (!(teknikerIds.length > 0)) return [3 /*break*/, 9];
                    _i = 0, teknikerIds_1 = teknikerIds;
                    _e.label = 6;
                case 6:
                    if (!(_i < teknikerIds_1.length)) return [3 /*break*/, 9];
                    teknikerId_1 = teknikerIds_1[_i];
                    return [4 /*yield*/, prisma.randevuTekniker.create({
                            data: {
                                randevu: { connect: { id: params.id } },
                                tekniker: { connect: { id: teknikerId_1 } }
                            }
                        })];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    if (!(malzemeler && durum && (durum === "Tamamlandı" || durum === "Kısmı Çözüm"))) return [3 /*break*/, 19];
                    // Mevcut malzemeleri sil
                    return [4 /*yield*/, prisma.randevuMalzeme.deleteMany({
                            where: { randevuId: params.id }
                        })];
                case 10:
                    // Mevcut malzemeleri sil
                    _e.sent();
                    if (!(malzemeler.length > 0)) return [3 /*break*/, 14];
                    _d = 0, malzemeler_1 = malzemeler;
                    _e.label = 11;
                case 11:
                    if (!(_d < malzemeler_1.length)) return [3 /*break*/, 14];
                    item = malzemeler_1[_d];
                    return [4 /*yield*/, prisma.randevuMalzeme.create({
                            data: {
                                randevu: { connect: { id: params.id } },
                                malzeme: { connect: { id: item.malzemeId } },
                                miktar: item.miktar,
                                birim: item.birim,
                                fiyat: item.fiyat || 0
                            }
                        })];
                case 12:
                    _e.sent();
                    _e.label = 13;
                case 13:
                    _d++;
                    return [3 /*break*/, 11];
                case 14:
                    if (!(durum === "Tamamlandı")) return [3 /*break*/, 16];
                    return [4 /*yield*/, prisma.ariza.update({
                            where: { id: randevuKontrol.ariza.id },
                            data: { durum: "Çözüm" }
                        })];
                case 15:
                    _e.sent();
                    return [3 /*break*/, 18];
                case 16:
                    if (!(durum === "Kısmı Çözüm")) return [3 /*break*/, 18];
                    return [4 /*yield*/, prisma.ariza.update({
                            where: { id: randevuKontrol.ariza.id },
                            data: { durum: "Kısmı Çözüm" }
                        })];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18: return [3 /*break*/, 22];
                case 19:
                    if (!(durum === "İptal Edildi")) return [3 /*break*/, 22];
                    return [4 /*yield*/, prisma.randevu.findMany({
                            where: {
                                arizaId: randevuKontrol.ariza.id,
                                id: { not: params.id },
                                durum: { notIn: ["İptal Edildi"] }
                            }
                        })];
                case 20:
                    digerAktifRandevular = _e.sent();
                    if (!(digerAktifRandevular.length === 0)) return [3 /*break*/, 22];
                    return [4 /*yield*/, prisma.ariza.update({
                            where: { id: randevuKontrol.ariza.id },
                            data: { durum: "Talep Alındı" }
                        })];
                case 21:
                    _e.sent();
                    _e.label = 22;
                case 22: return [4 /*yield*/, prisma.randevu.findUnique({
                        where: { id: params.id },
                        include: {
                            tekniker: true,
                            ariza: true,
                            teknikerler: {
                                include: {
                                    tekniker: true
                                }
                            },
                            kullanilanMalzemeler: {
                                include: {
                                    malzeme: true
                                }
                            }
                        }
                    })];
                case 23:
                    guncelRandevu = _e.sent();
                    return [2 /*return*/, server_1.NextResponse.json(guncelRandevu)];
                case 24:
                    error_2 = _e.sent();
                    console.error("Randevu güncelleme hatası:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Randevu güncellenirken bir hata oluştu" }, { status: 500 })];
                case 25: return [2 /*return*/];
            }
        });
    });
}
// DELETE: Randevu sil
function DELETE(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var session, randevuKontrol, digerAktifRandevular, error_3;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _c.sent();
                    // Oturum kontrolü
                    if (!session) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekiyor" }, { status: 401 })];
                    }
                    return [4 /*yield*/, prisma.randevu.findUnique({
                            where: { id: params.id },
                            include: { ariza: true }
                        })];
                case 2:
                    randevuKontrol = _c.sent();
                    if (!randevuKontrol) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Belirtilen randevu bulunamadı" }, { status: 404 })];
                    }
                    // Önce ilişkili malzemeleri sil
                    return [4 /*yield*/, prisma.randevuMalzeme.deleteMany({
                            where: { randevuId: params.id }
                        })];
                case 3:
                    // Önce ilişkili malzemeleri sil
                    _c.sent();
                    // Randevuyu sil
                    return [4 /*yield*/, prisma.randevu.delete({
                            where: { id: params.id }
                        })];
                case 4:
                    // Randevuyu sil
                    _c.sent();
                    return [4 /*yield*/, prisma.randevu.findMany({
                            where: {
                                arizaId: randevuKontrol.ariza.id,
                                durum: { notIn: ["İptal Edildi"] }
                            }
                        })];
                case 5:
                    digerAktifRandevular = _c.sent();
                    if (!(digerAktifRandevular.length === 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.ariza.update({
                            where: { id: randevuKontrol.ariza.id },
                            data: { durum: "Talep Alındı" }
                        })];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7: return [2 /*return*/, server_1.NextResponse.json({ message: "Randevu başarıyla silindi" })];
                case 8:
                    error_3 = _c.sent();
                    console.error("API Error:", error_3);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Randevu silinirken bir hata oluştu" }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
