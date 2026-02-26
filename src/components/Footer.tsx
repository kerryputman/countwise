import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <Image 
              src="/developer-avatar.png" 
              alt="Developer" 
              width={80} 
              height={80}
              className="rounded-full border-4 border-purple-400"
            />
          </div>
          
          {/* Info */}
          <div className="text-center md:text-left">
            <p className="text-purple-300 text-xs mt-2">
              Part of Low Noise Labs • Small tools, gentle systems
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
