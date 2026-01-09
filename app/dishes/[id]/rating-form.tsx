'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import PhotoUpload from '@/app/components/PhotoUpload'
import RatingSlider from '@/app/components/RatingSlider'
import FirstRatingCelebration from '@/app/components/FirstRatingCelebration'

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
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [existingRatingValue, setExistingRatingValue] = useState<number | null>(null)
  const [photos, setPhotos] = useState<Array<{ url: string; path: string }>>([])
  const [showFirstRatingCelebration, setShowFirstRatingCelebration] = useState(false)

  const [formData, setFormData] = useState({
    rating: 0,
    would_order_again: null as boolean | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.rating === 0) {
      setError('Please select a rating above 0')
      return
    }

    setLoading(true)
    setError(null)
    setShowUpdatePrompt(false)

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const ratingData = {
        dish_id: dishId,
        restaurant_id: restaurantId,
        user_id: user.id,
        rating: formData.rating,
        review_text: null,
        would_order_again: formData.would_order_again,
      }

      // Check if this is user's first rating
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('first_rating_completed')
        .eq('id', user.id)
        .single()

      const isFirstRating = !userProfile?.first_rating_completed

      // Try to insert new rating - database will enforce unique constraint
      const { error: insertError } = await supabase
        .from('ratings')
        .insert(ratingData)

      if (insertError) {
        // Check if it's a unique constraint violation (user already rated)
        if (insertError.code === '23505') {
          // Get the existing rating value
          const { data: existing } = await supabase
            .from('ratings')
            .select('rating')
            .eq('dish_id', dishId)
            .eq('user_id', user.id)
            .single()

          setExistingRatingValue(existing?.rating || null)
          setShowUpdatePrompt(true)
          setError(`You've already rated this dish with ${existing?.rating || '?'} stars.`)
          setLoading(false)
          return
        }
        throw insertError
      }

      // If first rating, update profile and show celebration
      if (isFirstRating) {
        await supabase
          .from('profiles')
          .update({
            first_rating_completed: true,
            current_gift: 'egg'
          })
          .eq('id', user.id)
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

      // Show appropriate animation
      if (isFirstRating) {
        setShowFirstRatingCelebration(true)
        // First rating celebration will handle redirect after 4 seconds
      } else {
        setSuccess(true)
        // Wait for animation, then redirect
        setTimeout(() => {
          router.push('/')
        }, 1500)
      }
    } catch (err) {
      console.error('Error submitting rating:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit rating')
      setLoading(false)
    }
  }

  // Handle updating existing rating
  const handleUpdate = async () => {
    if (formData.rating === 0) {
      setError('Please select a rating above 0')
      return
    }

    setLoading(true)
    setError(null)
    setShowUpdatePrompt(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('ratings')
        .update({
          rating: formData.rating,
          review_text: null,
          would_order_again: formData.would_order_again,
        })
        .eq('dish_id', dishId)
        .eq('user_id', user.id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (err) {
      console.error('Error updating rating:', err)
      setError(err instanceof Error ? err.message : 'Failed to update rating')
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
      {/* First Rating Celebration */}
      {showFirstRatingCelebration && (
        <FirstRatingCelebration
          onClose={() => {
            setShowFirstRatingCelebration(false)
            router.push('/')
          }}
        />
      )}

      {/* Form Header - Landing Page Theme Applied */}
      <div className="mb-6 pb-6 border-b-4 border-foreground">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 uppercase tracking-tight">
          Rate This Dish
        </h2>
        <p className="text-lg text-muted-foreground uppercase tracking-wide">Share your honest review</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Animation */}
        {success && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-in fade-in duration-300">
            <div className="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 text-center animate-in zoom-in duration-500">
              <div className="text-6xl mb-4 animate-bounce">🌮</div>
              <h3 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-wide">
                {showUpdatePrompt ? 'Rating Updated!' : 'Rating Submitted!'}
              </h3>
              <p className="text-muted-foreground uppercase tracking-wide font-bold">Redirecting home...</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-destructive text-destructive-foreground border-4 border-foreground px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-lg">{error}</p>
            {showUpdatePrompt && (
              <div className="mt-4">
                <p className="text-sm mb-3">Would you like to update your rating to {formData.rating} stars?</p>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground px-6 py-3 text-base border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wide transition-all"
                >
                  {loading ? 'Updating...' : 'Update My Rating'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Rating Slider */}
        <div className="bg-muted border-4 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <RatingSlider
            value={formData.rating}
            onChange={(rating) => setFormData({ ...formData, rating })}
            label="Your Rating"
            required
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
            maxPhotos={3}
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

        <button
          type="submit"
          disabled={loading || formData.rating === 0}
          className="w-full bg-primary text-primary-foreground px-8 py-5 text-xl border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wide transition-all"
        >
          {loading ? 'Submitting...' : 'Submit Rating'}
        </button>
      </form>
    </div>
  )
}
