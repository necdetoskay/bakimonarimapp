import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Tüm uzmanlık alanlarını getir
export async function GET(req: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için yetkiniz yok." }),
        { status: 401 }
      );
    }

    // Tüm uzmanlık alanlarını getir
    const uzmanlikAlanlari = await prisma.uzmanlikAlani.findMany({
      orderBy: {
        ad: "asc",
      },
    });

    return NextResponse.json(uzmanlikAlanlari);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Veri alınırken bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// POST: Yeni uzmanlık alanı ekle
export async function POST(req: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için yetkiniz yok." }),
        { status: 401 }
      );
    }

    // Gelen veriyi al
    const body = await req.json();
    const { ad, ekbilgi } = body;

    // Veri doğrulama
    if (!ad) {
      return new NextResponse(
        JSON.stringify({ error: "Uzmanlık alanı adı gereklidir." }),
        { status: 400 }
      );
    }

    // Daha önce aynı adda uzmanlık alanı var mı kontrol et
    const existingUzmanlikAlani = await prisma.uzmanlikAlani.findUnique({
      where: { ad },
    });

    if (existingUzmanlikAlani) {
      return new NextResponse(
        JSON.stringify({ error: "Bu isimle bir uzmanlık alanı zaten mevcut." }),
        { status: 400 }
      );
    }

    // Yeni uzmanlık alanı oluştur
    const uzmanlikAlani = await prisma.uzmanlikAlani.create({
      data: {
        ad,
        ekbilgi,
      },
    });

    return NextResponse.json(uzmanlikAlani);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Uzmanlık alanı eklenirken bir hata oluştu." }),
      { status: 500 }
    );
  }
} 