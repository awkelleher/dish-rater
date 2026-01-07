import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function BestOfPage() {
  const supabase = await createClient();

  // Get all unique areas
  const { data: areas } = await supabase
    .from('restaurants')
    .select('area')
    .eq('city', 'Jersey City')
    .not('area', 'is', null)
    .order('area');

  const uniqueAreas = [...new Set(areas?.map(r => r.area) || [])];

  // Get all unique dish categories with counts
  const { data: categories } = await supabase
    .from('dishes')
    .select('category')
    .not('category', 'is', null);

  const categoryCounts = categories?.reduce((acc, dish) => {
    if (dish.category) {
      acc[dish.category] = (acc[dish.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const popularCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([category]) => category);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Best Of Jersey City
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover the top-rated dishes by neighborhood or food type
          </p>
        </div>

        {/* Browse by Area Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3">📍</span>
            Browse by Area
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uniqueAreas.map((area) => (
              <Link
                key={area}
                href={`/best-of/area/${encodeURIComponent(area)}`}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all p-6 text-center border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {area}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Top 10 dishes
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Food Type Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3">🍜</span>
            Browse by Food Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <Link
                key={category}
                href={`/best-of/food/${encodeURIComponent(category)}`}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all p-6 text-center border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {category}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Top 10 in JC
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
