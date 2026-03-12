import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Stitch Stash | countwise',
}

export default function StashLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${playfair.variable} ${dmSans.variable}`}>
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
