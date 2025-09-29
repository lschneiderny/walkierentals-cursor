"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"
import AddToCartModal from "@/components/AddToCartModal"
import { mockRetailItems, type RetailItemListing } from "@/lib/mock-data"

interface RetailItem {
  id: string
  slug: string
  name: string
  description: string | null
  unitCost: number
  image: string | null
  categoryId: string
  currentInventory: number
  available: boolean
  specs: Record<string, unknown> | null
  searchTags: string
  category: {
    name: string
  }
}

export default function StorePage() {
  const [storeItems, setStoreItems] = useState<RetailItem[]>([])
  const [filteredItems, setFilteredItems] = useState<RetailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    fetchStoreItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [storeItems, searchTerm, selectedCategory])

  const fetchStoreItems = async () => {
    try {
      const response = await fetch("/api/store")
      if (response.ok) {
        const data = await response.json()
        setStoreItems(data as RetailItemListing[])
      } else {
        // If API doesn't exist yet, use mock data
        setStoreItems(mockRetailItems)
      }
    } catch (error) {
      console.error("Error fetching store items:", error)
      setStoreItems(mockRetailItems)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = storeItems

    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description?.toLowerCase().includes(normalizedSearch) ||
        item.searchTags.toLowerCase().includes(normalizedSearch)
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item =>
        item.category.name.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setFilteredItems(filtered)
  }

  const categories = ["all", ...Array.from(new Set(storeItems.map(item => item.category.name)))]

  const handleAddToCart = (item: RetailItem) => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      price: item.unitCost,
      image: item.image,
      type: 'store' as const,
      category: item.category.name,
    })
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Walkie Talkie Store</h1>
          <p className="text-xl text-gray-600">
            Professional accessories, headsets, and equipment for your communication needs
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredItems.length} of {storeItems.length} products
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-200 relative">
                    {/* Placeholder for product image */}
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                      {item.category.name.toLowerCase().includes('headset') || item.category.name.toLowerCase().includes('earpiece') ? '🎧' :
                       item.category.name.toLowerCase().includes('case') ? '💼' :
                       item.category.name.toLowerCase().includes('battery') ? '🔋' :
                       item.category.name.toLowerCase().includes('antenna') ? '📡' : '📱'}
                    </div>
                    {!item.available && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.category.name}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    )}

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-bold text-green-600">
                        ${item.unitCost.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.currentInventory > 0 ? `${item.currentInventory} in stock` : 'Out of stock'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/store/${item.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold text-center"
                      >
                        View Details
                      </Link>
                      <button
                        className={`flex-1 py-2 px-4 rounded font-semibold text-center ${
                          item.available && item.currentInventory > 0
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                        disabled={!item.available || item.currentInventory === 0}
                        onClick={() => item.available && item.currentInventory > 0 && handleAddToCart(item)}
                      >
                        {item.available && item.currentInventory > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">No products found matching your criteria.</div>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Featured Categories */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Shop by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Headsets & Earpieces", icon: "🎧", description: "Professional audio accessories" },
              { name: "Batteries & Chargers", icon: "🔋", description: "Power solutions for all devices" },
              { name: "Carrying Cases", icon: "💼", description: "Protection and transport solutions" },
              { name: "Antennas & Accessories", icon: "📡", description: "Range extenders and specialty items" }
            ].map((category, index) => (
              <Link
                key={index}
                href={`/store?category=${encodeURIComponent(category.name)}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {selectedItem && (
        <AddToCartModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedItem(null)
          }}
          item={selectedItem}
        />
      )}
    </div>
  )
}

// Mock data for development
const mockRetailItemsData: RetailItem[] = [
  {
    id: "retail-1",
    slug: "professional-over-ear-headset",
    name: "Professional Over-Ear Headset",
    description: "Noise-canceling headset with boom microphone for clear communication",
    unitCost: 89.99,
    image: null,
    categoryId: "1",
    currentInventory: 25,
    available: true,
    specs: { type: "Over-ear", noiseCanceling: true, microphone: "Boom" },
    searchTags: "headset, professional, audio",
    category: { name: "Headsets" }
  },
  {
    id: "retail-2",
    slug: "surveillance-earpiece-kit",
    name: "Surveillance Earpiece Kit",
    description: "Discreet earpiece with clear acoustic tube for security personnel",
    unitCost: 34.99,
    image: null,
    categoryId: "1",
    currentInventory: 15,
    available: true,
    specs: { type: "Earpiece", style: "Acoustic tube", color: "Black" },
    searchTags: "earpiece, surveillance, discreet",
    category: { name: "Headsets" }
  },
  {
    id: "retail-3",
    slug: "multi-unit-desktop-charger",
    name: "Multi-Unit Desktop Charger",
    description: "6-bay desktop charger compatible with Motorola XPR series",
    unitCost: 299.99,
    image: null,
    categoryId: "2",
    currentInventory: 8,
    available: true,
    specs: { bays: 6, compatibility: "Motorola XPR", voltage: "12V" },
    searchTags: "charger, desktop, multi-unit",
    category: { name: "Chargers" }
  },
  {
    id: "retail-4",
    slug: "high-capacity-battery-pack",
    name: "High-Capacity Battery Pack",
    description: "Extended life Li-Ion battery for prolonged use in demanding environments",
    unitCost: 79.99,
    image: null,
    categoryId: "2",
    currentInventory: 30,
    available: true,
    specs: { capacity: "3000mAh", chemistry: "Li-Ion", voltage: "7.4V" },
    searchTags: "battery, li-ion, high-capacity",
    category: { name: "Batteries" }
  },
  {
    id: "retail-5",
    slug: "waterproof-protective-case",
    name: "Waterproof Protective Case",
    description: "Hard-shell case with foam interior for safe transport of 6 walkie talkies",
    unitCost: 149.99,
    image: null,
    categoryId: "3",
    currentInventory: 12,
    available: true,
    specs: { capacity: 6, material: "ABS plastic", waterproof: "IP67" },
    searchTags: "case, waterproof, transport",
    category: { name: "Cases" }
  },
  {
    id: "retail-6",
    slug: "belt-clip-and-holster-combo",
    name: "Belt Clip and Holster Combo",
    description: "Heavy-duty belt clip with quick-release holster for professional use",
    unitCost: 24.99,
    image: null,
    categoryId: "4",
    currentInventory: 45,
    available: true,
    specs: { material: "Nylon", attachment: "Belt clip", quickRelease: true },
    searchTags: "holster, belt clip, accessory",
    category: { name: "Accessories" }
  },
  {
    id: "retail-7",
    slug: "external-antenna-kit",
    name: "External Antenna Kit",
    description: "High-gain antenna for extended range in outdoor environments",
    unitCost: 59.99,
    image: null,
    categoryId: "4",
    currentInventory: 20,
    available: true,
    specs: { gain: "5dBi", frequency: "VHF/UHF", connector: "SMA" },
    searchTags: "antenna, high-gain, outdoor",
    category: { name: "Antennas" }
  },
  {
    id: "retail-8",
    slug: "programming-cable",
    name: "Programming Cable",
    description: "USB programming cable for walkie talkie configuration and updates",
    unitCost: 29.99,
    image: null,
    categoryId: "4",
    currentInventory: 18,
    available: true,
    specs: { interface: "USB", compatibility: "Multiple brands", length: "6ft" },
    searchTags: "programming, cable, usb",
    category: { name: "Accessories" }
  }
]
