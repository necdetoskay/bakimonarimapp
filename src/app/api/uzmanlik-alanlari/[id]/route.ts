import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Belirli bir uzmanlık alanını getir
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

    // Uzmanlık alanını getir
    const uzmanlikAlani = await prisma.uzmanlikAlani.findUnique({
      where: { id },
      include: {
        teknikerler: true, // İlişkili teknikerleri de getir
      },
    });

    if (!uzmanlikAlani) {
      return new NextResponse(
        JSON.stringify({ error: "Uzmanlık alanı bulunamadı." }),
        { status: 404 }
      );
    }

    return NextResponse.json(uzmanlikAlani);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Veri alınırken bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// PUT: Uzmanlık alanını güncelle
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
    const { ad, ekbilgi } = body;

    // Veri doğrulama
    if (!ad) {
      return new NextResponse(
        JSON.stringify({ error: "Uzmanlık alanı adı gereklidir." }),
        { status: 400 }
      );
    }

    // Uzmanlık alanının var olduğunu kontrol et
    const existingUzmanlikAlani = await prisma.uzmanlikAlani.findUnique({
      where: { id },
    });

    if (!existingUzmanlikAlani) {
      return new NextResponse(
        JSON.stringify({ error: "Uzmanlık alanı bulunamadı." }),
        { status: 404 }
      );
    }

    // Aynı ada sahip başka bir kayıt var mı kontrol et (kendi dışında)
    const duplicateUzmanlikAlani = await prisma.uzmanlikAlani.findFirst({
      where: {
        ad,
        id: { not: id },
      },
    });

    if (duplicateUzmanlikAlani) {
      return new NextResponse(
        JSON.stringify({ error: "Bu isimle bir uzmanlık alanı zaten mevcut." }),
        { status: 400 }
      );
    }

    // Uzmanlık alanını güncelle
    const updatedUzmanlikAlani = await prisma.uzmanlikAlani.update({
      where: { id },
      data: {
        ad,
        ekbilgi,
      },
    });

    return NextResponse.json(updatedUzmanlikAlani);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Uzmanlık alanı güncellenirken bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// DELETE: Uzmanlık alanını sil
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

    // Uzmanlık alanını kontrol et
    const uzmanlikAlani = await prisma.uzmanlikAlani.findUnique({
      where: { id },
      include: {
        teknikerler: true,
      },
    });

    if (!uzmanlikAlani) {
      return new NextResponse(
        JSON.stringify({ error: "Uzmanlık alanı bulunamadı." }),
        { status: 404 }
      );
    }

    // İlişkili tekniker var mı kontrol et
    if (uzmanlikAlani.teknikerler.length > 0) {
      return new NextResponse(
        JSON.stringify({
          error: "Bu uzmanlık alanı tekniker(ler) tarafından kullanılıyor. Önce ilişkiyi kaldırın.",
        }),
        { status: 400 }
      );
    }

    // Uzmanlık alanını sil
    await prisma.uzmanlikAlani.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Uzmanlık alanı başarıyla silindi.",
    });
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Uzmanlık alanı silinirken bir hata oluştu." }),
      { status: 500 }
    );
  }
} 