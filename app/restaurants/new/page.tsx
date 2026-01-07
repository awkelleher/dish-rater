'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ClientDarkNavBar from '@/app/components/ClientDarkNavBar'
import PhotoUpload from '@/app/components/PhotoUpload'
import RestaurantAutocomplete from '@/app/components/RestaurantAutocomplete'
import RatingSlider from '@/app/components/RatingSlider'

export default function NewDishPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<Array<{ url: string; path: string }>>([])
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    restaurantName: '',
    area: '',
    dishName: '',
    rating: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      // If user exists, ensure they have a profile
      if (user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existingProfile) {
          // Create profile if it doesn't exist
          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email?.split('@')[0] || 'user',
            })
        }
      }

      // Check if restaurant already exists or was selected
      let restaurant
      if (selectedRestaurantId) {
        // User selected from autocomplete
        const { data: existingRestaurant } = await supabase
          .from('restaurants')
          .select('id')
          .eq('id', selectedRestaurantId)
          .single()
        restaurant = existingRestaurant
      } else {
        // Check if restaurant with this name exists
        const { data: existingRestaurant } = await supabase
          .from('restaurants')
          .select('id')
          .eq('name', formData.restaurantName)
          .eq('city', 'Jersey City')
          .single()

        if (existingRestaurant) {
          restaurant = existingRestaurant
        } else {
          // Create new restaurant
          const { data: newRestaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .insert({
              name: formData.restaurantName,
              address: '', // No longer collecting
              city: 'Jersey City',
              state: 'NJ',
              area: formData.area,
              created_by: user?.id || null,
            })
            .select()
            .single()

          if (restaurantError) throw restaurantError
          restaurant = newRestaurant
        }
      }

      // Create the dish
      const { data: dish, error: dishError } = await supabase
        .from('dishes')
        .insert({
          restaurant_id: restaurant.id,
          name: formData.dishName,
          added_by: user?.id || null,
        })
        .select()
        .single()

      if (dishError) throw dishError

      // Create initial rating if user provided one
      if (formData.rating > 0 && user) {
        const { error: ratingError } = await supabase
          .from('ratings')
          .insert({
            dish_id: dish.id,
            restaurant_id: restaurant.id,
            user_id: user.id,
            rating: formData.rating,
            review_text: null,
            would_order_again: null,
          })

        if (ratingError) {
          console.error('Error saving rating:', ratingError)
        }
      }

      // Save photos if any were uploaded
      if (photos.length > 0 && user) {
        const photoInserts = photos.map(photo => ({
          dish_id: dish.id,
          user_id: user.id,
          storage_path: photo.path,
          url: photo.url,
        }))

        const { error: photoError } = await supabase
          .from('photos')
          .insert(photoInserts)

        if (photoError) console.error('Error saving photos:', photoError)
      }

      // Redirect to explore
      router.push('/explore')
    } catch (err) {
      console.error('Error creating dish:', err)
      setError(err instanceof Error ? err.message : 'Failed to create dish')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <ClientDarkNavBar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Add a Dish</h1>
          <p className="text-gray-400">Add a dish from Jersey City</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant *
            </label>
            <RestaurantAutocomplete
              value={formData.restaurantName}
              onChange={(name, id) => {
                setFormData({ ...formData, restaurantName: name })
                setSelectedRestaurantId(id || null)
              }}
              onAreaSelect={(area) => {
                setFormData({ ...formData, area })
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Start typing to see existing restaurants
            </p>
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
              Area *
            </label>
            <select
              id="area"
              required
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Select an area</option>
              <option value="Downtown">Downtown</option>
              <option value="Journal Square">Journal Square</option>
              <option value="Heights">Heights</option>
              <option value="West Side">West Side</option>
              <option value="Bergen-Lafayette">Bergen-Lafayette</option>
              <option value="Greenville">Greenville</option>
            </select>
          </div>

          <div>
            <label htmlFor="dish" className="block text-sm font-medium text-gray-700 mb-2">
              Dish *
            </label>
            <input
              type="text"
              id="dish"
              required
              value={formData.dishName}
              onChange={(e) => setFormData({ ...formData, dishName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Al Pastor Taco"
            />
          </div>

          {/* Rating Slider */}
          <RatingSlider
            value={formData.rating}
            onChange={(rating) => setFormData({ ...formData, rating })}
            label="Rate This Taco (optional)"
          />

          {/* Photo Upload */}
          <div>
            <PhotoUpload
              onPhotoUploaded={(url, path) => setPhotos([...photos, { url, path }])}
              currentPhotos={photos.map(p => p.url)}
            />
            
            {/* Show uploaded photos */}
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={photo.url} 
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Adding...' : 'Add Dish'}
            </button>
            <Link
              href="/explore"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
