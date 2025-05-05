"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var client_1 = require("@prisma/client");
// PrismaClient'ın çoklu örneklemelerini önlemek için globalThis kullanılıyor
// Development sırasında hot reload nedeniyle birden fazla PrismaClient örneği oluşabilir
// Bu şekilde global bir değişken kullanarak bunu önlüyoruz
var globalForPrisma = globalThis;
// Development modunda çok fazla yeni bağlantı oluşturmamak için
// global bir istemci kullanıyoruz
exports.db = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.db;
