import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row'] | null

export default async function Header() {
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
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src="/logo.svg" 
            alt="Hood Eats" 
            width={120} 
            height={120}
            className="w-auto h-12"
          />
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/explore" className="text-gray-700 hover:text-black transition-colors font-medium">
            Explore
          </Link>
          <Link href="/restaurants/new" className="text-gray-700 hover:text-black transition-colors font-medium">
            Add Dish
          </Link>
          {user && profile ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-medium">
                {(profile as Profile)?.full_name || (profile as Profile)?.username}
              </span>
            </div>
          ) : (
            <Link 
              href="/auth/login" 
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors font-medium"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
