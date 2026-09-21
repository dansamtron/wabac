import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"
import { Hero } from "../components/home/Hero"
import { Features } from "../components/home/Features"
import { Marketplace } from "../components/home/Marketplace"
import { HowItWorks } from "../components/home/HowItWorks"
import { Pricing } from "../components/home/Pricing"
import { FinalCTA } from "../components/home/FinalCTA"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1a1a1a] selection:bg-[#0B9C74]/20">
      <Header />
      <main>
        <Hero />
        <Features />
        <Marketplace />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
