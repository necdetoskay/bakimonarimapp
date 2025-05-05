"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CostAnalysis;
var react_1 = require("react");
var swr_1 = __importDefault(require("swr"));
var arizaUtils_1 = require("@/utils/arizaUtils");
var formatUtils_1 = require("@/utils/formatUtils");
var recharts_1 = require("recharts");
function CostAnalysis() {
    var _a = (0, react_1.useState)([]), costData = _a[0], setCostData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    // Verileri çek
    var _c = (0, swr_1.default)("/api/arizalar", arizaUtils_1.fetcher, { revalidateOnFocus: false, dedupingInterval: 30000 }), _d = _c.data, arizalar = _d === void 0 ? [] : _d, arizalarError = _c.error;
    var _e = (0, swr_1.default)("/api/ariza-tipleri", arizaUtils_1.fetcher, { revalidateOnFocus: false }), _f = _e.data, arizaTipleri = _f === void 0 ? [] : _f, arizaTipleriError = _e.error;
    // Veri hazırlandığında loading durumunu güncelle
    (0, react_1.useEffect)(function () {
        if (arizalar.length > 0 &&
            arizaTipleri.length > 0 &&
            !arizalarError &&
            !arizaTipleriError) {
            processData();
        }
        else if (arizalarError || arizaTipleriError) {
            setIsLoading(false);
        }
    }, [arizalar, arizaTipleri, arizalarError, arizaTipleriError]);
    // Maliyet verilerini hazırla
    var processData = function () {
        // Arıza tipi bazında maliyetleri hesapla
        var costByType = {};
        // Önce tüm tipleri sıfır olarak başlat
        arizaTipleri.forEach(function (tip) {
            costByType[tip.ad] = 0;
        });
        // Sonra arızalardan maliyetleri hesapla
        arizalar.forEach(function (ariza) {
            var _a;
            var tipAdi = ((_a = ariza.arizaTipi) === null || _a === void 0 ? void 0 : _a.ad) || "Diğer";
            var maliyet = (0, arizaUtils_1.hesaplaArizaMasrafi)(ariza);
            if (!costByType[tipAdi]) {
                costByType[tipAdi] = 0;
            }
            costByType[tipAdi] += maliyet;
        });
        // Veriyi görselleştirme için uygun formata dönüştür
        var data = Object.entries(costByType)
            .map(function (_a) {
            var name = _a[0], maliyet = _a[1];
            return ({ name: name, maliyet: maliyet });
        })
            .sort(function (a, b) { return b.maliyet - a.maliyet; }); // Büyükten küçüğe sırala
        setCostData(data);
        setIsLoading(false);
    };
    // Tooltip içeriğini özelleştir
    var CustomTooltip = function (_a) {
        var active = _a.active, payload = _a.payload, label = _a.label;
        if (active && payload && payload.length) {
            return (<div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-primary">{(0, formatUtils_1.formatPara)(payload[0].value)}</p>
        </div>);
        }
        return null;
    };
    if (isLoading) {
        return (<div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>);
    }
    if (costData.length === 0) {
        return (<div className="h-full w-full flex items-center justify-center">
        <p className="text-muted-foreground">Henüz maliyet verisi bulunmuyor.</p>
      </div>);
    }
    return (<recharts_1.ResponsiveContainer width="100%" height="100%">
      <recharts_1.BarChart data={costData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
        <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <recharts_1.XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false}/>
        <recharts_1.YAxis tickFormatter={function (value) { return "".concat(value.toLocaleString('tr-TR'), " \u20BA"); }} tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false}/>
        <recharts_1.Tooltip content={<CustomTooltip />}/>
        <recharts_1.Bar dataKey="maliyet" animationDuration={1500} animationBegin={200} radius={[4, 4, 0, 0]}>
          {costData.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[index % COLORS.length]}/>); })}
        </recharts_1.Bar>
      </recharts_1.BarChart>
    </recharts_1.ResponsiveContainer>);
}
