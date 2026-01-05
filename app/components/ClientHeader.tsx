'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ClientHeader() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    getUser()
  }, [])

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/explore" className="text-2xl font-bold hover:text-gray-700 transition-colors">
          DishRate
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/explore" className="text-gray-700 hover:text-black transition-colors">
            Explore
          </Link>
          <Link href="/restaurants/new" className="text-gray-700 hover:text-black transition-colors">
            Add Dish
          </Link>
          {user && profile ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-medium">
                {profile.full_name || profile.username}
              </span>
            </div>
          ) : (
            <Link 
              href="/auth/login" 
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
