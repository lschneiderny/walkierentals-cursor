"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { UserRole } from "@prisma/client"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart } from "lucide-react"

export default function Header() {
  const { data: session } = useSession()
  const { state, dispatch, getTotalItems } = useCart()

  return (
    <header className="bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-blue-800">
          <div className="flex items-center space-x-6">
            <Link href="/blog" className="hover:text-blue-300">Blog</Link>
            <Link href="/gear-for-sale" className="hover:text-blue-300">Gear for Sale</Link>
            <Link href="/help" className="hover:text-blue-300">Help</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/rent" className="bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded text-sm">Rent</Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <span>Welcome, {session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                >
                  Sign Out
                </button>
                {(session.user as any)?.role === UserRole.EMPLOYEE && (
                  <Link href="/admin" className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-orange-500 rounded-full p-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xl font-bold">WalkieRentals</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/rentals" className="hover:text-blue-300">RENTALS</Link>
            <Link href="/store" className="hover:text-blue-300">STORE</Link>
            <Link href="/packages" className="hover:text-blue-300">PACKAGES</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-blue-800 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="relative p-2 hover:bg-blue-800 rounded"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
