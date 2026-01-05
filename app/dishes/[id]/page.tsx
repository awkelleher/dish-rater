import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RatingForm from './rating-form'
import Header from '@/app/components/Header'

export default async function DishPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const dishId = params.id

  // Fetch dish with restaurant info
  const { data: dish } = await supabase
    .from('dishes')
    .select(`
      *,
      restaurants (
        id,
        name,
        address,
        neighborhood
      )
    `)
    .eq('id', dishId)
    .single()

  if (!dish) {
    notFound()
  }

  // Fetch ratings for this dish
  const { data: ratings } = await supabase
    .from('ratings')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq('dish_id', dishId)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Dish Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{dish.name}</h1>
              <Link 
                href={`/restaurants/${dish.restaurants?.id}`}
                className="text-lg text-gray-600 hover:underline"
              >
                {dish.restaurants?.name}
              </Link>
              {dish.restaurants?.neighborhood && (
                <p className="text-sm text-gray-500 mt-1">
                  {dish.restaurants.neighborhood} • {dish.restaurants.address}
                </p>
              )}
            </div>
            
            {dish.average_rating > 0 && (
              <div className="text-center">
                <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
                  <span className="text-yellow-600 text-2xl">⭐</span>
                  <span className="font-bold text-3xl">{dish.average_rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {dish.rating_count} {dish.rating_count === 1 ? 'rating' : 'ratings'}
                </p>
              </div>
            )}
          </div>

          {dish.description && (
            <p className="text-gray-700 mb-4">{dish.description}</p>
          )}

          <div className="flex gap-3 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-full">🌮 {dish.category}</span>
            {dish.price && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                ${dish.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Rating Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Rate This Taco</h2>
          <RatingForm dishId={dishId} restaurantId={dish.restaurant_id} />
        </div>

        {/* Ratings List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">
            Reviews ({ratings?.length || 0})
          </h2>

          {ratings && ratings.length > 0 ? (
            <div className="space-y-6">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {rating.profiles?.avatar_url ? (
                        <img 
                          src={rating.profiles.avatar_url} 
                          alt={rating.profiles.username}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {rating.profiles?.username?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold">{rating.profiles?.username}</span>
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                          <span className="text-yellow-600">⭐</span>
                          <span className="font-semibold">{rating.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {rating.review_text && (
                        <p className="text-gray-700 mb-2">{rating.review_text}</p>
                      )}

                      {rating.would_order_again !== null && (
                        <p className="text-sm text-gray-600">
                          {rating.would_order_again ? '✅ Would order again' : '❌ Would not order again'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to rate this taco!
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
