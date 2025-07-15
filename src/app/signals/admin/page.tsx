'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Lock, ArrowLeft, Send } from 'lucide-react'

export default function AdminSignals() {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    checkAuth()
  }, [])

  // Check for existing unlock
  useEffect(() => {
    const storedUnlock = sessionStorage.getItem('adminUnlocked')
    if (storedUnlock === 'true') {
      setIsUnlocked(true)
    }
  }, [])

  // Load messages
  useEffect(() => {
    if (!isUnlocked) return

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('signal_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setMessages(data || [])
    }

    fetchMessages()

    const channel = supabase.channel('realtime-messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'signal_messages'
      }, fetchMessages)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [isUnlocked])

  const handleUnlock = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      setIsUnlocked(true)
      sessionStorage.setItem('adminUnlocked', 'true')
      if (inputRef.current) inputRef.current.focus()
    } else {
      alert('Incorrect admin password')
    }
  }

  const handleLock = () => {
    setIsUnlocked(false)
    sessionStorage.removeItem('adminUnlocked')
    setPassword('')
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return

    const { error } = await supabase
      .from('signal_messages')
      .insert({
        text: newMessage,
        sender_id: userId
      })

    if (!error) setNewMessage('')
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
          <div className="text-center space-y-2">
            <Lock className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
            <p className="text-gray-700">Enter the admin password to continue</p>
          </div>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="Enter password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          />
          
          <button
            onClick={handleUnlock}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Unlock Panel
          </button>
          
          <button
            onClick={() => router.push('/signals')}
            className="w-full py-2.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Signals
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-300 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Signal Panel</h1>
          <button
            onClick={handleLock}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
          >
            <Lock className="w-5 h-5" /> Lock
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="max-w-4xl mx-auto p-4 pb-20">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`p-4 rounded-xl shadow-sm ${
                message.sender_id === userId 
                  ? 'bg-blue-600 text-white rounded-br-none ml-10' 
                  : 'bg-white border border-gray-300 text-gray-900 rounded-bl-none mr-10'
              }`}
            >
              <p className="whitespace-pre-line font-medium">{message.text}</p>
              <div className={`mt-2 text-xs ${
                message.sender_id === userId ? 'text-blue-100' : 'text-gray-600'
              }`}>
                {new Date(message.created_at).toLocaleString()}
                {message.edited && <span className="italic ml-2">(edited)</span>}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your signal..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}