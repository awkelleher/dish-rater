import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DarkNavBar from '../components/DarkNavBar'

export default async function ProfilePage() {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's ratings
  const { data: ratings } = await supabase
    .from('ratings')
    .select(`
      *,
      dishes (
        id,
        name,
        category,
        restaurants (
          name,
          neighborhood
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const ratingCount = ratings?.length || 0
  const avgRating = ratings?.length 
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0'

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <DarkNavBar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black mb-2">
                  {profile?.full_name || profile?.username}
                </h1>
                {profile?.full_name && (
                  <p className="text-zinc-400">@{profile.username}</p>
                )}
              </div>
              <Link
                href="/profile/edit"
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition-colors"
              >
                Edit Profile
              </Link>
            </div>

            {profile?.bio && (
              <p className="text-zinc-300 mb-6">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold mb-1">{ratingCount}</div>
                <div className="text-sm text-zinc-400">Ratings</div>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold mb-1">{avgRating}</div>
                <div className="text-sm text-zinc-400">Avg Rating</div>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold mb-1">
                  {ratings?.filter(r => r.rating >= 8).length || 0}
                </div>
                <div className="text-sm text-zinc-400">8+ Ratings</div>
              </div>
            </div>
          </div>

          {/* Recent Ratings */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Ratings</h2>
            
            {ratings && ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <Link
                    key={rating.id}
                    href={`/dishes/${rating.dish_id}`}
                    className="block bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-xl p-6 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold mb-1">
                          {rating.dishes?.name}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          {rating.dishes?.restaurants?.name} • {rating.dishes?.restaurants?.neighborhood}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-700 px-3 py-1 rounded-lg">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-bold">{rating.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {rating.review_text && (
                      <p className="text-zinc-300 text-sm mb-3">"{rating.review_text}"</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>{rating.dishes?.category}</span>
                      {rating.would_order_again !== null && (
                        <span>
                          {rating.would_order_again ? '✅ Would order again' : '❌ Would not order again'}
                        </span>
                      )}
                      <span>{new Date(rating.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-12 text-center">
                <p className="text-zinc-400 mb-4">You haven't rated anything yet</p>
                <Link
                  href="/explore"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg font-semibold transition-colors"
                >
                  Start Exploring
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
