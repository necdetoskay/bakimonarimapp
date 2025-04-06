import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

// Prisma istemcisini daha verimli bir şekilde oluştur
// Bu, bağlantı havuzunu yeniden kullanır ve daha iyi performans sağlar
import { db } from "@/lib/db";

// Sık sorgulanan verileri önbelleğe almak için cache headers
const cacheHeaders = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  "CDN-Cache-Control": "public, max-age=60",
};

// GET: Tüm projeleri getir
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

    // Projeleri getir
    const projeler = await db.proje.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ad: true,
        adres: true,
        konum: true,
        image: true,
        ekbilgi: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Önbelleğe alma yönergeleri ekle
    const response = NextResponse.json(projeler);
    
    // 60 saniye boyunca istemci tarafında önbelleğe alınabilir
    // 300 saniye boyunca shared cache'de (CDN) saklanabilir
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=60"
    );
    
    return response;
  } catch (error) {
    console.error("Projeler getirme hatası:", error);
    return NextResponse.json(
      { message: "Projeler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST: Yeni proje ekle
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

    // İstek gövdesini analiz et
    const body = await req.json();
    const { ad, adres, konum, image, ekbilgi } = body;

    // Zorunlu alanları kontrol et
    if (!ad || !adres) {
      return NextResponse.json(
        { message: "Proje adı ve adresi zorunludur" },
        { status: 400 }
      );
    }

    // Aynı ada sahip proje var mı kontrol et
    const existingProje = await db.proje.findFirst({
      where: { ad },
    });

    if (existingProje) {
      return NextResponse.json(
        { message: "Bu ada sahip bir proje zaten var" },
        { status: 400 }
      );
    }

    // Yeni proje oluştur
    const proje = await db.proje.create({
      data: {
        ad,
        adres,
        konum: konum || null,
        image: image || null,
        ekbilgi: ekbilgi || null,
      },
    });

    return NextResponse.json(proje);
  } catch (error) {
    console.error("Proje ekleme hatası:", error);
    return NextResponse.json(
      { message: "Proje eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 