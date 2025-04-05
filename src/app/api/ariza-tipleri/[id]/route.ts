import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Arıza tipi detayını getir
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

    const arizaTipi = await prisma.arizaTipi.findUnique({
      where: { id },
    });

    if (!arizaTipi) {
      return NextResponse.json(
        { message: "Arıza tipi bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(arizaTipi);
  } catch (error) {
    console.error("Arıza tipi detayı getirilirken hata:", error);
    return NextResponse.json(
      { message: "Arıza tipi detayı getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Arıza tipi güncelle
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
    const { ad, ekbilgi } = await request.json();

    // Arıza tipi var mı kontrol et
    const arizaTipi = await prisma.arizaTipi.findUnique({
      where: { id },
    });

    if (!arizaTipi) {
      return NextResponse.json(
        { message: "Arıza tipi bulunamadı" },
        { status: 404 }
      );
    }

    // Ad değişmişse, yeni ad kullanımda mı kontrol et
    if (ad !== arizaTipi.ad) {
      const existingArizaTipi = await prisma.arizaTipi.findUnique({
        where: { ad },
      });

      if (existingArizaTipi) {
        return NextResponse.json(
          { message: "Bu arıza tipi adı zaten kullanımda" },
          { status: 400 }
        );
      }
    }

    // Arıza tipini güncelle
    const updatedArizaTipi = await prisma.arizaTipi.update({
      where: { id },
      data: {
        ad,
        ekbilgi,
      },
    });

    return NextResponse.json(updatedArizaTipi);
  } catch (error) {
    console.error("Arıza tipi güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Arıza tipi güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Arıza tipi sil
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

    // Arıza tipi var mı kontrol et
    const arizaTipi = await prisma.arizaTipi.findUnique({
      where: { id },
    });

    if (!arizaTipi) {
      return NextResponse.json(
        { message: "Arıza tipi bulunamadı" },
        { status: 404 }
      );
    }

    // Arıza tipini sil
    await prisma.arizaTipi.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Arıza tipi başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Arıza tipi silme hatası:", error);
    return NextResponse.json(
      { message: "Arıza tipi silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 