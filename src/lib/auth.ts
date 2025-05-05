import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gerekli");
        }
        
        try {
          // Veritabanı bağlantısını kontrol et
          try {
            await db.$connect();
          } catch (dbError) {
            console.error("Veritabanı bağlantı hatası:", dbError);
            throw new Error("Database connection failed");
          }
          
          // Kullanıcıyı email ile bul
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            },
            include: {
              role: true
            }
          });
          
          if (!user) {
            console.log("Kullanıcı bulunamadı:", credentials.email);
            throw new Error("User not found");
          }
          
          // Şifreyi kontrol et
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!passwordMatch) {
            console.log("Yanlış şifre:", credentials.email);
            throw new Error("Incorrect password");
          }
          
          // İzinleri veritabanından al
          const permissionsOnRoles = await db.$queryRaw`
            SELECT p.name 
            FROM "Permission" p
            JOIN "PermissionsOnRoles" por ON p.id = por."permissionId"
            WHERE por."roleId" = ${user.roleId}
          `;
          
          // İzin isimlerini çıkar
          const permissions = Array.isArray(permissionsOnRoles) 
            ? permissionsOnRoles.map(p => p.name as string) 
            : [];
          
          console.log("Başarılı giriş:", credentials.email);
          
          // Kullanıcı bilgilerini döndür
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role.name,
            permissions: permissions
          };
        } catch (error) {
          console.error("Authorize hatası:", error);
          // Hata mesajını ilet
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};