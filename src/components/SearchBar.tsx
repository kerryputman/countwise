interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  venueCount: number
}

export default function SearchBar({ searchTerm, onSearchChange, venueCount }: SearchBarProps) {
  return (
    <div className="mb-8">
      <div className="max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search by venue, city, state, or country..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-6 py-4 text-lg rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors"
        />
        <p className="mt-2 text-sm text-gray-500 text-center">
          {venueCount} {venueCount === 1 ? 'venue' : 'venues'} found
        </p>
      </div>
    </div>
  )
}
