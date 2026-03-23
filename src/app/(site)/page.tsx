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

const tools = [
  {
    href: '/calculator',
    icon: <RulerIcon />,
    name: 'Fabric Calculator',
    description: 'Cut size across common counts, with needle suggestions.',
  },
  {
    href: '/stash',
    icon: <PaletteIcon />,
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
          </Link>
        ))}
      </div>
    </main>
  )
}
