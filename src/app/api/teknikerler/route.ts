import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Tüm teknikerleri getir
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

    const teknikerler = await prisma.tekniker.findMany({
      include: {
        uzmanlikAlanlari: true,
      },
      orderBy: {
        adsoyad: 'asc'
      }
    });

    return NextResponse.json(teknikerler);
  } catch (error) {
    console.error("Teknikerler getirilirken hata:", error);
    return NextResponse.json(
      { message: "Teknikerler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni tekniker oluştur
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

    const { adsoyad, telefon, ekbilgi, uzmanlikAlanlariIds } = await request.json();

    // Validasyon
    if (!adsoyad) {
      return NextResponse.json(
        { message: "Tekniker adı ve soyadı gereklidir" },
        { status: 400 }
      );
    }

    // Tekniker oluştur
    const newTekniker = await prisma.tekniker.create({
      data: {
        adsoyad,
        telefon,
        ekbilgi,
        uzmanlikAlanlari: {
          connect: uzmanlikAlanlariIds && uzmanlikAlanlariIds.length > 0
            ? uzmanlikAlanlariIds.map((id: string) => ({ id }))
            : []
        }
      },
      include: {
        uzmanlikAlanlari: true,
      },
    });

    return NextResponse.json(newTekniker, { status: 201 });
  } catch (error) {
    console.error("Tekniker oluşturma hatası:", error);
    return NextResponse.json(
      { message: "Tekniker oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 