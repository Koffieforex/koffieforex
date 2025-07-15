'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface AdminLockProps {
  onUnlock: () => void
}

export default function AdminLock({ onUnlock }: AdminLockProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUnlock = async () => {
    if (!password) {
      setError('Please enter the admin password')
      return
    }

    setLoading(true)
    setError('')

    // In a real app, you might want to verify this server-side
    if (password === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      onUnlock()
    } else {
      setError('Incorrect admin password')
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Admin Access Required</h1>
        <p className="text-gray-600 text-center">
          Enter the admin password to access the signal panel
        </p>
        
        <div className="space-y-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        
        <button
          onClick={handleUnlock}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Unlock'}
        </button>
      </div>
    </div>
  )
}