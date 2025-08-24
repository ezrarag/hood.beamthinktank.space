'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Target, TrendingUp, CheckCircle } from 'lucide-react'

interface NodeMapProps {
  onNodeSelect: (node: any) => void
  selectedNode: any
}

export default function NodeMap({ onNodeSelect, selectedNode }: NodeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Enhanced mock data with donation tiers
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
      coordinates: [28.5383, -81.3792],
      unlockedTiers: ['Classes', 'Cleaning'],
      nextTier: 'Food',
      nextTierAmount: 2000,
      progress: 64
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
      coordinates: [28.5600, -81.3600],
      unlockedTiers: ['Classes'],
      nextTier: 'Cleaning',
      nextTierAmount: 1000,
      progress: 60
    },
    {
      id: 3,
      name: 'Thornton Park Community',
      address: '789 E Central Blvd, Orlando, FL 32801',
      members: 34,
      donationGoal: 4000,
      currentAmount: 2800,
      perks: [
        'Park event access',
        'Local business discounts',
        'Community garden plots'
      ],
      coordinates: [28.5450, -81.3750],
      unlockedTiers: ['Classes', 'Cleaning'],
      nextTier: 'Food',
      nextTierAmount: 2000,
      progress: 70
    }
  ]

  useEffect(() => {
    // Initialize map when component mounts
    if (mapRef.current && !mapInstance.current) {
      initializeMap()
    }

    return () => {
      // Cleanup map when component unmounts
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  const initializeMap = async () => {
    try {
      // Dynamic import of Leaflet to avoid SSR issues
      const L = await import('leaflet')
      
      // Set default icon path
      L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/'

      // Create map instance
      mapInstance.current = L.map(mapRef.current!).setView([28.5383, -81.3792], 13)

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current)

      // Add markers for each node
      mockNodes.forEach(node => {
        const marker = L.marker(node.coordinates as [number, number])
          .addTo(mapInstance.current)
          .bindPopup(createPopupContent(node))
        
        marker.on('click', () => {
          onNodeSelect(node)
        })
        
        markersRef.current.push(marker)
      })

    } catch (error) {
      console.error('Failed to initialize map:', error)
    }
  }

  const createPopupContent = (node: any) => {
    const progress = (node.currentAmount / node.nextTierAmount) * 100
    
    return `
      <div class="p-4 min-w-[280px]">
        <div class="mb-3">
          <h3 class="font-bold text-gray-900 text-lg mb-1">${node.name}</h3>
          <p class="text-sm text-gray-600">${node.address}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="text-center">
            <div class="text-lg font-bold text-hood-600">${node.members}</div>
            <div class="text-xs text-gray-500">Members</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-beam-600">$${node.currentAmount.toLocaleString()}</div>
            <div class="text-xs text-gray-500">Raised</div>
          </div>
        </div>
        
        <div class="mb-3">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">Progress to ${node.nextTier}</span>
            <span class="font-medium">${progress.toFixed(0)}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-gradient-to-r from-hood-500 to-beam-500 h-2 rounded-full" style="width: ${progress}%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            $${node.currentAmount.toLocaleString()} of $${node.nextTierAmount.toLocaleString()}
          </p>
        </div>
        
        <div class="mb-3">
          <p class="text-sm text-gray-600 mb-2">
            <span class="font-medium text-green-600">Unlocked:</span> ${node.unlockedTiers.join(', ')}
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-medium text-orange-600">Next:</span> ${node.nextTier} ($${node.nextTierAmount.toLocaleString()})
          </p>
        </div>
        
        <button class="w-full bg-hood-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-hood-700 transition-colors font-medium">
          View Details
        </button>
      </div>
    `
  }

  const centerOnNode = (node: any) => {
    if (mapInstance.current && node.coordinates) {
      mapInstance.current.setView(node.coordinates as [number, number], 15)
    }
  }

  useEffect(() => {
    if (selectedNode) {
      centerOnNode(selectedNode)
    }
  }, [selectedNode])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 text-hood-500 mr-2" />
          Global Hood Network
        </h3>
        
        {/* Map Container */}
        <div 
          ref={mapRef} 
          className="w-full h-96 bg-gray-100 rounded-xl border border-gray-200 mb-4"
          style={{ minHeight: '400px' }}
        >
          {/* Fallback content when map is loading */}
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Loading Hood network...</p>
            </div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-hood-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Active Hoods</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-beam-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Donation Progress</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Services Unlocked</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Next Tier</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Click any Hood marker to view detailed progress and services
        </p>
      </div>
    </motion.div>
  )
}
