import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default categories
  const categories = [
    { name: 'Professional', description: 'High-end professional walkie talkies' },
    { name: 'Waterproof', description: 'Waterproof and weather-resistant models' },
    { name: 'Budget', description: 'Affordable options for basic needs' },
    { name: 'Consumer', description: 'Consumer-grade walkie talkies' },
    { name: 'Headsets', description: 'Audio accessories and headsets' },
    { name: 'Chargers', description: 'Charging solutions and accessories' },
    { name: 'Batteries', description: 'Battery packs and power solutions' },
    { name: 'Cases', description: 'Protective cases and carrying solutions' },
    { name: 'Accessories', description: 'Various walkie talkie accessories' },
    { name: 'Antennas', description: 'Antennas and signal boosters' },
  ]

  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: category.name }
    })

    if (!existingCategory) {
      await prisma.category.create({
        data: category,
      })
    }
  }

  // Create default employee account
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const employee = await prisma.user.upsert({
    where: { email: 'admin@walkierentals.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@walkierentals.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  })

  console.log('Database seeded successfully!')
  console.log('Default employee created:')
  console.log('Email: admin@walkierentals.com')
  console.log('Password: admin123')
  console.log('Role: EMPLOYEE')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

