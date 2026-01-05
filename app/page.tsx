import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">DishRate</h1>
          <nav className="flex gap-4">
            <Link href="/auth/login" className="hover:underline">
              Log in
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Rate dishes, not restaurants
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find the best dishes at every restaurant in NYC. Stop guessing what to order.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Link 
              href="/explore" 
              className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800"
            >
              Explore dishes
            </Link>
            <Link 
              href="/restaurants/new" 
              className="border border-gray-300 px-6 py-3 rounded-lg text-lg hover:bg-gray-50"
            >
              Add a restaurant
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-semibold mb-2">Rate individual dishes</h3>
              <p className="text-gray-600 text-sm">
                Every menu item gets its own rating. Know exactly what's good.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🍕</div>
              <h3 className="font-semibold mb-2">Discover hidden gems</h3>
              <p className="text-gray-600 text-sm">
                A 3-star restaurant might have a 5-star pasta. Find it.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-semibold mb-2">Share with photos</h3>
              <p className="text-gray-600 text-sm">
                Upload dish photos and help others order confidently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-gray-600 text-sm">
        <p>DishRate NYC &copy; 2024</p>
      </footer>
    </main>
  );
}
