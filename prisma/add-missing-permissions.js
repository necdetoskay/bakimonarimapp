const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Eksik izinleri ekleme işlemi başlatılıyor...');

  // İzinleri oluştur
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

  // Mevcut izinleri kontrol et
  const existingPermissions = await prisma.permission.findMany();
  console.log(`Veritabanında ${existingPermissions.length} izin bulunuyor.`);

  let added = 0;
  let skipped = 0;

  for (const perm of permissions) {
    const exists = existingPermissions.some(p => p.name === perm.name);
    
    if (!exists) {
      await prisma.permission.create({
        data: perm
      });
      console.log(`+ ${perm.name} izni eklendi`);
      added++;
    } else {
      console.log(`~ ${perm.name} izni zaten mevcut, atlanıyor`);
      skipped++;
    }
  }

  console.log(`\nİşlem tamamlandı: ${added} izin eklendi, ${skipped} izin atlandı.`);
  
  // Şimdi admin rolüne tüm izinleri ekleyelim
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' }
  });
  
  if (adminRole) {
    console.log(`\nAdmin rolü (${adminRole.id}) için eksik izinler ekleniyor...`);
    
    // Admin rolü için tüm izinleri ekle
    const allPermissions = await prisma.permission.findMany();
    let adminPermsAdded = 0;
    
    for (const perm of allPermissions) {
      // Bu izin ilişkisi zaten var mı kontrol et
      const relationExists = await prisma.permissionsOnRoles.findUnique({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: perm.id
          }
        }
      });
      
      if (!relationExists) {
        await prisma.permissionsOnRoles.create({
          data: {
            roleId: adminRole.id,
            permissionId: perm.id
          }
        });
        console.log(`+ Admin rolüne ${perm.name} izni eklendi`);
        adminPermsAdded++;
      }
    }
    
    console.log(`Admin rolüne ${adminPermsAdded} yeni izin eklendi.`);
  } else {
    console.log('Admin rolü bulunamadı!');
  }
}

main()
  .then(async () => {
    console.log('Bağlantı kapatılıyor...');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 