'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Target } from 'lucide-react'

interface NodeMapProps {
  onNodeSelect: (node: any) => void
  selectedNode: any
}

export default function NodeMap({ onNodeSelect, selectedNode }: NodeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])

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
      coordinates: [28.5450, -81.3750]
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
    const progress = (node.currentAmount / node.donationGoal) * 100
    
    return `
      <div class="p-2">
        <h3 class="font-semibold text-gray-900 mb-2">${node.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${node.address}</p>
        <div class="flex items-center text-sm text-gray-600 mb-2">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
          </svg>
          ${node.members} members
        </div>
        <div class="mb-2">
          <div class="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>$${node.currentAmount.toLocaleString()} / $${node.donationGoal.toLocaleString()}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-hood-500 h-2 rounded-full" style="width: ${progress}%"></div>
          </div>
        </div>
        <button class="w-full bg-hood-600 text-white text-sm py-1 px-3 rounded hover:bg-hood-700 transition-colors">
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
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="w-5 h-5 text-hood-500 mr-2" />
        Community Nodes Map
      </h3>
      
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-96 bg-gray-100 rounded-lg border border-gray-200"
        style={{ minHeight: '400px' }}
      >
        {/* Fallback content when map is loading */}
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Loading map...</p>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-hood-500 rounded-full mr-2"></div>
            <span>Community Nodes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-beam-500 rounded-full mr-2"></div>
            <span>Donation Goals</span>
          </div>
        </div>
        <div className="text-xs">
          Click markers to view details
        </div>
      </div>
    </div>
  )
}
