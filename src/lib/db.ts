import { PrismaClient } from "@prisma/client";

// PrismaClient'ın çoklu örneklemelerini önlemek için globalThis kullanılıyor
// Development sırasında hot reload nedeniyle birden fazla PrismaClient örneği oluşabilir
// Bu şekilde global bir değişken kullanarak bunu önlüyoruz

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Development modunda çok fazla yeni bağlantı oluşturmamak için
// global bir istemci kullanıyoruz
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db; 