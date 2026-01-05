'use client'

import { useState } from 'react'

interface RatingSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  required?: boolean
}

export default function RatingSlider({ 
  value, 
  onChange, 
  label = "Rating",
  required = false 
}: RatingSliderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600'
    if (rating >= 6) return 'text-yellow-600'
    if (rating >= 4) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRatingLabel = (rating: number) => {
    if (rating === 0) return 'Not rated'
    if (rating >= 9) return 'Exceptional'
    if (rating >= 8) return 'Excellent'
    if (rating >= 7) return 'Great'
    if (rating >= 6) return 'Good'
    if (rating >= 5) return 'Decent'
    if (rating >= 4) return 'Okay'
    if (rating >= 3) return 'Meh'
    if (rating >= 2) return 'Poor'
    return 'Terrible'
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && '*'}
      </label>
      
      <div className="space-y-4">
        {/* Rating Display */}
        <div className="text-center">
          <div className={`text-6xl font-bold ${getRatingColor(value)} transition-colors`}>
            {value.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 font-medium mt-1">
            {getRatingLabel(value)}
          </div>
        </div>

        {/* Slider */}
        <div className="relative px-2">
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-black
              [&::-webkit-slider-thumb]:cursor-grab
              [&::-webkit-slider-thumb]:active:cursor-grabbing
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform
              [&::-moz-range-thumb]:w-6
              [&::-moz-range-thumb]:h-6
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-black
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-grab
              [&::-moz-range-thumb]:active:cursor-grabbing
              [&::-moz-range-thumb]:hover:scale-110
              [&::-moz-range-thumb]:transition-transform
            "
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
            }}
          />
          
          {/* Scale markers */}
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8</span>
            <span>10</span>
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="flex gap-2 flex-wrap justify-center">
          {[0, 2, 4, 6, 8, 10].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                Math.abs(value - rating) < 0.5
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
