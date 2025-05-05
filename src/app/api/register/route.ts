import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    console.log("Register API: Request received");
    const { name, email, password } = await request.json();
    console.log("Register API: Request body parsed");

    // Basit validasyon
    if (!name || !email || !password) {
      console.log("Register API: Validation failed - missing fields");
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
  } catch (error: any) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { message: "Kullanıcı oluşturulurken bir hata oluştu", error: error.message },
      { status: 500 }
    );
  }
}
