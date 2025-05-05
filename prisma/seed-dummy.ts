import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Ariza Tipleri (Fault Types)
  console.log('Creating ArizaTipleri...');
  const arizaTipleri = await prisma.arizaTipi.createMany({
    data: [
      { ad: 'Su', ekbilgi: 'Su tesisatı arızaları' },
      { ad: 'Elektrik', ekbilgi: 'Elektrik tesisatı arızaları' },
      { ad: 'Isıtma', ekbilgi: 'Isıtma sistemi arızaları' },
      { ad: 'Kapı', ekbilgi: 'Kapı ve kilit arızaları' },
      { ad: 'Asansör', ekbilgi: 'Asansör arızaları' },
      { ad: 'Diğer', ekbilgi: 'Diğer arızalar' },
    ],
    skipDuplicates: true,
  });
  console.log({ arizaTipleri });
  console.log('ArizaTipleri created.');

  // Uzmanlik Alanlari (Expertise Areas)
  console.log('Creating UzmanlikAlanlari...');
  const uzmanlikAlanlari = await prisma.uzmanlikAlani.createMany({
    data: [
      { ad: 'Su Tesisatı', ekbilgi: 'Su tesisatı uzmanlığı' },
      { ad: 'Elektrik Tesisatı', ekbilgi: 'Elektrik tesisatı uzmanlığı' },
      { ad: 'Isıtma Sistemleri', ekbilgi: 'Isıtma sistemleri uzmanlığı' },
      { ad: 'Kapı ve Kilit', ekbilgi: 'Kapı ve kilit sistemleri uzmanlığı' },
      { ad: 'Asansör Bakımı', ekbilgi: 'Asansör bakım ve onarım uzmanlığı' },
      { ad: 'Genel Bakım', ekbilgi: 'Genel bakım ve onarım uzmanlığı' },
    ],
    skipDuplicates: true,
  });
  console.log({ uzmanlikAlanlari });
  console.log('UzmanlikAlanlari created.');

  // Malzemeler (Materials)
  console.log('Creating Malzemeler...');
  const malzemeler = await prisma.malzeme.createMany({
    data: [
      { ad: 'Su Borusu', birim: 'Metre' },
      { ad: 'Kablo', birim: 'Metre' },
      { ad: 'Radyatör', birim: 'Adet' },
      { ad: 'Kilit', birim: 'Adet' },
      { ad: 'Asansör Halatı', birim: 'Metre' },
      { ad: 'Vida', birim: 'Adet' },
    ],
    skipDuplicates: true,
  });
  console.log({ malzemeler });
  console.log('Malzemeler created.');

  // Projeler (Projects)
  console.log('Creating Projeler...');
  const projeler = await prisma.proje.createMany({
    data: [
      { ad: 'Güneş Sitesi', ekbilgi: 'Güneş Sitesi Projesi', adres: 'İstanbul' },
      { ad: 'Ay Sitesi', ekbilgi: 'Ay Sitesi Projesi', adres: 'Ankara' },
      { ad: 'Yıldız Sitesi', ekbilgi: 'Yıldız Sitesi Projesi', adres: 'İzmir' },
    ],
    skipDuplicates: true,
  });
  console.log({ projeler });
  console.log('Projeler created.');

  // Bloklar (Blocks)
  console.log('Creating Bloklar...');
  const bloklar = await prisma.blok.createMany({
    data: [
      { ad: 'A Blok', projeId: await (async () => { try { const proje = await prisma.proje.findFirst({ where: { ad: 'Güneş Sitesi' } }); if (!proje) { throw new Error("Proje not found"); } return proje.id } catch (error) { console.error("Error finding Proje:", error); throw error; }})() },
      { ad: 'B Blok', projeId: await (async () => { try { const proje = await prisma.proje.findFirst({ where: { ad: 'Güneş Sitesi' } }); if (!proje) { throw new Error("Proje not found"); } return proje.id } catch (error) { console.error("Error finding Proje:", error); throw error; }})() },
      { ad: 'C Blok', projeId: await (async () => { try { const proje = await prisma.proje.findFirst({ where: { ad: 'Ay Sitesi' } }); if (!proje) { throw new Error("Proje not found"); } return proje.id } catch (error) { console.error("Error finding Proje:", error); throw error; }})() },
    ],
    skipDuplicates: true,
  });
  console.log({ bloklar });
  console.log('Bloklar created.');

  // Daireler (Apartments)
  console.log('Creating Daireler...');
  const daireler = await prisma.daire.createMany({
    data: [
      { numara: '1', kat: '1', blokId: (await prisma.blok.findFirst({ where: { ad: 'A Blok' } }))?.id || '' },
      { numara: '2', kat: '1', blokId: (await prisma.blok.findFirst({ where: { ad: 'A Blok' } }))?.id || '' },
      { numara: '3', kat: '2', blokId: (await prisma.blok.findFirst({ where: { ad: 'B Blok' } }))?.id || '' },
    ],
    skipDuplicates: true,
  });
  console.log({ daireler });
  console.log('Daireler created.');

  // Teknikerler (Technicians)
  console.log('Creating Teknikerler...');
  const teknikerler = await prisma.tekniker.createMany({
    data: [
      { adsoyad: 'Ahmet Yılmaz' },
      { adsoyad: 'Ayşe Demir' },
    ],
    skipDuplicates: true,
  });
  console.log({ teknikerler });
  console.log('Teknikerler created.');

  // Arizalar (Faults)
  console.log('Creating Arizalar...');
  const arizalar = await prisma.ariza.createMany({
    data: [
      {
        aciklama: 'Su sızıntısı var',
        arizaTipiId: (await prisma.arizaTipi.findFirst({ where: { ad: 'Su' } }))?.id || '',
        daireId: (await prisma.daire.findFirst({ where: { numara: '1' } }))?.id || '',
        durum: 'Talep Alındı',
        createdAt: new Date(),
      },
      {
        aciklama: 'Elektrik kesintisi var',
        arizaTipiId: (await prisma.arizaTipi.findFirst({ where: { ad: 'Elektrik' } }))?.id || '',
        daireId: (await prisma.daire.findFirst({ where: { numara: '2' } }))?.id || '',
        durum: 'Randevu Planlandı',
        createdAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });
  console.log({ arizalar });
  console.log('Arizalar created.');

  // Randevular (Appointments)
  console.log('Creating Randevular...');
  const randevular = await prisma.randevu.createMany({
    data: [
      {
        tarih: new Date(),
        arizaId: (await prisma.ariza.findFirst({ where: { aciklama: 'Su sızıntısı var' } }))?.id || '',
        teknikerId: (await prisma.tekniker.findFirst({ where: { adsoyad: 'Ahmet Yılmaz' } }))?.id || '',
        notlar: 'Su sızıntısı kontrolü yapılacak',
        durum: 'Planlandı',
      },
      {
        tarih: new Date(),
        arizaId: (await prisma.ariza.findFirst({ where: { aciklama: 'Elektrik kesintisi var' } }))?.id || '',
        teknikerId: (await prisma.tekniker.findFirst({ where: { adsoyad: 'Ayşe Demir' } }))?.id || '',
        notlar: 'Elektrik tesisatı kontrolü yapılacak',
        durum: 'Planlandı',
      },
    ],
    skipDuplicates: true,
  });
  console.log({ randevular });
  console.log('Randevular created.');

  // RandevuMalzeme (Appointment Materials)
  console.log('Creating RandevuMalzemeler...');
  const randevuMalzemeler = await prisma.randevuMalzeme.createMany({
    data: [
      {
        randevuId: (await prisma.randevu.findFirst({ where: { notlar: 'Su sızıntısı kontrolü yapılacak' } }))?.id || '',
        malzemeId: (await prisma.malzeme.findFirst({ where: { ad: 'Su Borusu' } }))?.id || '',
        miktar: 2,
        fiyat: new Decimal(100),
      },
      {
        randevuId: (await prisma.randevu.findFirst({ where: { notlar: 'Elektrik tesisatı kontrolü yapılacak' } }))?.id || '',
        malzemeId: (await prisma.malzeme.findFirst({ where: { ad: 'Kablo' } }))?.id || '',
        miktar: 5,
        fiyat: new Decimal(150),
      },
    ],
    skipDuplicates: true,
  });
  console.log({ randevuMalzemeler });
  console.log('RandevuMalzemeler created.');
}

async function runSeed() {
  try {
    await main();
  } catch (error) {
    console.error('Failed to seed the database:');
    console.error(error);
  }
}

runSeed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
