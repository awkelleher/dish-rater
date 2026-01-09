import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Database } from '@/types/database.types'
import UserBadge from './UserBadge'
import { Button } from '@/components/ui/button'

type Profile = Database['public']['Tables']['profiles']['Row'] | null

export default async function ThemedNavBar() {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  // Get user profile if logged in
  let profile: Profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, full_name')
      .eq('id', user.id)
      .maybeSingle()
    profile = data ?? null
  }

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
              fullName={(profile as Profile)?.full_name}
              username={(profile as Profile)?.username || user.email?.split('@')[0] || 'User'}
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
