"use client"

import React, { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { RentalDatePicker, DatePresets } from './DatePicker'
import { X } from 'lucide-react'

interface AddToCartModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id: string
    name: string
    price: number
    image: string | null
    type: 'rental' | 'store'
    category?: string
  }
}

export default function AddToCartModal({ isOpen, onClose, item }: AddToCartModalProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePresetSelect = (days: number) => {
    const today = new Date()
    const start = new Date(today)
    const end = new Date(today)
    end.setDate(end.getDate() + days)

    setStartDate(start)
    setEndDate(end)
  }

  const calculateRentalDays = () => {
    if (!startDate || !endDate) return 0
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  const calculateTotal = () => {
    if (item.type === 'rental') {
      const days = calculateRentalDays()
      return item.price * days * quantity
    }
    return item.price * quantity
  }

  const handleAddToCart = async () => {
    if (item.type === 'rental' && (!startDate || !endDate)) {
      alert('Please select rental dates')
      return
    }

    setLoading(true)

    try {
      const cartItem = {
        name: item.name,
        price: item.price,
        image: item.image,
        type: item.type,
        quantity,
        category: item.category,
        ...(item.type === 'rental' && {
          rentalDays: calculateRentalDays(),
          startDate,
          endDate,
        }),
      }

      addToCart(cartItem)
      onClose()
      // Reset form
      setQuantity(1)
      setStartDate(null)
      setEndDate(null)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add to Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item Info */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-2xl">
                {item.type === 'rental' ? '📻' : '🛒'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.type === 'rental' ? 'Rental' : 'Purchase'}
                </p>
              </div>
            </div>

            <div className="text-2xl font-bold text-green-600 mb-2">
              ${item.price.toFixed(2)}
              {item.type === 'rental' && ' per day'}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Date Selection for Rentals */}
          {item.type === 'rental' && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Select Rental Period</h4>

              <div className="mb-4">
                <DatePresets onPresetSelect={handlePresetSelect} />
              </div>

              <RentalDatePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>
          )}

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            {item.type === 'rental' && (
              <p className="text-sm text-gray-600 mt-1">
                {calculateRentalDays()} day{calculateRentalDays() !== 1 ? 's' : ''} × {quantity} × ${item.price.toFixed(2)}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              disabled={loading || (item.type === 'rental' && (!startDate || !endDate))}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
