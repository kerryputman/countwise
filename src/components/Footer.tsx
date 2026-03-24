import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-sage-800 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* LNL Logo */}
          <Link href="https://lownoiselabs.dev" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <Image
              src="/lnl-logo.png"
              alt="Low Noise Labs"
              width={80}
              height={80}
              className="rounded-md opacity-80 ring-2 ring-sage-400"
            />
          </Link>

          {/* Profile Image */}
          <div className="flex-shrink-0">
            <Image
              src="/developer-avatar.png"
              alt="Developer"
              width={80}
              height={80}
              className="rounded-full border-4 border-sage-400"
            />
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <p className="text-sage-300 text-xs mt-2">
              Part of{' '}
              <Link href="https://lownoiselabs.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                Low Noise Labs
              </Link>
              {' '}• Small tools, gentle systems.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
