import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import ThemedNavBar from '@/app/components/ThemedNavBar';

export default async function BestOfPage() {
  const supabase = await createClient();

  // Get all unique neighborhoods from database to check which have dishes
  const { data: neighborhoods } = await supabase
    .from('restaurants')
    .select('neighborhood')
    .eq('city', 'Jersey City')
    .not('neighborhood', 'is', null)
    .order('neighborhood');

  const neighborhoodsWithDishes = [...new Set(neighborhoods?.map(r => r.neighborhood) || [])];

  // All neighborhoods (same as in the dish form) - sorted alphabetically
  const allNeighborhoods = [
    'BERGEN-LAFAYETTE',
    'Downtown',
    'Exchange Place',
    'GREENVILLE',
    'Grove Street',
    'JOURNAL SQUARE',
    'Newport',
    'Paulus Hook',
    'THE HEIGHTS',
    'Van Vorst Park',
    'WEST SIDE'
  ];

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
    <div className="min-h-screen bg-background">
      <ThemedNavBar />
      <div className="container mx-auto px-6 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center border-b-4 border-foreground pb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 uppercase tracking-tight">
            Best Of Jersey City
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground uppercase tracking-wide font-bold">
            Discover the top-rated dishes by neighborhood or food type
          </p>
        </div>

        {/* Browse by Neighborhood Section */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 flex items-center uppercase tracking-tight">
            <span className="mr-4 text-4xl">📍</span>
            Browse by Neighborhood
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allNeighborhoods.map((neighborhood) => {
              const hasDishes = neighborhoodsWithDishes.includes(neighborhood);
              return (
                <Link
                  key={neighborhood}
                  href={`/best-of/area/${encodeURIComponent(neighborhood)}`}
                  className={`group p-6 text-center border-4 border-foreground transition-all ${
                    hasDishes
                      ? 'bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-muted'
                      : 'bg-muted shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] opacity-60'
                  }`}
                >
                  <h3 className={`text-lg md:text-xl font-bold uppercase tracking-wide transition-colors ${
                    hasDishes
                      ? 'text-foreground group-hover:text-primary'
                      : 'text-muted-foreground'
                  }`}>
                    {neighborhood}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wide font-bold">
                    {hasDishes ? 'Top 10 dishes' : 'No dishes yet'}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Browse by Food Type Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 flex items-center uppercase tracking-tight">
            <span className="mr-4 text-4xl">🍜</span>
            Browse by Food Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularCategories.map((category) => (
              <Link
                key={category}
                href={`/best-of/food/${encodeURIComponent(category)}`}
                className="group bg-card p-6 text-center border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-muted"
              >
                <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-wide">
                  {category}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wide font-bold">
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
