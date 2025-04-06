// Using CommonJS style imports
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

console.log('===== BASIC SEED BAŞLATILIYOR =====');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seed işlemi başlatılıyor...');

    // Roller
    console.log('Roller oluşturuluyor...');
    const roles = [
      { name: 'admin', description: 'Sistem yöneticisi' },
      { name: 'manager', description: 'Yönetici' },
      { name: 'user', description: 'Normal kullanıcı' },
    ];

    const createdRoles = [];
    for (const role of roles) {
      try {
        const existingRole = await prisma.role.findUnique({
          where: { name: role.name },
        });

        if (!existingRole) {
          const createdRole = await prisma.role.create({ data: role });
          createdRoles.push(createdRole);
          console.log(`${role.name} rolü oluşturuldu.`);
        } else {
          createdRoles.push(existingRole);
          console.log(`${role.name} rolü zaten mevcut.`);
        }
      } catch (error) {
        console.error(`Rol ${role.name} oluşturulurken hata: ${error.message}`);
      }
    }

    // İzinler
    console.log('İzinler oluşturuluyor...');
    const permissions = [
      // Kullanıcı yönetimi izinleri
      { name: 'users.view', description: 'Kullanıcıları görüntüleme' },
      { name: 'users.create', description: 'Kullanıcı oluşturma' },
      { name: 'users.edit', description: 'Kullanıcı düzenleme' },
      { name: 'users.delete', description: 'Kullanıcı silme' },
      
      // Rol yönetimi izinleri
      { name: 'roles.view', description: 'Rolleri görüntüleme' },
      { name: 'roles.create', description: 'Rol oluşturma' },
      { name: 'roles.edit', description: 'Rol düzenleme' },
      { name: 'roles.delete', description: 'Rol silme' },
      
      // İzin yönetimi izinleri
      { name: 'permissions.view', description: 'İzinleri görüntüleme' },
      { name: 'permissions.create', description: 'İzin oluşturma' },
      { name: 'permissions.edit', description: 'İzin düzenleme' },
      { name: 'permissions.delete', description: 'İzin silme' },
      
      // Proje yönetimi izinleri
      { name: 'projects.view', description: 'Projeleri görüntüleme' },
      { name: 'projects.create', description: 'Proje oluşturma' },
      { name: 'projects.edit', description: 'Proje düzenleme' },
      { name: 'projects.delete', description: 'Proje silme' },
      
      // Blok yönetimi izinleri
      { name: 'blocks.view', description: 'Blokları görüntüleme' },
      { name: 'blocks.create', description: 'Blok oluşturma' },
      { name: 'blocks.edit', description: 'Blok düzenleme' },
      { name: 'blocks.delete', description: 'Blok silme' },
      
      // Daire yönetimi izinleri
      { name: 'apartments.view', description: 'Daireleri görüntüleme' },
      { name: 'apartments.create', description: 'Daire oluşturma' },
      { name: 'apartments.edit', description: 'Daire düzenleme' },
      { name: 'apartments.delete', description: 'Daire silme' },
      
      // Arıza yönetimi izinleri
      { name: 'faults.view', description: 'Arızaları görüntüleme' },
      { name: 'faults.create', description: 'Arıza oluşturma' },
      { name: 'faults.edit', description: 'Arıza düzenleme' },
      { name: 'faults.delete', description: 'Arıza silme' },
      
      // Randevu yönetimi izinleri
      { name: 'appointments.view', description: 'Randevuları görüntüleme' },
      { name: 'appointments.create', description: 'Randevu oluşturma' },
      { name: 'appointments.edit', description: 'Randevu düzenleme' },
      { name: 'appointments.delete', description: 'Randevu silme' },
      
      // Tekniker yönetimi izinleri
      { name: 'technicians.view', description: 'Teknikerleri görüntüleme' },
      { name: 'technicians.create', description: 'Tekniker oluşturma' },
      { name: 'technicians.edit', description: 'Tekniker düzenleme' },
      { name: 'technicians.delete', description: 'Tekniker silme' },
      
      // Malzeme yönetimi izinleri
      { name: 'materials.view', description: 'Malzemeleri görüntüleme' },
      { name: 'materials.create', description: 'Malzeme oluşturma' },
      { name: 'materials.edit', description: 'Malzeme düzenleme' },
      { name: 'materials.delete', description: 'Malzeme silme' },
      
      // Arıza tipi yönetimi izinleri
      { name: 'faultTypes.view', description: 'Arıza tiplerini görüntüleme' },
      { name: 'faultTypes.create', description: 'Arıza tipi oluşturma' },
      { name: 'faultTypes.edit', description: 'Arıza tipi düzenleme' },
      { name: 'faultTypes.delete', description: 'Arıza tipi silme' },
      
      // Uzmanlık alanı yönetimi izinleri
      { name: 'expertiseAreas.view', description: 'Uzmanlık alanlarını görüntüleme' },
      { name: 'expertiseAreas.create', description: 'Uzmanlık alanı oluşturma' },
      { name: 'expertiseAreas.edit', description: 'Uzmanlık alanı düzenleme' },
      { name: 'expertiseAreas.delete', description: 'Uzmanlık alanı silme' },
    ];

    const createdPermissions = [];
    for (const permission of permissions) {
      try {
        const existingPermission = await prisma.permission.findUnique({
          where: { name: permission.name },
        });

        if (!existingPermission) {
          const created = await prisma.permission.create({ data: permission });
          createdPermissions.push(created);
          console.log(`${permission.name} izni oluşturuldu.`);
        } else {
          createdPermissions.push(existingPermission);
          console.log(`${permission.name} izni zaten mevcut.`);
        }
      } catch (error) {
        console.error(`İzin ${permission.name} oluşturulurken hata: ${error.message}`);
      }
    }

    // Roller ve izinler arasındaki ilişkileri kur
    console.log('Rol-İzin ilişkileri oluşturuluyor...');
    
    // Admin rolüne tüm izinleri ver
    const adminRole = createdRoles.find(r => r.name === 'admin');
    if (adminRole) {
      for (const permission of createdPermissions) {
        try {
          const existingRelation = await prisma.permissionsOnRoles.findUnique({
            where: {
              roleId_permissionId: {
                roleId: adminRole.id,
                permissionId: permission.id
              }
            }
          });

          if (!existingRelation) {
            await prisma.permissionsOnRoles.create({
              data: {
                roleId: adminRole.id,
                permissionId: permission.id
              }
            });
            console.log(`Admin rolüne ${permission.name} izni eklendi.`);
          } else {
            console.log(`Admin rolünde ${permission.name} izni zaten mevcut.`);
          }
        } catch (error) {
          console.error(`İzin ilişkisi oluşturulurken hata: ${error.message}`);
        }
      }
    }

    // Manager rolüne bazı izinleri ver
    const managerRole = createdRoles.find(r => r.name === 'manager');
    if (managerRole) {
      const managerPermissions = createdPermissions.filter(p => 
        p.name.startsWith('projects.') || 
        p.name.startsWith('blocks.') || 
        p.name.startsWith('apartments.') || 
        p.name.startsWith('faults.') || 
        p.name.startsWith('appointments.') || 
        p.name.startsWith('technicians.') || 
        p.name.startsWith('materials.') || 
        p.name.startsWith('faultTypes.') || 
        p.name.startsWith('expertiseAreas.') ||
        p.name === 'users.view'
      );

      for (const permission of managerPermissions) {
        try {
          const existingRelation = await prisma.permissionsOnRoles.findUnique({
            where: {
              roleId_permissionId: {
                roleId: managerRole.id,
                permissionId: permission.id
              }
            }
          });

          if (!existingRelation) {
            await prisma.permissionsOnRoles.create({
              data: {
                roleId: managerRole.id,
                permissionId: permission.id
              }
            });
            console.log(`Manager rolüne ${permission.name} izni eklendi.`);
          } else {
            console.log(`Manager rolünde ${permission.name} izni zaten mevcut.`);
          }
        } catch (error) {
          console.error(`İzin ilişkisi oluşturulurken hata: ${error.message}`);
        }
      }
    }

    // User rolüne sınırlı izinler ver
    const userRole = createdRoles.find(r => r.name === 'user');
    if (userRole) {
      const userPermissions = createdPermissions.filter(p => 
        p.name === 'projects.view' || 
        p.name === 'blocks.view' || 
        p.name === 'apartments.view' || 
        p.name === 'faults.view' || 
        p.name === 'faults.create' || 
        p.name === 'appointments.view'
      );

      for (const permission of userPermissions) {
        try {
          const existingRelation = await prisma.permissionsOnRoles.findUnique({
            where: {
              roleId_permissionId: {
                roleId: userRole.id,
                permissionId: permission.id
              }
            }
          });

          if (!existingRelation) {
            await prisma.permissionsOnRoles.create({
              data: {
                roleId: userRole.id,
                permissionId: permission.id
              }
            });
            console.log(`User rolüne ${permission.name} izni eklendi.`);
          } else {
            console.log(`User rolünde ${permission.name} izni zaten mevcut.`);
          }
        } catch (error) {
          console.error(`İzin ilişkisi oluşturulurken hata: ${error.message}`);
        }
      }
    }

    // Admin kullanıcısı
    console.log('Admin kullanıcısı oluşturuluyor...');
    try {
      const adminRole = await prisma.role.findUnique({
        where: { name: 'admin' },
      });
      
      if (adminRole) {
        const adminEmail = 'admin@bakimonarim.com';
        const existingAdmin = await prisma.user.findUnique({
          where: { email: adminEmail },
        });

        if (!existingAdmin) {
          const hashedPassword = await bcrypt.hash('Admin123!', 10);
          
          await prisma.user.create({
            data: {
              name: 'Admin',
              email: adminEmail,
              password: hashedPassword,
              roleId: adminRole.id,
            },
          });
          console.log('Admin kullanıcısı oluşturuldu.');
        } else {
          console.log('Admin kullanıcısı zaten mevcut.');
        }
      } else {
        console.log('Admin rolü bulunamadı, kullanıcı oluşturulamadı.');
      }
    } catch (error) {
      console.error(`Admin kullanıcısı oluşturulurken hata: ${error.message}`);
    }

    // Test manager kullanıcısı
    console.log('Manager kullanıcısı oluşturuluyor...');
    try {
      const managerRole = await prisma.role.findUnique({
        where: { name: 'manager' },
      });
      
      if (managerRole) {
        const managerEmail = 'manager@bakimonarim.com';
        const existingManager = await prisma.user.findUnique({
          where: { email: managerEmail },
        });

        if (!existingManager) {
          const hashedPassword = await bcrypt.hash('Manager123!', 10);
          
          await prisma.user.create({
            data: {
              name: 'Test Manager',
              email: managerEmail,
              password: hashedPassword,
              roleId: managerRole.id,
            },
          });
          console.log('Manager kullanıcısı oluşturuldu.');
        } else {
          console.log('Manager kullanıcısı zaten mevcut.');
        }
      } else {
        console.log('Manager rolü bulunamadı, kullanıcı oluşturulamadı.');
      }
    } catch (error) {
      console.error(`Manager kullanıcısı oluşturulurken hata: ${error.message}`);
    }

    // Test normal kullanıcı
    console.log('Normal kullanıcı oluşturuluyor...');
    try {
      const userRole = await prisma.role.findUnique({
        where: { name: 'user' },
      });
      
      if (userRole) {
        const normalUserEmail = 'user@bakimonarim.com';
        const existingUser = await prisma.user.findUnique({
          where: { email: normalUserEmail },
        });

        if (!existingUser) {
          const hashedPassword = await bcrypt.hash('User123!', 10);
          
          await prisma.user.create({
            data: {
              name: 'Test Kullanıcı',
              email: normalUserEmail,
              password: hashedPassword,
              roleId: userRole.id,
            },
          });
          console.log('Normal kullanıcı oluşturuldu.');
        } else {
          console.log('Normal kullanıcı zaten mevcut.');
        }
      } else {
        console.log('User rolü bulunamadı, kullanıcı oluşturulamadı.');
      }
    } catch (error) {
      console.error(`Normal kullanıcı oluşturulurken hata: ${error.message}`);
    }

    // Arıza Tipleri
    console.log('Arıza tipleri oluşturuluyor...');
    const arizaTipleri = [
      { ad: 'Elektrik Arızası' },
      { ad: 'Su Tesisatı Arızası' },
      { ad: 'Mobilya Tamiri' },
      { ad: 'Boya/Badana' },
      { ad: 'Klima/Isıtma Arızası' },
    ];

    for (const tip of arizaTipleri) {
      try {
        const existingTip = await prisma.arizaTipi.findUnique({
          where: { ad: tip.ad },
        });

        if (!existingTip) {
          await prisma.arizaTipi.create({ data: tip });
          console.log(`${tip.ad} arıza tipi oluşturuldu.`);
        } else {
          console.log(`${tip.ad} arıza tipi zaten mevcut.`);
        }
      } catch (error) {
        console.error(`Arıza tipi ${tip.ad} oluşturulurken hata: ${error.message}`);
      }
    }

    // Uzmanlık Alanları
    console.log('Uzmanlık alanları oluşturuluyor...');
    const uzmanlikAlanlari = [
      { ad: 'Elektrik Tesisatı' },
      { ad: 'Su Tesisatı' },
      { ad: 'Mobilya Tamiri' },
      { ad: 'Boya/Badana' },
      { ad: 'İklimlendirme' },
    ];

    for (const uzmanlik of uzmanlikAlanlari) {
      try {
        const existingUzmanlik = await prisma.uzmanlikAlani.findUnique({
          where: { ad: uzmanlik.ad },
        });

        if (!existingUzmanlik) {
          await prisma.uzmanlikAlani.create({ data: uzmanlik });
          console.log(`${uzmanlik.ad} uzmanlık alanı oluşturuldu.`);
        } else {
          console.log(`${uzmanlik.ad} uzmanlık alanı zaten mevcut.`);
        }
      } catch (error) {
        console.error(`Uzmanlık alanı ${uzmanlik.ad} oluşturulurken hata: ${error.message}`);
      }
    }

    // Teknikerler
    console.log('Teknikerler oluşturuluyor...');
    const teknikerler = [
      { adsoyad: 'Ahmet Yılmaz', telefon: '05321234567' },
      { adsoyad: 'Mehmet Kaya', telefon: '05331234568' },
      { adsoyad: 'Ayşe Demir', telefon: '05341234569' },
    ];

    for (const tekniker of teknikerler) {
      try {
        const existingTekniker = await prisma.tekniker.findFirst({
          where: { adsoyad: tekniker.adsoyad },
        });

        if (!existingTekniker) {
          await prisma.tekniker.create({
            data: {
              adsoyad: tekniker.adsoyad,
              telefon: tekniker.telefon
            }
          });
          console.log(`${tekniker.adsoyad} teknikeri oluşturuldu.`);
        } else {
          console.log(`${tekniker.adsoyad} teknikeri zaten mevcut.`);
        }
      } catch (error) {
        console.error(`Tekniker ${tekniker.adsoyad} oluşturulurken hata: ${error.message}`);
      }
    }

    // Tekniker uzmanlık alanlarını ekle
    console.log('Tekniker uzmanlık alanları ekleniyor...');
    try {
      // İlk tekniker için uzmanlık alanları
      const tekniker1 = await prisma.tekniker.findFirst({
        where: { adsoyad: 'Ahmet Yılmaz' },
      });

      const uzmanlik1 = await prisma.uzmanlikAlani.findUnique({
        where: { ad: 'Elektrik Tesisatı' },
      });

      const uzmanlik2 = await prisma.uzmanlikAlani.findUnique({
        where: { ad: 'Su Tesisatı' },
      });

      if (tekniker1 && uzmanlik1 && uzmanlik2) {
        await prisma.tekniker.update({
          where: { id: tekniker1.id },
          data: {
            uzmanlikAlanlari: {
              connect: [
                { id: uzmanlik1.id },
                { id: uzmanlik2.id }
              ]
            }
          }
        });
        console.log(`${tekniker1.adsoyad} teknikerine uzmanlık alanları eklendi.`);
      }

      // İkinci tekniker için uzmanlık alanları
      const tekniker2 = await prisma.tekniker.findFirst({
        where: { adsoyad: 'Mehmet Kaya' },
      });

      const uzmanlik3 = await prisma.uzmanlikAlani.findUnique({
        where: { ad: 'Mobilya Tamiri' },
      });

      if (tekniker2 && uzmanlik2 && uzmanlik3) {
        await prisma.tekniker.update({
          where: { id: tekniker2.id },
          data: {
            uzmanlikAlanlari: {
              connect: [
                { id: uzmanlik2.id },
                { id: uzmanlik3.id }
              ]
            }
          }
        });
        console.log(`${tekniker2.adsoyad} teknikerine uzmanlık alanları eklendi.`);
      }

      // Üçüncü tekniker için uzmanlık alanları
      const tekniker3 = await prisma.tekniker.findFirst({
        where: { adsoyad: 'Ayşe Demir' },
      });

      const uzmanlik4 = await prisma.uzmanlikAlani.findUnique({
        where: { ad: 'Boya/Badana' },
      });

      const uzmanlik5 = await prisma.uzmanlikAlani.findUnique({
        where: { ad: 'İklimlendirme' },
      });

      if (tekniker3 && uzmanlik4 && uzmanlik5) {
        await prisma.tekniker.update({
          where: { id: tekniker3.id },
          data: {
            uzmanlikAlanlari: {
              connect: [
                { id: uzmanlik4.id },
                { id: uzmanlik5.id }
              ]
            }
          }
        });
        console.log(`${tekniker3.adsoyad} teknikerine uzmanlık alanları eklendi.`);
      }
    } catch (error) {
      console.error(`Tekniker uzmanlık alanları eklenirken hata: ${error.message}`);
    }

    // Malzemeler
    console.log('Malzemeler oluşturuluyor...');
    const malzemeler = [
      { ad: 'Su Borusu (1m)', birim: 'metre' },
      { ad: 'Musluk Bataryası', birim: 'adet' },
      { ad: 'Elektrik Kablosu (1m)', birim: 'metre' },
      { ad: 'Priz', birim: 'adet' },
      { ad: 'Anahtar', birim: 'adet' },
    ];

    for (const malzeme of malzemeler) {
      try {
        const existingMalzeme = await prisma.malzeme.findUnique({
          where: { ad: malzeme.ad },
        });

        if (!existingMalzeme) {
          await prisma.malzeme.create({ data: malzeme });
          console.log(`${malzeme.ad} malzemesi oluşturuldu.`);
        } else {
          console.log(`${malzeme.ad} malzemesi zaten mevcut.`);
        }
      } catch (error) {
        console.error(`Malzeme ${malzeme.ad} oluşturulurken hata: ${error.message}`);
      }
    }

    // Projeler
    console.log('Projeler oluşturuluyor...');
    const projeler = [
      { 
        ad: 'Yeşil Vadi Konutları',
        adres: 'Yeşil Vadi Mah. Çiçek Sok. No:1',
        konum: 'Ankara/Çankaya',
        ekbilgi: '2020 yılında tamamlanan modern site'
      },
      { 
        ad: 'Mavi Deniz Residence',
        adres: 'Sahil Mah. Deniz Cad. No:15',
        konum: 'İstanbul/Kadıköy',
        ekbilgi: 'Deniz manzaralı lüks daireler'
      }
    ];

    for (const proje of projeler) {
      try {
        const existingProje = await prisma.proje.findUnique({
          where: { ad: proje.ad },
        });

        if (!existingProje) {
          await prisma.proje.create({ data: proje });
          console.log(`${proje.ad} projesi oluşturuldu.`);
        } else {
          console.log(`${proje.ad} projesi zaten mevcut.`);
        }
      } catch (error) {
        console.error(`Proje ${proje.ad} oluşturulurken hata: ${error.message}`);
      }
    }

    console.log('Seed işlemi tamamlandı!');
  } catch (mainError) {
    console.error('Ana seed işleminde hata:', mainError);
    throw mainError;
  }
}

console.log('Main fonksiyonu çağrılıyor...');
main()
  .then(async () => {
    console.log('Seed başarılı, bağlantı kapatılıyor...');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed hatası:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 