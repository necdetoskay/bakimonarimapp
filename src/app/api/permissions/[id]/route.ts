import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// İzin detayını getir
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

    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
       roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!permission) {
      return NextResponse.json(
        { message: "İzin bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(permission);
  } catch (error) {
    console.error("İzin detayı getirilirken hata:", error);
    return NextResponse.json(
      { message: "İzin detayı getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// İzin güncelle
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
    const { name, description } = await request.json();

    // İzin var mı kontrol et
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      return NextResponse.json(
        { message: "İzin bulunamadı" },
        { status: 404 }
      );
    }

    // Temel izinleri güncellemeyi engelle
    if (["read", "write", "delete"].includes(permission.name)) {
      return NextResponse.json(
        { message: "Temel izinler değiştirilemez" },
        { status: 400 }
      );
    }

    // İzin adı değişmişse, yeni ad kullanımda mı kontrol et
    if (name !== permission.name) {
      const existingPermission = await prisma.permission.findUnique({
        where: { name },
      });

      if (existingPermission) {
        return NextResponse.json(
          { message: "Bu izin adı zaten kullanımda" },
          { status: 400 }
        );
      }
    }

    // İzni güncelle
    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: {
        name,
        description,
      },
      include: {
        roles: true,
      },
    });

    return NextResponse.json(updatedPermission);
  } catch (error) {
    console.error("İzin güncelleme hatası:", error);
    return NextResponse.json(
      { message: "İzin güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// İzin sil
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

    // İzni kontrol et
    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });

    if (!permission) {
      return NextResponse.json(
        { message: "İzin bulunamadı" },
        { status: 404 }
      );
    }

    // Temel izinleri silmeyi engelle
    if (["read", "write", "delete"].includes(permission.name)) {
      return NextResponse.json(
        { message: "Temel izinler silinemez" },
        { status: 400 }
      );
    }

    // Rollere atanmış mı kontrol et
    if (permission.roles.length > 0) {
      return NextResponse.json(
        { message: "Bu izin bazı rollere atanmış olduğu için silinemez" },
        { status: 400 }
      );
    }

    // İzni sil
    await prisma.permission.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "İzin başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("İzin silme hatası:", error);
    return NextResponse.json(
      { message: "İzin silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
