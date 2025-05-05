"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
require("./globals.css");
var google_1 = require("next/font/google");
var utils_1 = require("@/lib/utils");
var SessionProvider_1 = __importDefault(require("@/providers/SessionProvider"));
var toaster_1 = require("@/components/ui/toaster");
var inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "Auth Yönetim Uygulaması",
    description: "Next.js, PostgreSQL, Prisma ve Shadcn/UI ile oluşturuldu",
};
function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="tr" suppressHydrationWarning>
      <body className={(0, utils_1.cn)("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <SessionProvider_1.default>
          {children}
          <toaster_1.Toaster />
        </SessionProvider_1.default>
      </body>
    </html>);
}
