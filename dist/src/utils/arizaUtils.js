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
exports.fetcher = exports.hesaplaArizaMasrafi = exports.getDurumBadgeVariant = exports.getArizaIcon = void 0;
// Arıza tipine göre ikon döndüren fonksiyon
var getArizaIcon = function (tip) {
    switch (tip === null || tip === void 0 ? void 0 : tip.toLowerCase()) {
        case "su":
            return "💧";
        case "elektrik":
            return "⚡";
        case "ısıtma":
            return "🔥";
        case "kapı":
            return "🚪";
        case "asansör":
            return "🔼";
        default:
            return "🔧";
    }
};
exports.getArizaIcon = getArizaIcon;
// Durum badge'i için renk döndüren fonksiyon
var getDurumBadgeVariant = function (durum) {
    switch (durum) {
        case "Talep Alındı": return "secondary";
        case "Randevu Planlandı": return "warning";
        case "Randevu Yeniden Planlandı": return "warning";
        case "Kısmı Çözüm": return "default";
        case "Çözüm": return "success";
        case "İptal Edildi": return "destructive";
        default: return "secondary";
    }
};
exports.getDurumBadgeVariant = getDurumBadgeVariant;
// Arıza toplam masrafını hesapla
var hesaplaArizaMasrafi = function (ariza) {
    if (!ariza.randevular || ariza.randevular.length === 0)
        return 0;
    var toplamMasraf = 0;
    ariza.randevular.forEach(function (randevu) {
        if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
            randevu.kullanilanMalzemeler.forEach(function (malzeme) {
                toplamMasraf += malzeme.miktar * (malzeme.fiyat || 0);
            });
        }
    });
    return toplamMasraf;
};
exports.hesaplaArizaMasrafi = hesaplaArizaMasrafi;
// Veri getirme fonksiyonu
var fetcher = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(url)];
            case 1:
                res = _a.sent();
                if (!res.ok) {
                    throw new Error("Veri çekerken bir hata oluştu");
                }
                return [2 /*return*/, res.json()];
        }
    });
}); };
exports.fetcher = fetcher;
