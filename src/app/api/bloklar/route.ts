import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Tüm blokları getir
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

    // URL'den projeId parametresini al
    const { searchParams } = new URL(req.url);
    const projeId = searchParams.get("projeId");

    // Eğer projeId varsa, sadece o projeye ait blokları getir
    let bloklar;
    if (projeId) {
      bloklar = await prisma.blok.findMany({
        where: {
          projeId: projeId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Tüm blokları getir
      bloklar = await prisma.blok.findMany({
        include: {
          proje: {
            select: {
              id: true,
              ad: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return new NextResponse(JSON.stringify(bloklar), { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// POST: Yeni blok ekle
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

    // İstek gövdesinden verileri al
    const body = await req.json();
    const { ad, ekbilgi, projeId } = body;

    // Validasyon
    if (!ad) {
      return new NextResponse(
        JSON.stringify({ error: "Blok adı gereklidir." }),
        { status: 400 }
      );
    }

    if (!projeId) {
      return new NextResponse(
        JSON.stringify({ error: "Proje ID gereklidir." }),
        { status: 400 }
      );
    }

    // Projenin var olup olmadığını kontrol et
    const existingProje = await prisma.proje.findUnique({
      where: {
        id: projeId,
      },
    });

    if (!existingProje) {
      return new NextResponse(
        JSON.stringify({ error: "Belirtilen proje bulunamadı." }),
        { status: 404 }
      );
    }

    // Yeni blok oluştur
    const blok = await prisma.blok.create({
      data: {
        ad,
        ekbilgi,
        projeId,
      },
    });

    return new NextResponse(JSON.stringify(blok), { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
} 