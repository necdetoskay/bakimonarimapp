import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Basit validasyon
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "İsim, email ve şifre gereklidir" },
        { status: 400 }
      );
    }

    // Email daha önce kullanılmış mı kontrol et
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email adresi zaten kullanımda" },
        { status: 400 }
      );
    }

    // "user" rolünü bul veya oluştur
    let userRole = await db.role.findUnique({
      where: { name: "user" },
    });

    // Eğer user rolü yoksa, onu oluştur
    if (!userRole) {
      userRole = await db.role.create({
        data: {
          name: "user",
          description: "Standart kullanıcı rolü"
        },
      });
      console.log("User rolü otomatik olarak oluşturuldu:", userRole.id);
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: userRole.id,
      },
    });

    // Hassas bilgiler olmadan kullanıcıyı döndür
    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { message: "Kullanıcı oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 