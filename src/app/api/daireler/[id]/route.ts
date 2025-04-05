import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Bir daireyi getir
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

    const id = params.id;

    // Daireyi ve bağlı blok bilgilerini getir
    const daire = await prisma.daire.findUnique({
      where: {
        id: id,
      },
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
    });

    if (!daire) {
      return new NextResponse(
        JSON.stringify({ error: "Daire bulunamadı." }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(daire), { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// PUT: Daire güncelle
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

    const id = params.id;
    const body = await req.json();
    const { numara, kat, ekbilgi } = body;

    // Validasyon
    if (!numara) {
      return new NextResponse(
        JSON.stringify({ error: "Daire numarası gereklidir." }),
        { status: 400 }
      );
    }

    // Dairenin var olup olmadığını kontrol et
    const existingDaire = await prisma.daire.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingDaire) {
      return new NextResponse(
        JSON.stringify({ error: "Daire bulunamadı." }),
        { status: 404 }
      );
    }

    // Aynı blokta aynı numaralı başka daire var mı kontrol et (kendisi hariç)
    const duplicateDaire = await prisma.daire.findFirst({
      where: {
        numara,
        blokId: existingDaire.blokId,
        id: { not: id },
      },
    });

    if (duplicateDaire) {
      return new NextResponse(
        JSON.stringify({ error: "Bu blokta aynı numaralı bir daire zaten mevcut." }),
        { status: 400 }
      );
    }

    // Daireyi güncelle
    const updatedDaire = await prisma.daire.update({
      where: {
        id: id,
      },
      data: {
        numara,
        kat,
        ekbilgi,
      },
    });

    return new NextResponse(JSON.stringify(updatedDaire), { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// DELETE: Daire sil
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

    const id = params.id;

    // Dairenin var olup olmadığını kontrol et
    const existingDaire = await prisma.daire.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingDaire) {
      return new NextResponse(
        JSON.stringify({ error: "Daire bulunamadı." }),
        { status: 404 }
      );
    }

    // Daireyi sil
    await prisma.daire.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Daire başarıyla silindi." }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
} 