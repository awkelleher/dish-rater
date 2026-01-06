'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RestaurantAutocompleteProps {
  value: string
  onChange: (value: string, restaurantId?: string) => void
  onNeighborhoodSelect?: (neighborhood: string) => void
  onAreaSelect?: (area: string) => void
}

export default function RestaurantAutocomplete({
  value,
  onChange,
  onNeighborhoodSelect,
  onAreaSelect
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
      if (value.length < 2) {
        setSuggestions([])
        return
      }

      setLoading(true)
      const { data } = await supabase
        .from('restaurants')
        .select('id, name, neighborhood, area')
        .eq('city', 'Jersey City')
        .ilike('name', `%${value}%`)
        .limit(5)

      setSuggestions(data || [])
      setShowSuggestions(true)
      setLoading(false)
    }

    const timeoutId = setTimeout(searchRestaurants, 300)
    return () => clearTimeout(timeoutId)
  }, [value, supabase])

  const handleSelect = (restaurant: any) => {
    onChange(restaurant.name, restaurant.id)
    if (onNeighborhoodSelect && restaurant.neighborhood) {
      onNeighborhoodSelect(restaurant.neighborhood)
    }
    if (onAreaSelect && restaurant.area) {
      onAreaSelect(restaurant.area)
    }
    setShowSuggestions(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        placeholder="Taqueria Downtown"
        autoComplete="off"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((restaurant) => (
            <button
              key={restaurant.id}
              type="button"
              onClick={() => handleSelect(restaurant)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0"
            >
              <div className="font-medium text-gray-900">{restaurant.name}</div>
              {restaurant.area && (
                <div className="text-sm text-gray-500">{restaurant.area}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-black rounded-full"></div>
        </div>
      )}
    </div>
  )
}
