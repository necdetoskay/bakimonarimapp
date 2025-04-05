import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Tüm daireleri veya belirli bir bloğa ait daireleri getir
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

    // URL'den blokId parametresini al
    const { searchParams } = new URL(req.url);
    const blokId = searchParams.get("blokId");

    // Eğer blokId varsa, sadece o bloğa ait daireleri getir
    let daireler;
    if (blokId) {
      daireler = await prisma.daire.findMany({
        where: {
          blokId: blokId,
        },
        orderBy: {
          numara: "asc",
        },
      });
    } else {
      // Tüm daireleri getir
      daireler = await prisma.daire.findMany({
        include: {
          blok: {
            select: {
              id: true,
              ad: true,
              proje: {
                select: {
                  id: true,
                  ad: true,
                },
              },
            },
          },
        },
        orderBy: {
          numara: "asc",
        },
      });
    }

    return new NextResponse(JSON.stringify(daireler), { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// POST: Yeni daire ekle
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
    const { numara, kat, ekbilgi, blokId } = body;

    // Validasyon
    if (!numara) {
      return new NextResponse(
        JSON.stringify({ error: "Daire numarası gereklidir." }),
        { status: 400 }
      );
    }

    if (!blokId) {
      return new NextResponse(
        JSON.stringify({ error: "Blok ID gereklidir." }),
        { status: 400 }
      );
    }

    // Blokun var olup olmadığını kontrol et
    const existingBlok = await prisma.blok.findUnique({
      where: {
        id: blokId,
      },
    });

    if (!existingBlok) {
      return new NextResponse(
        JSON.stringify({ error: "Belirtilen blok bulunamadı." }),
        { status: 404 }
      );
    }

    // Aynı blokta aynı numaralı daire var mı kontrol et
    const existingDaire = await prisma.daire.findFirst({
      where: {
        numara,
        blokId,
      },
    });

    if (existingDaire) {
      return new NextResponse(
        JSON.stringify({ error: "Bu blokta aynı numaralı bir daire zaten mevcut." }),
        { status: 400 }
      );
    }

    // Yeni daire oluştur
    const daire = await prisma.daire.create({
      data: {
        numara,
        kat,
        ekbilgi,
        blokId,
      },
    });

    return new NextResponse(JSON.stringify(daire), { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
} 