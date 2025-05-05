"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FaultTypeChart;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var arizaUtils_1 = require("@/utils/arizaUtils");
var swr_1 = __importDefault(require("swr"));
var recharts_1 = require("recharts");
function FaultTypeChart() {
    var _a = (0, react_1.useState)([]), pieData = _a[0], setPieData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    // SWR ile veri çekme
    var _c = (0, swr_1.default)("/api/arizalar", arizaUtils_1.fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30000 // 30 saniye
    }), _d = _c.data, arizalar = _d === void 0 ? [] : _d, arizalarError = _c.error;
    (0, react_1.useEffect)(function () {
        if (arizalar.length > 0 && !arizalarError) {
            // Arıza tiplerine göre gruplandırma
            var arizaTipGruplari_1 = {};
            arizalar.forEach(function (ariza) {
                var _a;
                var tipAdi = ((_a = ariza.arizaTipi) === null || _a === void 0 ? void 0 : _a.ad) || "Diğer";
                if (!arizaTipGruplari_1[tipAdi]) {
                    arizaTipGruplari_1[tipAdi] = 0;
                }
                arizaTipGruplari_1[tipAdi]++;
            });
            // Pasta grafik için veri hazırlığı
            var chartData = Object.entries(arizaTipGruplari_1).map(function (_a) {
                var name = _a[0], value = _a[1];
                return ({
                    name: name,
                    value: value
                });
            });
            setPieData(chartData);
            setIsLoading(false);
        }
    }, [arizalar, arizalarError]);
    // Pasta grafik renkleri
    var COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    if (isLoading) {
        return (<card_1.Card className="col-span-3">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg">Arıza Tipleri Dağılımı</card_1.CardTitle>
          <card_1.CardDescription>Arıza tiplerinin dağılımı ve sayıları</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    }
    return (<card_1.Card className="col-span-3">
      <card_1.CardHeader>
        <card_1.CardTitle className="text-lg">Arıza Tipleri Dağılımı</card_1.CardTitle>
        <card_1.CardDescription>Arıza tiplerinin dağılımı ve sayıları</card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="h-[300px] w-full">
          <recharts_1.ResponsiveContainer width="100%" height="100%">
            <recharts_1.PieChart>
              <recharts_1.Pie data={pieData} cx="50%" cy="50%" labelLine={true} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={function (_a) {
        var name = _a.name, percent = _a.percent;
        return "".concat(name, ": ").concat((percent * 100).toFixed(0), "%");
    }} animationDuration={1000} animationBegin={200}>
                {pieData.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[index % COLORS.length]}/>); })}
              </recharts_1.Pie>
              <recharts_1.Tooltip formatter={function (value, name) { return [
            "".concat(value, " adet"),
            "".concat(name)
        ]; }}/>
            </recharts_1.PieChart>
          </recharts_1.ResponsiveContainer>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
