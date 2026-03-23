'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  function linkClass(href: string) {
    return `text-sm transition-colors ${
      pathname === href
        ? 'text-sage-600 font-medium'
        : 'text-linen-700 hover:text-sage-600'
    }`
  }

  return (
    <nav className="border-b border-linen-200 bg-white">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/countwise-logo-transparent.png"
            alt="countwise"
            width={909}
            height={342}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/calculator" className={linkClass('/calculator')}>
            Fabric Calculator
          </Link>
          <Link href="/stash" className={linkClass('/stash')}>
            Stitch Stash
          </Link>
        </div>
      </div>
    </nav>
  )
}
