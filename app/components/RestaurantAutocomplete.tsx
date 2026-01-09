'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RestaurantAutocompleteProps {
  value: string
  onChange: (value: string, restaurantId?: string) => void
  onNeighborhoodSelect?: (neighborhood: string) => void
}

export default function RestaurantAutocomplete({
  value,
  onChange,
  onNeighborhoodSelect
}: RestaurantAutocompleteProps) {
  const supabase = createClient()
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search for restaurants as user types
  useEffect(() => {
    async function searchRestaurants() {
      setLoading(true)

      try {
        // If no value or short value, show all restaurants
        if (value.length < 1) {
          const { data, error } = await supabase
            .from('restaurants')
            .select('id, name, neighborhood')
            .eq('city', 'Jersey City')
            .order('name')
            .limit(10)

          if (error) {
            console.error('Error fetching restaurants:', error)
          }

          console.log('All restaurants:', data)
          setSuggestions(data || [])
          setLoading(false)
          return
        }

        // Otherwise, search by name
        console.log('Searching for:', value)
        const { data, error } = await supabase
          .from('restaurants')
          .select('id, name, neighborhood')
          .eq('city', 'Jersey City')
          .ilike('name', `%${value}%`)
          .order('name')
          .limit(10)

        if (error) {
          console.error('Error searching restaurants:', error)
        }

        console.log('Search results:', data)
        setSuggestions(data || [])
        setLoading(false)
      } catch (err) {
        console.error('Exception in searchRestaurants:', err)
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchRestaurants, 300)
    return () => clearTimeout(timeoutId)
  }, [value, supabase])

  const handleSelect = (restaurant: any) => {
    console.log('Selected restaurant:', restaurant)
    onChange(restaurant.name, restaurant.id)
    // Auto-fill neighborhood when restaurant is selected
    if (onNeighborhoodSelect && restaurant.neighborhood) {
      console.log('Auto-filling neighborhood:', restaurant.neighborhood)
      onNeighborhoodSelect(restaurant.neighborhood)
    }
    setShowSuggestions(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        className="w-full px-4 py-3 text-base border-4 border-foreground bg-background text-foreground focus:ring-4 focus:ring-primary focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
        placeholder="Taqueria Downtown"
        autoComplete="off"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-h-60 overflow-auto">
          {suggestions.map((restaurant) => (
            <button
              key={restaurant.id}
              type="button"
              onClick={() => handleSelect(restaurant)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b-2 border-border last:border-b-0"
            >
              <div className="font-bold text-foreground uppercase tracking-wide">{restaurant.name}</div>
              {restaurant.neighborhood && (
                <div className="text-sm text-muted-foreground font-bold uppercase tracking-wide">{restaurant.neighborhood}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-4 top-4">
          <div className="animate-spin h-5 w-5 border-2 border-muted-foreground border-t-foreground"></div>
        </div>
      )}
    </div>
  )
}
