"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"
import AddToCartModal from "@/components/AddToCartModal"
import { mockRentals, type RentalListing } from "@/lib/mock-data"

interface Rental {
  id: string
  slug: string
  name: string
  description: string | null
  dailyRate: number
  image: string | null
  categoryId: string
  currentInventory: number
  available: boolean
  specs: Record<string, unknown> | null
  availabilityDate: string | null
  searchTags: string
  category: {
    name: string
  }
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    fetchRentals()
  }, [])

  useEffect(() => {
    filterRentals()
  }, [rentals, searchTerm, selectedCategory])

  const fetchRentals = async () => {
    try {
      const response = await fetch("/api/rentals")
      if (response.ok) {
        const data = await response.json()
        setRentals(
          data.map((item: RentalListing) => ({
            ...item,
            availabilityDate: item.availabilityDate ?? null,
          }))
        )
      } else {
        // If API doesn't exist yet, use mock data
        setRentals(mockRentals)
      }
    } catch (error) {
      console.error("Error fetching rentals:", error)
      setRentals(mockRentals)
    } finally {
      setLoading(false)
    }
  }

  const filterRentals = () => {
    let filtered = rentals

    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(rental =>
        rental.name.toLowerCase().includes(normalizedSearch) ||
        rental.description?.toLowerCase().includes(normalizedSearch) ||
        rental.searchTags.toLowerCase().includes(normalizedSearch)
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(rental =>
        rental.category.name.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setFilteredRentals(filtered)
  }

  const categories = ["all", ...Array.from(new Set(rentals.map(r => r.category.name)))]

  const handleAddToCart = (rental: Rental) => {
    setSelectedItem({
      id: rental.id,
      name: rental.name,
      price: rental.dailyRate,
      image: rental.image,
      type: 'rental' as const,
      category: rental.category.name,
    })
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Walkie Talkie Rentals</h1>
          <p className="text-xl text-gray-600">
            Professional two-way radios for events, construction, security, and more
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
            <div className="text-lg text-gray-600">Loading rentals...</div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredRentals.length} of {rentals.length} rentals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRentals.map((rental) => (
                <div key={rental.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-200 relative">
                    {/* Placeholder for product image */}
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                      📻
                    </div>
                    {rental.availabilityDate && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        Available {new Date(rental.availabilityDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{rental.name}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {rental.category.name}
                      </span>
                    </div>

                    {rental.description && (
                      <p className="text-gray-600 text-sm mb-4">{rental.description}</p>
                    )}

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-bold text-green-600">
                        ${rental.dailyRate.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        per day
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/rentals/${rental.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold text-center"
                      >
                        View Details
                      </Link>
                      <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold"
                        onClick={() => handleAddToCart(rental)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRentals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">No rentals found matching your criteria.</div>
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
