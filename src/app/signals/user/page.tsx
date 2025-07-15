'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Message from '../components/Message'
import Link from 'next/link'
import { ArrowLeft, Bell, BellOff, Settings } from 'lucide-react'

dayjs.extend(relativeTime)

export default function UserSignals() {
  const [messages, setMessages] = useState<SignalMessage[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('signal_messages')
        .select('*, profile:profiles(username, telegram)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching messages:', error)
        return
      }
      setMessages(data as SignalMessage[])
    }

    fetchMessages()

    const channel = supabase
      .channel('signal_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signal_messages' }, 
        (payload) => handleRealtimeUpdate(payload)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      supabase
        .from('signal_messages')
        .select('*, profile:profiles(username, telegram)')
        .eq('id', payload.new.id)
        .single()
        .then(({ data }) => {
          if (data) setMessages(prev => [data as SignalMessage, ...prev])
          if (notificationsEnabled) {
            new Notification('New Forex Signal', { body: payload.new.text })
          }
        })
    }
    // ... other event types
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/signals" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </span>
            Forex Signals
          </h1>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p className="text-lg font-medium">No signals yet</p>
              <p className="text-sm">Check back later for new trading signals</p>
            </div>
          ) : (
            <div className="divide-y divide-blue-50">
              {messages.map((message) => (
                <div key={message.id} className="p-4 hover:bg-blue-50/50 transition-colors">
                  <Message message={message} isCurrentUser={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Watermark */}
      <div className="fixed bottom-4 right-4 text-xs text-blue-200/50">
        koffieFX • {new Date().getFullYear()}
      </div>
    </div>
  )
}