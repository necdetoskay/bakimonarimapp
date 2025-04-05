import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Tüm projeleri getir
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

    // Tüm projeleri getir
    const projeler = await prisma.proje.findMany({
      orderBy: {
        createdAt: "desc", // En yeni projeler önce
      },
    });

    return NextResponse.json(projeler);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Veri alınırken bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// POST: Yeni proje ekle
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
    const { ad, ekbilgi, adres, konum, image } = body;

    // Veri doğrulama
    if (!ad) {
      return new NextResponse(
        JSON.stringify({ error: "Proje adı gereklidir." }),
        { status: 400 }
      );
    }

    if (!adres) {
      return new NextResponse(
        JSON.stringify({ error: "Proje adresi gereklidir." }),
        { status: 400 }
      );
    }

    // Daha önce aynı adda proje var mı kontrol et
    const existingProje = await prisma.proje.findUnique({
      where: { ad },
    });

    if (existingProje) {
      return new NextResponse(
        JSON.stringify({ error: "Bu isimle bir proje zaten mevcut." }),
        { status: 400 }
      );
    }

    // Yeni proje oluştur
    const proje = await prisma.proje.create({
      data: {
        ad,
        ekbilgi,
        adres,
        konum,
        image,
      },
    });

    return NextResponse.json(proje);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Proje eklenirken bir hata oluştu." }),
      { status: 500 }
    );
  }
} 