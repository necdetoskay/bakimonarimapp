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
exports.POST = POST;
var client_1 = require("@prisma/client");
var server_1 = require("next/server");
var next_auth_1 = require("next-auth");
var auth_1 = require("@/lib/auth");
var prisma = new client_1.PrismaClient();
// GET: Tüm arızaları veya belirli bir daireye ait arızaları getir
function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var session, searchParams, daireId, where, arizalar, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _a.sent();
                    // Oturum kontrolü
                    if (!session) {
                        return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Bu işlem için giriş yapmanız gerekiyor" }), { status: 401 })];
                    }
                    searchParams = new URL(req.url).searchParams;
                    daireId = searchParams.get('daireId');
                    where = daireId ? { daireId: daireId } : {};
                    return [4 /*yield*/, prisma.ariza.findMany({
                            where: where,
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
                                },
                                randevular: {
                                    include: {
                                        kullanilanMalzemeler: {
                                            include: {
                                                malzeme: true
                                            }
                                        }
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        })];
                case 2:
                    arizalar = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json(arizalar)];
                case 3:
                    error_1 = _a.sent();
                    console.error("API Error:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Arızalar alınırken bir hata oluştu" }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// POST: Yeni arıza kaydı oluştur
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var session, _a, daireId, bildirenKisi, telefon, aciklama, arizaTipiId, oncelik, ekbilgi, daireKontrol, arizaTipiKontrol, yeniAriza, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _b.sent();
                    // Oturum kontrolü
                    if (!session) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekiyor" }, { status: 401 })];
                    }
                    return [4 /*yield*/, req.json()];
                case 2:
                    _a = _b.sent(), daireId = _a.daireId, bildirenKisi = _a.bildirenKisi, telefon = _a.telefon, aciklama = _a.aciklama, arizaTipiId = _a.arizaTipiId, oncelik = _a.oncelik, ekbilgi = _a.ekbilgi;
                    // Zorunlu alanları kontrol et
                    if (!daireId || !aciklama) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Daire ve arıza açıklaması zorunludur" }, { status: 400 })];
                    }
                    return [4 /*yield*/, prisma.daire.findUnique({
                            where: { id: daireId }
                        })];
                case 3:
                    daireKontrol = _b.sent();
                    if (!daireKontrol) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Belirtilen daire bulunamadı" }, { status: 404 })];
                    }
                    if (!arizaTipiId) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma.arizaTipi.findUnique({
                            where: { id: arizaTipiId }
                        })];
                case 4:
                    arizaTipiKontrol = _b.sent();
                    if (!arizaTipiKontrol) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Belirtilen arıza tipi bulunamadı" }, { status: 404 })];
                    }
                    _b.label = 5;
                case 5: return [4 /*yield*/, prisma.ariza.create({
                        data: {
                            daireId: daireId,
                            bildirenKisi: bildirenKisi || null,
                            telefon: telefon || null,
                            aciklama: aciklama,
                            arizaTipiId: arizaTipiId || null,
                            oncelik: oncelik || "Orta",
                            ekbilgi: ekbilgi || null
                        },
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
                    yeniAriza = _b.sent();
                    return [2 /*return*/, server_1.NextResponse.json(yeniAriza, { status: 201 })];
                case 7:
                    error_2 = _b.sent();
                    console.error("API Error:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Arıza kaydedilirken bir hata oluştu" }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
