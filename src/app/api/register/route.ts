import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email adresi zaten kullanımda" },
        { status: 400 }
      );
    }

    // Varsayılan user rolünü getir
    const userRole = await prisma.role.findUnique({
      where: { name: "user" },
    });

    if (!userRole) {
      return NextResponse.json(
        { message: "Kullanıcı rolü bulunamadı" },
        { status: 500 }
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    const newUser = await prisma.user.create({
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