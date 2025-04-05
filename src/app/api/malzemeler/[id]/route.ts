import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Malzeme detayını getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Yalnızca oturum açmış kullanıcılar erişebilir
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { id } = params;

    const malzeme = await prisma.malzeme.findUnique({
      where: { id },
    });

    if (!malzeme) {
      return NextResponse.json(
        { message: "Malzeme bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(malzeme);
  } catch (error) {
    console.error("Malzeme detayı getirilirken hata:", error);
    return NextResponse.json(
      { message: "Malzeme detayı getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Malzeme güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Yalnızca oturum açmış kullanıcılar erişebilir
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { ad, birim, ekbilgi } = await request.json();

    // Malzeme var mı kontrol et
    const malzeme = await prisma.malzeme.findUnique({
      where: { id },
    });

    if (!malzeme) {
      return NextResponse.json(
        { message: "Malzeme bulunamadı" },
        { status: 404 }
      );
    }

    // Ad değişmişse, yeni ad kullanımda mı kontrol et
    if (ad !== malzeme.ad) {
      const existingMalzeme = await prisma.malzeme.findUnique({
        where: { ad },
      });

      if (existingMalzeme) {
        return NextResponse.json(
          { message: "Bu malzeme adı zaten kullanımda" },
          { status: 400 }
        );
      }
    }

    // Malzemeyi güncelle
    const updatedMalzeme = await prisma.malzeme.update({
      where: { id },
      data: {
        ad,
        birim,
        ekbilgi,
      },
    });

    return NextResponse.json(updatedMalzeme);
  } catch (error) {
    console.error("Malzeme güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Malzeme güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Malzeme sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Yalnızca oturum açmış kullanıcılar erişebilir
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Malzeme var mı kontrol et
    const malzeme = await prisma.malzeme.findUnique({
      where: { id },
    });

    if (!malzeme) {
      return NextResponse.json(
        { message: "Malzeme bulunamadı" },
        { status: 404 }
      );
    }

    // Malzemeyi sil
    await prisma.malzeme.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Malzeme başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Malzeme silme hatası:", error);
    return NextResponse.json(
      { message: "Malzeme silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 