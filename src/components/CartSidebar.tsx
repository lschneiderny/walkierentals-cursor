"use client"

import React from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { X, Minus, Plus, Trash2 } from 'lucide-react'

export default function CartSidebar() {
  const { state, dispatch, removeFromCart, updateCartItem, getTotalCost, getTotalItems } = useCart()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
    } else {
      updateCartItem(id, { quantity: newQuantity })
    }
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

  if (!state.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({getTotalItems()})
            </h2>
            <button
              onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some items to get started!</p>
                <button
                  onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-4">
                      {/* Item Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-2xl">
                        {item.type === 'rental' ? '📻' : '🛒'}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.type === 'rental' ? 'Rental' : 'Purchase'}
                        </p>

                        {item.type === 'rental' && (
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Start: {formatDate(item.startDate)}</div>
                            <div>End: {formatDate(item.endDate)}</div>
                            {item.rentalDays && (
                              <div>Days: {item.rentalDays}</div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ${calculateItemTotal(item).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  ${getTotalCost().toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded font-semibold text-center block"
                  onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded font-semibold text-center"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
