import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Tüm arızaları veya belirli bir daireye ait arızaları getir
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Oturum kontrolü
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için giriş yapmanız gerekiyor" }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const daireId = searchParams.get('daireId');
    
    // Eğer daireId parametresi varsa, sadece o daireye ait arızaları getir
    const where = daireId ? { daireId } : {};
    
    const arizalar = await prisma.ariza.findMany({
      where,
      include: {
        arizaTipi: true,
        daire: {
          include: {
            blok: {
              include: {
                proje: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(arizalar);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Arızalar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST: Yeni arıza kaydı oluştur
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Oturum kontrolü
    if (!session) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const {
      daireId,
      bildirenKisi,
      telefon,
      aciklama,
      arizaTipiId,
      oncelik,
      ekbilgi
    } = await req.json();

    // Zorunlu alanları kontrol et
    if (!daireId || !aciklama) {
      return NextResponse.json(
        { error: "Daire ve arıza açıklaması zorunludur" },
        { status: 400 }
      );
    }

    // Dairenin var olup olmadığını kontrol et
    const daireKontrol = await prisma.daire.findUnique({
      where: { id: daireId }
    });

    if (!daireKontrol) {
      return NextResponse.json(
        { error: "Belirtilen daire bulunamadı" },
        { status: 404 }
      );
    }

    // Arıza tipi varsa kontrol et
    if (arizaTipiId) {
      const arizaTipiKontrol = await prisma.arizaTipi.findUnique({
        where: { id: arizaTipiId }
      });

      if (!arizaTipiKontrol) {
        return NextResponse.json(
          { error: "Belirtilen arıza tipi bulunamadı" },
          { status: 404 }
        );
      }
    }

    // Arıza oluştur
    const yeniAriza = await prisma.ariza.create({
      data: {
        daireId,
        bildirenKisi: bildirenKisi || null,
        telefon: telefon || null,
        aciklama,
        arizaTipiId: arizaTipiId || null,
        oncelik: oncelik || "Orta",
        ekbilgi: ekbilgi || null
      },
      include: {
        arizaTipi: true,
        daire: {
          include: {
            blok: {
              include: {
                proje: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(yeniAriza, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Arıza kaydedilirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 