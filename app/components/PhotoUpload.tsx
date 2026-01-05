'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PhotoUploadProps {
  onPhotoUploaded: (url: string, path: string) => void
  maxPhotos?: number
  currentPhotos?: string[]
}

export default function PhotoUpload({ 
  onPhotoUploaded, 
  maxPhotos = 5,
  currentPhotos = []
}: PhotoUploadProps) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      
      if (!e.target.files || e.target.files.length === 0) {
        return
      }

      if (currentPhotos.length >= maxPhotos) {
        setError(`Maximum ${maxPhotos} photos allowed`)
        return
      }

      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      setUploading(true)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to upload photos')
        return
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('dish-photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('dish-photos')
        .getPublicUrl(fileName)

      onPhotoUploaded(publicUrl, fileName)
      
      // Reset input
      e.target.value = ''
    } catch (err) {
      console.error('Error uploading photo:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Add Photo {currentPhotos.length > 0 && `(${currentPhotos.length}/${maxPhotos})`}
      </label>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 transition-colors inline-flex items-center gap-2">
          <span className="text-2xl">📷</span>
          <span className="text-sm font-medium">
            {uploading ? 'Uploading...' : 'Choose Photo'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || currentPhotos.length >= maxPhotos}
            className="hidden"
          />
        </label>
        
        <span className="text-xs text-gray-500">
          Max 5MB, JPG/PNG
        </span>
      </div>
    </div>
  )
}
