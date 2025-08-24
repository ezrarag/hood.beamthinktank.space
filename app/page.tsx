'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Target, Gift, TrendingUp, Globe, Shield } from 'lucide-react'
import LocationSignup from '@/components/LocationSignup'
import NodeMap from '@/components/NodeMap'
import NodeCard from '@/components/NodeCard'

export default function HomePage() {
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [showSignup, setShowSignup] = useState(false)

  // Mock global stats for MVP
  const globalStats = {
    totalHoods: 47,
    totalDonations: 284500,
    activeServices: 156,
    averageUnlockSpeed: 23 // days
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-hood-500 to-beam-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Hood Dashboard</h1>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-600 hover:text-hood-600 transition-colors">Hoods</a>
                <a href="/governance" className="text-gray-600 hover:text-hood-600 transition-colors">Governance</a>
                <a href="#" className="text-gray-600 hover:text-hood-600 transition-colors">About</a>
              </nav>
              <button className="bg-hood-600 text-white px-4 py-2 rounded-lg hover:bg-hood-700 transition-colors">
                Join Hood
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Global Hood Network
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            See how BEAM neighborhoods work together and how donations translate into community services. 
            Track progress, unlock services, and build stronger communities worldwide.
          </p>
        </motion.div>

        {/* Global Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-gradient-to-br from-hood-50 to-hood-100 p-6 rounded-2xl border border-hood-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hood-600">Total Hoods</p>
                <p className="text-3xl font-bold text-hood-900">{globalStats.totalHoods}</p>
              </div>
              <Globe className="w-8 h-8 text-hood-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-beam-50 to-beam-100 p-6 rounded-2xl border border-beam-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-beam-600">Total Donations</p>
                <p className="text-3xl font-bold text-beam-900">${(globalStats.totalDonations / 1000).toFixed(0)}k</p>
              </div>
              <TrendingUp className="w-8 h-8 text-beam-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Services</p>
                <p className="text-3xl font-bold text-green-900">{globalStats.activeServices}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg. Unlock Speed</p>
                <p className="text-3xl font-bold text-purple-900">{globalStats.averageUnlockSpeed}d</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-hood-500 to-hood-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Location-Based</h3>
            <p className="text-gray-600 leading-relaxed">Find or create Hoods in your neighborhood and track community progress</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-beam-500 to-beam-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tier System</h3>
            <p className="text-gray-600 leading-relaxed">Unlock services at each donation milestone with transparent allocation</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Services</h3>
            <p className="text-gray-600 leading-relaxed">Access exclusive services and events through NGO partnerships</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Map & Signup */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <LocationSignup 
                onNodeFound={setSelectedNode}
                onShowSignup={() => setShowSignup(true)}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <NodeMap 
                onNodeSelect={setSelectedNode}
                selectedNode={selectedNode}
              />
            </motion.div>
          </div>

          {/* Right Column - Hood Details */}
          <div className="space-y-8">
            {selectedNode ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <NodeCard 
                  node={selectedNode}
                  onJoin={() => setShowSignup(true)}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-2xl border border-gray-200 text-center"
              >
                <MapPin className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">Select a Hood</h3>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Click on any Hood marker on the map to view detailed progress, 
                  unlocked services, and community information.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
