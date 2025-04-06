import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Belirli bir randevuyu getir
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

    const randevu = await prisma.randevu.findUnique({
      where: { id: params.id },
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
        oncekiRandevu: true,
        sonrakiRandevu: true
      }
    });

    if (!randevu) {
      return NextResponse.json(
        { error: "Randevu bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(randevu);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Randevu alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT: Randevu güncelleme
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { durum, sonuc, teknikerId, teknikerIds, malzemeler } = await req.json();

    // Randevunun var olup olmadığını kontrol et
    const randevuKontrol = await prisma.randevu.findUnique({
      where: { id: params.id },
      include: { ariza: true }
    });

    if (!randevuKontrol) {
      return NextResponse.json(
        { message: "Randevu bulunamadı" },
        { status: 404 }
      );
    }

    // Durumu güncellenecek alanlar
    const data: any = {};
    
    // Durum güncelleme
    if (durum) data.durum = durum;
    
    // Sonuç güncelleme
    if (sonuc !== undefined) data.sonuc = sonuc;
    
    // Tekniker güncelleme - tek tekniker
    if (teknikerId !== undefined) data.teknikerId = teknikerId || null;
    
    // Randevuyu güncelle
    const guncellenenRandevu = await prisma.randevu.update({
      where: { id: params.id },
      data,
      include: {
        tekniker: true,
        ariza: true,
        teknikerler: {
          include: {
            tekniker: true
          }
        }
      }
    });
    
    // Çoklu tekniker güncellemesi yapılmak isteniyorsa
    if (teknikerIds && Array.isArray(teknikerIds)) {
      // Önce mevcut bağlantıları sil
      await prisma.randevuTekniker.deleteMany({
        where: { randevuId: params.id }
      });
      
      // Yeni tekniker bağlantılarını ekle
      if (teknikerIds.length > 0) {
        for (const teknikerId of teknikerIds) {
          await prisma.randevuTekniker.create({
            data: {
              randevu: { connect: { id: params.id } },
              tekniker: { connect: { id: teknikerId } }
            }
          });
        }
      }
    }
    
    // Çözüm ekleme sırasında malzemeler de eklenmişse
    if (malzemeler && durum && (durum === "Tamamlandı" || durum === "Kısmı Çözüm")) {
      // Mevcut malzemeleri sil
      await prisma.randevuMalzeme.deleteMany({
        where: { randevuId: params.id }
      });

      // Yeni malzemeleri ekle
      if (malzemeler.length > 0) {
        for (const item of malzemeler) {
          await prisma.randevuMalzeme.create({
            data: {
              randevu: { connect: { id: params.id } },
              malzeme: { connect: { id: item.malzemeId } },
              miktar: item.miktar,
              birim: item.birim,
              fiyat: item.fiyat || 0
            }
          });
        }
      }
      
      // Arıza durumunu da güncelle
      if (durum === "Tamamlandı") {
        await prisma.ariza.update({
          where: { id: randevuKontrol.ariza.id },
          data: { durum: "Çözüm" }
        });
      } else if (durum === "Kısmı Çözüm") {
        await prisma.ariza.update({
          where: { id: randevuKontrol.ariza.id },
          data: { durum: "Kısmı Çözüm" }
        });
      }
    } else if (durum === "İptal Edildi") {
      // Eğer başka aktif randevu yoksa durumu değiştir
      const digerAktifRandevular = await prisma.randevu.findMany({
        where: {
          arizaId: randevuKontrol.ariza.id,
          id: { not: params.id },
          durum: { notIn: ["İptal Edildi"] }
        }
      });
      
      if (digerAktifRandevular.length === 0) {
        await prisma.ariza.update({
          where: { id: randevuKontrol.ariza.id },
          data: { durum: "Talep Alındı" }
        });
      }
    }

    // Güncel randevu bilgilerini getir (malzemeler dahil)
    const guncelRandevu = await prisma.randevu.findUnique({
      where: { id: params.id },
      include: {
        tekniker: true,
        ariza: true,
        teknikerler: {
          include: {
            tekniker: true
          }
        },
        kullanilanMalzemeler: {
          include: {
            malzeme: true
          }
        }
      }
    });

    return NextResponse.json(guncelRandevu);
  } catch (error) {
    console.error("Randevu güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Randevu güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE: Randevu sil
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

    // Randevunun var olup olmadığını kontrol et
    const randevuKontrol = await prisma.randevu.findUnique({
      where: { id: params.id },
      include: { ariza: true }
    });

    if (!randevuKontrol) {
      return NextResponse.json(
        { error: "Belirtilen randevu bulunamadı" },
        { status: 404 }
      );
    }

    // Önce ilişkili malzemeleri sil
    await prisma.randevuMalzeme.deleteMany({
      where: { randevuId: params.id }
    });

    // Randevuyu sil
    await prisma.randevu.delete({
      where: { id: params.id }
    });

    // Diğer aktif randevuları kontrol et
    const digerAktifRandevular = await prisma.randevu.findMany({
      where: {
        arizaId: randevuKontrol.ariza.id,
        durum: { notIn: ["İptal Edildi"] }
      }
    });

    // Eğer başka aktif randevu yoksa arıza durumunu "Talep Alındı" olarak güncelle
    if (digerAktifRandevular.length === 0) {
      await prisma.ariza.update({
        where: { id: randevuKontrol.ariza.id },
        data: { durum: "Talep Alındı" }
      });
    }

    return NextResponse.json({ message: "Randevu başarıyla silindi" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Randevu silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 