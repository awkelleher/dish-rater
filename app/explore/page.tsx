import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Header from '../components/Header'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { view?: string; neighborhood?: string }
}) {
  const supabase = await createClient()
  const view = searchParams.view || 'all'
  const selectedNeighborhood = searchParams.neighborhood

  // Fetch tacos based on view
  let topDishes: any[] = []

  if (view === 'neighborhood' && selectedNeighborhood) {
    // Filter by specific neighborhood
    const { data } = await supabase
      .from('dishes')
      .select(`
        *,
        restaurants!inner (
          id,
          name,
          neighborhood,
          city
        )
      `)
      .eq('category', 'Taco')
      .eq('restaurants.city', 'Jersey City')
      .eq('restaurants.neighborhood', selectedNeighborhood)
      .order('rating_count', { ascending: false })
      .order('average_rating', { ascending: false })
      .limit(50)
    topDishes = data || []
  } else if (view === 'top-rated') {
    // Only show highly rated dishes (8+ stars with at least 1 rating)
    const { data } = await supabase
      .from('dishes')
      .select(`
        *,
        restaurants!inner (
          id,
          name,
          neighborhood,
          city
        )
      `)
      .eq('category', 'Taco')
      .eq('restaurants.city', 'Jersey City')
      .gte('average_rating', 8)
      .gte('rating_count', 1)
      .order('average_rating', { ascending: false })
      .order('rating_count', { ascending: false })
      .limit(50)
    topDishes = data || []
  } else {
    // Show all tacos
    const { data } = await supabase
      .from('dishes')
      .select(`
        *,
        restaurants!inner (
          id,
          name,
          neighborhood,
          city
        )
      `)
      .eq('category', 'Taco')
      .eq('restaurants.city', 'Jersey City')
      .order('rating_count', { ascending: false })
      .order('average_rating', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)
    topDishes = data || []
  }

  // Get unique neighborhoods for the neighborhood browser
  const { data: neighborhoods } = await supabase
    .from('restaurants')
    .select('neighborhood')
    .eq('city', 'Jersey City')
    .not('neighborhood', 'is', null)
    .order('neighborhood')

  const uniqueNeighborhoods = [...new Set(neighborhoods?.map(r => r.neighborhood) || [])]

  // Group neighborhoods by area
  const neighborhoodsByArea = {
    'Bergen-Lafayette': ['Beacon', 'Bergen Hill', 'Communipaw', 'The Junction', 'Jackson Hill'],
    'The Heights': ['Central Avenue', 'Chelsea', 'Sparrow Hill', 'Transfer Station', 'Washington Village', 'Western Slope'],
    'Historic Downtown': ['Grove Street', 'Hamilton Park', 'Harsimus', 'Boyle Plaza', 'Van Vorst Park', 'The Village', 'West End', 'Hudson Waterfront', 'Exchange Place', 'Harborside Financial Center', 'Newport', 'Paulus Hook', 'Powerhouse Arts District'],
    'Greenville': ['Curries Woods', 'Port Liberte', 'Country Village', 'Claremont'],
    'Journal Square': ['Bergen Square', 'Five Corners', 'The Hilltop', 'India Square', 'The Island', 'Marion', 'McGinley Square'],
    'West Side': ['Hackensack Riverfront', 'Croxton', "Droyer's Point", 'Lincoln Park', 'Riverbend', 'Society Hill']
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* View Selection */}
        {view === 'all' && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">🌮 Explore Tacos</h1>
              <p className="text-gray-600">Discover the best tacos in Jersey City</p>
            </div>

            {/* Browse Options */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Link
                href="/explore?view=all"
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-2 border-black"
              >
                <div className="text-4xl mb-3">🌮</div>
                <h3 className="text-xl font-bold mb-2">All Tacos</h3>
                <p className="text-gray-600 text-sm">Browse all tacos in Jersey City</p>
              </Link>

              <Link
                href="/explore?view=neighborhood"
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-2 border-transparent hover:border-gray-200"
              >
                <div className="text-4xl mb-3">📍</div>
                <h3 className="text-xl font-bold mb-2">By Neighborhood</h3>
                <p className="text-gray-600 text-sm">Explore tacos in your area</p>
              </Link>

              <Link
                href="/explore?view=top-rated"
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-2 border-transparent hover:border-gray-200"
              >
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="text-xl font-bold mb-2">Top Rated</h3>
                <p className="text-gray-600 text-sm">Best of the best (8+ rating)</p>
              </Link>
            </div>
          </>
        )}

        {/* Neighborhood Browser */}
        {view === 'neighborhood' && !selectedNeighborhood && (
          <>
            <div className="mb-8">
              <Link href="/explore" className="text-sm text-gray-600 hover:text-black mb-2 inline-block">
                ← Back to Explore
              </Link>
              <h1 className="text-4xl font-bold mb-2">📍 Browse by Neighborhood</h1>
              <p className="text-gray-600">Select a neighborhood to see tacos in that area</p>
            </div>

            <div className="space-y-8">
              {Object.entries(neighborhoodsByArea).map(([area, hoods]) => {
                const hoodsWithTacos = hoods.filter(h => uniqueNeighborhoods.includes(h))
                if (hoodsWithTacos.length === 0) return null
                
                return (
                  <div key={area}>
                    <h2 className="text-2xl font-bold mb-4">{area}</h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {hoodsWithTacos.map((hood) => (
                        <Link
                          key={hood}
                          href={`/explore?view=neighborhood&neighborhood=${encodeURIComponent(hood)}`}
                          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center"
                        >
                          <div className="font-semibold text-gray-900">{hood}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Neighborhood Results */}
        {view === 'neighborhood' && selectedNeighborhood && (
          <>
            <div className="mb-8">
              <Link href="/explore?view=neighborhood" className="text-sm text-gray-600 hover:text-black mb-2 inline-block">
                ← All Neighborhoods
              </Link>
              <h1 className="text-4xl font-bold mb-2">📍 {selectedNeighborhood}</h1>
              <p className="text-gray-600">Tacos in {selectedNeighborhood}</p>
            </div>
          </>
        )}

        {/* Top Rated Header */}
        {view === 'top-rated' && (
          <>
            <div className="mb-8">
              <Link href="/explore" className="text-sm text-gray-600 hover:text-black mb-2 inline-block">
                ← Back to Explore
              </Link>
              <h1 className="text-4xl font-bold mb-2">⭐ Top Rated Tacos</h1>
              <p className="text-gray-600">The highest-rated tacos in Jersey City (8+ rating)</p>
            </div>
          </>
        )}

        {/* Taco Grid (shown for all views except neighborhood browser) */}
        {(view !== 'neighborhood' || selectedNeighborhood) && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topDishes && topDishes.length > 0 ? (
              topDishes.map((dish) => (
                <Link
                  key={dish.id}
                  href={`/dishes/${dish.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{dish.name}</h3>
                    {dish.rating_count > 0 ? (
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                        <span className="text-yellow-600">⭐</span>
                        <span className="font-semibold">{dish.average_rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        NEW
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{dish.restaurants.name}</p>
                  
                  {dish.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {dish.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2 text-xs text-gray-500 flex-wrap">
                    {dish.restaurants.neighborhood && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {dish.restaurants.neighborhood}
                      </span>
                    )}
                    {dish.price && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                        ${dish.price.toFixed(2)}
                      </span>
                    )}
                    {dish.rating_count > 0 && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {dish.rating_count} {dish.rating_count === 1 ? 'rating' : 'ratings'}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  🌮 No tacos found
                </p>
                <p className="text-gray-500 mb-6">
                  {view === 'top-rated' 
                    ? 'No tacos with 8+ rating yet. Be the first to rate!' 
                    : selectedNeighborhood
                    ? `No tacos in ${selectedNeighborhood} yet. Add one!`
                    : 'Be the first to add a taco!'}
                </p>
                <Link
                  href="/restaurants/new"
                  className="bg-black text-white px-6 py-3 rounded-lg inline-block hover:bg-gray-800 font-medium"
                >
                  Add a Taco
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
