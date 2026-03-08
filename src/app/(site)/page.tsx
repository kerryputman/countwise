import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'countwise',
}

const tools = [
  {
    href: '/calculator',
    icon: '📐',
    name: 'Fabric Calculator',
    description: 'Cut size across common counts, with needle suggestions.',
  },
  {
    href: '/stash',
    icon: '🧵',
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
            <div className="text-3xl mb-3">{tool.icon}</div>
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
