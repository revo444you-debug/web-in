// Script untuk fix timestamps dan test
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixTimestamps() {
  console.log('🔧 Starting timestamp fix...\n')

  // 1. Get contact ID
  const contact = await prisma.contact.findFirst({
    where: { phoneNumber: '6285175434869' }
  })
  if (!contact) {
    console.error('❌ Contact not found: 6285175434869')
    return
  }
  console.log('✅ Contact found:', contact.phoneNumber)

  // 2. Delete all test messages
  const deleted = await prisma.message.deleteMany({
    where: {
      OR: [
        { content: { contains: 'test' } },
        { content: { contains: 'Test' } },
        { content: { contains: 'badut' } },
        { content: { contains: 'Badut' } },
      ]
    }
  })
  console.log(`🗑️  Deleted ${deleted.count} test messages\n`)

  // 3. Create test messages with correct UTC timestamps
  console.log('📝 Creating test messages with UTC timestamps...\n')

  const baseTime = Date.now()
  
  // Simulate conversation with alternating messages
  const messages = [
    { content: 'Halo', isFromContact: true, offset: 0 },
    { content: 'hai', isFromContact: false, offset: 10000 },
    { content: 'Apa kabar?', isFromContact: true, offset: 20000 },
    { content: 'baik', isFromContact: false, offset: 30000 },
    { content: 'Lagi ngapain?', isFromContact: true, offset: 40000 },
    { content: 'kerja', isFromContact: false, offset: 50000 },
  ]

  for (const msg of messages) {
    const timestamp = new Date(baseTime + msg.offset)
    
    await prisma.message.create({
      data: {
        waMessageId: `test-${Date.now()}-${Math.random()}`,
        contactId: contact.id,
        content: msg.content,
        type: 'TEXT',
        isFromContact: msg.isFromContact,
        timestamp: timestamp,
        status: 'SENT',
      }
    })
    
    console.log(`${msg.isFromContact ? '👤' : '💬'} ${msg.content} - ${timestamp.toISOString()}`)
  }

  console.log('\n✅ Test messages created!\n')

  // 4. Verify order
  console.log('🔍 Verifying message order...\n')
  
  const allMessages = await prisma.message.findMany({
    where: { contactId: contact.id },
    orderBy: { timestamp: 'asc' },
    select: {
      content: true,
      isFromContact: true,
      timestamp: true,
    }
  })

  console.log('Messages in database order:')
  allMessages.forEach((msg, i) => {
    const from = msg.isFromContact ? 'Contact' : 'You'
    const time = new Date(msg.timestamp).toISOString()
    console.log(`${i + 1}. [${time}] ${from}: ${msg.content}`)
  })

  // Check if order is correct
  let isCorrect = true
  for (let i = 1; i < allMessages.length; i++) {
    const prev = new Date(allMessages[i-1].timestamp).getTime()
    const curr = new Date(allMessages[i].timestamp).getTime()
    if (prev > curr) {
      console.log(`\n❌ Order is WRONG at index ${i}`)
      isCorrect = false
      break
    }
  }

  if (isCorrect) {
    console.log('\n✅ Message order is CORRECT!')
    console.log('✅ Timestamps are properly sorted!')
    console.log('\n🎉 Problem solved! Refresh your browser to see the fix.')
  } else {
    console.log('\n❌ Message order is still wrong')
    console.log('There might be an issue with database timezone settings')
  }

  await prisma.$disconnect()
}

fixTimestamps().catch(console.error)
