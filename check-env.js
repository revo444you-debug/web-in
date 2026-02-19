// Script untuk check environment variables
require('dotenv').config()

console.log('=== Environment Variables Check ===\n')

const token = process.env.WABA_ACCESS_TOKEN
const phoneId = process.env.WABA_PHONE_NUMBER_ID

console.log('WABA_PHONE_NUMBER_ID:')
console.log('  Value:', phoneId)
console.log('  Length:', phoneId?.length)
console.log('  Has quotes:', phoneId?.includes('"'))
console.log('')

console.log('WABA_ACCESS_TOKEN:')
console.log('  Exists:', !!token)
console.log('  Length:', token?.length)
console.log('  First 30 chars:', token?.substring(0, 30))
console.log('  Last 10 chars:', token?.substring(token.length - 10))
console.log('  Has whitespace:', /\s/.test(token || ''))
console.log('  Has newline:', token?.includes('\n'))
console.log('  Has quotes:', token?.includes('"'))
console.log('')

// Check for hidden characters
if (token) {
  const bytes = Buffer.from(token)
  console.log('Token bytes (first 50):', bytes.slice(0, 50))
  console.log('Token bytes (last 20):', bytes.slice(-20))
}

console.log('\n=== Test WhatsApp API ===\n')

// Test API call
const testAPI = async () => {
  try {
    const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`
    
    console.log('Testing API call to:', url)
    console.log('Using token:', token?.substring(0, 30) + '...')
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: '1234567890', // Dummy number
        type: 'text',
        text: { body: 'test' }
      })
    })
    
    console.log('Response status:', response.status)
    console.log('Response statusText:', response.statusText)
    
    const data = await response.json()
    console.log('Response body:', JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testAPI()
