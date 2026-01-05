export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          zip_code: string | null
          neighborhood: string | null
          cuisine_type: string[] | null
          price_range: number | null
          phone: string | null
          website: string | null
          google_place_id: string | null
          latitude: number | null
          longitude: number | null
          created_by: string | null
          created_at: string
          updated_at: string
          is_verified: boolean
        }
        Insert: {
          id?: string
          name: string
          address: string
          city?: string
          state?: string
          zip_code?: string | null
          neighborhood?: string | null
          cuisine_type?: string[] | null
          price_range?: number | null
          phone?: string | null
          website?: string | null
          google_place_id?: string | null
          latitude?: number | null
          longitude?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_verified?: boolean
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string | null
          neighborhood?: string | null
          cuisine_type?: string[] | null
          price_range?: number | null
          phone?: string | null
          website?: string | null
          google_place_id?: string | null
          latitude?: number | null
          longitude?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_verified?: boolean
        }
      }
      dishes: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          category: string | null
          price: number | null
          is_available: boolean
          added_by: string | null
          created_at: string
          updated_at: string
          rating_count: number
          average_rating: number
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          category?: string | null
          price?: number | null
          is_available?: boolean
          added_by?: string | null
          created_at?: string
          updated_at?: string
          rating_count?: number
          average_rating?: number
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          category?: string | null
          price?: number | null
          is_available?: boolean
          added_by?: string | null
          created_at?: string
          updated_at?: string
          rating_count?: number
          average_rating?: number
        }
      }
      ratings: {
        Row: {
          id: string
          dish_id: string
          user_id: string
          restaurant_id: string
          rating: number
          review_text: string | null
          visit_date: string | null
          would_order_again: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dish_id: string
          user_id: string
          restaurant_id: string
          rating: number
          review_text?: string | null
          visit_date?: string | null
          would_order_again?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dish_id?: string
          user_id?: string
          restaurant_id?: string
          rating?: number
          review_text?: string | null
          visit_date?: string | null
          would_order_again?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          dish_id: string
          rating_id: string | null
          user_id: string
          storage_path: string
          url: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          dish_id: string
          rating_id?: string | null
          user_id: string
          storage_path: string
          url: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          dish_id?: string
          rating_id?: string | null
          user_id?: string
          storage_path?: string
          url?: string
          caption?: string | null
          created_at?: string
        }
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      helpful_votes: {
        Row: {
          rating_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          rating_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          rating_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      top_rated_dishes: {
        Row: {
          id: string | null
          dish_name: string | null
          description: string | null
          price: number | null
          category: string | null
          average_rating: number | null
          rating_count: number | null
          restaurant_id: string | null
          restaurant_name: string | null
          neighborhood: string | null
          cuisine_type: string[] | null
        }
      }
      user_feed: {
        Row: {
          rating_id: string | null
          rating: number | null
          review_text: string | null
          created_at: string | null
          dish_name: string | null
          dish_id: string | null
          restaurant_name: string | null
          restaurant_id: string | null
          username: string | null
          avatar_url: string | null
          user_id: string | null
        }
      }
    }
  }
}
