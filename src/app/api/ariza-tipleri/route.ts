import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Tüm arıza tiplerini getir
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

    const arizaTipleri = await prisma.arizaTipi.findMany({
      orderBy: {
        ad: 'asc'
      }
    });

    return NextResponse.json(arizaTipleri);
  } catch (error) {
    console.error("Arıza tipleri getirilirken hata:", error);
    return NextResponse.json(
      { message: "Arıza tipleri getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni arıza tipi oluştur
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

    const { ad, ekbilgi } = await request.json();

    // Validasyon
    if (!ad) {
      return NextResponse.json(
        { message: "Arıza tipi adı gereklidir" },
        { status: 400 }
      );
    }

    // Ad kontrolü
    const existingArizaTipi = await prisma.arizaTipi.findUnique({
      where: { ad },
    });

    if (existingArizaTipi) {
      return NextResponse.json(
        { message: "Bu arıza tipi adı zaten kullanımda" },
        { status: 400 }
      );
    }

    // Arıza tipi oluştur
    const newArizaTipi = await prisma.arizaTipi.create({
      data: {
        ad,
        ekbilgi,
      },
    });

    return NextResponse.json(newArizaTipi, { status: 201 });
  } catch (error) {
    console.error("Arıza tipi oluşturma hatası:", error);
    return NextResponse.json(
      { message: "Arıza tipi oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 