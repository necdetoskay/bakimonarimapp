// Using CommonJS style imports
const { PrismaClient } = require('@prisma/client');

// Force console output to be immediate
const originalLog = console.log;
console.log = function() {
  originalLog.apply(console, arguments);
  // Ensure output is flushed
  process.stdout.write('');
};

console.log('===== PERMISSIONS SEED BAŞLATILIYOR =====');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('İzinler seed işlemi başlatılıyor...');

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

    // İzinleri oluştur
    console.log(`${permissions.length} adet izin oluşturulacak...`);
    const createdPermissions = [];
    for (const permission of permissions) {
      try {
        const existingPermission = await prisma.permission.findUnique({
          where: { name: permission.name },
        });

        if (!existingPermission) {
          const created = await prisma.permission.create({ data: permission });
          createdPermissions.push(created);
          console.log(`✅ ${permission.name} izni oluşturuldu.`);
        } else {
          createdPermissions.push(existingPermission);
          console.log(`ℹ️ ${permission.name} izni zaten mevcut.`);
        }
      } catch (error) {
        console.error(`❌ İzin ${permission.name} oluşturulurken hata: ${error.message}`);
      }
    }

    // Roller ve izinler arasındaki ilişkileri kur
    console.log('\nRol-İzin ilişkileri oluşturuluyor...');
    
    // Rolleri getir
    const roles = await prisma.role.findMany();
    console.log(`${roles.length} adet rol bulundu.`);
    
    // Admin rolüne tüm izinleri ver
    const adminRole = roles.find(r => r.name === 'admin');
    if (adminRole) {
      console.log(`Admin rolü bulundu (ID: ${adminRole.id}).`);
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
            console.log(`✅ Admin rolüne ${permission.name} izni eklendi.`);
          } else {
            console.log(`ℹ️ Admin rolünde ${permission.name} izni zaten mevcut.`);
          }
        } catch (error) {
          console.error(`❌ İzin ilişkisi oluşturulurken hata: ${error.message}`);
        }
      }
    } else {
      console.log('❌ Admin rolü bulunamadı.');
    }

    // Manager rolüne bazı izinleri ver
    const managerRole = roles.find(r => r.name === 'manager');
    if (managerRole) {
      console.log(`\nManager rolü bulundu (ID: ${managerRole.id}).`);
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

      console.log(`Manager rolüne ${managerPermissions.length} adet izin eklenecek.`);
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
            console.log(`✅ Manager rolüne ${permission.name} izni eklendi.`);
          } else {
            console.log(`ℹ️ Manager rolünde ${permission.name} izni zaten mevcut.`);
          }
        } catch (error) {
          console.error(`❌ İzin ilişkisi oluşturulurken hata: ${error.message}`);
        }
      }
    } else {
      console.log('❌ Manager rolü bulunamadı.');
    }

    // User rolüne sınırlı izinler ver
    const userRole = roles.find(r => r.name === 'user');
    if (userRole) {
      console.log(`\nUser rolü bulundu (ID: ${userRole.id}).`);
      const userPermissions = createdPermissions.filter(p => 
        p.name === 'projects.view' || 
        p.name === 'blocks.view' || 
        p.name === 'apartments.view' || 
        p.name === 'faults.view' || 
        p.name === 'faults.create' || 
        p.name === 'appointments.view'
      );

      console.log(`User rolüne ${userPermissions.length} adet izin eklenecek.`);
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
            console.log(`✅ User rolüne ${permission.name} izni eklendi.`);
          } else {
            console.log(`ℹ️ User rolünde ${permission.name} izni zaten mevcut.`);
          }
        } catch (error) {
          console.error(`❌ İzin ilişkisi oluşturulurken hata: ${error.message}`);
        }
      }
    } else {
      console.log('❌ User rolü bulunamadı.');
    }

    console.log('\n✅ İzinler seed işlemi tamamlandı!');
  } catch (mainError) {
    console.error('\n❌ Ana seed işleminde hata:', mainError);
    throw mainError;
  }
}

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