import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/session'
import { sendMessageSchema } from '@/lib/validations/message'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export async function POST(req: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { contactId, type, content, mediaUrl, caption } = sendMessageSchema.parse(body)

    // Get contact info
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Send via WhatsApp API
    const waResponse = await sendWhatsAppMessage(contact.waId, {
      type: type.toLowerCase() as any,
      text: content,
      mediaId: mediaUrl,
      caption,
    })

    // Save to database
    const message = await prisma.message.create({
      data: {
        waMessageId: waResponse.messages[0].id,
        contactId,
        senderId: session.userId,
        type,
        content,
        mediaUrl,
        caption,
        isFromContact: false,
        timestamp: new Date(),
        status: 'SENT',
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim pesan' },
      { status: 500 }
    )
  }
}
