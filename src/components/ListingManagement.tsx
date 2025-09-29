"use client"

import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Plus } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface Rental {
  id: string
  slug: string
  name: string
  description: string | null
  dailyRate: number
  category: Category
  currentInventory: number
  available: boolean
  createdAt: string
  searchTags: string
  user: {
    name: string
  }
}

interface Package {
  id: string
  slug: string
  name: string
  description: string | null
  dailyRate: number
  category: Category
  items: Array<{ rental: Rental; count: number }>
  createdAt: string
  searchTags: string
  user: {
    name: string
  }
}

interface RetailItem {
  id: string
  slug: string
  name: string
  description: string | null
  unitCost: number
  category: Category
  currentInventory: number
  available: boolean
  createdAt: string
  searchTags: string
  user: {
    name: string
  }
}

type ListingType = 'rentals' | 'packages' | 'retail'

export default function ListingManagement() {
  const [activeTab, setActiveTab] = useState<ListingType>('rentals')
  const [rentals, setRentals] = useState<Rental[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [retailItems, setRetailItems] = useState<RetailItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch categories first
      const categoriesResponse = await fetch('/api/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      }

      // Fetch data based on active tab
      switch (activeTab) {
        case 'rentals':
          await fetchRentals()
          break
        case 'packages':
          await fetchPackages()
          break
        case 'retail':
          await fetchRetailItems()
          break
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRentals = async () => {
    const response = await fetch('/api/admin/rentals')
    if (response.ok) {
      const data = await response.json()
      setRentals(data)
    }
  }

  const fetchPackages = async () => {
    const response = await fetch('/api/admin/packages')
    if (response.ok) {
      const data = await response.json()
      setPackages(data)
    }
  }

  const fetchRetailItems = async () => {
    const response = await fetch('/api/admin/retail')
    if (response.ok) {
      const data = await response.json()
      setRetailItems(data)
    }
  }

  const handleDelete = async (id: string, type: ListingType) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchData() // Refresh data
      } else {
        alert('Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting item')
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    setShowCreateForm(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setShowCreateForm(true)
  }

  const handleFormClose = () => {
    setShowCreateForm(false)
    setEditingItem(null)
  }

  const handleFormSuccess = () => {
    setShowCreateForm(false)
    setEditingItem(null)
    fetchData() // Refresh data
  }

  const renderTable = () => {
    switch (activeTab) {
      case 'rentals':
        return (
          <RentalsTable
            rentals={rentals}
            categories={categories}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete(id, 'rentals')}
          />
        )
      case 'packages':
        return (
          <PackagesTable
            packages={packages}
            categories={categories}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete(id, 'packages')}
          />
        )
      case 'retail':
        return (
          <RetailItemsTable
            retailItems={retailItems}
            categories={categories}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete(id, 'retail')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'rentals', name: 'Rentals', icon: '📻' },
            { id: 'packages', name: 'Packages', icon: '📦' },
            { id: 'retail', name: 'Retail', icon: '🛒' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ListingType)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-900'
                  : 'border-transparent text-gray-900 hover:text-blue-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {activeTab === 'rentals' && 'Manage Rentals'}
          {activeTab === 'packages' && 'Manage Packages'}
          {activeTab === 'retail' && 'Manage Retail Items'}
        </h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      ) : (
        renderTable()
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <CreateEditForm
          type={activeTab}
          item={editingItem}
          categories={categories}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}

// Individual table components
function RentalsTable({
  rentals,
  categories,
  onEdit,
  onDelete
}: {
  rentals: Rental[]
  categories: Category[]
  onEdit: (rental: Rental) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daily Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rentals.map((rental) => (
            <tr key={rental.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{rental.name}</div>
                <div className="text-sm text-gray-500">{rental.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {rental.category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${rental.dailyRate.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  rental.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {rental.available ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(rental)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(rental.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PackagesTable({
  packages,
  categories,
  onEdit,
  onDelete
}: {
  packages: Package[]
  categories: Category[]
  onEdit: (pkg: Package) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daily Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                <div className="text-sm text-gray-500">{pkg.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {pkg.category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${pkg.dailyRate.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pkg.items.reduce((total, item) => total + item.count, 0)} units across {pkg.items.length} rentals
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(pkg)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(pkg.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RetailItemsTable({
  retailItems,
  categories,
  onEdit,
  onDelete
}: {
  retailItems: RetailItem[]
  categories: Category[]
  onEdit: (item: RetailItem) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {retailItems.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${item.unitCost.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.currentInventory}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Create/Edit Form Component
function CreateEditForm({
  type,
  item,
  categories,
  onClose,
  onSuccess
}: {
  type: ListingType
  item?: any
  categories: Category[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    identifier: '',
    slugAutoGenerated: true,
    searchTags: '',
    dailyRate: '',
    unitCost: '',
    categoryId: '',
    currentInventory: '',
    specs: '',
    available: true,
    packageItems: '[]',
    ...item
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const normalizedType = type === 'retail' ? 'retail' : type
      const endpoint = item
        ? `/api/admin/${normalizedType}/${item.id}`
        : `/api/admin/${normalizedType}`

      const method = item ? 'PUT' : 'POST'

      const payload: Record<string, any> = {
        name: formData.name,
        description: formData.description || undefined,
        categoryId: formData.categoryId,
        searchTags: formData.searchTags || undefined,
      }

      if (normalizedType === 'rentals') {
        payload.slug = formData.slug || undefined
        payload.dailyRate = formData.dailyRate
        payload.currentInventory = formData.currentInventory
        payload.specs = formData.specs
        payload.available = formData.available
      } else if (normalizedType === 'packages') {
        payload.slug = formData.slug || undefined
        payload.dailyRate = formData.dailyRate
        try {
          payload.rentalItems = JSON.parse(formData.packageItems)
        } catch (error) {
          alert('Package items must be valid JSON')
          setLoading(false)
          return
        }
      } else if (normalizedType === 'retail') {
        payload.slug = formData.slug || undefined
        payload.unitCost = formData.unitCost
        payload.currentInventory = formData.currentInventory
        payload.specs = formData.specs
        payload.available = formData.available
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save item')
      }
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Error saving item')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {item ? 'Edit' : 'Create'} {type === 'rentals' ? 'Rental' : type === 'packages' ? 'Package' : 'Retail Item'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="auto-generated if left blank"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Tags
                </label>
                <input
                  type="text"
                  value={formData.searchTags}
                  onChange={(e) => handleChange('searchTags', e.target.value)}
                  placeholder="Comma-separated keywords"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === 'packages' ? 'Daily Rate *' : type === 'retail' ? 'Unit Cost *' : 'Daily Rate *'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={type === 'retail' ? formData.unitCost : formData.dailyRate}
                  onChange={(e) => handleChange(type === 'retail' ? 'unitCost' : 'dailyRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === 'packages' ? 'Rental Items (JSON)' : 'Current Inventory'}
                </label>
                {type === 'packages' ? (
                  <textarea
                    value={formData.packageItems}
                    onChange={(e) => handleChange('packageItems', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-gray-900"
                    placeholder='[{"rentalId": "...", "count": 2}]'
                  />
                ) : (
                  <input
                    type="number"
                    value={formData.currentInventory}
                    onChange={(e) => handleChange('currentInventory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                )}
              </div>
            </div>

            {/* Rental/Store-specific fields */}
            {(type === 'rentals' || type === 'retail') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications (JSON format)
                </label>
                <textarea
                  value={formData.specs}
                  onChange={(e) => handleChange('specs', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-gray-900"
                  placeholder='{"frequency": "VHF/UHF", "power": "5W"}'
                />
              </div>
            )}

            {/* Availability toggle */}
            {(type === 'rentals' || type === 'retail') && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => handleChange('available', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                  Available for {type === 'rentals' ? 'rental' : 'purchase'}
                </label>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : (item ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

