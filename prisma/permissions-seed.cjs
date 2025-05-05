const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Permissions seed başlatılıyor...');

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

  for (const perm of permissions) {
    const existing = await prisma.permission.findUnique({
      where: { name: perm.name }
    });
    
    if (!existing) {
      await prisma.permission.create({
        data: perm
      });
      console.log(`${perm.name} izni oluşturuldu`);
    } else {
      console.log(`${perm.name} izni zaten mevcut`);
    }
  }

  // Rolleri getir
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' }
  });
  
  const managerRole = await prisma.role.findUnique({
    where: { name: 'manager' }
  });
  
  const userRole = await prisma.role.findUnique({
    where: { name: 'user' }
  });

  // Tüm izinleri getir
  const allPermissions = await prisma.permission.findMany();
  
  // Admin rolüne tüm izinleri ekle
  if (adminRole) {
    console.log('Admin rolü için izinler ekleniyor...');
    for (const perm of allPermissions) {
      try {
        await prisma.permissionsOnRoles.create({
          data: {
            roleId: adminRole.id,
            permissionId: perm.id
          }
        });
      } catch (error) {
        // İlişki zaten varsa hata verecektir, görmezden gel
        if (!error.message.includes('Unique constraint')) {
          console.error(`Admin rolü için ${perm.name} izni eklenirken hata:`, error);
        }
      }
    }
  }

  // Manager rolüne bazı izinleri ekle
  if (managerRole) {
    console.log('Manager rolü için izinler ekleniyor...');
    const managerPerms = allPermissions.filter(p => 
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
    
    for (const perm of managerPerms) {
      try {
        await prisma.permissionsOnRoles.create({
          data: {
            roleId: managerRole.id,
            permissionId: perm.id
          }
        });
      } catch (error) {
        // İlişki zaten varsa hata verecektir, görmezden gel
        if (!error.message.includes('Unique constraint')) {
          console.error(`Manager rolü için ${perm.name} izni eklenirken hata:`, error);
        }
      }
    }
  }

  // User rolüne bazı izinleri ekle
  if (userRole) {
    console.log('User rolü için izinler ekleniyor...');
    const userPerms = allPermissions.filter(p => 
      p.name === 'projects.view' || 
      p.name === 'blocks.view' || 
      p.name === 'apartments.view' || 
      p.name === 'faults.view' || 
      p.name === 'faults.create' || 
      p.name === 'appointments.view'
    );
    
    for (const perm of userPerms) {
      try {
        await prisma.permissionsOnRoles.create({
          data: {
            roleId: userRole.id,
            permissionId: perm.id
          }
        });
      } catch (error) {
        // İlişki zaten varsa hata verecektir, görmezden gel
        if (!error.message.includes('Unique constraint')) {
          console.error(`User rolü için ${perm.name} izni eklenirken hata:`, error);
        }
      }
    }
  }

  console.log('İzinler başarıyla eklendi!');
}

main()
  .then(async () => {
    console.log('İşlem tamamlandı.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Hata:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 