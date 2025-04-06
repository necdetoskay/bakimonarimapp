import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Randevuları listele
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Oturum kontrolü
    if (!session) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const arizaId = searchParams.get("arizaId");
    const teknikerId = searchParams.get("teknikerId");
    const tarihBaslangic = searchParams.get("tarihBaslangic");
    const tarihBitis = searchParams.get("tarihBitis");
    
    // Filtreleme
    const where: any = {};
    
    if (arizaId) {
      where.arizaId = arizaId;
    }
    
    if (teknikerId) {
      where.teknikerId = teknikerId;
    }
    
    if (tarihBaslangic || tarihBitis) {
      where.tarih = {};
      
      if (tarihBaslangic) {
        where.tarih.gte = new Date(tarihBaslangic);
      }
      
      if (tarihBitis) {
        where.tarih.lte = new Date(tarihBitis);
      }
    }
    
    const randevular = await prisma.randevu.findMany({
      where,
      include: {
        tekniker: true,
        ariza: {
          include: {
            daire: {
              include: {
                blok: {
                  include: {
                    proje: true
                  }
                }
              }
            },
            arizaTipi: true
          }
        },
        kullanilanMalzemeler: {
          include: {
            malzeme: true
          }
        },
        teknikerler: {
          include: {
            tekniker: true
          }
        }
      },
      orderBy: {
        tarih: "desc"
      }
    });
    
    return NextResponse.json(randevular);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Randevular alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST: Yeni randevu oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { arizaId, tarih, teknikerIds, notlar } = await request.json();

    // Validasyon
    if (!arizaId || !tarih) {
      return NextResponse.json(
        { message: "Arıza ID ve tarih alanları zorunludur" },
        { status: 400 }
      );
    }

    // Arıza var mı?
    const ariza = await prisma.ariza.findUnique({
      where: { id: arizaId }
    });

    if (!ariza) {
      return NextResponse.json(
        { message: "Arıza bulunamadı" },
        { status: 404 }
      );
    }

    // Ana randevuyu oluştur
    const yeniRandevu = await prisma.randevu.create({
      data: {
        ariza: { connect: { id: arizaId } },
        tarih: new Date(tarih),
        notlar,
        durum: "Planlandı",
        // Teknikerle ilgili işlemler ayrı ele alınacak
      },
      include: {
        tekniker: true,
      }
    });

    // Eğer teknikerIds varsa, bu teknikerleri randevu ile ilişkilendir
    if (teknikerIds && teknikerIds.length > 0) {
      // Her bir tekniker için RandevuTekniker kaydı oluştur
      for (const teknikerId of teknikerIds) {
        await prisma.randevuTekniker.create({
          data: {
            randevu: { connect: { id: yeniRandevu.id } },
            tekniker: { connect: { id: teknikerId } }
          }
        });
      }
    }

    // Arıza durumunu "Randevu Planlandı" olarak güncelle
    await prisma.ariza.update({
      where: { id: arizaId },
      data: { durum: "Randevu Planlandı" }
    });

    // Güncel randevu bilgisini al
    const guncelRandevu = await prisma.randevu.findUnique({
      where: { id: yeniRandevu.id },
      include: {
        ariza: true,
        teknikerler: {
          include: {
            tekniker: true
          }
        }
      }
    });

    return NextResponse.json(guncelRandevu, { status: 201 });
  } catch (error) {
    console.error("Randevu oluşturma hatası:", error);
    return NextResponse.json(
      { message: "Randevu oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 