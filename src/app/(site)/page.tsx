import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: {
    absolute: 'Countwise — Small tools for cross-stitchers',
  },
}

const RulerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="w-8 h-8 mb-3 text-sage-500"
  >
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z" />
    <path d="m14.5 12.5 2-2" />
    <path d="m11.5 9.5 2-2" />
    <path d="m8.5 6.5 2-2" />
    <path d="m17.5 15.5 2-2" />
  </svg>
)

const PaletteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="w-8 h-8 mb-3 text-sage-500"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
)

const CalcPreview = () => (
  <svg viewBox="0 0 200 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-lg" aria-hidden="true">
    {/* Header row */}
    <rect width="200" height="18" fill="#d4e5d6" />
    <rect x="6" y="5" width="26" height="7" rx="3" fill="#7a9e7e" opacity="0.8" />
    <rect x="52" y="5" width="22" height="7" rx="3" fill="#7a9e7e" opacity="0.8" />
    <rect x="96" y="5" width="44" height="7" rx="3" fill="#7a9e7e" opacity="0.8" />
    <rect x="162" y="5" width="28" height="7" rx="3" fill="#7a9e7e" opacity="0.8" />
    {/* Row 1 */}
    <rect y="18" width="200" height="17" fill="white" />
    <rect x="6" y="23" width="22" height="6" rx="2" fill="#c8d9c9" />
    <rect x="52" y="23" width="16" height="6" rx="2" fill="#c8d9c9" />
    <rect x="96" y="23" width="52" height="6" rx="2" fill="#c8d9c9" />
    <rect x="162" y="23" width="20" height="6" rx="2" fill="#c8d9c9" />
    {/* Row 2 */}
    <rect y="35" width="200" height="17" fill="#f9f6f0" />
    <rect x="6" y="40" width="22" height="6" rx="2" fill="#c8d9c9" />
    <rect x="52" y="40" width="16" height="6" rx="2" fill="#c8d9c9" />
    <rect x="96" y="40" width="52" height="6" rx="2" fill="#c8d9c9" />
    <rect x="162" y="40" width="20" height="6" rx="2" fill="#c8d9c9" />
    {/* Row 3 */}
    <rect y="52" width="200" height="17" fill="white" />
    <rect x="6" y="57" width="22" height="6" rx="2" fill="#c8d9c9" />
    <rect x="52" y="57" width="16" height="6" rx="2" fill="#c8d9c9" />
    <rect x="96" y="57" width="52" height="6" rx="2" fill="#c8d9c9" />
    <rect x="162" y="57" width="20" height="6" rx="2" fill="#c8d9c9" />
  </svg>
)

const SWATCH_COLORS = [
  '#C5283D', '#E8845A', '#F5C518', '#9DC86A', '#4A90D9', '#9B59B6',
  '#FF6B9D', '#1ABC9C', '#6B4F3A', '#E67E22', '#2E7D52', '#5C7EA8',
  '#F0C8B8', '#B8D4E8', '#C8E6C9', '#F8E0A0', '#D4B0C8', '#B0B0A8',
]

const StashPreview = () => {
  const cols = 6
  const rows = 3
  const r = 10
  const colSpacing = 30
  const rowSpacing = 22
  const startX = 13
  const startY = 13
  return (
    <svg viewBox="0 0 200 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-lg" aria-hidden="true">
      <rect width="200" height="68" fill="white" />
      {SWATCH_COLORS.slice(0, cols * rows).map((color, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const cx = startX + col * colSpacing
        const cy = startY + row * rowSpacing
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill={color} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        )
      })}
    </svg>
  )
}

const tools = [
  {
    href: '/calculator',
    icon: <RulerIcon />,
    preview: <CalcPreview />,
    name: 'Fabric Calculator',
    description: 'Cut size across common counts, with needle suggestions.',
  },
  {
    href: '/stash',
    icon: <PaletteIcon />,
    preview: <StashPreview />,
    name: 'Stitch Stash',
    description: 'Track your DMC thread inventory and organise by project.',
  },
]

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <Image
          src="/countwise-logo-transparent.png"
          alt="countwise"
          width={909}
          height={342}
          className="h-24 w-auto mx-auto mb-4"
          priority
        />
        <p className="text-linen-500 text-lg">
          Small tools for cross-stitchers.
        </p>
        <p className="mt-2 text-sm text-linen-400 tracking-wide">
          Free · No account needed · Works on mobile
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group bg-white border border-linen-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-sage-200 transition-all"
          >
            {tool.icon}
            <h2 className="font-semibold text-linen-900 group-hover:text-sage-600 transition-colors">
              {tool.name}
            </h2>
            <p className="mt-1 text-sm text-linen-500">{tool.description}</p>
            <div className="mt-4 rounded-lg overflow-hidden border border-linen-100">
              {tool.preview}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
