import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Tekniker detayını getir
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

    const tekniker = await prisma.tekniker.findUnique({
      where: { id },
      include: {
        uzmanlikAlanlari: true,
      },
    });

    if (!tekniker) {
      return NextResponse.json(
        { message: "Tekniker bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(tekniker);
  } catch (error) {
    console.error("Tekniker detayı getirilirken hata:", error);
    return NextResponse.json(
      { message: "Tekniker detayı getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Tekniker güncelle
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
    const { adsoyad, telefon, ekbilgi, uzmanlikAlanlariIds } = await request.json();

    // Tekniker var mı kontrol et
    const tekniker = await prisma.tekniker.findUnique({
      where: { id },
      include: {
        uzmanlikAlanlari: true,
      },
    });

    if (!tekniker) {
      return NextResponse.json(
        { message: "Tekniker bulunamadı" },
        { status: 404 }
      );
    }

    // Validasyon
    if (!adsoyad) {
      return NextResponse.json(
        { message: "Tekniker adı ve soyadı gereklidir" },
        { status: 400 }
      );
    }

    // Teknikeri güncelle
    const updatedTekniker = await prisma.tekniker.update({
      where: { id },
      data: {
        adsoyad,
        telefon,
        ekbilgi,
        uzmanlikAlanlari: {
          // Önce mevcut ilişkileri temizle
          set: [],
          // Sonra yeni ilişkileri kur
          connect: uzmanlikAlanlariIds && uzmanlikAlanlariIds.length > 0
            ? uzmanlikAlanlariIds.map((id: string) => ({ id }))
            : []
        }
      },
      include: {
        uzmanlikAlanlari: true,
      },
    });

    return NextResponse.json(updatedTekniker);
  } catch (error) {
    console.error("Tekniker güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Tekniker güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Tekniker sil
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

    // Tekniker var mı kontrol et
    const tekniker = await prisma.tekniker.findUnique({
      where: { id },
    });

    if (!tekniker) {
      return NextResponse.json(
        { message: "Tekniker bulunamadı" },
        { status: 404 }
      );
    }

    // Teknikeri sil
    await prisma.tekniker.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Tekniker başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Tekniker silme hatası:", error);
    return NextResponse.json(
      { message: "Tekniker silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 