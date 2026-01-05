'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import ClientHeader from '@/app/components/ClientHeader'
import PhotoUpload from '@/app/components/PhotoUpload'

export default function NewDishPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const restaurantId = params.id as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [restaurant, setRestaurant] = useState<any>(null)
  const [photos, setPhotos] = useState<Array<{ url: string; path: string }>>([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  })

  useEffect(() => {
    async function fetchRestaurant() {
      const { data } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single()
      
      setRestaurant(data)
    }
    fetchRestaurant()
  }, [restaurantId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error: insertError } = await supabase
        .from('dishes')
        .insert({
          restaurant_id: restaurantId,
          name: formData.name,
          description: formData.description || null,
          category: 'Taco',
          price: formData.price ? parseFloat(formData.price) : null,
          added_by: user?.id || null,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Save photos if any were uploaded
      if (photos.length > 0 && user) {
        const photoInserts = photos.map(photo => ({
          dish_id: data.id,
          user_id: user.id,
          storage_path: photo.path,
          url: photo.url,
        }))

        const { error: photoError } = await supabase
          .from('photos')
          .insert(photoInserts)

        if (photoError) console.error('Error saving photos:', photoError)
      }

      // Reset form for adding another dish
      setFormData({ name: '', description: '', price: '' })
      setPhotos([])
      
      // Show success message
      alert('Taco added! Add another or go to explore.')
    } catch (err) {
      console.error('Error creating dish:', err)
      setError(err instanceof Error ? err.message : 'Failed to create dish')
    } finally {
      setLoading(false)
    }
  }

  if (!restaurant) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Add Tacos</h1>
          <p className="text-gray-600">Adding tacos to {restaurant.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Taco Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Al Pastor Taco"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Marinated pork with pineapple, onions, and cilantro on a corn tortilla"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="3.50"
              />
            </div>
          </div>

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
              {loading ? 'Adding...' : 'Add Taco'}
            </button>
            <Link
              href="/explore"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-center"
            >
              Done - Go to Explore
            </Link>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>After adding a taco, you can add another or go back to explore.</p>
        </div>
      </main>
    </div>
  )
}
