import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | countwise',
    default: 'countwise',
  },
  description: 'Small tools for cross-stitchers',
  openGraph: {
    title: 'countwise',
    description: 'Small tools for cross-stitchers',
    url: 'https://countwise.lownoiselabs.dev',
    siteName: 'countwise',
    images: [
      {
        url: '/og-image.png',
        width: 1280,
        height: 640,
        alt: 'countwise — Small tools for cross-stitchers',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'countwise',
    description: 'Small tools for cross-stitchers',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
