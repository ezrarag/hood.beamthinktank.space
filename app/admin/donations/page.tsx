'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface EquipmentItem {
  id: string
  name: string
  target: number
  progress: number
  funded: boolean
  category: string
  city: string
  description: string
  createdAt: string
}

interface Donation {
  id: string
  equipmentId: string
  amount: number
  donorName: string
  donorEmail: string
  message: string
  stripeSessionId: string
  createdAt: string
}

export default function AdminDonationsPage() {
  const [donationData, setDonationData] = useState<{
    equipment: EquipmentItem[]
    categories: any[]
    donations: Donation[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    category: '',
    city: '',
    description: ''
  })

  // Fetch donation data
  useEffect(() => {
    fetchDonationData()
  }, [])

  const fetchDonationData = async () => {
    try {
      const response = await fetch('/api/donations')
      if (response.ok) {
        const data = await response.json()
        setDonationData(data)
      }
    } catch (error) {
      console.error('Error fetching donation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: editingItem ? 'updateEquipment' : 'addEquipment',
          data: editingItem ? { ...formData, id: editingItem.id } : formData
        }),
      })

      if (response.ok) {
        await fetchDonationData()
        setShowAddForm(false)
        setEditingItem(null)
        setFormData({ name: '', target: '', category: '', city: '', description: '' })
      }
    } catch (error) {
      console.error('Error saving equipment:', error)
    }
  }

  const handleEdit = (item: EquipmentItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      target: item.target.toString(),
      category: item.category,
      city: item.city,
      description: item.description
    })
    setShowAddForm(true)
  }

  const handleProgressUpdate = async (itemId: string, newProgress: number) => {
    try {
      const response = await fetch('/api/donations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId: itemId,
          progress: newProgress
        }),
      })

      if (response.ok) {
        await fetchDonationData()
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Management</h1>
          <p className="text-gray-600">Manage equipment items and track donation progress</p>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit Equipment Item' : 'Add New Equipment Item'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount ($)</label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Environment & Green">Environment & Green</option>
                    <option value="Education & Skills">Education & Skills</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Community & Care">Community & Care</option>
                    <option value="Transportation & Repair">Transportation & Repair</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingItem(null)
                    setFormData({ name: '', target: '', category: '', city: '', description: '' })
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Add New Item Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mb-6"
          >
            + Add New Equipment Item
          </button>
        )}

        {/* Equipment List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Equipment Items</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {donationData?.equipment.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.category} • {item.city}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${item.target.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Target</p>
                  </div>
                </div>
                
                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-blue-600">{item.progress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        item.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    ${Math.round((item.progress / 100) * item.target).toLocaleString()} raised
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Edit
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Progress:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.progress}
                      onChange={(e) => handleProgressUpdate(item.id, parseInt(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600 w-12">{item.progress}%</span>
                  </div>
                  
                  {item.funded && (
                    <span className="text-green-600 text-sm font-medium">✓ Funded</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
