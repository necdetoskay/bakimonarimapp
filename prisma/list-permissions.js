const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  // Get permissions
  const permissions = await db.permission.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  
  console.log(`Found ${permissions.length} permissions:`);
  permissions.forEach(p => {
    console.log(`- ${p.name}: ${p.description || 'No description'}`);
  });
  
  // Get roles
  const roles = await db.role.findMany({
    include: {
      _count: {
        select: {
          permissions: true
        }
      }
    }
  });
  
  console.log(`\nFound ${roles.length} roles:`);
  roles.forEach(r => {
    console.log(`- ${r.name}: ${r.description || 'No description'} (${r._count.permissions} permissions)`);
  });
  
  // Get admin role permissions
  const adminRole = await db.role.findFirst({
    where: { name: 'admin' },
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });
  
  if (adminRole) {
    console.log(`\nAdmin role has ${adminRole.permissions.length} permissions:`);
    adminRole.permissions.forEach(p => {
      console.log(`- ${p.permission.name}`);
    });
  }
}

main()
  .then(() => db.$disconnect())
  .catch(e => {
    console.error(e);
    db.$disconnect();
    process.exit(1);
  }); 