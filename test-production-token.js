// Test dengan token dari production
// Jalankan: node test-production-token.js YOUR_PRODUCTION_TOKEN

const token = process.argv[2]

if (!token) {
  console.error('Usage: node test-production-token.js YOUR_TOKEN')
  process.exit(1)
}

console.log('Testing token:', token.substring(0, 30) + '...')
console.log('Token length:', token.length)

const testAPI = async () => {
  try {
    const url = 'https://graph.facebook.com/v21.0/988128274384219/messages'
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: '1234567890',
        type: 'text',
        text: { body: 'test' }
      })
    })
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (response.status === 200 || response.status === 201) {
      console.log('\n✅ Token VALID!')
      console.log('Update your .env with this token')
    } else if (response.status === 401) {
      console.log('\n❌ Token INVALID or EXPIRED')
      console.log('Generate new token from Meta dashboard')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testAPI()
