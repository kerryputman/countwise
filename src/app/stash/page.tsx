import type { Metadata } from 'next'
import StitchStash from '@/components/StitchStash'

export const metadata: Metadata = {
  title: 'Stitch Stash',
}

export default function StashPage() {
  return <StitchStash />
}
