// Test send message via Vercel production
// Ganti YOUR_VERCEL_URL dengan URL production kamu

const VERCEL_URL = 'https://your-app.vercel.app' // GANTI INI!
const CONTACT_ID = 'YOUR_CONTACT_ID' // GANTI dengan contact ID yang valid

const testProductionEndpoint = async () => {
  try {
    console.log('Testing production endpoint:', VERCEL_URL)
    
    const response = await fetch(`${VERCEL_URL}/api/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactId: CONTACT_ID,
        type: 'TEXT',
        content: 'Test from script'
      })
    })
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('\n✅ Production endpoint WORKS!')
      console.log('Token di Vercel masih valid')
    } else {
      console.log('\n❌ Production endpoint FAILED!')
      console.log('Token di Vercel juga sudah expired')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testProductionEndpoint()
