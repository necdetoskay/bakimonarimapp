import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Kullanıcı detayını getir
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

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Şifreyi çıkar
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Kullanıcı detayı getirilirken hata:", error);
    return NextResponse.json(
      { message: "Kullanıcı detayı getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Kullanıcı güncelle
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
    const { name, email, password, roleId } = await request.json();

    // Kullanıcı var mı kontrol et
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Email değişmişse, yeni email kullanımda mı kontrol et
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "Bu email adresi zaten kullanımda" },
          { status: 400 }
        );
      }
    }

    // Güncelleme verilerini hazırla
    const updateData: any = {
      name,
      email,
      roleId,
    };

    // Şifre güncellenmişse hashle
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });

    // Şifreyi çıkar
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Kullanıcı güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Kullanıcı sil
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

    // Admin kullanıcısını silmeyi engelle
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    if (user.role.name === "admin" && user.email === "admin@example.com") {
      return NextResponse.json(
        { message: "Varsayılan admin kullanıcısı silinemez" },
        { status: 400 }
      );
    }

    // Kullanıcıyı sil
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Kullanıcı başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Kullanıcı silme hatası:", error);
    return NextResponse.json(
      { message: "Kullanıcı silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 