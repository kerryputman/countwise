import type { Metadata } from 'next'
import FabricCalculator from '@/components/FabricCalculator'

export const metadata: Metadata = {
  title: 'Fabric Calculator',
}

export default function CalculatorPage() {
  return <FabricCalculator />
}
