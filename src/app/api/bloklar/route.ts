import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET: Tüm blokları getir
export async function GET(req: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    // URL'den projeId parametresini al
    const { searchParams } = new URL(req.url);
    const projeId = searchParams.get("projeId");

    // Sorgu kriterlerini oluştur
    const where = projeId ? { projeId } : {};

    // Blokları getir
    const bloklar = await db.blok.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ad: true,
        projeId: true,
        ekbilgi: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Önbelleğe alma yönergeleri ekle
    const response = NextResponse.json(bloklar);
    
    // Cache süresini azaltarak daha hızlı güncellemeleri sağla
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    
    return response;
  } catch (error: any) {
    console.error("Blokları getirme hatası:", error);
    return NextResponse.json(
      { message: "Blokları getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST: Yeni blok ekle
export async function POST(req: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    // İstek gövdesinden verileri al
    const body = await req.json();
    const { ad, projeId, ekbilgi } = body;

    // Zorunlu alanları kontrol et
    if (!ad || !projeId) {
      return NextResponse.json(
        { message: "Blok adı ve proje ID'si zorunludur" },
        { status: 400 }
      );
    }

    // Proje var mı kontrol et
    const existingProje = await db.proje.findUnique({
      where: { id: projeId },
    });

    if (!existingProje) {
      return NextResponse.json(
        { message: "Belirtilen proje bulunamadı" },
        { status: 404 }
      );
    }

    // Aynı projedeki aynı ada sahip blok var mı kontrol et
    const existingBlok = await db.blok.findFirst({
      where: {
        AND: [
          { projeId },
          { ad },
        ],
      },
    });

    if (existingBlok) {
      return NextResponse.json(
        { message: "Bu projede bu ada sahip bir blok zaten var" },
        { status: 400 }
      );
    }

    // Yeni blok oluştur
    const blok = await db.blok.create({
      data: {
        ad,
        projeId,
        ekbilgi: ekbilgi || null,
      },
    });

    return NextResponse.json(blok);
  } catch (error: any) {
    console.error("Blok ekleme hatası:", error);
    return NextResponse.json(
      { message: "Blok eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 