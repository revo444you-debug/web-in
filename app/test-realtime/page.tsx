'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestRealtimePage() {
  const [status, setStatus] = useState<string>('Checking...')
  const [messages, setMessages] = useState<any[]>([])
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${log}`])
  }

  useEffect(() => {
    addLog('🚀 Starting Realtime test...')

    // Test connection
    const channel = supabase
      .channel('test-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          addLog(`📨 Received: ${payload.eventType} - ${JSON.stringify(payload.new)}`)
          setMessages((prev) => [...prev, payload])
        }
      )
      .subscribe((status) => {
        addLog(`🔌 Status: ${status}`)
        setStatus(status)

        if (status === 'SUBSCRIBED') {
          addLog('✅ Successfully connected to Realtime!')
        } else if (status === 'CHANNEL_ERROR') {
          addLog('❌ Error: Could not connect to Realtime')
        } else if (status === 'TIMED_OUT') {
          addLog('⏱️ Error: Connection timed out')
        }
      })

    return () => {
      addLog('🔌 Disconnecting...')
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Realtime Connection Test</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Connection Status:</h2>
        <p className={`text-lg ${status === 'SUBSCRIBED' ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </p>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Environment Variables:</h2>
        <pre className="text-xs overflow-auto">
          NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ NOT SET'}
          {'\n'}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET'}
        </pre>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Check if status is "SUBSCRIBED" (green)</li>
          <li>Open Supabase SQL Editor and run:
            <pre className="bg-white p-2 mt-1 rounded text-xs">
              INSERT INTO messages (id, "waMessageId", "contactId", content, type, "isFromContact", timestamp)
              VALUES (gen_random_uuid(), 'test-' || gen_random_uuid(), (SELECT id FROM contacts LIMIT 1), 'Test message', 'TEXT', true, NOW());
            </pre>
          </li>
          <li>Watch the logs below - you should see the new message appear instantly</li>
        </ol>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Logs:</h2>
        <div className="bg-white p-3 rounded max-h-64 overflow-auto">
          {logs.length === 0 ? (
            <p className="text-gray-400">No logs yet...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-xs font-mono mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Received Messages ({messages.length}):</h2>
        <div className="bg-white p-3 rounded max-h-64 overflow-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400">No messages received yet...</p>
          ) : (
            <pre className="text-xs">{JSON.stringify(messages, null, 2)}</pre>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Troubleshooting:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• If status is not "SUBSCRIBED", check Supabase dashboard</li>
          <li>• Enable Realtime: Database → Replication → Enable for "messages" table</li>
          <li>• Run SQL script: <code className="bg-yellow-100 px-1">enable-realtime.sql</code></li>
          <li>• Check browser console (F12) for detailed errors</li>
        </ul>
      </div>
    </div>
  )
}
