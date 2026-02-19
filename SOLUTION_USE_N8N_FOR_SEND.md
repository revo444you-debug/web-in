# Solusi: Pakai n8n untuk Send Message

## Masalah
- Token WhatsApp expire terus
- Works di Vercel tapi tidak di local
- Kemungkinan IP restriction dari Meta

## Solusi: Centralize WhatsApp Integration di n8n

Karena kamu sudah pakai n8n untuk receive messages (webhook), lebih baik pakai n8n juga untuk send messages.

### Keuntungan:
- ✅ Token management di satu tempat (n8n)
- ✅ Tidak perlu update token di multiple places
- ✅ Bypass IP restriction (n8n server IP yang dipakai)
- ✅ Easier debugging
- ✅ Works di local dan production

## Setup n8n Workflow untuk Send Message

### 1. Buat Workflow Baru di n8n

**Workflow Name:** WhatsApp Send Message

**Nodes:**
1. **Webhook** (Trigger)
   - Method: POST
   - Path: `/webhook/whatsapp/send`
   - Response: Immediately

2. **WhatsApp Business Cloud** (Action)
   - Operation: Send Message
   - Phone Number ID: `988128274384219`
   - Access Token: (token kamu)
   - To: `{{ $json.body.to }}`
   - Message Type: Text
   - Message: `{{ $json.body.message }}`

3. **Respond to Webhook**
   - Status Code: 200
   - Body: `{{ $json }}`

### 2. Get Webhook URL

Setelah activate workflow, copy webhook URL:
```
https://your-n8n-instance.com/webhook/whatsapp/send
```

### 3. Update .env

Tambahkan n8n webhook URL:
```env
N8N_SEND_MESSAGE_WEBHOOK=https://your-n8n-instance.com/webhook/whatsapp/send
N8N_API_KEY=your_n8n_api_key
```

### 4. Update lib/whatsapp.ts

Ganti direct API call dengan n8n webhook:

```typescript
export async function sendWhatsAppMessage(
  to: string,
  message: {
    type: 'text' | 'image' | 'video' | 'document'
    text?: string
    mediaId?: string
    caption?: string
  }
) {
  const n8nWebhook = process.env.N8N_SEND_MESSAGE_WEBHOOK
  
  if (!n8nWebhook) {
    throw new Error('N8N_SEND_MESSAGE_WEBHOOK not configured')
  }

  const response = await fetch(n8nWebhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
    },
    body: JSON.stringify({
      to,
      message: message.text,
      type: message.type,
      mediaId: message.mediaId,
      caption: message.caption,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`n8n Webhook Error: ${JSON.stringify(error)}`)
  }

  return response.json()
}
```

### 5. Test

```bash
npm run dev
```

Sekarang send message akan via n8n, tidak langsung ke Meta API.

## Alternative: Pakai n8n API (Bukan Webhook)

Kalau mau lebih proper, pakai n8n API untuk trigger workflow:

```typescript
export async function sendWhatsAppMessage(to: string, message: any) {
  const n8nUrl = process.env.N8N_URL // https://your-n8n.com
  const n8nApiKey = process.env.N8N_API_KEY
  const workflowId = process.env.N8N_SEND_MESSAGE_WORKFLOW_ID

  const response = await fetch(`${n8nUrl}/api/v1/workflows/${workflowId}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': n8nApiKey,
    },
    body: JSON.stringify({
      to,
      message: message.text,
    }),
  })

  return response.json()
}
```

## Kesimpulan

Dengan centralize WhatsApp integration di n8n:
- ✅ Token management lebih mudah
- ✅ Works di local dan production
- ✅ Bypass IP restrictions
- ✅ Easier debugging dan monitoring
- ✅ Consistent dengan receive message flow (yang sudah pakai n8n)
