import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Belirli bir projeyi getir
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için yetkiniz yok." }),
        { status: 401 }
      );
    }

    const { id } = params;

    // Projeyi getir
    const proje = await prisma.proje.findUnique({
      where: { id },
    });

    if (!proje) {
      return new NextResponse(
        JSON.stringify({ error: "Proje bulunamadı." }),
        { status: 404 }
      );
    }

    return NextResponse.json(proje);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Veri alınırken bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// PUT: Projeyi güncelle
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için yetkiniz yok." }),
        { status: 401 }
      );
    }

    const { id } = params;
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

    // Projenin var olduğunu kontrol et
    const existingProje = await prisma.proje.findUnique({
      where: { id },
    });

    if (!existingProje) {
      return new NextResponse(
        JSON.stringify({ error: "Proje bulunamadı." }),
        { status: 404 }
      );
    }

    // Aynı ada sahip başka bir kayıt var mı kontrol et (kendi dışında)
    if (ad !== existingProje.ad) {
      const duplicateProje = await prisma.proje.findFirst({
        where: {
          ad,
          id: { not: id },
        },
      });

      if (duplicateProje) {
        return new NextResponse(
          JSON.stringify({ error: "Bu isimle bir proje zaten mevcut." }),
          { status: 400 }
        );
      }
    }

    // Projeyi güncelle
    const updatedProje = await prisma.proje.update({
      where: { id },
      data: {
        ad,
        ekbilgi,
        adres,
        konum,
        image,
      },
    });

    return NextResponse.json(updatedProje);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Proje güncellenirken bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// DELETE: Projeyi sil
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için yetkiniz yok." }),
        { status: 401 }
      );
    }

    const { id } = params;

    // Projeyi kontrol et
    const proje = await prisma.proje.findUnique({
      where: { id },
    });

    if (!proje) {
      return new NextResponse(
        JSON.stringify({ error: "Proje bulunamadı." }),
        { status: 404 }
      );
    }

    // Projeyi sil
    await prisma.proje.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Proje başarıyla silindi.",
    });
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Proje silinirken bir hata oluştu." }),
      { status: 500 }
    );
  }
} 