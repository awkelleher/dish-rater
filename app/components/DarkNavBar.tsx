import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import UserBadge from './UserBadge'

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

  // Get all unique neighborhoods
  const { data: neighborhoods } = await supabase
    .from('restaurants')
    .select('neighborhood')
    .eq('city', 'Jersey City')
    .not('neighborhood', 'is', null)
    .order('neighborhood')

  const uniqueNeighborhoods = [...new Set(neighborhoods?.map(r => r.neighborhood) || [])].sort()

  // Get all unique dish categories with counts
  const { data: categories } = await supabase
    .from('dishes')
    .select('category')
    .not('category', 'is', null)

  const categoryCounts = categories?.reduce((acc, dish) => {
    if (dish.category) {
      acc[dish.category] = (acc[dish.category] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>) || {}

  const popularCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([category]) => category)

  return (
    <nav className="sticky top-0 z-50 bg-background border-b-4 border-foreground shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
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
            {/* Best Of Dropdown with Sub-menus */}
            <div className="relative group">
              <Link
                href="/best-of"
                className="px-4 py-2 text-sm font-bold text-foreground hover:bg-muted border-2 border-transparent hover:border-foreground transition-all flex items-center gap-1 uppercase tracking-wide"
              >
                Best Of
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute left-0 mt-1 w-56 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {/* Neighborhoods Sub-dropdown */}
                  <div className="relative group/neighborhoods">
                    <div className="px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-bold flex items-center justify-between cursor-pointer uppercase tracking-wide border-b-2 border-border">
                      Neighborhoods
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="absolute left-full top-0 ml-1 w-56 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] opacity-0 invisible group-hover/neighborhoods:opacity-100 group-hover/neighborhoods:visible transition-all duration-200">
                      <div className="py-2">
                        {uniqueNeighborhoods.map((neighborhood) => (
                          <Link
                            key={neighborhood}
                            href={`/best-of/area/${encodeURIComponent(neighborhood)}`}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-bold uppercase tracking-wide"
                          >
                            {neighborhood}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Food Categories Sub-dropdown */}
                  <div className="relative group/food">
                    <div className="px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-bold flex items-center justify-between cursor-pointer uppercase tracking-wide border-b-2 border-border">
                      Food Categories
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="absolute left-full top-0 ml-1 w-56 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] opacity-0 invisible group-hover/food:opacity-100 group-hover/food:visible transition-all duration-200">
                      <div className="py-2">
                        {popularCategories.map((category) => (
                          <Link
                            key={category}
                            href={`/best-of/food/${encodeURIComponent(category)}`}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-bold uppercase tracking-wide"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-foreground my-2"></div>
                  <Link href="/best-of" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-bold uppercase tracking-wide">
                    View All
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/hot-sauces"
              className="px-4 py-2 text-sm font-bold text-foreground hover:bg-muted border-2 border-transparent hover:border-foreground transition-all flex items-center gap-1 uppercase tracking-wide"
            >
              🌶️ Hot Sauces
            </Link>

            <Link
              href="/restaurants/new"
              className="px-4 py-2 text-sm font-bold text-primary hover:bg-muted border-2 border-transparent hover:border-foreground transition-all uppercase tracking-wide"
            >
              Add Dish
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <UserBadge
                userId={user.id}
                fullName={profile?.full_name}
                username={profile?.username || user.email?.split('@')[0] || 'User'}
                variant="dark"
              />
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wide"
              >
                Log in
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-foreground hover:bg-muted border-2 border-transparent hover:border-foreground transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (hidden by default - would need client component for toggle) */}
        <div className="md:hidden pb-4 space-y-1 hidden">
          <Link
            href="/best-of"
            className="block px-4 py-2 text-sm font-bold text-foreground hover:bg-muted transition-colors uppercase tracking-wide"
          >
            Best Of
          </Link>
          <Link
            href="/hot-sauces"
            className="block px-4 py-2 text-sm font-bold text-foreground hover:bg-muted transition-colors uppercase tracking-wide"
          >
            🌶️ Hot Sauces
          </Link>
          <Link
            href="/restaurants/new"
            className="block px-4 py-2 text-sm font-bold text-primary hover:bg-muted transition-colors uppercase tracking-wide"
          >
            Add Dish
          </Link>
        </div>
      </div>
    </nav>
  )
}
