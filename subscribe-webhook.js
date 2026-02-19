// Script untuk subscribe webhook fields via Graph API
require('dotenv').config()

const PHONE_NUMBER_ID = process.env.WABA_PHONE_NUMBER_ID
const ACCESS_TOKEN = process.env.WABA_ACCESS_TOKEN

async function subscribeWebhook() {
  console.log('📡 Subscribing to webhook fields...\n')
  
  // Subscribe to messages and message_status
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/subscribed_apps`
  
  const body = new URLSearchParams({
    subscribed_fields: 'messages,message_status'
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Successfully subscribed to webhook fields!')
      console.log('Response:', JSON.stringify(data, null, 2))
      console.log('\n📋 Subscribed fields: messages, message_status')
      console.log('\n🧪 Now test:')
      console.log('1. Send a message from WhatsApp to your business number')
      console.log('2. Check terminal for webhook logs')
      console.log('3. Check database for new message')
    } else {
      console.error('❌ Failed to subscribe')
      console.error('Error:', JSON.stringify(data, null, 2))
      
      if (data.error?.message?.includes('Invalid OAuth')) {
        console.error('\n⚠️  Access token might be expired or invalid')
        console.error('Get new token from: Meta for Developers → WhatsApp → API Setup')
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Check current subscription
async function checkSubscription() {
  console.log('🔍 Checking current webhook subscription...\n')
  
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/subscribed_apps?access_token=${ACCESS_TOKEN}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (response.ok) {
      console.log('📊 Current subscription:')
      console.log(JSON.stringify(data, null, 2))
      
      if (data.data && data.data.length > 0) {
        const fields = data.data[0].subscribed_fields || []
        console.log('\n✅ Subscribed fields:', fields.join(', '))
        
        if (!fields.includes('messages')) {
          console.log('\n⚠️  "messages" field is NOT subscribed!')
          console.log('Running subscription...\n')
          await subscribeWebhook()
        } else {
          console.log('\n✅ "messages" field is already subscribed')
          console.log('\n🤔 If webhook still not receiving messages, check:')
          console.log('1. Cloudflare Tunnel is running')
          console.log('2. Next.js dev server is running')
          console.log('3. Webhook URL in Meta is correct')
          console.log('4. Test number is added in Meta')
        }
      } else {
        console.log('\n⚠️  No subscription found!')
        console.log('Running subscription...\n')
        await subscribeWebhook()
      }
    } else {
      console.error('❌ Failed to check subscription')
      console.error('Error:', JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run check first, then subscribe if needed
checkSubscription()
