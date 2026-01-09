'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import UserBadge from './UserBadge'
import { Button } from '@/components/ui/button'

export default function ClientThemedNavBar() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', user.id)
          .maybeSingle()
        setProfile(data)
      }
    }
    fetchUser()
  }, [])

  return (
    <header className="border-b-4 border-foreground py-4 px-6 bg-background">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">HOOD EATS</h1>
          <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wide">Bite the Block</p>
        </Link>

        <nav className="flex gap-4 items-center">
          <Link href="/best-of">
            <Button
              variant="outline"
              className="bg-background text-foreground hover:bg-muted font-bold border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Explore
            </Button>
          </Link>
          <Link href="/restaurants/new">
            <Button
              variant="outline"
              className="bg-background text-foreground hover:bg-muted font-bold border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Add Dish
            </Button>
          </Link>
          {user ? (
            <UserBadge
              userId={user.id}
              fullName={profile?.full_name}
              username={profile?.username || user.email?.split('@')[0] || 'User'}
              variant="light"
            />
          ) : (
            <Link href="/auth/login">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Log In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
