import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/session'

export async function GET(req: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const contactId = searchParams.get('contactId')

    if (!contactId) {
      return NextResponse.json(
        { error: 'contactId required' },
        { status: 400 }
      )
    }

    const messages = await prisma.message.findMany({
      where: { contactId },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [
        { timestamp: 'asc' },
        { createdAt: 'asc' },
      ],
    })

    // Debug: Log timestamps
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Messages fetched:', messages.length)
      messages.forEach((msg, i) => {
        console.log(`${i + 1}. [${msg.timestamp.toISOString()}] ${msg.isFromContact ? 'Contact' : 'You'}: ${msg.content?.substring(0, 20)}`)
      })
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
