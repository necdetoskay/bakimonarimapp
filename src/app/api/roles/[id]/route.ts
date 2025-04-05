import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Rol detayını getir
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

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { message: "Rol bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("Rol detayı getirilirken hata:", error);
    return NextResponse.json(
      { message: "Rol detayı getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Rol güncelle
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
    const { name, description, permissionIds } = await request.json();

    // Rol var mı kontrol et
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });

    if (!role) {
      return NextResponse.json(
        { message: "Rol bulunamadı" },
        { status: 404 }
      );
    }

    // Admin rolünü güncellemeyi engelle
    if (role.name === "admin") {
      return NextResponse.json(
        { message: "Admin rolü değiştirilemez" },
        { status: 400 }
      );
    }

    // Rol adı değişmişse, yeni ad kullanımda mı kontrol et
    if (name !== role.name) {
      const existingRole = await prisma.role.findUnique({
        where: { name },
      });

      if (existingRole) {
        return NextResponse.json(
          { message: "Bu rol adı zaten kullanımda" },
          { status: 400 }
        );
      }
    }

    // Rolü güncelle
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions: {
          // Önce tüm izinleri kaldır
          set: [],
          // Sonra yeni izinleri ekle
          connect: permissionIds ? permissionIds.map((id: string) => ({ id })) : [],
        },
      },
      include: {
        permissions: true,
      },
    });

    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error("Rol güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Rol güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Rol sil
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

    // Rolü kontrol et
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!role) {
      return NextResponse.json(
        { message: "Rol bulunamadı" },
        { status: 404 }
      );
    }

    // admin ve user rollerini silmeyi engelle
    if (role.name === "admin" || role.name === "user") {
      return NextResponse.json(
        { message: "Temel roller silinemez" },
        { status: 400 }
      );
    }

    // Kullanıcılar var mı kontrol et
    if (role.users.length > 0) {
      return NextResponse.json(
        { message: "Bu role sahip kullanıcılar olduğu için silinemez" },
        { status: 400 }
      );
    }

    // Rolü sil
    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Rol başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Rol silme hatası:", error);
    return NextResponse.json(
      { message: "Rol silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 