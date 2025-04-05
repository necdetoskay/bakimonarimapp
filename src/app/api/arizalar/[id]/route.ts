import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Belirli bir arızayı getir
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Oturum kontrolü
    if (!session) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const ariza = await prisma.ariza.findUnique({
      where: { id: params.id },
      include: {
        arizaTipi: true,
        daire: {
          include: {
            blok: {
              include: {
                proje: true
              }
            }
          }
        }
      }
    });

    if (!ariza) {
      return NextResponse.json(
        { error: "Arıza bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(ariza);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Arıza alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT: Arıza bilgilerini güncelle
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Oturum kontrolü
    if (!session) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const {
      bildirenKisi,
      telefon,
      aciklama,
      arizaTipiId,
      oncelik,
      durum,
      ekbilgi
    } = await req.json();

    // Arızanın var olup olmadığını kontrol et
    const arizaKontrol = await prisma.ariza.findUnique({
      where: { id: params.id }
    });

    if (!arizaKontrol) {
      return NextResponse.json(
        { error: "Belirtilen arıza bulunamadı" },
        { status: 404 }
      );
    }

    // Zorunlu alanları kontrol et
    if (aciklama !== undefined && !aciklama) {
      return NextResponse.json(
        { error: "Arıza açıklaması boş olamaz" },
        { status: 400 }
      );
    }

    // Arıza tipi varsa kontrol et
    if (arizaTipiId) {
      const arizaTipiKontrol = await prisma.arizaTipi.findUnique({
        where: { id: arizaTipiId }
      });

      if (!arizaTipiKontrol) {
        return NextResponse.json(
          { error: "Belirtilen arıza tipi bulunamadı" },
          { status: 404 }
        );
      }
    }

    // Güncellenecek verileri hazırla
    const data: any = {};
    if (bildirenKisi !== undefined) data.bildirenKisi = bildirenKisi || null;
    if (telefon !== undefined) data.telefon = telefon || null;
    if (aciklama !== undefined) data.aciklama = aciklama;
    if (arizaTipiId !== undefined) data.arizaTipiId = arizaTipiId || null;
    if (oncelik !== undefined) data.oncelik = oncelik;
    if (durum !== undefined) data.durum = durum;
    if (ekbilgi !== undefined) data.ekbilgi = ekbilgi || null;

    // Arızayı güncelle
    const guncellenenAriza = await prisma.ariza.update({
      where: { id: params.id },
      data,
      include: {
        arizaTipi: true,
        daire: {
          include: {
            blok: {
              include: {
                proje: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(guncellenenAriza);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Arıza güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE: Arızayı sil
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Oturum kontrolü
    if (!session) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Arızanın var olup olmadığını kontrol et
    const arizaKontrol = await prisma.ariza.findUnique({
      where: { id: params.id }
    });

    if (!arizaKontrol) {
      return NextResponse.json(
        { error: "Belirtilen arıza bulunamadı" },
        { status: 404 }
      );
    }

    // Arızayı sil
    await prisma.ariza.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Arıza başarıyla silindi" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Arıza silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 