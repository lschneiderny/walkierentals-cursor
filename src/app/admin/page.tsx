"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ListingManagement from "@/components/ListingManagement"
import { isEmployeeOrAdmin } from "@/lib/auth-utils"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth/signin")
      return
    }
    if (!isEmployeeOrAdmin(session.user?.role)) {
      router.push("/")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session || !isEmployeeOrAdmin(session.user?.role)) {
    return null
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "inventory", name: "Inventory", icon: "📦" },
    { id: "orders", name: "Orders", icon: "📋" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session.user?.name}! Manage your inventory and orders.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-900"
                      : "border-transparent text-gray-900 hover:text-blue-700 hover:border-blue-300"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && <OverviewTab onNavigate={setActiveTab} />}
            {activeTab === "inventory" && <ListingManagement />}
            {activeTab === "orders" && <OrdersTab />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const stats = [
    { name: "Total Rentals", value: "24", change: "+12%", icon: "📻" },
    { name: "Active Packages", value: "6", change: "+2", icon: "📦" },
    { name: "Store Items", value: "18", change: "+5", icon: "🛒" },
    { name: "Pending Orders", value: "3", change: "-2", icon: "📋" },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.name}</div>
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate("inventory")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Manage Rentals
          </button>
          <button
            onClick={() => onNavigate("inventory")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Manage Packages
          </button>
          <button
            onClick={() => onNavigate("inventory")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Manage Retail Items
          </button>
        </div>
      </div>
    </div>
  )
}

// Orders Tab Component
function OrdersTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Order Management</h2>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Management</h3>
        <p className="text-gray-600 mb-4">View and manage customer orders and rentals.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">
          View Orders
        </button>
      </div>
    </div>
  )
}
