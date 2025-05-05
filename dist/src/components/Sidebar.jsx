"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var link_1 = __importDefault(require("next/link"));
var navigation_1 = require("next/navigation");
var utils_1 = require("@/lib/utils");
var react_1 = require("next-auth/react");
var lucide_react_1 = require("lucide-react");
var accordion_1 = require("@/components/ui/accordion");
var Sidebar = function () {
    var _a, _b, _c;
    var pathname = (0, navigation_1.usePathname)();
    var session = (0, react_1.useSession)().data;
    var isAdmin = ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.role) === "admin";
    // Define menu categories
    var menuCategories = [
        {
            title: "Genel",
            icon: lucide_react_1.LayoutDashboard,
            items: [
                {
                    title: "Dashboard",
                    href: "/dashboard",
                    icon: lucide_react_1.Home,
                    showAlways: true,
                },
                {
                    title: "Raporlar",
                    href: "/dashboard/raporlar",
                    icon: lucide_react_1.BarChart2,
                    showAlways: true,
                },
            ]
        },
        {
            title: "Kullanıcı Yönetimi",
            icon: lucide_react_1.Users,
            items: [
                {
                    title: "Kullanıcılar",
                    href: "/dashboard/users",
                    icon: lucide_react_1.Users,
                    adminOnly: false,
                },
                {
                    title: "Roller",
                    href: "/dashboard/roles",
                    icon: lucide_react_1.Shield,
                    adminOnly: false,
                },
                {
                    title: "İzinler",
                    href: "/dashboard/permissions",
                    icon: lucide_react_1.Key,
                    adminOnly: false,
                },
            ]
        },
        {
            title: "Arıza Yönetimi",
            icon: lucide_react_1.Hammer,
            items: [
                {
                    title: "Arıza Tipleri",
                    href: "/dashboard/ariza-tipleri",
                    icon: lucide_react_1.AlertCircle,
                    adminOnly: false,
                },
                {
                    title: "Uzmanlık Alanları",
                    href: "/dashboard/uzmanlik-alanlari",
                    icon: lucide_react_1.Briefcase,
                    adminOnly: false,
                },
                {
                    title: "Malzemeler",
                    href: "/dashboard/malzemeler",
                    icon: lucide_react_1.Package,
                    adminOnly: false,
                },
                {
                    title: "Teknikerler",
                    href: "/dashboard/teknikerler",
                    icon: lucide_react_1.Wrench,
                    adminOnly: false,
                },
            ]
        },
        {
            title: "Proje Yönetimi",
            icon: lucide_react_1.FileText,
            items: [
                {
                    title: "Projeler",
                    href: "/dashboard/projeler",
                    icon: lucide_react_1.Building2,
                    adminOnly: false,
                },
            ]
        }
    ];
    // Function to render a single menu item
    var renderMenuItem = function (item) {
        if (item.adminOnly && !isAdmin)
            return null;
        if (!item.showAlways && !isAdmin)
            return null;
        return (<li key={item.href}>
        <link_1.default href={item.href} className={(0, utils_1.cn)("flex items-center gap-3 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors", pathname === item.href && "bg-slate-800 text-white")}>
          {item.icon && <item.icon className="h-5 w-5"/>}
          <span>{item.title}</span>
        </link_1.default>
      </li>);
    };
    return (<aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">Yönetim Paneli</h1>
      </div>
      <nav className="flex-1 p-4">
        <accordion_1.Accordion type="multiple" defaultValue={["Genel"]} className="space-y-2">
          {menuCategories.map(function (category) { return (<accordion_1.AccordionItem key={category.title} value={category.title}>
              <accordion_1.AccordionTrigger className="flex items-center gap-3">
                {category.icon && <category.icon className="h-5 w-5"/>}
                <span>{category.title}</span>
              </accordion_1.AccordionTrigger>
              <accordion_1.AccordionContent>
                <ul className="space-y-1 pl-2">
                  {category.items.map(function (item) { return renderMenuItem(item); })}
                </ul>
              </accordion_1.AccordionContent>
            </accordion_1.AccordionItem>); })}
        </accordion_1.Accordion>
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="text-sm text-slate-400">
          {((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.name) || "Kullanıcı"}
          <div className="text-xs">{((_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.role) || "Rol yok"}</div>
        </div>
      </div>
    </aside>);
};
exports.default = Sidebar;
