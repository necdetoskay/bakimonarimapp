import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Tüm rolleri getir
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

    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: { users: true },
        },
      },
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error("Roller getirilirken hata:", error);
    return NextResponse.json(
      { message: "Roller getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni rol oluştur
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

    const { name, description, permissionIds } = await request.json();

    // Validasyon
    if (!name) {
      return NextResponse.json(
        { message: "Rol adı gereklidir" },
        { status: 400 }
      );
    }

    // Rol adı kontrolü
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      return NextResponse.json(
        { message: "Bu rol adı zaten kullanımda" },
        { status: 400 }
      );
    }

    // Rol oluştur
    const newRole = await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          connect: permissionIds ? permissionIds.map((id: string) => ({ id })) : [],
        },
      },
      include: {
        permissions: true,
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Rol oluşturma hatası:", error);
    return NextResponse.json(
      { message: "Rol oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 