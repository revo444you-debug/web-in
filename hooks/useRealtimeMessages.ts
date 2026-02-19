import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Message = {
  id: string
  content: string | null
  type: string
  mediaUrl: string | null
  caption: string | null
  timestamp: string
  isFromContact: boolean
  contactId: string
  sender: {
    email: string
    role: string
  } | null
}

export function useRealtimeMessages(contactId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!contactId) {
      setMessages([])
      setLoading(false)
      return
    }

    // Fetch initial messages
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/messages?contactId=${contactId}`)
        const data = await res.json()
        
        // Sort by timestamp on client side to ensure correct order
        const sorted = data.sort((a: Message, b: Message) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
        
        setMessages(sorted)
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`messages:${contactId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `contactId=eq.${contactId}`,
        },
        (payload) => {
          console.log('📨 New message received:', payload.new)
          const newMessage = payload.new as Message
          
          setMessages((prev) => {
            // Check if message already exists (by ID)
            const exists = prev.some((msg) => msg.id === newMessage.id)
            if (exists) {
              console.log('⚠️ Message already exists, skipping')
              return prev
            }
            
            // Remove optimistic message with same content
            const withoutOptimistic = prev.filter((msg) => {
              // Keep all non-temporary messages
              if (!msg.id.toString().startsWith('temp-')) return true
              
              // Remove temporary message if content matches and is outgoing
              const isSameContent = msg.content === newMessage.content && !newMessage.isFromContact
              if (isSameContent) {
                console.log('🔄 Replacing optimistic message:', msg.id, 'with real:', newMessage.id)
                return false
              }
              
              return true
            })
            
            // Add the real message at the end (messages should already be sorted from API)
            return [...withoutOptimistic, newMessage]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `contactId=eq.${contactId}`,
        },
        (payload) => {
          console.log('📝 Message updated:', payload.new)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? (payload.new as Message) : msg
            )
          )
        }
      )
      .subscribe((status) => {
        console.log('🔌 Realtime subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to messages channel')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to messages channel')
        } else if (status === 'TIMED_OUT') {
          console.error('⏱️ Subscription timed out')
        }
      })

    // Cleanup
    return () => {
      supabase.removeChannel(channel)
    }
  }, [contactId])

  return { messages, loading, setMessages }
}
