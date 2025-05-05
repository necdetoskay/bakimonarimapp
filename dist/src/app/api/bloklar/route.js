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
var server_1 = require("next/server");
var next_auth_1 = require("next-auth");
var auth_1 = require("@/lib/auth");
var db_1 = require("@/lib/db");
// GET: Tüm blokları getir
function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var session, searchParams, projeId, where, bloklar, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _a.sent();
                    if (!(session === null || session === void 0 ? void 0 : session.user)) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 })];
                    }
                    searchParams = new URL(req.url).searchParams;
                    projeId = searchParams.get("projeId");
                    where = projeId ? { projeId: projeId } : {};
                    return [4 /*yield*/, db_1.db.blok.findMany({
                            where: where,
                            orderBy: { createdAt: "desc" },
                            select: {
                                id: true,
                                ad: true,
                                projeId: true,
                                ekbilgi: true,
                                createdAt: true,
                                updatedAt: true,
                            },
                        })];
                case 2:
                    bloklar = _a.sent();
                    response = server_1.NextResponse.json(bloklar);
                    // Cache süresini azaltarak daha hızlı güncellemeleri sağla
                    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
                    return [2 /*return*/, response];
                case 3:
                    error_1 = _a.sent();
                    console.error("Blokları getirme hatası:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Blokları getirilirken bir hata oluştu" }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// POST: Yeni blok ekle
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var session, body, ad, projeId, ekbilgi, existingProje, existingBlok, blok, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _a.sent();
                    if (!(session === null || session === void 0 ? void 0 : session.user)) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 })];
                    }
                    return [4 /*yield*/, req.json()];
                case 2:
                    body = _a.sent();
                    ad = body.ad, projeId = body.projeId, ekbilgi = body.ekbilgi;
                    // Zorunlu alanları kontrol et
                    if (!ad || !projeId) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Blok adı ve proje ID'si zorunludur" }, { status: 400 })];
                    }
                    return [4 /*yield*/, db_1.db.proje.findUnique({
                            where: { id: projeId },
                        })];
                case 3:
                    existingProje = _a.sent();
                    if (!existingProje) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Belirtilen proje bulunamadı" }, { status: 404 })];
                    }
                    return [4 /*yield*/, db_1.db.blok.findFirst({
                            where: {
                                AND: [
                                    { projeId: projeId },
                                    { ad: ad },
                                ],
                            },
                        })];
                case 4:
                    existingBlok = _a.sent();
                    if (existingBlok) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Bu projede bu ada sahip bir blok zaten var" }, { status: 400 })];
                    }
                    return [4 /*yield*/, db_1.db.blok.create({
                            data: {
                                ad: ad,
                                projeId: projeId,
                                ekbilgi: ekbilgi || null,
                            },
                        })];
                case 5:
                    blok = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json(blok)];
                case 6:
                    error_2 = _a.sent();
                    console.error("Blok ekleme hatası:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Blok eklenirken bir hata oluştu" }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
