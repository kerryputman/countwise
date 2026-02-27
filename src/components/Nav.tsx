import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="border-b border-linen-200 bg-white">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold tracking-tight text-linen-900 hover:text-sage-600 transition-colors"
        >
          countwise
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-linen-700 hover:text-sage-600 transition-colors"
          >
            Fabric Calculator
          </Link>
        </div>
      </div>
    </nav>
  )
}
