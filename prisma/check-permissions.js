const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Write directly to stdout
    process.stdout.write('Veritabanındaki izinleri kontrol ediyorum...\n');

    const permissions = await prisma.permission.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    process.stdout.write(`Toplam ${permissions.length} izin bulundu:\n\n`);
    
    for (const perm of permissions) {
      process.stdout.write(`- ${perm.name}: ${perm.description}\n`);
    }
    
    process.stdout.write('\nRol-İzin ilişkilerini kontrol ediyorum...\n');
    
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
    
    for (const role of roles) {
      process.stdout.write(`\nRol: ${role.name} (${role.description || 'Açıklama yok'})\n`);
      process.stdout.write(`Sahip olduğu izinler (${role.permissions.length}):\n`);
      
      for (const relation of role.permissions) {
        process.stdout.write(`- ${relation.permission.name}: ${relation.permission.description || 'Açıklama yok'}\n`);
      }
    }

    process.stdout.write('\nKontrol tamamlandı.\n');
    return "Başarılı";
  } catch (error) {
    process.stderr.write(`HATA: ${error.message}\n`);
    throw error;
  }
}

main()
  .then(async (result) => {
    process.stdout.write(`\nSonuç: ${result}\n`);
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    process.stderr.write(`Kritik hata: ${e}\n`);
    await prisma.$disconnect();
    process.exit(1);
  }); 