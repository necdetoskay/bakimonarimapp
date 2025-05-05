import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import SessionProvider from "@/providers/SessionProvider";
import { NavigationProvider } from "@/providers/navigation-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Yönetim Uygulaması",
  description: "Next.js, PostgreSQL, Prisma ve Shadcn/UI ile oluşturuldu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <SessionProvider>
          <NavigationProvider>
            {children}
            <Toaster />
          </NavigationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}