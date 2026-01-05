import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function DarkNavBar() {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get user profile if logged in
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, full_name')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-zinc-800 backdrop-blur-sm bg-black/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.svg" 
              alt="Hood Eats" 
              width={100} 
              height={100}
              className="w-auto h-10"
            />
          </Link>

          {/* Main Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/explore?view=neighborhood"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
            >
              Neighborhoods
            </Link>
            
            <Link
              href="/explore?view=best-of"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
            >
              Best Of
            </Link>

            <Link
              href="/hot-sauces"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors flex items-center gap-1"
            >
              🌶️ Hot Sauces
            </Link>

            <Link
              href="/restaurants/new"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
            >
              Add Dish
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {user && profile ? (
              <Link
                href="/profile"
                className="px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
              >
                {profile.full_name || profile.username}
              </Link>
            ) : (
              <Link 
                href="/auth/login" 
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg transition-colors"
              >
                Log in
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-zinc-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (hidden by default - would need client component for toggle) */}
        <div className="md:hidden pb-4 space-y-1 hidden">
          <Link
            href="/explore?view=neighborhood"
            className="block px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg"
          >
            Neighborhoods
          </Link>
          <Link
            href="/explore?view=best-of"
            className="block px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg"
          >
            Best Of
          </Link>
          <Link
            href="/hot-sauces"
            className="block px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg"
          >
            🌶️ Hot Sauces
          </Link>
          <Link
            href="/restaurants/new"
            className="block px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg"
          >
            Add Dish
          </Link>
        </div>
      </div>
    </nav>
  )
}
