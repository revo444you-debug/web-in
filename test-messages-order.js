// Test messages order dari API
// Ganti CONTACT_ID dengan ID contact yang kamu test

const CONTACT_ID = '6285175434869' // GANTI INI!

const testMessagesOrder = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/messages?contactId=${CONTACT_ID}`)
    const messages = await response.json()
    
    console.log('=== Messages Order Test ===\n')
    console.log('Total messages:', messages.length)
    console.log('\nMessages in order:\n')
    
    messages.forEach((msg, index) => {
      const time = new Date(msg.timestamp).toLocaleTimeString()
      const from = msg.isFromContact ? 'Contact' : 'You'
      console.log(`${index + 1}. [${time}] ${from}: ${msg.content}`)
    })
    
    console.log('\n=== Timestamp Check ===\n')
    
    // Check if timestamps are in order
    let isOrdered = true
    for (let i = 1; i < messages.length; i++) {
      const prev = new Date(messages[i-1].timestamp).getTime()
      const curr = new Date(messages[i].timestamp).getTime()
      
      if (prev > curr) {
        console.log(`❌ Out of order at index ${i}:`)
        console.log(`   ${i-1}: ${messages[i-1].timestamp} (${messages[i-1].content})`)
        console.log(`   ${i}: ${messages[i].timestamp} (${messages[i].content})`)
        isOrdered = false
      }
    }
    
    if (isOrdered) {
      console.log('✅ All messages are in correct timestamp order')
    } else {
      console.log('\n❌ Messages are NOT in correct order!')
      console.log('This is the problem causing grouping issue')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testMessagesOrder()
