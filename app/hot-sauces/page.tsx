import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ThemedNavBar from '../components/ThemedNavBar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function HotSaucesPage() {
  const supabase = await createClient()

  // Fetch hot sauces - for now, hardcoded. Later can be from database
  const hotSauces = [
    {
      id: 1,
      name: "El Yucateco Caribbean",
      emoji: "🌶️",
      heat: 8,
      flavor: 9,
      availability: "Most bodegas",
      description: "Habanero-based, slightly fruity. Perfect for tacos.",
      color: "from-orange-500 to-orange-600"
    },
    {
      id: 2,
      name: "Valentina Extra Hot",
      emoji: "🔥",
      heat: 6,
      flavor: 10,
      availability: "Everywhere",
      description: "The classic. Tangy, versatile, reliable.",
      color: "from-red-500 to-red-600"
    },
    {
      id: 3,
      name: "Secret Aardvark Habanero",
      emoji: "🦔",
      heat: 7,
      flavor: 9,
      availability: "Specialty stores",
      description: "Tomato-based, Caribbean vibes. Addictive.",
      color: "from-orange-600 to-red-600"
    },
    {
      id: 4,
      name: "Cholula Original",
      emoji: "🌮",
      heat: 4,
      flavor: 8,
      availability: "Everywhere",
      description: "Mild but flavorful. Gateway hot sauce.",
      color: "from-yellow-600 to-orange-500"
    },
    {
      id: 5,
      name: "Marie Sharp's Habanero",
      emoji: "🇧🇿",
      heat: 8,
      flavor: 10,
      availability: "Online/specialty",
      description: "Belizean gold. Carrot-based, perfectly balanced.",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 6,
      name: "Tapatío",
      emoji: "🎩",
      heat: 5,
      flavor: 9,
      availability: "Everywhere",
      description: "Red pepper perfection. No frills, just heat.",
      color: "from-red-600 to-red-700"
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <ThemedNavBar />

      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">🌶️</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Hood Eats Hot Sauces</h1>
              <p className="text-lg text-muted-foreground uppercase tracking-wide">
                The definitive guide to what you should be putting on your food
              </p>
            </div>
          </div>

          <Card className="border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-card p-6 mt-8">
            <p className="text-foreground">
              Look, we take hot sauce seriously around here. These aren't paid placements.
              These are the bottles that actually deliver. If you disagree, @ us.
            </p>
          </Card>
        </div>

        {/* Hot Sauce Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotSauces.map((sauce) => (
            <Card
              key={sauce.id}
              className="border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-card p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{sauce.emoji}</div>
                  <h3 className="text-xl font-bold text-foreground">{sauce.name}</h3>
                </div>
                <Badge className="bg-primary text-primary-foreground border-2 border-foreground font-bold">
                  #{sauce.id}
                </Badge>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground font-bold uppercase text-xs">Heat</span>
                    <span className="text-foreground font-bold">{sauce.heat}/10</span>
                  </div>
                  <div className="h-3 bg-muted border-2 border-foreground overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${sauce.heat * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground font-bold uppercase text-xs">Flavor</span>
                    <span className="text-foreground font-bold">{sauce.flavor}/10</span>
                  </div>
                  <div className="h-3 bg-muted border-2 border-foreground overflow-hidden">
                    <div
                      className="h-full bg-secondary"
                      style={{ width: `${sauce.flavor * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-foreground text-sm mb-4">{sauce.description}</p>

              {/* Availability */}
              <div className="pt-4 border-t-2 border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-bold">Where to find it</p>
                <p className="text-sm text-foreground">{sauce.availability}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="max-w-4xl mx-auto mt-16 border-t-4 border-foreground pt-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Submit Your Pick</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Got a hot sauce we're sleeping on? Think we got the rankings wrong?
            Let us know what should be on this list.
          </p>
          <Link href="/hot-sauces/submit">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Submit a Hot Sauce
            </Button>
          </Link>
        </div>

        {/* Fun Stats Section */}
        <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
          <Card className="border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-card p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-foreground mb-1">847</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide font-bold">Bottles tested</div>
          </Card>

          <Card className="border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-card p-6 text-center">
            <div className="text-4xl mb-2">😰</div>
            <div className="text-3xl font-bold text-foreground mb-1">23</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide font-bold">Regrettable decisions</div>
          </Card>

          <Card className="border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-card p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-foreground mb-1">6</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide font-bold">True hall of famers</div>
          </Card>
        </div>
      </main>
    </div>
  )
}
