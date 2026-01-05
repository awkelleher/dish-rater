import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.jpg" 
              alt="Hood Eats" 
              width={120} 
              height={120}
              className="w-auto h-16"
            />
          </div>
          <div className="flex gap-4">
            <Link 
              href="/auth/login"
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Log in
            </Link>
            <Link 
              href="/auth/signup"
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center pt-20 pb-16">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image 
              src="/logo.jpg" 
              alt="Hood Eats - Bite the Block" 
              width={600} 
              height={600}
              className="w-full max-w-2xl h-auto"
              priority
            />
          </div>

          {/* Tagline */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
            Rate every taco in Jersey City
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover the best tacos in your neighborhood. Rate what you've tried. 
            Help others find their next favorite bite.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/explore"
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🌮 Explore Tacos
            </Link>
            <Link 
              href="/restaurants/new"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-gray-300"
            >
              Add a Taco
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto py-20">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3">Discover</h3>
              <p className="text-gray-600">
                Browse tacos by neighborhood or check out the top-rated spots in Jersey City
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-3">Rate</h3>
              <p className="text-gray-600">
                Give each taco a score from 0-10. Share photos and reviews to help others decide
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">🌮</div>
              <h3 className="text-2xl font-bold mb-3">Contribute</h3>
              <p className="text-gray-600">
                Add new taco spots and dishes. Help build the most comprehensive taco guide in JC
              </p>
            </div>
          </div>
        </div>

        {/* Neighborhoods Section */}
        <div className="max-w-6xl mx-auto py-20">
          <h2 className="text-4xl font-bold text-center mb-8">Every Hood, Every Bite</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            From Downtown to Greenville, we're covering all of Jersey City
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {['Downtown', 'Journal Square', 'The Heights', 'Bergen-Lafayette', 
              'Greenville', 'West Side', 'The Waterfront', 'McGinley Square'].map((hood) => (
              <div key={hood} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-semibold text-gray-800">{hood}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-4xl font-bold mb-6">Ready to bite the block?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the community and start rating tacos today
          </p>
          <Link 
            href="/auth/signup"
            className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-12 py-4 rounded-xl text-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2025 Hood Eats. Bite the Block. 🌮</p>
        </div>
      </footer>
    </div>
  )
}
