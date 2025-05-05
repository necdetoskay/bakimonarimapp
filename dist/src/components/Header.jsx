"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
var react_1 = require("next-auth/react");
var button_1 = require("@/components/ui/button");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var avatar_1 = require("@/components/ui/avatar");
var lucide_react_1 = require("lucide-react");
function Header(_a) {
    var user = _a.user;
    return (<header className="h-16 px-6 border-b flex items-center justify-between">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      
      <dropdown_menu_1.DropdownMenu>
        <dropdown_menu_1.DropdownMenuTrigger asChild>
          <button_1.Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <avatar_1.Avatar className="h-8 w-8">
              <avatar_1.AvatarImage src={user.image || ""} alt={user.name || ""}/>
              <avatar_1.AvatarFallback>{getInitials(user.name)}</avatar_1.AvatarFallback>
            </avatar_1.Avatar>
          </button_1.Button>
        </dropdown_menu_1.DropdownMenuTrigger>
        <dropdown_menu_1.DropdownMenuContent className="w-56" align="end" forceMount>
          <dropdown_menu_1.DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-slate-500">
                {user.email}
              </p>
            </div>
          </dropdown_menu_1.DropdownMenuLabel>
          <dropdown_menu_1.DropdownMenuSeparator />
          <dropdown_menu_1.DropdownMenuItem>
            <lucide_react_1.User className="mr-2 h-4 w-4"/>
            <span>Profil</span>
          </dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuItem>
            <lucide_react_1.Settings className="mr-2 h-4 w-4"/>
            <span>Ayarlar</span>
          </dropdown_menu_1.DropdownMenuItem>
          <dropdown_menu_1.DropdownMenuSeparator />
          <dropdown_menu_1.DropdownMenuItem onClick={function () { return (0, react_1.signOut)(); }}>
            <lucide_react_1.LogOut className="mr-2 h-4 w-4"/>
            <span>Çıkış Yap</span>
          </dropdown_menu_1.DropdownMenuItem>
        </dropdown_menu_1.DropdownMenuContent>
      </dropdown_menu_1.DropdownMenu>
    </header>);
}
function getInitials(name) {
    if (!name)
        return "U";
    return name
        .split(" ")
        .map(function (n) { return n[0]; })
        .join("")
        .toUpperCase()
        .substring(0, 2);
}
