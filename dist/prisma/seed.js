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
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function seedDummyData() {
    return __awaiter(this, void 0, void 0, function () {
        var projeler, arizaTipleriData, arizaTipleri, _i, arizaTipleriData_1, arizaTipiData, _a, projeler_1, projeData, proje, bloklar, _b, bloklar_1, blokData, blok, daireSayisi, i, daire, arizaTuru;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    projeler = [
                        { ad: 'Güneş Sitesi', adres: 'Merkez Mahallesi, Çiçek Sokak No:10, İstanbul' },
                        { ad: 'Ay Apartmanları', adres: 'Sahil Caddesi, Yıldız Sokak No:5, İzmir' },
                        { ad: 'Yıldız Konutları', adres: 'Başkent Bulvarı, Ankara' },
                    ];
                    arizaTipleriData = [
                        { ad: 'Elektrik Arızası' },
                        { ad: 'Su Tesisatı Arızası' },
                        { ad: 'Isıtma Arızası' },
                        { ad: 'Klima Arızası' },
                        { ad: 'Diğer' },
                    ];
                    return [4 /*yield*/, prisma.arizaTipi.findMany()];
                case 1:
                    arizaTipleri = _c.sent();
                    if (!(arizaTipleri.length === 0)) return [3 /*break*/, 7];
                    _i = 0, arizaTipleriData_1 = arizaTipleriData;
                    _c.label = 2;
                case 2:
                    if (!(_i < arizaTipleriData_1.length)) return [3 /*break*/, 5];
                    arizaTipiData = arizaTipleriData_1[_i];
                    return [4 /*yield*/, prisma.arizaTipi.create({
                            data: arizaTipiData,
                        })];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, prisma.arizaTipi.findMany()];
                case 6:
                    arizaTipleri = _c.sent();
                    _c.label = 7;
                case 7:
                    _a = 0, projeler_1 = projeler;
                    _c.label = 8;
                case 8:
                    if (!(_a < projeler_1.length)) return [3 /*break*/, 18];
                    projeData = projeler_1[_a];
                    return [4 /*yield*/, prisma.proje.create({
                            data: projeData,
                        })];
                case 9:
                    proje = _c.sent();
                    bloklar = [
                        { ad: 'A Blok', projeId: proje.id },
                        { ad: 'B Blok', projeId: proje.id },
                    ];
                    _b = 0, bloklar_1 = bloklar;
                    _c.label = 10;
                case 10:
                    if (!(_b < bloklar_1.length)) return [3 /*break*/, 17];
                    blokData = bloklar_1[_b];
                    return [4 /*yield*/, prisma.blok.create({
                            data: blokData,
                        })];
                case 11:
                    blok = _c.sent();
                    daireSayisi = 5;
                    i = 1;
                    _c.label = 12;
                case 12:
                    if (!(i <= daireSayisi)) return [3 /*break*/, 16];
                    return [4 /*yield*/, prisma.daire.create({
                            data: {
                                numara: i.toString(),
                                kat: Math.floor(Math.random() * 5 + 1).toString(), // 1-5 arası kat
                                blokId: blok.id,
                            },
                        })];
                case 13:
                    daire = _c.sent();
                    arizaTuru = arizaTipleri[Math.floor(Math.random() * arizaTipleri.length)];
                    return [4 /*yield*/, prisma.ariza.create({
                            data: {
                                aciklama: "Daire ".concat(daire.numara, " ").concat(arizaTuru.ad, " bulunmaktad\u0131r."),
                                oncelik: ['Düşük', 'Normal', 'Yüksek'][Math.floor(Math.random() * 3)],
                                daireId: daire.id,
                                arizaTipiId: arizaTuru.id,
                            },
                        })];
                case 14:
                    _c.sent();
                    _c.label = 15;
                case 15:
                    i++;
                    return [3 /*break*/, 12];
                case 16:
                    _b++;
                    return [3 /*break*/, 10];
                case 17:
                    _a++;
                    return [3 /*break*/, 8];
                case 18:
                    console.log('Dummy data seeded successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 5]);
                    return [4 /*yield*/, seedDummyData()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error seeding database:', error_1);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, prisma.$disconnect()];
                case 4:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
