import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Header from '../components/Header'

const DISH_TYPES = [
  { name: 'Tacos', emoji: '🌮', category: 'Taco' },
  { name: 'Pizza', emoji: '🍕', category: 'Pizza' },
  { name: 'Ramen', emoji: '🍜', category: 'Ramen' },
  { name: 'Burgers', emoji: '🍔', category: 'Burger' },
  { name: 'Sandwiches', emoji: '🥪', category: 'Sandwich' },
  { name: 'Sushi', emoji: '🍣', category: 'Sushi' },
]

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { 
    view?: string
    neighborhood?: string
    category?: string
  }
}) {
  const supabase = await createClient()
  const view = searchParams.view || 'all'
  const selectedNeighborhood = searchParams.neighborhood
  const selectedCategory = searchParams.category || 'Taco'

  // Fetch dishes based on view
  let dishes: any[] = []
  let query = supabase
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
    .eq('restaurants.city', 'Jersey City')

  // Apply category filter if specified
  if (selectedCategory && selectedCategory !== 'all') {
    query = query.eq('category', selectedCategory)
  }

  if (view === 'neighborhood' && selectedNeighborhood) {
    // Filter by specific neighborhood
    const { data } = await query
      .eq('restaurants.neighborhood', selectedNeighborhood)
      .order('rating_count', { ascending: false })
      .order('average_rating', { ascending: false })
      .limit(50)
    dishes = data || []
  } else if (view === 'best-of') {
    // Show best rated dishes (8+ rating)
    const { data } = await query
      .gte('average_rating', 8)
      .gte('rating_count', 1)
      .order('average_rating', { ascending: false })
      .order('rating_count', { ascending: false })
      .limit(50)
    dishes = data || []
  } else if (view === 'category') {
    // Show all dishes of selected category
    const { data } = await query
      .order('rating_count', { ascending: false })
      .order('average_rating', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)
    dishes = data || []
  } else {
    // Show all dishes
    const { data } = await query
      .order('rating_count', { ascending: false })
      .order('average_rating', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)
    dishes = data || []
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
        {/* Main Landing - Explore Options */}
        {view === 'all' && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">🍽️ Explore</h1>
              <p className="text-gray-600">Discover the best food in Jersey City</p>
            </div>

            {/* Dish Type Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Browse by Dish Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {DISH_TYPES.map((type) => (
                  <Link
                    key={type.category}
                    href={`/explore?view=category&category=${type.category}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-center group border-2 border-transparent hover:border-orange-200"
                  >
                    <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">{type.emoji}</div>
                    <h3 className="font-bold text-gray-900">{type.name}</h3>
                  </Link>
                ))}
              </div>
            </div>

            {/* Explore Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/explore?view=neighborhood"
                className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg hover:shadow-xl transition-all p-8 text-white"
              >
                <div className="text-5xl mb-4">📍</div>
                <h3 className="text-2xl font-bold mb-2">By Neighborhood</h3>
                <p className="text-orange-100">Explore the best dishes in your area</p>
              </Link>

              <Link
                href="/explore?view=best-of"
                className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg hover:shadow-xl transition-all p-8 text-white"
              >
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold mb-2">Best Of</h3>
                <p className="text-yellow-100">Top rated dishes across Jersey City (8+ rating)</p>
              </Link>
            </div>
          </>
        )}

        {/* Category View */}
        {view === 'category' && (
          <>
            <div className="mb-8">
              <Link href="/explore" className="text-sm text-gray-600 hover:text-black mb-2 inline-block">
                ← Back to Explore
              </Link>
              <h1 className="text-4xl font-bold mb-4">
                {DISH_TYPES.find(t => t.category === selectedCategory)?.emoji}{' '}
                {DISH_TYPES.find(t => t.category === selectedCategory)?.name || selectedCategory}
              </h1>
              
              {/* Filter by Neighborhood */}
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/explore?view=category&category=${selectedCategory}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !selectedNeighborhood
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Neighborhoods
                </Link>
                <Link
                  href={`/explore?view=best-of&category=${selectedCategory}`}
                  className="px-4 py-2 rounded-lg font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                >
                  ⭐ Best Of (8+)
                </Link>
              </div>
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
              <p className="text-gray-600">Select a neighborhood to see the best dishes in that area</p>
            </div>

            <div className="space-y-8">
              {Object.entries(neighborhoodsByArea).map(([area, hoods]) => {
                const hoodsWithDishes = hoods.filter(h => uniqueNeighborhoods.includes(h))
                if (hoodsWithDishes.length === 0) return null
                
                return (
                  <div key={area}>
                    <h2 className="text-2xl font-bold mb-4">{area}</h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {hoodsWithDishes.map((hood) => (
                        <Link
                          key={hood}
                          href={`/explore?view=neighborhood&neighborhood=${encodeURIComponent(hood)}`}
                          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center hover:border-2 hover:border-orange-200"
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
              <h1 className="text-4xl font-bold mb-4">📍 {selectedNeighborhood}</h1>
              
              {/* Filter by Category */}
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/explore?view=neighborhood&neighborhood=${selectedNeighborhood}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !selectedCategory || selectedCategory === 'all'
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Dishes
                </Link>
                {DISH_TYPES.map((type) => (
                  <Link
                    key={type.category}
                    href={`/explore?view=neighborhood&neighborhood=${selectedNeighborhood}&category=${type.category}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === type.category
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {type.emoji} {type.name}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Best Of Header */}
        {view === 'best-of' && (
          <>
            <div className="mb-8">
              <Link href="/explore" className="text-sm text-gray-600 hover:text-black mb-2 inline-block">
                ← Back to Explore
              </Link>
              <h1 className="text-4xl font-bold mb-4">⭐ Best Of Jersey City</h1>
              
              {/* Filter by Category */}
              <div className="flex gap-2 flex-wrap">
                <Link
                  href="/explore?view=best-of"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !selectedCategory || selectedCategory === 'all'
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Dishes
                </Link>
                {DISH_TYPES.map((type) => (
                  <Link
                    key={type.category}
                    href={`/explore?view=best-of&category=${type.category}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === type.category
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {type.emoji} {type.name}
                  </Link>
                ))}
              </div>
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
                    <span className="bg-gray-100 px-2 py-1 rounded">{dish.category}</span>
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
