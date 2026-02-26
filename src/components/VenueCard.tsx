import { type VenueWithDates } from '@/lib/supabase'

interface VenueCardProps {
  venue: VenueWithDates
}

export default function VenueCard({ venue }: VenueCardProps) {
  const formatDate = (dateString: string) => {
    // Parse the date string directly to avoid timezone conversion
    const [year, month, day] = dateString.split('T')[0].split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return null
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-t-4 border-purple-500">
      {/* Venue Name and Location */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {venue.venue_name}
        </h2>
        <p className="text-gray-600">
          {venue.city}{venue.state ? `, ${venue.state}` : ''} {venue.country !== 'USA' && `• ${venue.country}`}
        </p>
      </div>

      {/* Tour Dates */}
      {venue.tour_dates.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-purple-700 mb-2">Show Dates</h3>
          {venue.tour_dates.map(date => (
            <div key={date.id} className="mb-2">
              <p className="font-medium text-gray-900">{formatDate(date.show_date)}</p>
              <div className="text-sm text-gray-600">
                {date.doors_time && <span>Doors: {formatTime(date.doors_time)}</span>}
                {date.show_time && <span className="ml-3">Show: {formatTime(date.show_time)}</span>}
              </div>
              {date.notes && <p className="text-sm text-purple-600 mt-1">{date.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Bag Policy */}
      {venue.bag_policy && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-purple-700 mb-1">Bag Policy</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {venue.bag_policy.split('\n').filter(line => line.trim()).map((line, index) => (
              <li key={index}>{line.trim()}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Prohibited Items */}
      {venue.prohibited_items && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-purple-700 mb-1">Prohibited Items</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {venue.prohibited_items.split('\n').filter(line => line.trim()).map((line, index) => (
              <li key={index}>{line.trim()}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {venue.notes && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-purple-700 mb-1">Notes</h3>
          <p className="text-sm text-gray-700">{venue.notes}</p>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-2 mt-4">
        {venue.official_policy_url && (
          <a 
            href={venue.official_policy_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:text-purple-800 underline"
          >
            Official Policy →
          </a>
        )}
        {venue.venue_website_url && (
          <a 
            href={venue.venue_website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:text-purple-800 underline"
          >
            Venue Website →
          </a>
        )}
      </div>
    </div>
  )
}