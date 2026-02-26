'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase, type VenueWithDates } from '@/lib/supabase'
import VenueCard from '@/components/VenueCard'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  const [venues, setVenues] = useState<VenueWithDates[]>([])
  const [filteredVenues, setFilteredVenues] = useState<VenueWithDates[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVenues()
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredVenues(venues)
    } else {
      const filtered = venues.filter(venue => 
        venue.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (venue.state && venue.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
        venue.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredVenues(filtered)
    }
  }, [searchTerm, venues])

  async function fetchVenues() {
    try {
      // Fetch venues
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .order('city')

      if (venuesError) throw venuesError

      // Fetch tour dates
      const { data: datesData, error: datesError } = await supabase
        .from('tour_dates')
        .select('*')
        .order('show_date')

      if (datesError) throw datesError

      // Combine venues with their dates
      const venuesWithDates: VenueWithDates[] = (venuesData || []).map(venue => ({
        ...venue,
        tour_dates: (datesData || []).filter(date => date.venue_id === venue.id)
      }))

      // Sort by earliest show date
      venuesWithDates.sort((a, b) => {
        const aEarliestDate = a.tour_dates.length > 0 
          ? new Date(a.tour_dates[0].show_date).getTime() 
          : Infinity
        const bEarliestDate = b.tour_dates.length > 0 
          ? new Date(b.tour_dates[0].show_date).getTime() 
          : Infinity
        return aEarliestDate - bEarliestDate
      })

      setVenues(venuesWithDates)
      setFilteredVenues(venuesWithDates)
    } catch (error) {
      console.error('Error fetching venues:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            src="/btsvenueguide.png"
            alt="BTS Tour Venue Guide"
            width={300}
            height={257}
            priority
            className="mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">
            Find venue policies and show information for your tour dates
          </p>
        </div>

        {/* Search */}
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          venueCount={filteredVenues.length}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading venues...</p>
          </div>
        )}

        {/* Venues List */}
        {!loading && filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm ? 'No venues found matching your search.' : 'No venues available yet.'}
            </p>
          </div>
        )}

        {!loading && filteredVenues.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map(venue => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
