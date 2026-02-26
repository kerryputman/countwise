import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database tables
export type Venue = {
  id: string
  venue_name: string
  city: string
  state: string | null
  country: string
  bag_policy: string | null
  prohibited_items: string | null
  notes: string | null
  venue_website_url: string | null
  official_policy_url: string | null
  bts_specific_url: string | null
  created_at: string
  updated_at: string
}

export type TourDate = {
  id: string
  venue_id: string
  show_date: string
  doors_time: string | null
  show_time: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type VenueWithDates = Venue & {
  tour_dates: TourDate[]
}
