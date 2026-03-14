import HeroSection from "@/modules/home/UI/views/hero-section";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default async function Page() {

    return(
      <div className="relative h-full">
          <HeroSection />
          <DottedGlowBackground className="-z-10" />
      </div>
    ) 
}