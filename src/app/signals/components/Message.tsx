'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import { User, Edit2, Trash2, Check, X } from 'lucide-react'

export default function Message({ message, isCurrentUser }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.text)

  return (
    <div className={`relative group ${isCurrentUser ? 'pl-10' : 'pr-10'}`}>
      <div className={`p-4 rounded-xl ${
        isCurrentUser 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-full ${
            isCurrentUser ? 'bg-blue-700' : 'bg-gray-100'
          }`}>
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium">
              {message.profile?.username || 'Admin'}
            </div>
            <div className="text-xs opacity-80">
              {dayjs(message.created_at).format('MMM D, h:mm A')}
              {message.edited && <span className="ml-1 italic">(edited)</span>}
            </div>
          </div>
        </div>

        <div className="whitespace-pre-line text-gray-800">
          {message.text}
        </div>

        {isCurrentUser && (
          <div className={`absolute ${isCurrentUser ? 'left-0' : 'right-0'} top-0 opacity-0 group-hover:opacity-100 transition flex gap-1`}>
            <button
              onClick={() => {
                setIsEditing(true)
                setEditText(message.text)
              }}
              className="p-2 text-blue-600 bg-white rounded-full shadow hover:bg-gray-50"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => confirm('Delete this message?') && console.log('Delete:', message.id)}
              className="p-2 text-red-600 bg-white rounded-full shadow hover:bg-gray-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}