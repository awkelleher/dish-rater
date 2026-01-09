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
  const [currentGift, setCurrentGift] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const displayName = fullName || username || 'User'
  const initial = displayName.charAt(0).toUpperCase()

  // Map gift types to emojis
  const giftEmojis: { [key: string]: string } = {
    egg: '🥚',
    chick: '🐣',
    chicken: '🐔',
    // Add more gift types as needed
  }

  useEffect(() => {
    // Fetch user stats and gift when popup opens
    if (isOpen && userId) {
      async function fetchStatsAndGift() {
        // Fetch ratings
        const { data: ratings } = await supabase
          .from('ratings')
          .select('rating')
          .eq('user_id', userId)

        if (ratings) {
          const count = ratings.length
          const avg = count > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / count
            : 0
          setStats({ ratingCount: count, avgRating: avg })
        }

        // Fetch current gift
        const { data: profile } = await supabase
          .from('profiles')
          .select('current_gift')
          .eq('id', userId)
          .single()

        if (profile) {
          setCurrentGift(profile.current_gift)
        }
      }
      fetchStatsAndGift()
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
        className="w-10 h-10 border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
        aria-label="User menu"
      >
        {initial}
      </button>

      {isOpen && (
        <div
          ref={cardRef}
          className="absolute right-0 mt-2 w-64 bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          <div className="p-4 border-b-2 border-border bg-muted">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">
                Hi, {displayName}!
              </h3>
              {currentGift && (
                <div className="text-3xl animate-bounce-slow" title={`Your ${currentGift}`}>
                  {giftEmojis[currentGift] || '🎁'}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-foreground">
              <span className="text-sm font-bold uppercase tracking-wide">Total Ratings:</span>
              <span className="font-bold">{stats.ratingCount}</span>
            </div>

            <div className="flex justify-between items-center text-foreground">
              <span className="text-sm font-bold uppercase tracking-wide">Average Rating:</span>
              <span className="font-bold">{stats.avgRating.toFixed(1)}</span>
            </div>
          </div>

          <div className="border-t-2 border-border">
            <a
              href="/profile"
              className="block px-4 py-3 text-sm font-bold text-foreground hover:bg-muted transition-colors uppercase tracking-wide"
            >
              View Profile
            </a>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-full text-left px-4 py-3 text-sm font-bold text-destructive hover:bg-muted transition-colors uppercase tracking-wide"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
