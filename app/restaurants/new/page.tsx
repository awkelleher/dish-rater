'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ClientThemedNavBar from '@/app/components/ClientThemedNavBar'
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
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])

  const [formData, setFormData] = useState({
    restaurantName: '',
    area: '',
    dishName: '',
    dishCategory: '',
    rating: 0,
    would_order_again: null as boolean | null,
  })

  // Fetch unique neighborhoods and categories from Supabase
  useEffect(() => {
    async function fetchData() {
      // Fetch neighborhoods
      const { data: neighborhoodData } = await supabase
        .from('restaurants')
        .select('neighborhood')
        .eq('city', 'Jersey City')
        .not('neighborhood', 'is', null)

      if (neighborhoodData) {
        const uniqueNeighborhoods = [...new Set(neighborhoodData.map(r => r.neighborhood))].sort()
        setNeighborhoods(uniqueNeighborhoods)
      }

      // Fetch categories
      const { data: categoryData } = await supabase
        .from('dishes')
        .select('category')
        .not('category', 'is', null)

      if (categoryData) {
        const categoryCounts = categoryData.reduce((acc, dish) => {
          if (dish.category) {
            acc[dish.category] = (acc[dish.category] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>)

        const sortedCategories = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([category]) => category)

        setCategories(sortedCategories)
      }
    }
    fetchData()
  }, [supabase])

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
              neighborhood: formData.area,
              created_by: user?.id || null,
            })
            .select()
            .single()

          if (restaurantError) throw restaurantError
          restaurant = newRestaurant
        }
      }

      // Check if dish already exists for this restaurant
      const { data: existingDish } = await supabase
        .from('dishes')
        .select('id')
        .eq('restaurant_id', restaurant.id)
        .eq('name', formData.dishName)
        .maybeSingle()

      let dish
      if (existingDish) {
        dish = existingDish
      } else {
        // Create new dish
        const { data: newDish, error: dishError } = await supabase
          .from('dishes')
          .insert({
            restaurant_id: restaurant.id,
            name: formData.dishName,
            category: formData.dishCategory || null,
            description: null,
            price: null,
            added_by: user?.id || null,
          })
          .select()
          .single()

        if (dishError) throw dishError
        dish = newDish
      }

      // Create initial rating if user provided one
      if (formData.rating > 0 && user) {
        // Check if this is user's first rating
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('first_rating_completed')
          .eq('id', user.id)
          .single()

        const isFirstRating = !userProfile?.first_rating_completed

        const { error: ratingError } = await supabase
          .from('ratings')
          .insert({
            dish_id: dish.id,
            restaurant_id: restaurant.id,
            user_id: user.id,
            rating: formData.rating,
            review_text: null,
            would_order_again: formData.would_order_again,
          })

        if (ratingError) {
          // Check if unique constraint violation
          if (ratingError.code === '23505') {
            // User already rated this dish - redirect to dish page to update
            router.push(`/dishes/${dish.id}`)
            return
          }
          console.error('Error saving rating:', ratingError)
        } else if (isFirstRating) {
          // Update profile for first rating
          await supabase
            .from('profiles')
            .update({
              first_rating_completed: true,
              current_gift: 'egg'
            })
            .eq('id', user.id)
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

      // Redirect to dish page
      router.push(`/dishes/${dish.id}`)
    } catch (err) {
      console.error('Error creating dish:', err)
      setError(err instanceof Error ? err.message : 'Failed to create dish')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientThemedNavBar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
          {/* Form Header */}
          <div className="mb-6 pb-6 border-b-4 border-foreground">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 uppercase tracking-tight">Add & Rate a Dish</h1>
            <p className="text-lg text-muted-foreground uppercase tracking-wide">Add a new dish and share your rating</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive text-destructive-foreground border-4 border-foreground px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-bold text-lg">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="restaurant" className="block text-base md:text-lg font-bold text-foreground mb-3 uppercase tracking-wide">
                Restaurant *
              </label>
              <RestaurantAutocomplete
                value={formData.restaurantName}
                onChange={(name, id) => {
                  console.log('onChange called with name:', name, 'id:', id)
                  setFormData(prev => ({ ...prev, restaurantName: name }))
                  setSelectedRestaurantId(id || null)
                }}
                onNeighborhoodSelect={(neighborhood) => {
                  console.log('onNeighborhoodSelect called with:', neighborhood)
                  setFormData(prev => ({ ...prev, area: neighborhood }))
                }}
              />
              <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wide font-bold">
                Start typing to see existing restaurants
              </p>
            </div>

            <div>
              <label htmlFor="area" className="block text-base md:text-lg font-bold text-foreground mb-3 uppercase tracking-wide">
                Neighborhood *
              </label>
              <select
                id="area"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-3 text-base border-4 border-foreground bg-background text-foreground focus:ring-4 focus:ring-primary focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
              >
                <option value="">Select a neighborhood</option>
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dish" className="block text-base md:text-lg font-bold text-foreground mb-3 uppercase tracking-wide">
                Dish Name *
              </label>
              <input
                type="text"
                id="dish"
                required
                value={formData.dishName}
                onChange={(e) => setFormData({ ...formData, dishName: e.target.value })}
                className="w-full px-4 py-3 text-base border-4 border-foreground bg-background text-foreground focus:ring-4 focus:ring-primary focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Al Pastor Taco"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-base md:text-lg font-bold text-foreground mb-3 uppercase tracking-wide">
                Category (optional)
              </label>
              <select
                id="category"
                value={formData.dishCategory}
                onChange={(e) => setFormData({ ...formData, dishCategory: e.target.value })}
                className="w-full px-4 py-3 text-base border-4 border-foreground bg-background text-foreground focus:ring-4 focus:ring-primary focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Slider */}
            <div className="bg-muted border-4 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <RatingSlider
                value={formData.rating}
                onChange={(rating) => setFormData({ ...formData, rating })}
                label="Your Rating (optional)"
              />
            </div>

            {/* Would Order Again */}
            <div>
              <label className="block text-base md:text-lg font-bold text-foreground mb-3 uppercase tracking-wide">
                Would you order this again?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, would_order_again: true })}
                  className={`flex-1 px-6 py-4 border-4 border-foreground font-bold text-lg uppercase tracking-wide transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                    formData.would_order_again === true
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  ✅ Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, would_order_again: false })}
                  className={`flex-1 px-6 py-4 border-4 border-foreground font-bold text-lg uppercase tracking-wide transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                    formData.would_order_again === false
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  ❌ No
                </button>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-base md:text-lg font-bold text-foreground mb-3 uppercase tracking-wide">
                Add Photos (optional)
              </label>
              <PhotoUpload
                onPhotoUploaded={(url, path) => setPhotos([...photos, { url, path }])}
                currentPhotos={photos.map(p => p.url)}
              />

              {/* Show uploaded photos */}
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={photo.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-28 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground border-2 border-foreground w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xl font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground px-8 py-5 text-xl border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wide transition-all"
              >
                {loading ? 'Submitting...' : 'Add & Rate Dish'}
              </button>
              <Link
                href="/"
                className="px-8 py-5 text-xl border-4 border-foreground bg-background text-foreground hover:bg-muted font-bold uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
