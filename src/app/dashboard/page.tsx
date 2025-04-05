import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Hoş geldiniz, {session?.user?.name}!</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{session?.user?.role || "Tanımlanmamış"}</div>
            <p className="text-xs text-muted-foreground">
              Mevcut kullanıcı rolünüz
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">{session?.user?.email || "Email bilgisi bulunamadı"}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>İzinleriniz</CardTitle>
          <CardDescription>
            Mevcut rolünüzle sahip olduğunuz izinler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session?.user?.permissions?.length ? (
            <div className="grid gap-2">
              {session.user.permissions.map((permission) => (
                <div key={permission} className="bg-slate-100 p-2 rounded-md text-sm">
                  {permission}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">İzin bulunamadı.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 