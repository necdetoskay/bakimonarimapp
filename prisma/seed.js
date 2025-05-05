import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedDummyData() {
  // Roller ve İzinler
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Sistem yöneticisi',
    },
  });

  const teknikerRole = await prisma.role.upsert({
    where: { name: 'Tekniker' },
    update: {},
    create: {
      name: 'Tekniker',
      description: 'Bakım ve onarım teknisyeni',
    },
  });

  const yoneticiRole = await prisma.role.upsert({
    where: { name: 'Yönetici' },
    update: {},
    create: {
      name: 'Yönetici',
      description: 'Site yöneticisi',
    },
  });

  // İzinler
  const permissions = [
    { name: 'proje_goruntuleme', description: 'Projeleri görüntüleme izni' },
    { name: 'proje_duzenleme', description: 'Projeleri düzenleme izni' },
    { name: 'ariza_goruntuleme', description: 'Arızaları görüntüleme izni' },
    { name: 'ariza_duzenleme', description: 'Arızaları düzenleme izni' },
    { name: 'randevu_goruntuleme', description: 'Randevuları görüntüleme izni' },
    { name: 'randevu_duzenleme', description: 'Randevuları düzenleme izni' },
    { name: 'kullanici_goruntuleme', description: 'Kullanıcıları görüntüleme izni' },
    { name: 'kullanici_duzenleme', description: 'Kullanıcıları düzenleme izni' },
    { name: 'rapor_goruntuleme', description: 'Raporları görüntüleme izni' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Admin rolüne tüm izinleri ekle
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.permissionsOnRoles.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Tekniker rolüne bazı izinleri ekle
  const teknikerPermissions = ['ariza_goruntuleme', 'randevu_goruntuleme', 'randevu_duzenleme'];
  for (const permName of teknikerPermissions) {
    const perm = await prisma.permission.findUnique({ where: { name: permName } });
    if (perm) {
      await prisma.permissionsOnRoles.upsert({
        where: {
          roleId_permissionId: {
            roleId: teknikerRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: teknikerRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  // Yönetici rolüne bazı izinleri ekle
  const yoneticiPermissions = ['proje_goruntuleme', 'ariza_goruntuleme', 'ariza_duzenleme', 'randevu_goruntuleme', 'rapor_goruntuleme'];
  for (const permName of yoneticiPermissions) {
    const perm = await prisma.permission.findUnique({ where: { name: permName } });
    if (perm) {
      await prisma.permissionsOnRoles.upsert({
        where: {
          roleId_permissionId: {
            roleId: yoneticiRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: yoneticiRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  // Kullanıcılar
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@bakimonarim.com' },
    update: {},
    create: {
      name: 'Admin Kullanıcı',
      email: 'admin@bakimonarim.com',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'tekniker@bakimonarim.com' },
    update: {},
    create: {
      name: 'Tekniker Kullanıcı',
      email: 'tekniker@bakimonarim.com',
      password: hashedPassword,
      roleId: teknikerRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'yonetici@bakimonarim.com' },
    update: {},
    create: {
      name: 'Yönetici Kullanıcı',
      email: 'yonetici@bakimonarim.com',
      password: hashedPassword,
      roleId: yoneticiRole.id,
    },
  });

  // Uzmanlık Alanları
  const uzmanlikAlanlari = [
    { ad: 'Elektrik' },
    { ad: 'Su Tesisatı' },
    { ad: 'Isıtma Sistemleri' },
    { ad: 'Klima ve Soğutma' },
    { ad: 'Genel Bakım' },
    { ad: 'Marangozluk' },
    { ad: 'Boyacılık' },
  ];

  for (const uzmanlik of uzmanlikAlanlari) {
    await prisma.uzmanlikAlani.upsert({
      where: { ad: uzmanlik.ad },
      update: {},
      create: uzmanlik,
    });
  }

  // Teknikerler
  const teknikerler = [
    { adsoyad: 'Mehmet Yılmaz', telefon: '05321234567', ekbilgi: 'Elektrik ve su tesisatı konusunda 10 yıllık deneyim' },
    { adsoyad: 'Ali Kaya', telefon: '05331234567', ekbilgi: 'Isıtma sistemleri uzmanı' },
    { adsoyad: 'Ayşe Demir', telefon: '05341234567', ekbilgi: 'Klima ve soğutma sistemleri uzmanı' },
    { adsoyad: 'Fatma Şahin', telefon: '05351234567', ekbilgi: 'Genel bakım ve onarım' },
    { adsoyad: 'Mustafa Öztürk', telefon: '05361234567', ekbilgi: 'Marangozluk ve boyacılık' },
  ];

  for (const teknikerData of teknikerler) {
    try {
      const tekniker = await prisma.tekniker.create({
        data: teknikerData,
      });

      // Her teknikere rastgele 1-3 uzmanlık alanı ekle
      const alanlar = await prisma.uzmanlikAlani.findMany();
      const randomAlanlar = alanlar.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
      
      for (const alan of randomAlanlar) {
        await prisma.tekniker.update({
          where: { id: tekniker.id },
          data: {
            uzmanlikAlanlari: {
              connect: { id: alan.id }
            }
          }
        });
      }
    } catch (error) {
      console.log(`Tekniker eklenirken hata: ${teknikerData.adsoyad} - ${error}`);
    }
  }

  // Malzemeler
  const malzemeler = [
    { ad: 'Elektrik Kablosu (m)', birim: 'metre' },
    { ad: 'Priz', birim: 'adet' },
    { ad: 'Sigorta', birim: 'adet' },
    { ad: 'Su Borusu (m)', birim: 'metre' },
    { ad: 'Musluk', birim: 'adet' },
    { ad: 'Vana', birim: 'adet' },
    { ad: 'Conta', birim: 'adet' },
    { ad: 'Klima Gazı', birim: 'kg' },
    { ad: 'Filtre', birim: 'adet' },
    { ad: 'Boya (L)', birim: 'litre' },
    { ad: 'Alçı (kg)', birim: 'kg' },
    { ad: 'Vida', birim: 'adet' },
    { ad: 'Dübel', birim: 'adet' },
  ];

  for (const malzeme of malzemeler) {
    await prisma.malzeme.upsert({
      where: { ad: malzeme.ad },
      update: {},
      create: malzeme,
    });
  }

  // Arıza Tipleri
  const arizaTipleriData = [
    { ad: 'Elektrik Arızası', ekbilgi: 'Elektrik tesisatı ile ilgili sorunlar' },
    { ad: 'Su Tesisatı Arızası', ekbilgi: 'Su tesisatı ile ilgili sorunlar' },
    { ad: 'Isıtma Arızası', ekbilgi: 'Kalorifer, kombi vb. ısıtma sistemleri ile ilgili sorunlar' },
    { ad: 'Klima Arızası', ekbilgi: 'Klima ve soğutma sistemleri ile ilgili sorunlar' },
    { ad: 'Kapı/Pencere Arızası', ekbilgi: 'Kapı, pencere, kilit vb. ile ilgili sorunlar' },
    { ad: 'Sıva/Boya Tamiri', ekbilgi: 'Duvar sıvası, boya ile ilgili sorunlar' },
    { ad: 'Mobilya Tamiri', ekbilgi: 'Mobilya ile ilgili sorunlar' },
    { ad: 'Diğer', ekbilgi: 'Diğer arıza türleri' },
  ];

  // Arıza Tiplerini veritabanına ekle
  for (const arizaTipi of arizaTipleriData) {
    await prisma.arizaTipi.upsert({
      where: { ad: arizaTipi.ad },
      update: {},
      create: arizaTipi,
    });
  }

  // Projeler
  const projeler = [
    { 
      ad: 'Güneş Sitesi', 
      adres: 'Merkez Mahallesi, Çiçek Sokak No:10, İstanbul',
      ekbilgi: '2020 yılında tamamlanan 3 bloklu site projesi',
      konum: '41.0082,28.9784' // İstanbul koordinatları
    },
    { 
      ad: 'Ay Apartmanları', 
      adres: 'Sahil Caddesi, Yıldız Sokak No:5, İzmir',
      ekbilgi: '2018 yılında tamamlanan 2 bloklu apartman projesi',
      konum: '38.4237,27.1428' // İzmir koordinatları
    },
    { 
      ad: 'Yıldız Konutları', 
      adres: 'Başkent Bulvarı No:25, Ankara',
      ekbilgi: '2021 yılında tamamlanan lüks konut projesi',
      konum: '39.9334,32.8597' // Ankara koordinatları
    },
    { 
      ad: 'Mavi Deniz Rezidans', 
      adres: 'Konyaaltı Caddesi No:42, Antalya',
      ekbilgi: '2019 yılında tamamlanan deniz manzaralı rezidans',
      konum: '36.8969,30.7133' // Antalya koordinatları
    },
    { 
      ad: 'Yeşil Vadi Evleri', 
      adres: 'Bağlar Caddesi No:18, Bursa',
      ekbilgi: '2022 yılında tamamlanan doğa ile iç içe konut projesi',
      konum: '40.1885,29.0610' // Bursa koordinatları
    },
  ];

  // Tüm arıza tiplerini al
  const arizaTipleri = await prisma.arizaTipi.findMany();
  // Tüm teknikerleri al
  const tumTeknikerler = await prisma.tekniker.findMany();
  // Tüm malzemeleri al
  const tumMalzemeler = await prisma.malzeme.findMany();

  for (const projeData of projeler) {
    try {
      const proje = await prisma.proje.upsert({
        where: { ad: projeData.ad },
        update: {},
        create: projeData,
      });

      // Bloklar
      const blokSayisi = Math.floor(Math.random() * 3) + 1; // 1-3 arası blok
      const blokHarfleri = ['A', 'B', 'C', 'D', 'E'];
      
      for (let i = 0; i < blokSayisi; i++) {
        const blokAd = `${blokHarfleri[i]} Blok`;
        try {
          const blok = await prisma.blok.create({
            data: {
              ad: blokAd,
              projeId: proje.id,
              ekbilgi: `${projeData.ad} ${blokAd}`
            },
          });

          // Daireler
          const katSayisi = Math.floor(Math.random() * 5) + 3; // 3-7 arası kat
          const katBasinaDaire = Math.floor(Math.random() * 3) + 2; // 2-4 arası daire/kat
          
          for (let kat = 1; kat <= katSayisi; kat++) {
            for (let daireNo = 1; daireNo <= katBasinaDaire; daireNo++) {
              const daireNumara = ((kat - 1) * katBasinaDaire + daireNo).toString();
              try {
                const daire = await prisma.daire.create({
                  data: {
                    numara: daireNumara,
                    kat: kat.toString(),
                    blokId: blok.id,
                    ekbilgi: `${kat}. kat ${daireNumara} numaralı daire`
                  },
                });

                // Her daireye 0-3 arası rastgele arıza ekle
                const arizaSayisi = Math.floor(Math.random() * 4); // 0-3 arası arıza
                
                for (let a = 0; a < arizaSayisi; a++) {
                  // Rastgele arıza tipi seç
                  const arizaTipi = arizaTipleri[Math.floor(Math.random() * arizaTipleri.length)];
                  
                  // Rastgele öncelik ve durum belirle
                  const oncelikler = ['Düşük', 'Orta', 'Yüksek'];
                  const durumlar = ['Talep Alındı', 'İnceleniyor', 'Randevu Planlandı', 'Tamamlandı', 'İptal Edildi'];
                  
                  const oncelik = oncelikler[Math.floor(Math.random() * oncelikler.length)];
                  const durum = durumlar[Math.floor(Math.random() * durumlar.length)];
                  
                  // Rastgele bildirim tarihi (son 30 gün içinde)
                  const bildirimTarihi = new Date();
                  bildirimTarihi.setDate(bildirimTarihi.getDate() - Math.floor(Math.random() * 30));
                  
                  // Arıza açıklaması oluştur
                  const aciklamalar = [
                    `${daire.numara} numaralı dairede ${arizaTipi.ad.toLowerCase()} tespit edildi.`,
                    `${blok.ad} ${daire.numara} numaralı dairede ${arizaTipi.ad.toLowerCase()} var.`,
                    `${daire.kat}. kattaki ${daire.numara} numaralı dairede ${arizaTipi.ad.toLowerCase()} bildirildi.`,
                    `Daire sakinleri ${arizaTipi.ad.toLowerCase()} nedeniyle acil müdahale talep ediyor.`,
                    `${arizaTipi.ad} için teknik destek talebi.`
                  ];
                  
                  const aciklama = aciklamalar[Math.floor(Math.random() * aciklamalar.length)];
                  
                  // Rastgele kişi bilgileri
                  const isimler = ['Ahmet Yılmaz', 'Ayşe Kaya', 'Mehmet Demir', 'Fatma Şahin', 'Ali Öztürk', 'Zeynep Çelik'];
                  const bildirenKisi = isimler[Math.floor(Math.random() * isimler.length)];
                  
                  // Rastgele telefon numarası
                  const telefon = `053${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
                  
                  try {
                    // Arıza oluştur
                    const ariza = await prisma.ariza.create({
                      data: {
                        bildirenKisi,
                        telefon,
                        aciklama,
                        oncelik,
                        durum,
                        daireId: daire.id,
                        arizaTipiId: arizaTipi.id,
                        createdAt: bildirimTarihi,
                        ekbilgi: `${projeData.ad} ${blok.ad} Daire ${daire.numara}`
                      },
                    });
                    
                    // Eğer arıza durumu "Randevu Planlandı" veya "Tamamlandı" ise randevu ekle
                    if (durum === 'Randevu Planlandı' || durum === 'Tamamlandı') {
                      // Randevu tarihi (arıza bildiriminden 1-7 gün sonra)
                      const randevuTarihi = new Date(bildirimTarihi);
                      randevuTarihi.setDate(randevuTarihi.getDate() + Math.floor(Math.random() * 7) + 1);
                      
                      // Rastgele tekniker seç
                      const tekniker = tumTeknikerler[Math.floor(Math.random() * tumTeknikerler.length)];
                      
                      // Randevu durumu
                      const randevuDurumu = durum === 'Tamamlandı' ? 'Tamamlandı' : 'Planlandı';
                      
                      // Randevu notları
                      const notlar = durum === 'Tamamlandı' 
                        ? `${arizaTipi.ad} başarıyla giderildi.` 
                        : `${arizaTipi.ad} için randevu planlandı.`;
                      
                      // Randevu sonucu
                      const sonuc = durum === 'Tamamlandı' 
                        ? `Arıza başarıyla giderildi, gerekli bakım ve onarım yapıldı.` 
                        : null;
                      
                      try {
                        // Randevu oluştur
                        const randevu = await prisma.randevu.create({
                          data: {
                            tarih: randevuTarihi,
                            notlar,
                            durum: randevuDurumu,
                            sonuc,
                            arizaId: ariza.id,
                            teknikerId: tekniker.id,
                          },
                        });
                        
                        // Eğer randevu tamamlandıysa, kullanılan malzemeleri ekle
                        if (randevuDurumu === 'Tamamlandı') {
                          // Rastgele 1-3 malzeme ekle
                          const malzemeSayisi = Math.floor(Math.random() * 3) + 1;
                          
                          for (let m = 0; m < malzemeSayisi; m++) {
                            // Rastgele malzeme seç
                            const malzeme = tumMalzemeler[Math.floor(Math.random() * tumMalzemeler.length)];
                            
                            // Rastgele miktar (1-10 arası)
                            const miktar = Math.floor(Math.random() * 10) + 1;
                            
                            // Rastgele fiyat (10-500 arası)
                            const fiyat = Math.floor(Math.random() * 490) + 10;
                            
                            // Malzeme kullanımı ekle
                            try {
                              await prisma.randevuMalzeme.create({
                                data: {
                                  randevuId: randevu.id,
                                  malzemeId: malzeme.id,
                                  miktar,
                                  birim: malzeme.birim,
                                  fiyat,
                                },
                              });
                            } catch (error) {
                              console.log(`Malzeme eklenirken hata: ${error}`);
                            }
                          }
                          
                          // Tekniker bağlantısı ekle
                          try {
                            await prisma.randevuTekniker.create({
                              data: {
                                randevuId: randevu.id,
                                teknikerId: tekniker.id,
                              },
                            });
                          } catch (error) {
                            console.log(`Tekniker bağlantısı eklenirken hata: ${error}`);
                          }
                        }
                      } catch (error) {
                        console.log(`Randevu eklenirken hata: ${error}`);
                      }
                    }
                  } catch (error) {
                    console.log(`Arıza eklenirken hata: ${error}`);
                  }
                }
              } catch (error) {
                console.log(`Daire eklenirken hata: ${error}`);
              }
            }
          }
        } catch (error) {
          console.log(`Blok eklenirken hata: ${error}`);
        }
      }
    } catch (error) {
      console.log(`Proje eklenirken hata: ${error}`);
    }
  }

  console.log('Dummy data seeded successfully!');
}

async function main() {
  try {
    console.log('===== KAPSAMLI SEED BAŞLATILIYOR =====');
    await seedDummyData();
    console.log('===== KAPSAMLI SEED TAMAMLANDI =====');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();