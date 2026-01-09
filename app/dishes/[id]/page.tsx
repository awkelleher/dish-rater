import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RatingForm from './rating-form'
import ThemedNavBar from '@/app/components/ThemedNavBar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id: dishId } = await params

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
    <div className="min-h-screen bg-background">
      <ThemedNavBar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Dish Header */}
        <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{dish.name}</h1>
              <Link
                href={`/restaurants/${dish.restaurants?.id}`}
                className="text-lg text-muted-foreground hover:text-foreground transition-colors font-bold uppercase tracking-wide"
              >
                {dish.restaurants?.name}
              </Link>
              {dish.restaurants?.neighborhood && (
                <p className="text-sm text-muted-foreground mt-1">
                  {dish.restaurants.neighborhood} • {dish.restaurants.address}
                </p>
              )}
            </div>

            {dish.average_rating > 0 && (
              <div className="text-center">
                <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 border-2 border-foreground">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-3xl">{dish.average_rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wide font-bold">
                  {dish.rating_count} {dish.rating_count === 1 ? 'rating' : 'ratings'}
                </p>
              </div>
            )}
          </div>

          {dish.description && (
            <p className="text-foreground mb-4">{dish.description}</p>
          )}

          <div className="flex gap-3 text-sm">
            <Badge className="bg-card text-foreground border-2 border-foreground font-bold">🌮 {dish.category}</Badge>
            {dish.price && (
              <Badge className="bg-secondary text-secondary-foreground border-2 border-foreground font-bold">
                ${dish.price.toFixed(2)}
              </Badge>
            )}
          </div>
        </Card>

        {/* Rating Form */}
        <div className="mb-6">
          <RatingForm dishId={dishId} restaurantId={dish.restaurant_id} />
        </div>

        {/* Ratings List */}
        <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Reviews ({ratings?.length || 0})
          </h2>

          {ratings && ratings.length > 0 ? (
            <div className="space-y-6">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b-2 border-border last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {rating.profiles?.avatar_url ? (
                        <img
                          src={rating.profiles.avatar_url}
                          alt={rating.profiles.username}
                          className="w-12 h-12 border-2 border-foreground"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted border-2 border-foreground flex items-center justify-center">
                          <span className="text-foreground font-bold">
                            {rating.profiles?.username?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-foreground">{rating.profiles?.username}</span>
                        <Badge className="bg-secondary text-secondary-foreground border-2 border-foreground font-bold">
                          ⭐ {rating.rating.toFixed(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground uppercase tracking-wide font-bold">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {rating.review_text && (
                        <p className="text-foreground mb-2">{rating.review_text}</p>
                      )}

                      {rating.would_order_again !== null && (
                        <p className="text-sm text-foreground font-bold">
                          {rating.would_order_again ? '✅ Would order again' : '❌ Would not order again'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8 uppercase tracking-wide font-bold">
              No reviews yet. Be the first to rate this taco!
            </p>
          )}
        </Card>
      </main>
    </div>
  )
}
