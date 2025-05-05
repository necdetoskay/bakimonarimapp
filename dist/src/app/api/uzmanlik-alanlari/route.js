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
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// GET: Tüm uzmanlık alanlarını getir
function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var session, uzmanlikAlanlari, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _a.sent();
                    if (!session) {
                        return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Bu işlem için yetkiniz yok." }), { status: 401 })];
                    }
                    return [4 /*yield*/, prisma.uzmanlikAlani.findMany({
                            orderBy: {
                                ad: "asc",
                            },
                        })];
                case 2:
                    uzmanlikAlanlari = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json(uzmanlikAlanlari)];
                case 3:
                    error_1 = _a.sent();
                    console.error("API Error:", error_1);
                    return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Veri alınırken bir hata oluştu." }), { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// POST: Yeni uzmanlık alanı ekle
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var session, body, ad, ekbilgi, existingUzmanlikAlani, uzmanlikAlani, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _a.sent();
                    if (!session) {
                        return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Bu işlem için yetkiniz yok." }), { status: 401 })];
                    }
                    return [4 /*yield*/, req.json()];
                case 2:
                    body = _a.sent();
                    ad = body.ad, ekbilgi = body.ekbilgi;
                    // Veri doğrulama
                    if (!ad) {
                        return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Uzmanlık alanı adı gereklidir." }), { status: 400 })];
                    }
                    return [4 /*yield*/, prisma.uzmanlikAlani.findUnique({
                            where: { ad: ad },
                        })];
                case 3:
                    existingUzmanlikAlani = _a.sent();
                    if (existingUzmanlikAlani) {
                        return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Bu isimle bir uzmanlık alanı zaten mevcut." }), { status: 400 })];
                    }
                    return [4 /*yield*/, prisma.uzmanlikAlani.create({
                            data: {
                                ad: ad,
                                ekbilgi: ekbilgi,
                            },
                        })];
                case 4:
                    uzmanlikAlani = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json(uzmanlikAlani)];
                case 5:
                    error_2 = _a.sent();
                    console.error("API Error:", error_2);
                    return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Uzmanlık alanı eklenirken bir hata oluştu." }), { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
