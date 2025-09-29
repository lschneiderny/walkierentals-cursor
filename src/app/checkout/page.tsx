"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/lib/cart-context"
import { Calendar, CreditCard, User, MapPin } from "lucide-react"

export default function CheckoutPage() {
  const { state, clearCart, getTotalCost } = useCart()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)

  const handleCheckout = async () => {
    setProcessing(true)

    // Simulate checkout process
    setTimeout(() => {
      alert("Order placed successfully! (This is a demo)")
      clearCart()
      router.push("/")
    }, 2000)
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some items before checking out.</p>
            <button
              onClick={() => router.push("/rentals")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Browse Rentals
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not selected'
    return date.toLocaleDateString()
  }

  const calculateItemTotal = (item: any) => {
    if (item.type === 'rental' && item.rentalDays) {
      return item.price * item.rentalDays * item.quantity
    }
    return item.price * item.quantity
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-2xl">
                      {item.type === 'rental' ? '📻' : '🛒'}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.type === 'rental' ? 'Rental' : 'Purchase'}
                      </p>

                      {item.type === 'rental' && (
                        <div className="text-xs text-gray-500 mt-1">
                          <div>Start: {formatDate(item.startDate)}</div>
                          <div>End: {formatDate(item.endDate)}</div>
                          {item.rentalDays && (
                            <div>Days: {item.rentalDays}</div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-semibold text-gray-900">
                          ${calculateItemTotal(item).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-green-600">${getTotalCost().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your delivery address"
                      required
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-200 pt-6">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : `Complete Order - $${getTotalCost().toFixed(2)}`}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-semibold"
                  >
                    Back to Cart
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
