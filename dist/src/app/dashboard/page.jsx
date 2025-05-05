"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
var react_1 = require("next-auth/react");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var link_1 = __importDefault(require("next/link"));
var SummaryCards_1 = __importDefault(require("@/components/dashboard/SummaryCards"));
var FaultTypeChart_1 = __importDefault(require("@/components/dashboard/FaultTypeChart"));
var ActivityChart_1 = __importDefault(require("@/components/dashboard/ActivityChart"));
var RecentFaults_1 = __importDefault(require("@/components/dashboard/RecentFaults"));
var StatsOverview_1 = __importDefault(require("@/components/dashboard/StatsOverview"));
var use_toast_1 = require("@/hooks/use-toast");
var react_2 = require("react");
var arizaUtils_1 = require("@/utils/arizaUtils");
var swr_1 = __importDefault(require("swr"));
function Dashboard() {
    var session = (0, react_1.useSession)().data;
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_2.useState)(true), isLoading = _a[0], setIsLoading = _a[1];
    // SWR ile temel verileri çek - dashboard sayfasında yenile butonuna basıldığında kullanılacak
    var mutateArizalar = (0, swr_1.default)(session ? "/api/arizalar" : null, arizaUtils_1.fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30000 // 30 saniye
    }).mutate;
    // Sayfa yüklendiğinde loading durumunu güncelle
    (0, react_2.useEffect)(function () {
        // Kısa bir gösterim süresi ver
        var timer = setTimeout(function () {
            setIsLoading(false);
        }, 500);
        return function () { return clearTimeout(timer); };
    }, []);
    // Tüm veri yenileme fonksiyonu
    var handleRefreshData = function () {
        setIsLoading(true);
        // Tüm verileri yenile
        mutateArizalar();
        toast({
            title: "Veriler yenileniyor",
            description: "Dashboard verileri güncelleniyor...",
            duration: 3000,
        });
        // Yenileme sonrası loading durumunu güncelle
        setTimeout(function () {
            setIsLoading(false);
        }, 1000);
    };
    // Veri yükleniyor ekranı
    if (isLoading) {
        return (<div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Dashboard yükleniyor...</p>
      </div>);
    }
    return (<div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        
        <div className="flex space-x-2">
          <link_1.default href="/dashboard/analytics">
            <button_1.Button variant="outline" size="sm" className="mr-2">
              <lucide_react_1.BarChart4 className="h-4 w-4 mr-2"/>
              Analitik Dashboard
            </button_1.Button>
          </link_1.default>
          <button_1.Button onClick={handleRefreshData} variant="outline" size="sm">
            <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
            Yenile
          </button_1.Button>
        </div>
      </div>
      
      {/* Özet Kartları Bileşeni */}
      <SummaryCards_1.default />
      
      {/* Ana İçerik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Arıza Tipleri Dağılımı */}
        <div className="col-span-3">
          <FaultTypeChart_1.default />
        </div>
        
        {/* Son 30 gün aktivite grafiği */}
        <div className="col-span-4">
          <ActivityChart_1.default />
        </div>
      </div>
      
      {/* Son Eklenen Arızalar */}
      <RecentFaults_1.default />
      
      {/* Durum ve Performans Özeti */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsOverview_1.default />
      </div>
    </div>);
}
