import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DarkNavBar from '../components/DarkNavBar'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string
    neighborhood?: string
    limit?: string
  }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const view = params.view || 'all'
  const selectedNeighborhood = params.neighborhood
  const limit = params.limit ? parseInt(params.limit) : 50

  // Fetch dishes based on view
  let dishes: any[] = []

  if (view === 'neighborhood' && selectedNeighborhood) {
    // Filter by specific area
    const { data, error } = await supabase
      .from('dishes')
      .select(`
        *,
        restaurants!inner (
          id,
          name,
          area,
          city
        )
      `)
      .eq('restaurants.city', 'Jersey City')
      .eq('restaurants.area', selectedNeighborhood)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching dishes by area:', error)
    }
    console.log('Filtering by area:', selectedNeighborhood)
    console.log('Found dishes:', data?.length || 0)

    dishes = data || []
  } else if (view === 'best-of') {
    // Show all rated dishes (will need to join with ratings table in the future)
    const { data } = await supabase
      .from('dishes')
      .select(`
        *,
        restaurants!inner (
          id,
          name,
          area,
          city
        )
      `)
      .eq('restaurants.city', 'Jersey City')
      .order('created_at', { ascending: false })
      .limit(50)
    dishes = data || []
  } else {
    // Show all dishes
    const { data } = await supabase
      .from('dishes')
      .select(`
        *,
        restaurants!inner (
          id,
          name,
          area,
          city
        )
      `)
      .eq('restaurants.city', 'Jersey City')
      .order('created_at', { ascending: false })
      .limit(50)
    dishes = data || []
  }

  // Get unique areas for the area browser
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('area')
    .eq('city', 'Jersey City')
    .not('area', 'is', null)

  const uniqueAreas = [...new Set(restaurants?.map(r => r.area) || [])]

  // All areas from the form
  const allAreas = [
    'Downtown',
    'Journal Square',
    'Heights',
    'West Side',
    'Bergen-Lafayette',
    'Greenville'
  ]

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <DarkNavBar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Main Landing - Explore Options */}
        {view === 'all' && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">🍽️ Explore</h1>
              <p className="text-zinc-400">Discover the best food in Jersey City</p>
            </div>

            {/* Explore Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/explore?view=neighborhood"
                className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg hover:shadow-xl transition-all p-8 text-white"
              >
                <div className="text-5xl mb-4">📍</div>
                <h3 className="text-2xl font-bold mb-2">By Area</h3>
                <p className="text-orange-100">Explore the best dishes in your area</p>
              </Link>

              <Link
                href="/explore?view=best-of"
                className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg hover:shadow-xl transition-all p-8 text-white"
              >
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold mb-2">Recent Dishes</h3>
                <p className="text-yellow-100">See the latest dishes added to Jersey City</p>
              </Link>
            </div>
          </>
        )}

        {/* Area Browser */}
        {view === 'neighborhood' && !selectedNeighborhood && (
          <>
            <div className="mb-8">
              <Link href="/explore" className="text-sm text-zinc-400 hover:text-white mb-2 inline-block">
                ← Back to Explore
              </Link>
              <h1 className="text-4xl font-bold mb-2">📍 Browse by Area</h1>
              <p className="text-zinc-400">Select an area to see the best dishes in that part of Jersey City</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allAreas.map((area) => {
                const hasDishes = uniqueAreas.includes(area)
                return (
                  <Link
                    key={area}
                    href={`/explore?view=neighborhood&neighborhood=${encodeURIComponent(area)}`}
                    className={`rounded-lg shadow-sm hover:shadow-md transition-all p-8 text-center border-2 ${
                      hasDishes
                        ? 'bg-white hover:border-orange-400 text-gray-900'
                        : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600 text-zinc-400'
                    }`}
                  >
                    <div className="text-2xl font-bold mb-2">{area}</div>
                    {!hasDishes && (
                      <div className="text-sm text-zinc-500">No dishes yet</div>
                    )}
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* Area Results */}
        {view === 'neighborhood' && selectedNeighborhood && (
          <>
            <div className="mb-8">
              <Link href="/explore?view=neighborhood" className="text-sm text-zinc-400 hover:text-white mb-2 inline-block">
                ← All Areas
              </Link>
              <h1 className="text-4xl font-bold mb-4">📍 {selectedNeighborhood}</h1>
            </div>
          </>
        )}

        {/* Best Of Header */}
        {view === 'best-of' && (
          <>
            <div className="mb-8">
              <Link href="/explore" className="text-sm text-zinc-400 hover:text-white mb-2 inline-block">
                ← Back to Explore
              </Link>
              <h1 className="text-4xl font-bold mb-4">⭐ Recent Dishes</h1>
            </div>
          </>
        )}

        {/* Dish Grid (shown for all filtered views) */}
        {view !== 'all' && view !== 'neighborhood' || (view === 'neighborhood' && selectedNeighborhood) ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes && dishes.length > 0 ? (
              dishes.map((dish) => (
                <Link
                  key={dish.id}
                  href={`/dishes/${dish.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{dish.name}</h3>

                  <p className="text-sm text-gray-600 mb-3">{dish.restaurants.name}</p>

                  {dish.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {dish.description}
                    </p>
                  )}

                  {dish.restaurants.area && (
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {dish.restaurants.area}
                      </span>
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  🍽️ No dishes found
                </p>
                <p className="text-gray-500 mb-6">
                  {view === 'best-of' 
                    ? 'No dishes with 8+ rating yet. Be the first to rate!' 
                    : selectedNeighborhood
                    ? `No dishes in ${selectedNeighborhood} yet. Add one!`
                    : 'Be the first to add a dish!'}
                </p>
                <Link
                  href="/restaurants/new"
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg inline-block hover:from-orange-700 hover:to-red-700 font-medium"
                >
                  Add a Dish
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  )
}
