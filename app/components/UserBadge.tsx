'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserBadgeProps {
  userId: string
  fullName?: string | null
  username?: string | null
  variant?: 'light' | 'dark'
}

export default function UserBadge({ userId, fullName, username, variant = 'light' }: UserBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState({ ratingCount: 0, avgRating: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const displayName = fullName || username || 'User'
  const initial = displayName.charAt(0).toUpperCase()

  useEffect(() => {
    // Fetch user stats when popup opens
    if (isOpen && userId) {
      async function fetchStats() {
        const { data: ratings } = await supabase
          .from('ratings')
          .select('overall_rating')
          .eq('user_id', userId)

        if (ratings) {
          const count = ratings.length
          const avg = count > 0
            ? ratings.reduce((sum, r) => sum + r.overall_rating, 0) / count
            : 0
          setStats({ ratingCount: count, avgRating: avg })
        }
      }
      fetchStats()
    }
  }, [isOpen, userId, supabase])

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const isDark = variant === 'dark'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDark ? 'focus:ring-orange-500 focus:ring-offset-black' : 'focus:ring-orange-400 focus:ring-offset-white'
        }`}
        aria-label="User menu"
      >
        {initial}
      </button>

      {isOpen && (
        <div
          ref={cardRef}
          className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg border overflow-hidden ${
            isDark
              ? 'bg-zinc-900 border-zinc-700'
              : 'bg-white border-gray-200'
          }`}
          style={{ zIndex: 9999 }}
        >
          <div className={`p-4 border-b ${isDark ? 'border-zinc-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Hi, {displayName}!
            </h3>
          </div>

          <div className="p-4 space-y-3">
            <div className={`flex justify-between items-center ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              <span className="text-sm">Total Ratings:</span>
              <span className="font-semibold">{stats.ratingCount}</span>
            </div>

            <div className={`flex justify-between items-center ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              <span className="text-sm">Average Rating:</span>
              <span className="font-semibold">{stats.avgRating.toFixed(1)}</span>
            </div>
          </div>

          <div className={`border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'}`}>
            <a
              href="/profile"
              className={`block px-4 py-3 text-sm font-medium transition-colors ${
                isDark
                  ? 'text-zinc-300 hover:bg-zinc-800'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              View Profile
            </a>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  isDark
                    ? 'text-red-400 hover:bg-zinc-800'
                    : 'text-red-600 hover:bg-gray-50'
                }`}
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
