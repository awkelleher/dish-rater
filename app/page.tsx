import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TopListsSection from './components/TopListsSection'
import ThemedNavBar from './components/ThemedNavBar'

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <ThemedNavBar />

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

      {/* Top 10 Lists with Dropdowns */}
      <TopListsSection />

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-6 border-t-4 border-foreground bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">Ready to Bite the Block?</h3>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join Hood Eats and start rating the best dishes in Jersey City.
          </p>
          <Link href="/auth/login">
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
