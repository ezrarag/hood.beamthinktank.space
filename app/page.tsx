'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Target, Gift } from 'lucide-react'
import LocationSignup from '@/components/LocationSignup'
import NodeMap from '@/components/NodeMap'
import NodeCard from '@/components/NodeCard'

export default function HomePage() {
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-hood-50 to-beam-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-hood-500 to-beam-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Hood</h1>
            </div>
            <p className="text-gray-600">Community Node Registration</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join Your Neighborhood Node
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with neighbors, contribute to community goals, and unlock exclusive perks. 
            Think Nextdoor meets Patreon — location-based community building with donation-driven rewards.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card text-center">
            <MapPin className="w-12 h-12 text-hood-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Location-Based</h3>
            <p className="text-gray-600">Find or create nodes in your neighborhood</p>
          </div>
          <div className="card text-center">
            <Target className="w-12 h-12 text-beam-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal Tracking</h3>
            <p className="text-gray-600">Monitor donation progress and unlock perks</p>
          </div>
          <div className="card text-center">
            <Gift className="w-12 h-12 text-hood-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Perks</h3>
            <p className="text-gray-600">Access exclusive services and events</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Signup & Map */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <LocationSignup 
                onNodeFound={setSelectedNode}
                onShowSignup={() => setShowSignup(true)}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <NodeMap 
                onNodeSelect={setSelectedNode}
                selectedNode={selectedNode}
              />
            </motion.div>
          </div>

          {/* Right Column - Node Details */}
          <div className="space-y-6">
            {selectedNode ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
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
                transition={{ delay: 0.5 }}
                className="card text-center text-gray-500"
              >
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Select a node on the map to view details</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
