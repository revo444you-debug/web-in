import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Webhook verification untuk WABA
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WABA_WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Menerima webhook dari WABA
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    console.log('📥 Webhook received:', JSON.stringify(body, null, 2))
    console.log('📥 Request headers:', Object.fromEntries(req.headers.entries()))

    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value) {
      console.log('⚠️ No value in webhook payload')
      return NextResponse.json({ status: 'ok' })
    }

    // Handle incoming messages
    if (value.messages) {
      console.log('📨 Processing messages:', value.messages.length)
      
      for (const message of value.messages) {
        const waId = message.from
        const phoneNumber = waId

        // Cari atau buat contact
        let contact = await prisma.contact.findUnique({
          where: { waId },
        })

        if (!contact) {
          // Dapatkan default label (qualified lead)
          let defaultLabel = await prisma.label.findFirst({
            where: { name: 'qualified lead' },
          })

          // Jika label belum ada, buat dulu
          if (!defaultLabel) {
            defaultLabel = await prisma.label.create({
              data: {
                name: 'qualified lead',
                order: 1,
                color: '#3B82F6',
              },
            })
          }

          contact = await prisma.contact.create({
            data: {
              waId,
              phoneNumber,
              name: value.contacts?.[0]?.profile?.name || phoneNumber,
              labelId: defaultLabel.id,
            },
          })
        }

        // Simpan message
        // WhatsApp sends timestamp in Unix seconds (UTC)
        // Store in UTC (standard practice like WhatsApp)
        const waTimestampUTC = new Date(parseInt(message.timestamp) * 1000)
        
        let messageData: any = {
          waMessageId: message.id,
          contactId: contact.id,
          isFromContact: true,
          timestamp: waTimestampUTC, // Store in UTC
          status: 'DELIVERED',
        }

        // Handle different message types
        if (message.type === 'text') {
          messageData.type = 'TEXT'
          messageData.content = message.text.body
        } else if (message.type === 'image') {
          messageData.type = 'IMAGE'
          messageData.mediaUrl = message.image.id
          messageData.caption = message.image.caption
        } else if (message.type === 'video') {
          messageData.type = 'VIDEO'
          messageData.mediaUrl = message.video.id
          messageData.caption = message.video.caption
        } else if (message.type === 'document') {
          messageData.type = 'DOCUMENT'
          messageData.mediaUrl = message.document.id
          messageData.caption = message.document.filename
        } else if (message.type === 'audio') {
          messageData.type = 'AUDIO'
          messageData.mediaUrl = message.audio.id
        }

        // Cek apakah message sudah ada (untuk avoid duplicate)
        const existingMessage = await prisma.message.findUnique({
          where: { waMessageId: message.id },
        })

        if (!existingMessage) {
          await prisma.message.create({ data: messageData })
          console.log('✅ Message saved:', message.id)
        } else {
          console.log('⚠️ Message already exists:', message.id)
        }
      }
    }

    // Handle message status updates
    if (value.statuses) {
      for (const status of value.statuses) {
        await prisma.message.updateMany({
          where: { waMessageId: status.id },
          data: {
            status: status.status.toUpperCase() as any,
          },
        })
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Webhook error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ 
      status: 'error',
      message: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
