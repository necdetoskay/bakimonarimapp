"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSaat = exports.formatPara = exports.formatTarih = void 0;
// Türkçe tarih formatlama
var formatTarih = function (tarih) {
    if (!tarih)
        return "";
    var date = new Date(tarih);
    return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};
exports.formatTarih = formatTarih;
// Türkçe para birimi formatlama
var formatPara = function (tutar) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
    }).format(tutar);
};
exports.formatPara = formatPara;
// Türkçe saat formatlama
var formatSaat = function (tarih) {
    if (!tarih)
        return "";
    var date = new Date(tarih);
    return date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
    });
};
exports.formatSaat = formatSaat;
