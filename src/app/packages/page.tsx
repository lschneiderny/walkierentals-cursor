"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"
import AddToCartModal from "@/components/AddToCartModal"
import { mockPackages, type PackageListing } from "@/lib/mock-data"

interface Package {
  id: string
  slug: string
  name: string
  description: string | null
  dailyRate: number
  image: string | null
  categoryId: string
  items: PackageListing[0]["items"]
  searchTags: string
  category: {
    name: string
  }
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages")
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      } else {
        // If API doesn't exist yet, use mock data
        setPackages(mockPackages)
      }
    } catch (error) {
      console.error("Error fetching packages:", error)
      setPackages(mockPackages)
    } finally {
      setLoading(false)
    }
  }

  const handleRentNow = (pkg: Package) => {
    setSelectedItem({
      id: pkg.id,
      name: pkg.name,
      price: pkg.dailyRate,
      image: pkg.image,
      type: 'rental' as const,
      category: pkg.category.name,
    })
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rental Packages</h1>
          <p className="text-xl text-gray-600">
            Pre-configured walkie talkie packages perfect for events of any size
          </p>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading packages...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 relative">
                  {/* Placeholder for package image */}
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                    📦
                  </div>
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    POPULAR
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {pkg.category.name}
                    </span>
                  </div>

                  {pkg.description && (
                    <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                  )}

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Package Includes:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {Array.isArray(pkg.items) ? (
                        pkg.items.slice(0, 3).map((item: any, index: number) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {item.name || `Item ${index + 1}`}
                          </li>
                        ))
                      ) : (
                        <li className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          Pre-configured walkie talkie set
                        </li>
                      )}
                      {Array.isArray(pkg.items) && pkg.items.length > 3 && (
                        <li className="text-gray-500">
                          +{pkg.items.length - 3} more items
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="text-3xl font-bold text-green-600">
                      ${pkg.dailyRate.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      per day
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/packages/${pkg.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-semibold text-center"
                    >
                      View Details
                    </Link>
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded font-semibold"
                      onClick={() => handleRentNow(pkg)}
                    >
                      Rent Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Package CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Package?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Don't see what you're looking for? We can create a custom package tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold"
            >
              Contact Us
            </Link>
            <Link
              href="/rentals"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Build Your Own
            </Link>
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
