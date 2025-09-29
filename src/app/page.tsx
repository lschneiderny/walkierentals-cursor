import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import FeaturedProducts from "@/components/FeaturedProducts"
import InfoSections from "@/components/InfoSections"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <InfoSections />
      </main>
      <Footer />
    </div>
  )
}
