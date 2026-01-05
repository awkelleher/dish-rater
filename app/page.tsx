import Link from 'next/link'
import Image from 'next/image'
import DarkNavBar from './components/DarkNavBar'

const QUICK_CATEGORIES = [
  { name: 'Tacos', emoji: '🌮', category: 'Taco' },
  { name: 'Pizza', emoji: '🍕', category: 'Pizza' },
  { name: 'Burgers', emoji: '🍔', category: 'Burger' },
  { name: 'Ramen', emoji: '🍜', category: 'Ramen' },
]

const POPULAR_NEIGHBORHOODS = [
  'Downtown', 'Paulus Hook', 'Journal Square', 
  'The Heights', 'Newport', 'Grove Street'
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Navigation */}
      <DarkNavBar />

      {/* Hero - Action First */}
      <main className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto pt-16 pb-12">
          {/* Main Value Prop */}
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            Find something
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              reliably good
            </span>
            <br />
            in 30 seconds
          </h1>
          
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl">
            Real ratings from real people in your hood. No BS, just good food.
          </p>

          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {/* Top 10 Quick Hit */}
            <Link 
              href="/explore?view=best-of&limit=10"
              className="group relative overflow-hidden bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-8 hover:scale-[1.02] transition-transform"
            >
              <div className="relative z-10">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-2xl font-bold mb-2">Top 10 in JC</h3>
                <p className="text-orange-100">Highest rated dishes right now</p>
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
            </Link>

            {/* Find by Location */}
            <Link 
              href="/explore?view=neighborhood"
              className="group relative overflow-hidden bg-zinc-800 border-2 border-zinc-700 hover:border-orange-500 rounded-2xl p-8 hover:scale-[1.02] transition-all"
            >
              <div className="relative z-10">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="text-2xl font-bold mb-2">By Neighborhood</h3>
                <p className="text-zinc-400">What's good near you?</p>
              </div>
            </Link>
          </div>

          {/* Quick Category Pills */}
          <div className="mb-12">
            <p className="text-sm text-zinc-500 uppercase tracking-wider mb-4">Quick Search</p>
            <div className="flex flex-wrap gap-3">
              {QUICK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.category}
                  href={`/explore?view=category&category=${cat.category}`}
                  className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold transition-colors border border-zinc-700 hover:border-orange-500"
                >
                  {cat.emoji} {cat.name}
                </Link>
              ))}
              <Link
                href="/explore?view=best-of"
                className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold transition-colors border border-zinc-700 hover:border-yellow-500"
              >
                ⭐ Best Of
              </Link>
            </div>
          </div>

          {/* Popular Neighborhoods - Quick Access */}
          <div className="border-t border-zinc-800 pt-8">
            <p className="text-sm text-zinc-500 uppercase tracking-wider mb-4">Popular Hoods</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {POPULAR_NEIGHBORHOODS.map((hood) => (
                <Link
                  key={hood}
                  href={`/explore?view=neighborhood&neighborhood=${encodeURIComponent(hood)}`}
                  className="px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors text-center border border-zinc-800 hover:border-zinc-700"
                >
                  {hood}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works - Minimal */}
        <div className="max-w-6xl mx-auto py-20 border-t border-zinc-800">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-xl font-bold mb-2">Find</h3>
              <p className="text-zinc-400 text-sm">
                Search by hood, dish type, or just browse the top-rated
              </p>
            </div>

            <div>
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="text-xl font-bold mb-2">Trust</h3>
              <p className="text-zinc-400 text-sm">
                Real ratings from people who actually ate there
              </p>
            </div>

            <div>
              <div className="text-3xl mb-3">🍽️</div>
              <h3 className="text-xl font-bold mb-2">Eat</h3>
              <p className="text-zinc-400 text-sm">
                No more wasting money on mid food
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto text-center py-20 border-t border-zinc-800">
          <h2 className="text-4xl font-bold mb-4">Hungry right now?</h2>
          <p className="text-zinc-400 mb-8">Stop scrolling. Start eating.</p>
          <Link 
            href="/explore?view=best-of&limit=10"
            className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-orange-700 hover:to-red-700 transition-all"
          >
            Show Me Top 10
          </Link>
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="border-t border-zinc-800 bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">© 2025 Hood Eats. Jersey City.</p>
            <Link 
              href="/auth/signup"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Add your spot →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
