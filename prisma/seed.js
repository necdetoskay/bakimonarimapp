import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

console.log('===== SEED BAŞLATILIYOR =====');

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

    for (const role of roles) {
      try {
        const existingRole = await prisma.role.findUnique({
          where: { name: role.name },
        });

        if (!existingRole) {
          await prisma.role.create({ data: role });
          console.log(`${role.name} rolü oluşturuldu.`);
        } else {
          console.log(`${role.name} rolü zaten mevcut.`);
        }
      } catch (error) {
        console.error(`Rol ${role.name} oluşturulurken hata: ${error.message}`);
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