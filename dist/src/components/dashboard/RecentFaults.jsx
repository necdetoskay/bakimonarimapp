"use strict";
"use client";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecentFaults;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var arizaUtils_1 = require("@/utils/arizaUtils");
var swr_1 = __importDefault(require("swr"));
var link_1 = __importDefault(require("next/link"));
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
function RecentFaults() {
    var _a = (0, react_1.useState)(true), isLoading = _a[0], setIsLoading = _a[1];
    // SWR ile veri çekme
    var _b = (0, swr_1.default)("/api/arizalar", arizaUtils_1.fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30000 // 30 saniye
    }), _c = _b.data, arizalar = _c === void 0 ? [] : _c, arizalarError = _b.error;
    (0, react_1.useEffect)(function () {
        if (!arizalarError) {
            setIsLoading(false);
        }
    }, [arizalarError]);
    if (isLoading) {
        return (<card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <card_1.CardTitle>Son Eklenen Arızalar</card_1.CardTitle>
            <card_1.CardDescription>En son eklenen 10 arıza kaydı</card_1.CardDescription>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    }
    // Arızaları tarihe göre sırala (en yeniden en eskiye)
    var sortedArizalar = __spreadArray([], arizalar, true).sort(function (a, b) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return (<card_1.Card>
      <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <card_1.CardTitle>Son Eklenen Arızalar</card_1.CardTitle>
          <card_1.CardDescription>En son eklenen 10 arıza kaydı</card_1.CardDescription>
        </div>
        <link_1.default href="/dashboard/arizalar">
          <button_1.Button variant="outline" size="sm">
            Tümünü Gör
            <lucide_react_1.ChevronRight className="ml-1 h-4 w-4"/>
          </button_1.Button>
        </link_1.default>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium">Arıza Tipi</th>
                <th className="py-3 px-4 text-left font-medium">Açıklama</th>
                <th className="py-3 px-4 text-left font-medium">Konum</th>
                <th className="py-3 px-4 text-left font-medium">Durum</th>
                <th className="py-3 px-4 text-left font-medium">Tarih</th>
                <th className="py-3 px-4 text-left font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedArizalar.slice(0, 10).map(function (ariza, index) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return (<tr key={ariza.id} className={index % 2 === 1 ? 'bg-slate-50' : ''}>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2">{(0, arizaUtils_1.getArizaIcon)((_a = ariza.arizaTipi) === null || _a === void 0 ? void 0 : _a.ad)}</span>
                      <span>{((_b = ariza.arizaTipi) === null || _b === void 0 ? void 0 : _b.ad) || "Genel"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-[200px] truncate" title={ariza.aciklama}>
                      {ariza.aciklama}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {(_d = (_c = ariza.daire) === null || _c === void 0 ? void 0 : _c.blok) === null || _d === void 0 ? void 0 : _d.ad}-{(_e = ariza.daire) === null || _e === void 0 ? void 0 : _e.numara}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <badge_1.Badge variant={(0, arizaUtils_1.getDurumBadgeVariant)(ariza.durum)}>{ariza.durum}</badge_1.Badge>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                    {(0, date_fns_1.format)(new Date(ariza.createdAt), "dd.MM.yyyy")}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <link_1.default href={"/dashboard/arizalar/".concat(ariza.id)}>
                        <button_1.Button variant="ghost" size="icon" className="h-8 w-8">
                          <lucide_react_1.Eye className="h-4 w-4"/>
                        </button_1.Button>
                      </link_1.default>
                      <link_1.default href={"/dashboard/projeler/".concat((_g = (_f = ariza.daire) === null || _f === void 0 ? void 0 : _f.blok) === null || _g === void 0 ? void 0 : _g.projeId, "/bloklar/").concat((_h = ariza.daire) === null || _h === void 0 ? void 0 : _h.blokId, "/daireler/").concat(ariza.daireId)}>
                        <button_1.Button variant="ghost" size="icon" className="h-8 w-8">
                          <lucide_react_1.Home className="h-4 w-4"/>
                        </button_1.Button>
                      </link_1.default>
                    </div>
                  </td>
                </tr>);
        })}
            </tbody>
          </table>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
