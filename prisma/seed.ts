import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Temel izinleri oluştur
  const readPermission = await prisma.permission.upsert({
    where: { name: 'read' },
    update: {},
    create: {
      name: 'read',
      description: 'Read access to resources',
    },
  });

  const writePermission = await prisma.permission.upsert({
    where: { name: 'write' },
    update: {},
    create: {
      name: 'write',
      description: 'Write access to resources',
    },
  });

  const deletePermission = await prisma.permission.upsert({
    where: { name: 'delete' },
    update: {},
    create: {
      name: 'delete',
      description: 'Delete access to resources',
    },
  });

  // Roller oluştur
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {
      permissions: {
        connect: [
          { id: readPermission.id },
          { id: writePermission.id },
          { id: deletePermission.id },
        ],
      },
    },
    create: {
      name: 'admin',
      description: 'Administrator with all permissions',
      permissions: {
        connect: [
          { id: readPermission.id },
          { id: writePermission.id },
          { id: deletePermission.id },
        ],
      },
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {
      permissions: {
        connect: [{ id: readPermission.id }],
      },
    },
    create: {
      name: 'user',
      description: 'Regular user with limited permissions',
      permissions: {
        connect: [{ id: readPermission.id }],
      },
    },
  });

  // Admin kullanıcı oluştur
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      roleId: adminRole.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 