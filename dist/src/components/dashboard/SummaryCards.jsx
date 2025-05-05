"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SummaryCards;
var card_1 = require("@/components/ui/card");
var react_1 = require("react");
var skeleton_1 = require("@/components/ui/skeleton");
var arizaUtils_1 = require("@/utils/arizaUtils");
var swr_1 = __importDefault(require("swr"));
var formatUtils_1 = require("@/utils/formatUtils");
function SummaryCards() {
    var _a = (0, swr_1.default)('/api/arizalar', arizaUtils_1.fetcher), arizalar = _a.data, arizaError = _a.error, arizaLoading = _a.isLoading;
    var _b = (0, swr_1.default)('/api/randevular', arizaUtils_1.fetcher), randevular = _b.data, randevuError = _b.error, randevuLoading = _b.isLoading;
    var _c = (0, react_1.useState)({
        arizalar: [],
        randevular: [],
        masraflar: 0
    }), summaryData = _c[0], setSummaryData = _c[1];
    (0, react_1.useEffect)(function () {
        if (arizalar && randevular) {
            // Bugünün tarihini al
            var bugun_1 = new Date();
            bugun_1.setHours(0, 0, 0, 0);
            // Bugün olan randevuları filtrele
            var bugunRandevular = randevular.filter(function (randevu) {
                var randevuTarihi = new Date(randevu.tarih);
                randevuTarihi.setHours(0, 0, 0, 0);
                return randevuTarihi.getTime() === bugun_1.getTime();
            });
            // Açık arızaları filtrele
            var acikArizalar = arizalar.filter(function (ariza) {
                return ariza.durum !== "Çözüm" && ariza.durum !== "İptal Edildi";
            });
            // Tamamlanan arızaları filtrele
            var tamamlananArizalar = arizalar.filter(function (ariza) {
                return ariza.durum === "Çözüm";
            });
            // Toplam masrafları hesapla
            var toplamMasraf_1 = 0;
            randevular.forEach(function (randevu) {
                if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
                    randevu.kullanilanMalzemeler.forEach(function (malzeme) {
                        toplamMasraf_1 += malzeme.miktar * (malzeme.fiyat || 0);
                    });
                }
            });
            setSummaryData({
                arizalar: acikArizalar,
                randevular: bugunRandevular,
                masraflar: toplamMasraf_1
            });
        }
    }, [arizalar, randevular]);
    var loading = arizaLoading || randevuLoading;
    return (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Açık Arızalar */}
      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <card_1.CardTitle className="text-sm font-medium">Açık Arızalar</card_1.CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </card_1.CardHeader>
        <card_1.CardContent>
          {loading ? (<skeleton_1.Skeleton className="h-8 w-1/2"/>) : (<div className="text-2xl font-bold">{summaryData.arizalar.length}</div>)}
        </card_1.CardContent>
        <card_1.CardFooter>
          <p className="text-xs text-muted-foreground">
            Bekleyen arıza talepleri sayısı
          </p>
        </card_1.CardFooter>
      </card_1.Card>

      {/* Bugünkü Randevular */}
      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <card_1.CardTitle className="text-sm font-medium">Bugünkü Randevular</card_1.CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
        </card_1.CardHeader>
        <card_1.CardContent>
          {loading ? (<skeleton_1.Skeleton className="h-8 w-1/2"/>) : (<div className="text-2xl font-bold">{summaryData.randevular.length}</div>)}
        </card_1.CardContent>
        <card_1.CardFooter>
          <p className="text-xs text-muted-foreground">
            Bugün için planlanan randevular
          </p>
        </card_1.CardFooter>
      </card_1.Card>

      {/* Çözülmüş Arızalar */}
      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <card_1.CardTitle className="text-sm font-medium">Çözülmüş Arızalar</card_1.CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </card_1.CardHeader>
        <card_1.CardContent>
          {loading ? (<skeleton_1.Skeleton className="h-8 w-1/2"/>) : (<div className="text-2xl font-bold">
              {(arizalar === null || arizalar === void 0 ? void 0 : arizalar.filter(function (ariza) { return ariza.durum === "Çözüm"; }).length) || 0}
            </div>)}
        </card_1.CardContent>
        <card_1.CardFooter>
          <p className="text-xs text-muted-foreground">
            Başarıyla çözülmüş arıza sayısı
          </p>
        </card_1.CardFooter>
      </card_1.Card>

      {/* Toplam Giderler */}
      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <card_1.CardTitle className="text-sm font-medium">Toplam Giderler</card_1.CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </card_1.CardHeader>
        <card_1.CardContent>
          {loading ? (<skeleton_1.Skeleton className="h-8 w-full"/>) : (<div className="text-2xl font-bold">{(0, formatUtils_1.formatPara)(summaryData.masraflar)}</div>)}
        </card_1.CardContent>
        <card_1.CardFooter>
          <p className="text-xs text-muted-foreground">
            Toplam malzeme giderleri
          </p>
        </card_1.CardFooter>
      </card_1.Card>
    </div>);
}
