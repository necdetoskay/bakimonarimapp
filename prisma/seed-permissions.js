// Using ES Module imports
import { PrismaClient } from '@prisma/client';

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

    // Check for admin role and create if missing
    const existingAdmin = await prisma.role.findUnique({
      where: { name: 'admin' },
    });
    if (!existingAdmin) {
      await prisma.role.create({
        data: { name: 'admin', description: 'Super admin rolü' },
      });
      console.log('✅ Admin rolü oluşturuldu.');
    }

    // Rollerden gelen verileri al
    const roles = await prisma.role.findMany();

    // Admin rolüne tüm izinleri ver
    const adminRole = roles.find(r => r.name === 'admin');
    if (adminRole) {
      console.log(`\nAdmin rolü bulundu (ID: ${adminRole.id}).`);
      const adminPermissions = createdPermissions; // Admin tüm izinleri alacak

      console.log(`Admin rolüne ${adminPermissions.length} adet izin eklenecek.`);
      for (const permission of adminPermissions) {
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

    // Diğer rollerin izin atamaları devam eder...
    // (manager ve user rolleri için mevcut kod blokları)
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
