import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Contact = {
  id: string
  waId: string
  name: string | null
  phoneNumber: string
  profilePic: string | null
  label: {
    id: string
    name: string
    color: string
  }
  messages: Array<{
    id: string
    content: string | null
    type: string
    timestamp: string
    isFromContact: boolean
  }>
}

export function useRealtimeContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial contacts
    const fetchContacts = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/contacts')
        const data = await res.json()
        setContacts(data)
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()

    // Subscribe to contact updates only (not messages)
    const channel = supabase
      .channel('contacts-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contacts',
        },
        (payload) => {
          console.log('👤 Contact updated:', payload.new)
          // Update specific contact immediately
          setContacts((prev) =>
            prev.map((contact) =>
              contact.id === payload.new.id
                ? { ...contact, ...payload.new }
                : contact
            )
          )
        }
      )
      .subscribe((status) => {
        console.log('🔌 Realtime contacts subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to contacts channel')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to contacts channel')
        } else if (status === 'TIMED_OUT') {
          console.error('⏱️ Contacts subscription timed out')
        }
      })

    // Cleanup
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { contacts, loading, setContacts }
}
