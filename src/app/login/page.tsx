"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface AlertStatus {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<AlertStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    // Email ve şifre kontrolü
    if (!email || !password) {
      setAlert({
        type: 'warning',
        message: 'Lütfen email ve şifre alanlarını doldurun.'
      });
      setIsLoading(false);
      return;
    }

    try {
      // Giriş işlemi
      console.log("Giriş denemesi:", email);
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Giriş sonucu:", result);

      if (!result) {
        throw new Error("Giriş işlemi başarısız oldu");
      }

      if (result.error) {
        let errorMessage = 'Giriş yapılırken bir hata oluştu.';
        
        // Hata mesajlarını özelleştir
        if (result.error.includes('Database')) {
          errorMessage = 'Veritabanı bağlantısı kurulamadı. Lütfen sistem yöneticinize başvurun.';
        } else if (result.error.includes('not found')) {
          errorMessage = 'Bu email adresi ile kayıtlı bir kullanıcı bulunamadı.';
        } else if (result.error.includes('password')) {
          errorMessage = 'Şifre yanlış. Lütfen tekrar deneyin.';
        }

        console.error("Giriş hatası:", result.error);
        setAlert({
          type: 'error',
          message: errorMessage
        });
        setIsLoading(false);
        return;
      }

      // Başarılı giriş
      console.log("Giriş başarılı, yönlendiriliyor...");
      setAlert({
        type: 'success',
        message: 'Giriş başarılı! Yönlendiriliyorsunuz...'
      });
      
      // Kısa bir gecikme ile yönlendir
      setTimeout(() => {
        // Doğrudan window.location kullanarak tam sayfa yenileme yap
        window.location.href = "/dashboard";
      }, 1000);

    } catch (error) {
      console.error("Login işlemi hatası:", error);
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
      setIsLoading(false);
    }
  };

  const getAlertIcon = (type: AlertStatus['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
      case 'info':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const alertStyles = {
    error: 'bg-destructive/15 text-destructive border-destructive/50',
    success: 'bg-green-500/15 text-green-500 border-green-500/50',
    warning: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/50',
    info: 'bg-blue-500/15 text-blue-500 border-blue-500/50'
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Giriş Yap</CardTitle>
          <CardDescription>
            Bakım Onarım uygulamasına giriş yapmak için email ve şifrenizi girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {alert && (
              <Alert className={`${alertStyles[alert.type]} border`}>
                {getAlertIcon(alert.type)}
                <AlertTitle className="ml-2">
                  {alert.type === 'error' ? 'Hata' : 
                   alert.type === 'success' ? 'Başarılı' : 
                   alert.type === 'warning' ? 'Uyarı' : 'Bilgi'}
                </AlertTitle>
                <AlertDescription className="ml-2">
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Kayıt Ol
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}