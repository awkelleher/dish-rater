import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DarkNavBar from '../components/DarkNavBar'

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
    <div className="min-h-screen bg-zinc-900 text-white">
      <DarkNavBar />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">🌶️</span>
            <div>
              <h1 className="text-5xl font-black mb-2">Hood Eats Hot Sauces</h1>
              <p className="text-zinc-400 text-lg">
                The definitive guide to what you should be putting on your food
              </p>
            </div>
          </div>
          
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mt-8">
            <p className="text-zinc-300">
              Look, we take hot sauce seriously around here. These aren't paid placements. 
              These are the bottles that actually deliver. If you disagree, @ us.
            </p>
          </div>
        </div>

        {/* Hot Sauce Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotSauces.map((sauce) => (
            <div
              key={sauce.id}
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{sauce.emoji}</div>
                  <h3 className="text-xl font-bold">{sauce.name}</h3>
                </div>
                <div className={`bg-gradient-to-r ${sauce.color} px-3 py-1 rounded-lg text-sm font-bold`}>
                  #{sauce.id}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">Heat</span>
                    <span className="text-white font-semibold">{sauce.heat}/10</span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${sauce.color}`}
                      style={{ width: `${sauce.heat * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">Flavor</span>
                    <span className="text-white font-semibold">{sauce.flavor}/10</span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-600"
                      style={{ width: `${sauce.flavor * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-zinc-300 text-sm mb-4">{sauce.description}</p>

              {/* Availability */}
              <div className="pt-4 border-t border-zinc-700">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Where to find it</p>
                <p className="text-sm text-zinc-300">{sauce.availability}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="max-w-4xl mx-auto mt-16 border-t border-zinc-800 pt-12">
          <h2 className="text-3xl font-bold mb-6">Submit Your Pick</h2>
          <p className="text-zinc-400 mb-6">
            Got a hot sauce we're sleeping on? Think we got the rankings wrong? 
            Let us know what should be on this list.
          </p>
          <Link
            href="/hot-sauces/submit"
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg font-semibold transition-colors"
          >
            Submit a Hot Sauce
          </Link>
        </div>

        {/* Fun Stats Section */}
        <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold mb-1">847</div>
            <div className="text-sm text-zinc-400">Bottles tested</div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">😰</div>
            <div className="text-3xl font-bold mb-1">23</div>
            <div className="text-sm text-zinc-400">Regrettable decisions</div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold mb-1">6</div>
            <div className="text-sm text-zinc-400">True hall of famers</div>
          </div>
        </div>
      </main>
    </div>
  )
}
