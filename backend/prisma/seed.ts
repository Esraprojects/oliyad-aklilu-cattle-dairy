import { PrismaClient, Role, CattleGender, CattleCategory, CattleStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('Admin@2024!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@olyiadcattle.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@olyiadcattle.com',
      password: hashedPassword,
      role: Role.ADMIN,
      phone: '+251911000000',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@olyiadcattle.com' },
    update: {},
    create: {
      name: 'Farm Manager',
      email: 'manager@olyiadcattle.com',
      password: await bcrypt.hash('Manager@2024!', 12),
      role: Role.MANAGER,
      phone: '+251922000000',
    },
  });

  const feeds = await Promise.all([
    prisma.feed.upsert({
      where: { id: 'feed-hay' },
      update: {},
      create: {
        id: 'feed-hay',
        name: 'Hay (Grass)',
        nameAm: 'ሣር (ድርቀት)',
        type: 'Roughage',
        unit: 'kg',
        costPerUnit: 8,
        stockQty: 2000,
        minStock: 200,
      },
    }),
    prisma.feed.upsert({
      where: { id: 'feed-concentrate' },
      update: {},
      create: {
        id: 'feed-concentrate',
        name: 'Concentrate Mix',
        nameAm: 'ድብልቅ ምግብ',
        type: 'Concentrate',
        unit: 'kg',
        costPerUnit: 35,
        stockQty: 500,
        minStock: 50,
      },
    }),
    prisma.feed.upsert({
      where: { id: 'feed-silage' },
      update: {},
      create: {
        id: 'feed-silage',
        name: 'Maize Silage',
        nameAm: 'የበቆሎ ሳይሌጅ',
        type: 'Silage',
        unit: 'kg',
        costPerUnit: 12,
        stockQty: 3000,
        minStock: 300,
      },
    }),
    prisma.feed.upsert({
      where: { id: 'feed-bran' },
      update: {},
      create: {
        id: 'feed-bran',
        name: 'Wheat Bran',
        nameAm: 'የስንዴ ቅርፊት',
        type: 'Byproduct',
        unit: 'kg',
        costPerUnit: 18,
        stockQty: 800,
        minStock: 100,
      },
    }),
  ]);

  const cattle = await Promise.all([
    prisma.cattle.upsert({
      where: { tagNumber: 'OAF-001' },
      update: {},
      create: {
        tagNumber: 'OAF-001',
        name: 'ቀይ',
        breed: 'Boran',
        gender: CattleGender.MALE,
        category: CattleCategory.FATTENING,
        status: CattleStatus.ACTIVE,
        purchasePrice: 25000,
        initialWeight: 280,
        currentWeight: 320,
        targetWeight: 450,
        color: 'Red-Brown',
      },
    }),
    prisma.cattle.upsert({
      where: { tagNumber: 'OAF-002' },
      update: {},
      create: {
        tagNumber: 'OAF-002',
        name: 'ጥቁር',
        breed: 'Fogera',
        gender: CattleGender.FEMALE,
        category: CattleCategory.DAIRY,
        status: CattleStatus.ACTIVE,
        purchasePrice: 32000,
        initialWeight: 350,
        currentWeight: 370,
        color: 'Black',
      },
    }),
    prisma.cattle.upsert({
      where: { tagNumber: 'OAF-003' },
      update: {},
      create: {
        tagNumber: 'OAF-003',
        name: 'ነጭ',
        breed: 'Holstein-Friesian Cross',
        gender: CattleGender.FEMALE,
        category: CattleCategory.DAIRY,
        status: CattleStatus.ACTIVE,
        purchasePrice: 45000,
        initialWeight: 400,
        currentWeight: 420,
        color: 'Black & White',
      },
    }),
    prisma.cattle.upsert({
      where: { tagNumber: 'OAF-004' },
      update: {},
      create: {
        tagNumber: 'OAF-004',
        name: 'ወርቅ',
        breed: 'Boran',
        gender: CattleGender.MALE,
        category: CattleCategory.FATTENING,
        status: CattleStatus.ACTIVE,
        purchasePrice: 22000,
        initialWeight: 250,
        currentWeight: 310,
        targetWeight: 430,
        color: 'Golden',
      },
    }),
  ]);

  await prisma.employee.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Kebede Alemu',
        phone: '+251911111111',
        position: 'Herdsman',
        salary: 4500,
        hireDate: new Date('2023-01-15'),
      },
      {
        name: 'Tigist Bekele',
        phone: '+251922222222',
        position: 'Dairy Technician',
        salary: 5500,
        hireDate: new Date('2023-03-01'),
      },
      {
        name: 'Mulugeta Haile',
        phone: '+251933333333',
        position: 'Feed Manager',
        salary: 5000,
        hireDate: new Date('2023-06-10'),
      },
    ],
  });

  console.log('Database seeded successfully!');
  console.log('Admin: admin@olyiadcattle.com / Admin@2024!');
  console.log('Manager: manager@olyiadcattle.com / Manager@2024!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
