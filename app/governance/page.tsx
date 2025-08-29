'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function GovernancePage() {
  const router = useRouter()
  const [userCity, setUserCity] = useState('')
  const [isDetecting, setIsDetecting] = useState(true)

  useEffect(() => {
    // Detect user location and redirect to city-specific governance page
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            const data = await response.json()
            const cityName = data.city || data.locality || ''
            
            if (cityName) {
              setUserCity(cityName)
              // Create URL-safe city slug
              const citySlug = cityName
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
              
              // Redirect to city-specific governance page
              router.push(`/governance/${citySlug}`)
            } else {
              setIsDetecting(false)
            }
          } catch (error) {
            console.error('Error getting city from coordinates:', error)
            setIsDetecting(false)
          }
        },
        () => {
          console.log('Location not available')
          setIsDetecting(false)
        }
      )
    } else {
      setIsDetecting(false)
    }
  }, [router])

  if (isDetecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Detecting your location...</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to your city's governance page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Governance Access Required
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            To access governance information, we need to know your city location. 
            {userCity ? ` We detected you're in ${userCity}.` : ''}
          </p>

          <div className="space-y-4">
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  setIsDetecting(true)
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      try {
                        const { latitude, longitude } = position.coords
                        const response = await fetch(
                          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        )
                        const data = await response.json()
                        const cityName = data.city || data.locality || ''
                        
                        if (cityName) {
                          const citySlug = cityName
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9-]/g, '')
                          
                          router.push(`/governance/${citySlug}`)
                        }
                      } catch (error) {
                        console.error('Error getting city from coordinates:', error)
                        setIsDetecting(false)
                      }
                    },
                    () => {
                      setIsDetecting(false)
                    }
                  )
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Enable Location Access
            </button>

            <div className="text-sm text-gray-500">
              Or manually enter your city below
            </div>

            <div className="flex justify-center space-x-2">
              <input
                type="text"
                placeholder="Enter your city name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const cityInput = e.currentTarget.value.trim()
                    if (cityInput) {
                      const citySlug = cityInput
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                      
                      router.push(`/governance/${citySlug}`)
                    }
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const cityInput = e.currentTarget.previousElementSibling as HTMLInputElement
                  const cityName = cityInput.value.trim()
                  if (cityName) {
                    const citySlug = cityName
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '')
                    
                    router.push(`/governance/${citySlug}`)
                  }
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
