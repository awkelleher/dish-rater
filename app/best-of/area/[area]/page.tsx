import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ area: string }>;
}

export default async function BestOfAreaPage({ params }: PageProps) {
  const { area } = await params;
  const decodedArea = decodeURIComponent(area);
  const supabase = await createClient();

  // Fetch top 10 dishes in this neighborhood, sorted by average rating
  const { data: dishes, error } = await supabase
    .from('dishes')
    .select(`
      *,
      restaurants!inner (
        id,
        name,
        address,
        neighborhood
      ),
      photos (
        id,
        url
      )
    `)
    .eq('restaurants.neighborhood', decodedArea)
    .not('average_rating', 'is', null)
    .gte('rating_count', 1)
    .order('average_rating', { ascending: false })
    .limit(10);

  if (error || !dishes || dishes.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 md:mb-12 border-b-4 border-foreground pb-6">
          <Link
            href="/best-of"
            className="text-primary hover:text-primary/80 mb-4 inline-flex items-center font-bold uppercase tracking-wide text-sm transition-colors"
          >
            ← Back to Best Of
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-3 uppercase tracking-tight">
            Top 10 Dishes in {decodedArea}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-wide font-bold">
            The highest-rated dishes in this neighborhood
          </p>
        </div>

        {/* Top Dishes List */}
        <div className="space-y-6">
          {dishes.map((dish, index) => {
            const restaurant = Array.isArray(dish.restaurants) ? dish.restaurants[0] : dish.restaurants;
            const firstPhoto = Array.isArray(dish.photos) && dish.photos.length > 0 ? dish.photos[0] : null;

            return (
              <Link
                key={dish.id}
                href={`/dishes/${dish.id}`}
                className="block bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-muted overflow-hidden"
              >
                <div className="flex flex-col md:flex-row relative">
                  {/* Ranking Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground font-bold text-2xl w-14 h-14 border-4 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {index + 1}
                  </div>

                  {/* Image */}
                  <div className="relative w-full md:w-64 h-48 bg-muted border-b-4 md:border-b-0 md:border-r-4 border-foreground">
                    {firstPhoto ? (
                      <Image
                        src={firstPhoto.url}
                        alt={dish.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 uppercase tracking-tight">
                          {dish.name}
                        </h3>
                        <p className="text-primary font-bold text-lg uppercase tracking-wide">
                          {restaurant?.name}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="ml-4 text-right">
                        <div className="text-4xl font-bold text-secondary">
                          {dish.average_rating?.toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground font-bold uppercase tracking-wide">
                          {dish.rating_count} {dish.rating_count === 1 ? 'rating' : 'ratings'}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {dish.description && (
                      <p className="text-foreground mb-4 line-clamp-2">
                        {dish.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-3 text-sm">
                      {dish.category && (
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground border-2 border-foreground font-bold uppercase tracking-wide">
                          {dish.category}
                        </span>
                      )}
                      {dish.price && (
                        <span className="px-3 py-1 bg-muted text-foreground border-2 border-foreground font-bold uppercase tracking-wide">
                          ${dish.price}
                        </span>
                      )}
                      {restaurant?.neighborhood && (
                        <span className="px-3 py-1 bg-muted text-muted-foreground border-2 border-foreground font-bold uppercase tracking-wide">
                          {restaurant.neighborhood}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
