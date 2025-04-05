import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Tüm kullanıcıları getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Yalnızca oturum açmış kullanıcılar erişebilir
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Kullanıcılar getirilirken hata:", error);
    return NextResponse.json(
      { message: "Kullanıcılar getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni kullanıcı oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Yalnızca oturum açmış kullanıcılar erişebilir
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { name, email, password, roleId } = await request.json();

    // Validasyon
    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { message: "Tüm alanlar gereklidir" },
        { status: 400 }
      );
    }

    // Email kontrol
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email adresi zaten kullanımda" },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
      },
      include: {
        role: true,
      },
    });

    // Hassas bilgileri kaldır
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Kullanıcı oluşturma hatası:", error);
    return NextResponse.json(
      { message: "Kullanıcı oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 