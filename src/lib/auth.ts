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
          return null;
        }
        
        try {
          // Buscar usuario por email con su rol
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            },
            include: {
              role: true
            }
          });
          
          if (!user) {
            console.log("Usuario no encontrado:", credentials.email);
            return null;
          }
          
          // Verificar contraseña
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!passwordMatch) {
            console.log("Contraseña incorrecta para:", credentials.email);
            return null;
          }
          
          // Obtener permisos desde la base de datos usando prisma raw query
          const permissionsOnRoles = await db.$queryRaw`
            SELECT p.name 
            FROM "Permission" p
            JOIN "PermissionsOnRoles" por ON p.id = por."permissionId"
            WHERE por."roleId" = ${user.roleId}
          `;
          
          // Extraer nombres de permisos
          const permissions = Array.isArray(permissionsOnRoles) 
            ? permissionsOnRoles.map(p => p.name as string) 
            : [];
          
          console.log("Login exitoso para:", credentials.email);
          
          // Devolver objeto de usuario con información necesaria
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role.name,
            permissions: permissions
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
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