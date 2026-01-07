'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Dish {
  id: string
  name: string
  rating_avg: number | null
  rating_count: number
  similarity_score?: number
}

interface DishAutocompleteProps {
  restaurantId: string
  value: string
  onChange: (value: string) => void
  onSelectDish?: (dish: Dish | null) => void
  placeholder?: string
  className?: string
  showSimilarityScores?: boolean  // For debugging
}

export function DishAutocompleteFuzzy({
  restaurantId,
  value,
  onChange,
  onSelectDish,
  placeholder = "Enter dish name...",
  className = "",
  showSimilarityScores = false
}: DishAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Dish[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions using fuzzy matching function
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        // Call the PostgreSQL function for fuzzy matching
        const { data, error } = await supabase
          .rpc('get_similar_dishes', {
            p_restaurant_id: restaurantId,
            p_search_text: value,
            p_limit: 5
          })

        if (error) {
          console.warn('Fuzzy matching function not available, falling back to ILIKE:', error)
          
          // Fallback to simple ILIKE if function doesn't exist
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('dishes')
            .select('id, name, rating_avg, rating_count')
            .eq('restaurant_id', restaurantId)
            .ilike('name', `%${value}%`)
            .order('rating_count', { ascending: false })
            .limit(5)

          if (fallbackError) throw fallbackError
          
          setSuggestions(fallbackData || [])
          setIsOpen((fallbackData || []).length > 0)
        } else {
          setSuggestions(data || [])
          setIsOpen((data || []).length > 0)
        }
      } catch (error) {
        console.error('Error fetching dish suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(debounce)
  }, [value, restaurantId, supabase])

  const handleSelect = (dish: Dish) => {
    onChange(dish.name)
    onSelectDish?.(dish)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const formatRatingInfo = (dish: Dish) => {
    if (dish.rating_count === 0) return 'No ratings yet'
    
    const stars = dish.rating_avg ? dish.rating_avg.toFixed(1) : '0.0'
    const count = dish.rating_count
    
    return `★ ${stars} (${count})`
  }

  const highlightMatch = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return text

    return (
      <>
        {text.slice(0, index)}
        <span className="bg-yellow-200 font-semibold">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </>
    )
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full" />
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="py-1">
            {suggestions.map((dish, index) => (
              <button
                key={dish.id}
                type="button"
                onClick={() => handleSelect(dish)}
                className={`w-full text-left px-4 py-2.5 hover:bg-gray-100 transition-colors ${
                  index === selectedIndex ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {highlightMatch(dish.name, value)}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {formatRatingInfo(dish)}
                    </div>
                  </div>
                  {showSimilarityScores && dish.similarity_score && (
                    <div className="text-xs text-gray-400 font-mono">
                      {(dish.similarity_score * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
            <p className="text-xs text-gray-600">
              <span className="font-medium">💡 Tip:</span> Select existing dish to pool ratings together
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
