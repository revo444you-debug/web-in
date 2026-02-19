'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestBroadcastPage() {
  const [status, setStatus] = useState<string>('Checking...')
  const [messages, setMessages] = useState<any[]>([])
  const [testMessage, setTestMessage] = useState('')

  useEffect(() => {
    console.log('🚀 Starting Broadcast test...')

    // Test dengan Broadcast (lebih simple, tidak perlu database setup)
    const channel = supabase
      .channel('test-broadcast')
      .on('broadcast', { event: 'test' }, (payload) => {
        console.log('📨 Received broadcast:', payload)
        setMessages((prev) => [...prev, payload])
      })
      .subscribe((status) => {
        console.log('🔌 Broadcast status:', status)
        setStatus(status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendTestMessage = () => {
    const payload = {
      message: testMessage,
      timestamp: new Date().toISOString(),
    }

    supabase.channel('test-broadcast').send({
      type: 'broadcast',
      event: 'test',
      payload,
    })

    console.log('📤 Sent broadcast:', payload)
    setTestMessage('')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Broadcast Test (Simpler)</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Connection Status:</h2>
        <p className={`text-lg ${status === 'SUBSCRIBED' ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">📡 Test Broadcast:</h3>
        <p className="text-sm text-blue-700 mb-3">
          Broadcast tidak butuh database setup. Buka 2 tabs dan kirim message dari satu tab, 
          tab lain akan terima instant!
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a test message..."
            className="flex-1 px-3 py-2 border rounded"
            onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
          />
          <button
            onClick={sendTestMessage}
            disabled={!testMessage.trim() || status !== 'SUBSCRIBED'}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Received Messages ({messages.length}):</h2>
        <div className="bg-white p-3 rounded max-h-64 overflow-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400">No messages received yet...</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="mb-2 p-2 bg-gray-50 rounded">
                <pre className="text-xs">{JSON.stringify(msg, null, 2)}</pre>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
        <h3 className="font-semibold text-green-800 mb-2">✅ Instructions:</h3>
        <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
          <li>Wait for status to be "SUBSCRIBED"</li>
          <li>Open this page in 2 browser tabs</li>
          <li>Type a message in Tab 1 and click Send</li>
          <li>Tab 2 should receive the message instantly!</li>
        </ol>
      </div>
    </div>
  )
}
