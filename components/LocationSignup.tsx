'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, Plus, Users, Target } from 'lucide-react'

interface LocationSignupProps {
  onNodeFound: (node: any) => void
  onShowSignup: () => void
}

export default function LocationSignup({ onNodeFound, onShowSignup }: LocationSignupProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    // Simulate search delay
    setTimeout(() => {
      // Mock search result - in real app this would query your database
      const mockResult = {
        id: 4,
        name: 'New Neighborhood Hub',
        address: searchQuery,
        members: 12,
        donationGoal: 2500,
        currentAmount: 800,
        perks: [
          'Community meetups',
          'Local business networking',
          'Skill sharing sessions'
        ],
        coordinates: [28.5383, -81.3792],
        unlockedTiers: ['Classes'],
        nextTier: 'Cleaning',
        nextTierAmount: 1000,
        progress: 32
      }
      
      onNodeFound(mockResult)
      setIsSearching(false)
    }, 1500)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 text-hood-500 mr-2" />
          Find Your Hood
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Search for existing Hoods in your area or create a new one to start building community services together.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your address or neighborhood..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hood-500 focus:border-transparent transition-colors"
                disabled={isSearching}
              />
            </div>
            <button
              type="submit"
              disabled={!searchQuery.trim() || isSearching}
              className="bg-hood-600 text-white px-6 py-3 rounded-lg hover:bg-hood-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gradient-to-r from-hood-50 to-hood-100 rounded-xl border border-hood-200">
            <div className="w-10 h-10 bg-hood-500 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Join Existing Hood</h4>
              <p className="text-sm text-gray-600">Connect with neighbors and contribute to community goals</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gradient-to-r from-beam-50 to-beam-100 rounded-xl border border-beam-200">
            <div className="w-10 h-10 bg-beam-500 rounded-lg flex items-center justify-center mr-4">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Create New Hood</h4>
              <p className="text-sm text-gray-600">Start a new community and set donation goals</p>
            </div>
            <button
              onClick={onShowSignup}
              className="bg-beam-600 text-white px-4 py-2 rounded-lg hover:bg-beam-700 transition-colors text-sm font-medium"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start">
            <Target className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">How Hoods Work</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Hoods unlock community services as they reach donation milestones. Each tier provides 
                access to different services like classes, cleaning, food assistance, and transportation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
