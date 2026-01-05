import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Header() {
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
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/explore" className="text-2xl font-bold hover:text-gray-700 transition-colors">
          DishRate
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/explore" className="text-gray-700 hover:text-black transition-colors">
            Explore
          </Link>
          <Link href="/restaurants/new" className="text-gray-700 hover:text-black transition-colors">
            Add Dish
          </Link>
          {user && profile ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-medium">
                {profile.full_name || profile.username}
              </span>
            </div>
          ) : (
            <Link 
              href="/auth/login" 
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
