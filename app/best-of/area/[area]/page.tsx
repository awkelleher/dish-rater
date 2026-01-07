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

  // Fetch top 10 dishes in this area, sorted by average rating
  const { data: dishes, error } = await supabase
    .from('dishes')
    .select(`
      *,
      restaurants!inner (
        id,
        name,
        area,
        address,
        neighborhood
      ),
      photos (
        id,
        photo_url,
        caption
      )
    `)
    .eq('restaurants.area', decodedArea)
    .eq('restaurants.city', 'Jersey City')
    .not('average_rating', 'is', null)
    .gte('rating_count', 1)
    .order('average_rating', { ascending: false })
    .limit(10);

  if (error || !dishes || dishes.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/best-of"
            className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 mb-4 inline-flex items-center"
          >
            ← Back to Best Of
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
            Top 10 Dishes in {decodedArea}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
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
                className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Ranking Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>

                  {/* Image */}
                  <div className="relative w-full md:w-64 h-48 bg-gray-200 dark:bg-gray-700">
                    {firstPhoto ? (
                      <Image
                        src={firstPhoto.photo_url}
                        alt={dish.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {dish.name}
                        </h3>
                        <p className="text-orange-500 dark:text-orange-400 font-medium">
                          {restaurant?.name}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="ml-4 text-right">
                        <div className="text-3xl font-bold text-orange-500 dark:text-orange-400">
                          {dish.average_rating?.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {dish.rating_count} {dish.rating_count === 1 ? 'rating' : 'ratings'}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {dish.description && (
                      <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {dish.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                      {dish.category && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                          {dish.category}
                        </span>
                      )}
                      {dish.price && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                          ${dish.price}
                        </span>
                      )}
                      {restaurant?.neighborhood && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
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
