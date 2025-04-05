import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Tüm malzemeleri getir
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

    const malzemeler = await prisma.malzeme.findMany({
      orderBy: {
        ad: 'asc'
      }
    });

    return NextResponse.json(malzemeler);
  } catch (error) {
    console.error("Malzemeler getirilirken hata:", error);
    return NextResponse.json(
      { message: "Malzemeler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni malzeme oluştur
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

    const { ad, birim, ekbilgi } = await request.json();

    // Validasyon
    if (!ad) {
      return NextResponse.json(
        { message: "Malzeme adı gereklidir" },
        { status: 400 }
      );
    }

    // Ad kontrolü
    const existingMalzeme = await prisma.malzeme.findUnique({
      where: { ad },
    });

    if (existingMalzeme) {
      return NextResponse.json(
        { message: "Bu malzeme adı zaten kullanımda" },
        { status: 400 }
      );
    }

    // Malzeme oluştur
    const newMalzeme = await prisma.malzeme.create({
      data: {
        ad,
        birim,
        ekbilgi,
      },
    });

    return NextResponse.json(newMalzeme, { status: 201 });
  } catch (error) {
    console.error("Malzeme oluşturma hatası:", error);
    return NextResponse.json(
      { message: "Malzeme oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 