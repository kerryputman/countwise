import type { Metadata } from "next";
import FabricCalculator from "@/components/FabricCalculator";

// Note: Next.js 15.5.x has a regression where layout title templates are not
// applied to static metadata exports. Setting the full title explicitly until fixed.
export const metadata: Metadata = {
  title: "Fabric Calculator | countwise",
};

export default function Page() {
  return <FabricCalculator />;
}
