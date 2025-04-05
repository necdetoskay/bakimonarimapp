"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  Users,
  Shield,
  Key,
  Home,
  AlertCircle,
  Briefcase,
  Package,
  Wrench,
  Building2
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      showAlways: true,
    },
    {
      title: "Kullanıcılar",
      href: "/dashboard/users",
      icon: Users,
      adminOnly: false,
    },
    {
      title: "Roller",
      href: "/dashboard/roles",
      icon: Shield,
      adminOnly: false,
    },
    {
      title: "İzinler",
      href: "/dashboard/permissions",
      icon: Key,
      adminOnly: false,
    },
    {
      title: "Arıza Tipleri",
      href: "/dashboard/ariza-tipleri",
      icon: AlertCircle,
      adminOnly: false,
    },
    {
      title: "Uzmanlık Alanları",
      href: "/dashboard/uzmanlik-alanlari",
      icon: Briefcase,
      adminOnly: false,
    },
    {
      title: "Malzemeler",
      href: "/dashboard/malzemeler",
      icon: Package,
      adminOnly: false,
    },
    {
      title: "Teknikerler",
      href: "/dashboard/teknikerler",
      icon: Wrench,
      adminOnly: false,
    },
    {
      title: "Projeler",
      href: "/dashboard/projeler",
      icon: Building2,
      adminOnly: false,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">Auth Yönetimi</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            if (!item.showAlways && !isAdmin) return null;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors",
                    pathname === item.href && "bg-slate-800 text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="text-sm text-slate-400">
          {session?.user?.name || "Kullanıcı"}
          <div className="text-xs">{session?.user?.role || "Rol yok"}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 