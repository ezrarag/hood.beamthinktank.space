'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Plus, Users } from 'lucide-react'

interface LocationSignupProps {
  onNodeFound: (node: any) => void
  onShowSignup: () => void
}

export default function LocationSignup({ onNodeFound, onShowSignup }: LocationSignupProps) {
  const [address, setAddress] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Mock data for demo purposes
  const mockNodes = [
    {
      id: 1,
      name: 'Downtown Orlando Arts District',
      address: '123 E Central Blvd, Orlando, FL 32801',
      members: 47,
      donationGoal: 5000,
      currentAmount: 3200,
      perks: [
        'Free concert tickets',
        'Access to recorded performances',
        'Priority access to community music workshops'
      ],
      coordinates: [28.5383, -81.3792]
    },
    {
      id: 2,
      name: 'Mills 50 Creative Hub',
      address: '456 N Mills Ave, Orlando, FL 32803',
      members: 23,
      donationGoal: 3000,
      currentAmount: 1800,
      perks: [
        'Art gallery access',
        'Creative workshop discounts',
        'Local artist meetups'
      ],
      coordinates: [28.5600, -81.3600]
    }
  ]

  const handleSearch = async () => {
    if (!address.trim()) return
    
    setIsSearching(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Filter nodes by proximity (mock logic)
    const results = mockNodes.filter(node => 
      node.address.toLowerCase().includes(address.toLowerCase()) ||
      node.name.toLowerCase().includes(address.toLowerCase())
    )
    
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleJoinNode = (node: any) => {
    onNodeFound(node)
    onShowSignup()
  }

  const handleCreateNode = () => {
    setShowCreateForm(true)
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="w-5 h-5 text-hood-500 mr-2" />
        Find Your Neighborhood Node
      </h3>
      
      {/* Search Input */}
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Enter address or zip code..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !address.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 mb-6"
        >
          <h4 className="font-medium text-gray-700">Found {searchResults.length} node(s):</h4>
          {searchResults.map((node) => (
            <div key={node.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-semibold text-gray-900">{node.name}</h5>
                  <p className="text-sm text-gray-600">{node.address}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {node.members} members
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleJoinNode(node)}
                  className="btn-primary text-sm py-1 px-3"
                >
                  Join Node
                </button>
                <button
                  onClick={() => onNodeFound(node)}
                  className="btn-secondary text-sm py-1 px-3"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Create New Node */}
      <div className="border-t border-gray-200 pt-6">
        <div className="text-center">
          <p className="text-gray-600 mb-3">Don't see a node in your area?</p>
          <button
            onClick={handleCreateNode}
            className="btn-secondary inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Node
          </button>
        </div>
      </div>

      {/* Create Node Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-hood-50 rounded-lg border border-hood-200"
        >
          <h4 className="font-medium text-gray-900 mb-3">Create New Community Node</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Node name..."
              className="input-field"
            />
            <input
              type="text"
              placeholder="Address..."
              className="input-field"
            />
            <input
              type="number"
              placeholder="Donation goal ($)"
              className="input-field"
            />
            <div className="flex space-x-2">
              <button className="btn-primary flex-1">Create Node</button>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
