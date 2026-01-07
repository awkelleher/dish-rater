'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import PhotoUpload from '@/app/components/PhotoUpload'
import RatingSlider from '@/app/components/RatingSlider'

interface RatingFormProps {
  dishId: string
  restaurantId: string
}

export default function RatingForm({ dishId, restaurantId }: RatingFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingRating, setExistingRating] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [photos, setPhotos] = useState<Array<{ url: string; path: string }>>([])

  const [formData, setFormData] = useState({
    rating: 0,
    review_text: '',
    would_order_again: null as boolean | null,
  })

  // Check for existing rating when component mounts
  useEffect(() => {
    async function checkExistingRating() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('ratings')
        .select('*')
        .eq('dish_id', dishId)
        .eq('user_id', user.id)
        .single()

      if (data) {
        setExistingRating(data)
        setFormData({
          rating: data.rating,
          review_text: data.review_text || '',
          would_order_again: data.would_order_again,
        })
      }
    }
    checkExistingRating()
  }, [dishId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      setError('Please select a rating above 0')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      if (existingRating && !isEditing) {
        // User already rated, show error message
        setError("You've already rated this dish! Click 'Update Rating' to change it.")
        setLoading(false)
        return
      }

      const ratingData = {
        dish_id: dishId,
        restaurant_id: restaurantId,
        user_id: user.id,
        rating: formData.rating,
        review_text: formData.review_text || null,
        would_order_again: formData.would_order_again,
      }

      if (existingRating) {
        // Update existing rating
        const { error: updateError } = await supabase
          .from('ratings')
          .update(ratingData)
          .eq('id', existingRating.id)

        if (updateError) throw updateError
      } else {
        // Insert new rating
        const { error: insertError } = await supabase
          .from('ratings')
          .insert(ratingData)

        if (insertError) throw insertError
      }

      // Save photos if any were uploaded
      if (photos.length > 0) {
        const photoInserts = photos.map(photo => ({
          dish_id: dishId,
          user_id: user.id,
          storage_path: photo.path,
          url: photo.url,
        }))

        const { error: photoError } = await supabase
          .from('photos')
          .insert(photoInserts)

        if (photoError) console.error('Error saving photos:', photoError)
      }

      // Show success animation
      setSuccess(true)
      
      // Wait for animation, then redirect
      setTimeout(() => {
        router.push('/explore')
      }, 1500)
    } catch (err) {
      console.error('Error submitting rating:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit rating')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Animation */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center transform transition-all duration-300 scale-100">
            <div className="text-6xl mb-4 animate-bounce">🌮</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {existingRating ? 'Rating Updated!' : 'Rating Submitted!'}
            </h3>
            <p className="text-gray-600">Redirecting to explore...</p>
          </div>
        </div>
      )}

      {/* Existing Rating Notice */}
      {existingRating && !isEditing && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          <p className="font-medium mb-2">You've already rated this taco!</p>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm underline hover:no-underline"
          >
            Click here to update your rating
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          {existingRating && !isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true)
                setError(null)
              }}
              className="block mt-2 text-sm underline hover:no-underline"
            >
              Update your rating instead
            </button>
          )}
        </div>
      )}

      {/* Rating Slider */}
      <RatingSlider
        value={formData.rating}
        onChange={(rating) => setFormData({ ...formData, rating })}
        label="Your Rating"
        required
      />

      {/* Review Text */}
      <div>
        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review (optional)
        </label>
        <textarea
          id="review"
          rows={4}
          value={formData.review_text}
          onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Share your thoughts about this taco..."
        />
      </div>

      {/* Would Order Again */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Would you order this again?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, would_order_again: true })}
            className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
              formData.would_order_again === true
                ? 'bg-green-500 text-white border-green-500'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            ✅ Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, would_order_again: false })}
            className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
              formData.would_order_again === false
                ? 'bg-red-500 text-white border-red-500'
                : 'border-gray-300 hover:border-red-500'
            }`}
          >
            ❌ No
          </button>
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <PhotoUpload
          onPhotoUploaded={(url, path) => setPhotos([...photos, { url, path }])}
          currentPhotos={photos.map(p => p.url)}
          maxPhotos={3}
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
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || formData.rating === 0}
        className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Submitting...' : existingRating && isEditing ? 'Update Rating' : 'Submit Rating'}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={() => {
            setIsEditing(false)
            setFormData({
              rating: existingRating.rating,
              review_text: existingRating.review_text || '',
              would_order_again: existingRating.would_order_again,
            })
          }}
          className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          Cancel Edit
        </button>
      )}
    </form>
  )
}
