const WABA_API_URL = 'https://graph.facebook.com/v21.0'
const PHONE_NUMBER_ID = process.env.WABA_PHONE_NUMBER_ID!
const ACCESS_TOKEN = process.env.WABA_ACCESS_TOKEN!

// Debug logging (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 WhatsApp Config:', {
    phoneNumberId: PHONE_NUMBER_ID,
    hasAccessToken: !!ACCESS_TOKEN,
    tokenLength: ACCESS_TOKEN?.length || 0,
    tokenPrefix: ACCESS_TOKEN?.substring(0, 20) + '...',
  })
}

export async function sendWhatsAppMessage(
  to: string,
  message: {
    type: 'text' | 'image' | 'video' | 'document'
    text?: string
    mediaId?: string
    caption?: string
  }
) {
  const url = `${WABA_API_URL}/${PHONE_NUMBER_ID}/messages`

  let messageBody: any = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
  }

  if (message.type === 'text') {
    messageBody.type = 'text'
    messageBody.text = { body: message.text }
  } else if (message.type === 'image') {
    messageBody.type = 'image'
    messageBody.image = {
      id: message.mediaId,
      caption: message.caption,
    }
  } else if (message.type === 'video') {
    messageBody.type = 'video'
    messageBody.video = {
      id: message.mediaId,
      caption: message.caption,
    }
  } else if (message.type === 'document') {
    messageBody.type = 'document'
    messageBody.document = {
      id: message.mediaId,
      caption: message.caption,
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(messageBody),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('❌ WhatsApp API Error:', {
      status: response.status,
      statusText: response.statusText,
      error,
      tokenUsed: ACCESS_TOKEN?.substring(0, 20) + '...',
    })
    throw new Error(`WhatsApp API Error: ${JSON.stringify(error)}`)
  }

  return response.json()
}

export async function getMediaUrl(mediaId: string): Promise<string> {
  const url = `${WABA_API_URL}/${mediaId}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get media URL')
  }

  const data = await response.json()
  return data.url
}

export async function downloadMedia(mediaUrl: string): Promise<Buffer> {
  const response = await fetch(mediaUrl, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to download media')
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export async function markMessageAsRead(messageId: string) {
  const url = `${WABA_API_URL}/${PHONE_NUMBER_ID}/messages`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }),
  })

  return response.ok
}
