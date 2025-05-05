"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActivityChart;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var arizaUtils_1 = require("@/utils/arizaUtils");
var swr_1 = __importDefault(require("swr"));
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var recharts_1 = require("recharts");
function ActivityChart() {
    var _a = (0, react_1.useState)([]), areaData = _a[0], setAreaData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    // SWR ile veri çekme
    var _c = (0, swr_1.default)("/api/arizalar", arizaUtils_1.fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30000 // 30 saniye
    }), _d = _c.data, arizalar = _d === void 0 ? [] : _d, arizalarError = _c.error;
    (0, react_1.useEffect)(function () {
        if (arizalar.length > 0 && !arizalarError) {
            // Son 30 günlük arızalar
            var son30GunArizalari_1 = arizalar.filter(function (ariza) {
                var createdAt = new Date(ariza.createdAt);
                var simdi = new Date();
                var otuzGunOnce = new Date(simdi);
                otuzGunOnce.setDate(simdi.getDate() - 30);
                return createdAt >= otuzGunOnce;
            });
            // Son 30 gün için area chart data
            var son30Gun = Array.from({ length: 30 }).map(function (_, i) {
                var tarih = (0, date_fns_1.subDays)(new Date(), 29 - i);
                var gun = (0, date_fns_1.format)(tarih, 'dd.MM');
                // O güne ait arızaları bul
                var gunArizalar = son30GunArizalari_1.filter(function (ariza) {
                    var createdAt = new Date(ariza.createdAt);
                    return createdAt.toDateString() === tarih.toDateString();
                });
                // O güne ait çözülen arızaları bul
                var cozulenler = gunArizalar.filter(function (ariza) {
                    return ariza.durum === "Çözüm";
                }).length;
                return {
                    gun: gun,
                    ariza: gunArizalar.length,
                    cozulen: cozulenler,
                    tarih: (0, date_fns_1.format)(tarih, 'd MMMM', { locale: locale_1.tr }),
                };
            });
            setAreaData(son30Gun);
            setIsLoading(false);
        }
    }, [arizalar, arizalarError]);
    if (isLoading) {
        return (<card_1.Card className="col-span-4">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg">Aylık Aktivite</card_1.CardTitle>
          <card_1.CardDescription>Son 30 günlük arıza ve çözüm aktivitesi</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    }
    return (<card_1.Card className="col-span-4">
      <card_1.CardHeader>
        <card_1.CardTitle className="text-lg">Aylık Aktivite</card_1.CardTitle>
        <card_1.CardDescription>Son 30 günlük arıza ve çözüm aktivitesi</card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="h-[300px] w-full">
          <recharts_1.ResponsiveContainer width="100%" height="100%">
            <recharts_1.AreaChart data={areaData} margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 20,
        }}>
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.XAxis dataKey="gun" tick={{ fontSize: 12 }} tickFormatter={function (value, index) { return index % 5 === 0 ? value : ''; }}/>
              <recharts_1.YAxis tick={{ fontSize: 12 }}/>
              <recharts_1.Tooltip labelFormatter={function (value) {
            var item = areaData.find(function (item) { return item.gun === value; });
            return item ? item.tarih : value;
        }} formatter={function (value, name) { return [
            value,
            name === 'ariza' ? 'Yeni Arıza' : 'Çözülen Arıza'
        ]; }}/>
              <recharts_1.Area type="monotone" dataKey="ariza" stackId="1" stroke="#8884d8" fill="#8884d8" name="Yeni Arıza" animationDuration={1500}/>
              <recharts_1.Area type="monotone" dataKey="cozulen" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Çözülen Arıza" animationDuration={1500}/>
            </recharts_1.AreaChart>
          </recharts_1.ResponsiveContainer>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
