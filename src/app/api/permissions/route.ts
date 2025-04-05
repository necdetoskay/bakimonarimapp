import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Tüm izinleri getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Yalnızca oturum açmış kullanıcılar erişebilir
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const permissions = await prisma.permission.findMany({
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { roles: true },
        },
      },
    });

    return NextResponse.json(permissions);
  } catch (error) {
    console.error("İzinler getirilirken hata:", error);
    return NextResponse.json(
      { message: "İzinler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni izin oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Yalnızca oturum açmış kullanıcılar erişebilir
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { name, description } = await request.json();

    // Validasyon
    if (!name) {
      return NextResponse.json(
        { message: "İzin adı gereklidir" },
        { status: 400 }
      );
    }

    // İzin adı kontrolü
    const existingPermission = await prisma.permission.findUnique({
      where: { name },
    });

    if (existingPermission) {
      return NextResponse.json(
        { message: "Bu izin adı zaten kullanımda" },
        { status: 400 }
      );
    }

    // İzin oluştur
    const newPermission = await prisma.permission.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(newPermission, { status: 201 });
  } catch (error) {
    console.error("İzin oluşturma hatası:", error);
    return NextResponse.json(
      { message: "İzin oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 