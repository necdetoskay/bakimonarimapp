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
var library_1 = require("@prisma/client/runtime/library");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var arizaTipleri, uzmanlikAlanlari, malzemeler, projeler, bloklar, _a, _b, _c, daireler, _d, _e, _f, teknikerler, arizalar, _g, _h, _j, randevular, _k, _l, _m, randevuMalzemeler, _o, _p, _q;
        var _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
        var _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
        return __generator(this, function (_26) {
            switch (_26.label) {
                case 0: return [4 /*yield*/, prisma.arizaTipi.createMany({
                        data: [
                            { ad: 'Su', ekbilgi: 'Su tesisatı arızaları' },
                            { ad: 'Elektrik', ekbilgi: 'Elektrik tesisatı arızaları' },
                            { ad: 'Isıtma', ekbilgi: 'Isıtma sistemi arızaları' },
                            { ad: 'Kapı', ekbilgi: 'Kapı ve kilit arızaları' },
                            { ad: 'Asansör', ekbilgi: 'Asansör arızaları' },
                            { ad: 'Diğer', ekbilgi: 'Diğer arızalar' },
                        ],
                        skipDuplicates: true,
                    })];
                case 1:
                    arizaTipleri = _26.sent();
                    console.log({ arizaTipleri: arizaTipleri });
                    return [4 /*yield*/, prisma.uzmanlikAlani.createMany({
                            data: [
                                { ad: 'Su Tesisatı', ekbilgi: 'Su tesisatı uzmanlığı' },
                                { ad: 'Elektrik Tesisatı', ekbilgi: 'Elektrik tesisatı uzmanlığı' },
                                { ad: 'Isıtma Sistemleri', ekbilgi: 'Isıtma sistemleri uzmanlığı' },
                                { ad: 'Kapı ve Kilit', ekbilgi: 'Kapı ve kilit sistemleri uzmanlığı' },
                                { ad: 'Asansör Bakımı', ekbilgi: 'Asansör bakım ve onarım uzmanlığı' },
                                { ad: 'Genel Bakım', ekbilgi: 'Genel bakım ve onarım uzmanlığı' },
                            ],
                            skipDuplicates: true,
                        })];
                case 2:
                    uzmanlikAlanlari = _26.sent();
                    console.log({ uzmanlikAlanlari: uzmanlikAlanlari });
                    return [4 /*yield*/, prisma.malzeme.createMany({
                            data: [
                                { ad: 'Su Borusu', birim: 'Metre' },
                                { ad: 'Kablo', birim: 'Metre' },
                                { ad: 'Radyatör', birim: 'Adet' },
                                { ad: 'Kilit', birim: 'Adet' },
                                { ad: 'Asansör Halatı', birim: 'Metre' },
                                { ad: 'Vida', birim: 'Adet' },
                            ],
                            skipDuplicates: true,
                        })];
                case 3:
                    malzemeler = _26.sent();
                    console.log({ malzemeler: malzemeler });
                    return [4 /*yield*/, prisma.proje.createMany({
                            data: [
                                { ad: 'Güneş Sitesi', ekbilgi: 'Güneş Sitesi Projesi', adres: 'İstanbul' },
                                { ad: 'Ay Sitesi', ekbilgi: 'Ay Sitesi Projesi', adres: 'Ankara' },
                                { ad: 'Yıldız Sitesi', ekbilgi: 'Yıldız Sitesi Projesi', adres: 'İzmir' },
                            ],
                            skipDuplicates: true,
                        })];
                case 4:
                    projeler = _26.sent();
                    console.log({ projeler: projeler });
                case 5:
                    _c = [
                        (_s = { ad: 'A Blok' }).projeId = (_8 = _26.sent()) ? _8.id : '', _s
                    ];
                    _t = { ad: 'B Blok' };
                    return [4 /*yield*/, prisma.proje.findFirst({ where: { ad: 'Güneş Sitesi' } })];
                case 6:
                    _c = _c.concat([
                        (_t.projeId = (_9 = _26.sent()) ? _9.id : '', _t)
                    ]);
                    _u = { ad: 'C Blok' };
                    return [4 /*yield*/, prisma.proje.findFirst({ where: { ad: 'Ay Sitesi' } })];
                case 7: return [4 /*yield*/, (_b = (_a = prisma.blok).createMany).apply(_a, [(_r = { data: _c.concat([
                            (_u.projeId = (_10 = _26.sent()) ? _10.id : '', _u)
                        ]) }).skipDuplicates = true,
                        _r])];
                case 8:
                    bloklar = _26.sent();
                    console.log({ bloklar: bloklar });
                    _f = [
                        (_w = { numara: '1', kat: '1' }).blokId = (_11 = _26.sent()) ? _11.id : '', _w
                    ];
                    _x = { numara: '2', kat: '1' };
                    return [4 /*yield*/, prisma.blok.findFirst({ where: { ad: 'A Blok' } })];
                case 9:
                    _f = _f.concat([
                        (_x.blokId = (_12 = _26.sent()) ? _12.id : '', _x)
                    ]);
                    _y = { numara: '3', kat: '2' };
                    return [4 /*yield*/, prisma.blok.findFirst({ where: { ad: 'B Blok' } })];
                case 10: return [4 /*yield*/, (_e = (_d = prisma.daire).createMany).apply(_d, [(_v = { data: _f.concat([
                            (_y.blokId = (_13 = _26.sent()) ? _13.id : '', _y)
                        ]) }).skipDuplicates = true,
                        _v])];
                case 11:
                    daireler = _26.sent();
                    console.log({ daireler: daireler });
                    return [4 /*yield*/, prisma.tekniker.createMany({
                            data: [
                                { adsoyad: 'Ahmet Yılmaz' },
                                { adsoyad: 'Ayşe Demir' },
                            ],
                            skipDuplicates: true,
                        })];
                case 12:
                    teknikerler = _26.sent();
                    console.log({ teknikerler: teknikerler });
                    _j = [
                        (_0 = {
                            aciklama: 'Su sızıntısı var'
                        }).arizaTipiId = (_14 = _26.sent()) ? _14.id : '',
                            _0.daireId = (_15 = _26.sent()) ? _15.id : '',
                            _0.durum = 'Talep Alındı',
                            _0.createdAt = new Date(),
                            _0
                    ];
                    _1 = {
                        aciklama: 'Elektrik kesintisi var'
                    };
                    return [4 /*yield*/, prisma.arizaTipi.findFirst({ where: { ad: 'Elektrik' } })];
                case 13:
                    _1.arizaTipiId = (_16 = _26.sent()) ? _16.id : '';
                    return [4 /*yield*/, prisma.daire.findFirst({ where: { numara: '2' } })];
                case 14: return [4 /*yield*/, (_h = (_g = prisma.ariza).createMany).apply(_g, [(_z = { data: _j.concat([
                            (_1.daireId = (_17 = _26.sent()) ? _17.id : '',
                                _1.durum = 'Randevu Planlandı',
                                _1.createdAt = new Date(),
                                _1)
                        ]) }).skipDuplicates = true,
                        _z])];
                case 15:
                    arizalar = _26.sent();
                    console.log({ arizalar: arizalar });
                    _m = [
                        (_3 = {
                            tarih: new Date()
                        }).arizaId = (_18 = _26.sent()) ? _18.id : '',
                            _3.teknikerId = (_19 = _26.sent()) ? _19.id : '',
                            _3.notlar = 'Su sızıntısı kontrolü yapılacak',
                            _3.durum = 'Planlandı',
                            _3
                    ];
                    _4 = {
                        tarih: new Date()
                    };
                    return [4 /*yield*/, prisma.ariza.findFirst({ where: { aciklama: 'Elektrik kesintisi var' } })];
                case 16:
                    _4.arizaId = (_20 = _26.sent()) ? _20.id : '';
                    return [4 /*yield*/, prisma.tekniker.findFirst({ where: { adsoyad: 'Ayşe Demir' } })];
                case 17: return [4 /*yield*/, (_l = (_k = prisma.randevu).createMany).apply(_k, [(_2 = { data: _m.concat([
                            (_4.teknikerId = (_21 = _26.sent()) ? _21.id : '',
                                _4.notlar = 'Elektrik tesisatı kontrolü yapılacak',
                                _4.durum = 'Planlandı',
                                _4)
                        ]) }).skipDuplicates = true,
                        _2])];
                case 18:
                    randevular = _26.sent();
                    console.log({ randevular: randevular });
                    _q = [
                        (_6 = {}).randevuId = (_22 = _26.sent()) ? _22.id : '',
                            _6.malzemeId = (_23 = _26.sent()) ? _23.id : '',
                            _6.miktar = 2,
                            _6.fiyat = new library_1.Decimal(100),
                            _6
                    ];
                    _7 = {};
                    return [4 /*yield*/, prisma.randevu.findFirst({ where: { notlar: 'Elektrik tesisatı kontrolü yapılacak' } })];
                case 19:
                    _7.randevuId = (_24 = _26.sent()) ? _24.id : '';
                    return [4 /*yield*/, prisma.malzeme.findFirst({ where: { ad: 'Kablo' } })];
                case 20: return [4 /*yield*/, (_p = (_o = prisma.randevuMalzeme).createMany).apply(_o, [(_5 = { data: _q.concat([
                            (_7.malzemeId = (_25 = _26.sent()) ? _25.id : '',
                                _7.miktar = 5,
                                _7.fiyat = new library_1.Decimal(150),
                                _7)
                        ]) }).skipDuplicates = true,
                        _5])];
                case 21:
                    randevuMalzemeler = _26.sent();
                    console.log({ randevuMalzemeler: randevuMalzemeler });
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
