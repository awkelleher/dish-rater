import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  // Sample data - replace with real data from your Supabase when ready
  const downtownTop10 = [
    { rank: 1, dish: 'Margherita Pizza', restaurant: 'Razza', neighborhood: 'Downtown', rating: 9.8 },
    { rank: 2, dish: 'Spicy Tonkotsu Ramen', restaurant: 'Ani Ramen', neighborhood: 'Downtown', rating: 9.7 },
    { rank: 3, dish: 'Breakfast Burrito', restaurant: 'Taqueria Downtown', neighborhood: 'Downtown', rating: 9.5 },
    { rank: 4, dish: 'Chicken Parm Sandwich', restaurant: 'Raval', neighborhood: 'Downtown', rating: 9.4 },
    { rank: 5, dish: 'Pastrami Sandwich', restaurant: 'Sam\'s Deli', neighborhood: 'Downtown', rating: 9.3 },
    { rank: 6, dish: 'Pad Thai', restaurant: 'Bangkok Kitchen', neighborhood: 'Downtown', rating: 9.2 },
    { rank: 7, dish: 'Fried Chicken', restaurant: 'South House', neighborhood: 'Downtown', rating: 9.1 },
    { rank: 8, dish: 'Bacon Egg & Cheese', restaurant: 'Grace O\'Malley\'s', neighborhood: 'Downtown', rating: 9.0 },
    { rank: 9, dish: 'Empanadas', restaurant: 'Empanada Lady', neighborhood: 'Downtown', rating: 8.9 },
    { rank: 10, dish: 'Chocolate Chip Cookie', restaurant: 'Levain Bakery', neighborhood: 'Downtown', rating: 8.8 },
  ]

  const bestTacos = [
    { rank: 1, dish: 'Al Pastor Taco', restaurant: 'Taqueria Downtown', neighborhood: 'Downtown', rating: 9.9 },
    { rank: 2, dish: 'Carnitas Taco', restaurant: 'Tacoria', neighborhood: 'Grove Street', rating: 9.7 },
    { rank: 3, dish: 'Fish Taco', restaurant: 'Taco Thursdays', neighborhood: 'Paulus Hook', rating: 9.6 },
    { rank: 4, dish: 'Birria Taco', restaurant: 'La Frontera', neighborhood: 'Journal Square', rating: 9.5 },
    { rank: 5, dish: 'Carne Asada Taco', restaurant: 'Taco Express', neighborhood: 'The Heights', rating: 9.4 },
    { rank: 6, dish: 'Lengua Taco', restaurant: 'Cinco De Mayo', neighborhood: 'Downtown', rating: 9.2 },
    { rank: 7, dish: 'Shrimp Taco', restaurant: 'Los Cuernos', neighborhood: 'Newport', rating: 9.1 },
    { rank: 8, dish: 'Vegetarian Taco', restaurant: 'Taqueria Vegana', neighborhood: 'Grove Street', rating: 9.0 },
    { rank: 9, dish: 'Chorizo Taco', restaurant: 'Taco Stop', neighborhood: 'Paulus Hook', rating: 8.9 },
    { rank: 10, dish: 'Barbacoa Taco', restaurant: 'El Patron', neighborhood: 'Journal Square', rating: 8.8 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-foreground py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">HOOD EATS</h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-1 uppercase tracking-wide">Bite the Block</p>
          </div>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-6 border-b-4 border-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 text-base px-4 py-2 bg-secondary text-secondary-foreground border-2 border-foreground">
            Rate · Browse · Discover
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            Find the Top 10 Best Dishes in Any Jersey City Neighborhood
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Hood Eats is your guide to the absolute best dishes in Jersey City. Rate, review, and discover what the
            block is eating.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/best-of">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Browse Neighborhoods
              </Button>
            </Link>
            <Link href="/restaurants/new">
              <Button
                size="lg"
                variant="outline"
                className="bg-background text-foreground hover:bg-muted font-bold text-lg border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Add a Dish
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top 10 Lists */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Downtown Top 10 */}
            <div>
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
                  Top 10 in Downtown JC
                </h3>
                <p className="text-lg text-muted-foreground">The neighborhood's absolute best dishes right now</p>
              </div>
              <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card">
                <div className="divide-y-2 divide-border">
                  {downtownTop10.map((item) => (
                    <div key={item.rank} className="p-4 hover:bg-muted transition-colors cursor-pointer">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center font-bold text-xl">
                            {item.rank}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground text-lg leading-tight mb-1">{item.dish}</h4>
                          <p className="text-muted-foreground text-sm">{item.restaurant}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="font-bold text-lg text-secondary">{item.rating}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Best Tacos */}
            <div>
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">Top 10 Tacos</h3>
                <p className="text-lg text-muted-foreground">The best tacos across all neighborhoods</p>
              </div>
              <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card">
                <div className="divide-y-2 divide-border">
                  {bestTacos.map((item) => (
                    <div key={item.rank} className="p-4 hover:bg-muted transition-colors cursor-pointer">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center font-bold text-xl">
                            {item.rank}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground text-lg leading-tight mb-1">{item.dish}</h4>
                          <p className="text-muted-foreground text-sm">
                            {item.restaurant} · {item.neighborhood}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="font-bold text-lg text-secondary">{item.rating}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-6 border-t-4 border-foreground bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">Ready to Bite the Block?</h3>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join Hood Eats and start rating the best dishes in Jersey City.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xl px-8 py-6 border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-foreground py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground uppercase tracking-wide font-bold">© 2026 Hood Eats · Bite the Block</p>
        </div>
      </footer>
    </div>
  )
}
