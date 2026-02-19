// Deep debug untuk menemukan masalah timezone
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function deepDebug() {
  console.log('🔍 DEEP DEBUG - Finding the root cause\n')
  console.log('=' .repeat(60))

  // 1. Check Node.js timezone
  console.log('\n1️⃣ NODE.JS ENVIRONMENT:')
  console.log('   TZ env var:', process.env.TZ || 'not set')
  console.log('   new Date():', new Date().toISOString())
  console.log('   Date.now():', new Date(Date.now()).toISOString())
  console.log('   Timezone offset:', new Date().getTimezoneOffset(), 'minutes')

  // 2. Check database timezone
  console.log('\n2️⃣ DATABASE TIMEZONE:')
  const tzResult = await prisma.$queryRaw`SHOW timezone`
  console.log('   PostgreSQL timezone:', tzResult[0].TimeZone)
  
  const nowResult = await prisma.$queryRaw`SELECT NOW() as now, NOW() AT TIME ZONE 'UTC' as utc_now`
  console.log('   Database NOW():', nowResult[0].now)
  console.log('   Database NOW() UTC:', nowResult[0].utc_now)

  // 3. Test insert with different methods
  console.log('\n3️⃣ TESTING INSERT METHODS:')
  
  const contact = await prisma.contact.findFirst({
    where: { phoneNumber: '6285175434869' }
  })
  
  if (!contact) {
    console.log('   ❌ Contact not found')
    await prisma.$disconnect()
    return
  }

  // Method 1: new Date()
  const msg1 = await prisma.message.create({
    data: {
      waMessageId: `debug-1-${Date.now()}`,
      contactId: contact.id,
      content: 'DEBUG: new Date()',
      type: 'TEXT',
      isFromContact: false,
      timestamp: new Date(),
      status: 'SENT',
    }
  })
  console.log('   Method 1 (new Date()):', msg1.timestamp)

  // Method 2: new Date(Date.now())
  const msg2 = await prisma.message.create({
    data: {
      waMessageId: `debug-2-${Date.now()}`,
      contactId: contact.id,
      content: 'DEBUG: Date.now()',
      type: 'TEXT',
      isFromContact: false,
      timestamp: new Date(Date.now()),
      status: 'SENT',
    }
  })
  console.log('   Method 2 (Date.now()):', msg2.timestamp)

  // Method 3: ISO string
  const msg3 = await prisma.message.create({
    data: {
      waMessageId: `debug-3-${Date.now()}`,
      contactId: contact.id,
      content: 'DEBUG: ISO string',
      type: 'TEXT',
      isFromContact: false,
      timestamp: new Date().toISOString(),
      status: 'SENT',
    }
  })
  console.log('   Method 3 (ISO string):', msg3.timestamp)

  // 4. Read back from database
  console.log('\n4️⃣ READING BACK FROM DATABASE:')
  const messages = await prisma.message.findMany({
    where: {
      waMessageId: {
        startsWith: 'debug-'
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  messages.forEach((msg, i) => {
    console.log(`   Message ${i+1}:`)
    console.log(`     Content: ${msg.content}`)
    console.log(`     Timestamp: ${msg.timestamp}`)
    console.log(`     ISO: ${new Date(msg.timestamp).toISOString()}`)
  })

  // 5. Check Prisma client timezone handling
  console.log('\n5️⃣ PRISMA CLIENT INFO:')
  console.log('   Prisma version:', require('@prisma/client/package.json').version)

  // 6. Solution recommendation
  console.log('\n6️⃣ SOLUTION:')
  console.log('   Based on the debug info above:')
  
  const nodeOffset = new Date().getTimezoneOffset()
  if (nodeOffset !== 0) {
    console.log('   ⚠️  Node.js is NOT in UTC timezone')
    console.log('   ⚠️  Offset:', nodeOffset, 'minutes')
    console.log('   ✅ FIX: Set TZ=UTC in .env and restart')
  } else {
    console.log('   ✅ Node.js is in UTC timezone')
  }

  if (tzResult[0].TimeZone !== 'UTC') {
    console.log('   ⚠️  Database is NOT in UTC timezone')
    console.log('   ⚠️  Current:', tzResult[0].TimeZone)
    console.log('   ✅ FIX: Run ALTER DATABASE SET timezone = \'UTC\'')
  } else {
    console.log('   ✅ Database is in UTC timezone')
  }

  // Cleanup
  await prisma.message.deleteMany({
    where: {
      waMessageId: {
        startsWith: 'debug-'
      }
    }
  })
  console.log('\n🧹 Cleaned up debug messages')

  console.log('\n' + '='.repeat(60))
  await prisma.$disconnect()
}

deepDebug().catch(console.error)
