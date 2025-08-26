'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Stripe payment handler
const handleStripePayment = async (categoryId: number, categoryName: string, amount: number) => {
  try {
    // Create Stripe checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryId,
        categoryName,
        amount,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancelled`,
      }),
    })

    const { sessionId } = await response.json()
    
    // Redirect to Stripe Checkout
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        console.error('Stripe error:', error)
      }
    }
  } catch (error) {
    console.error('Payment error:', error)
  }
}

// Load Stripe
// Load Stripe
const loadStripe = async (publishableKey: string) => {
  if (typeof window !== "undefined") {
    const stripeModule = await import("@stripe/stripe-js")
    return stripeModule.loadStripe(publishableKey)
  }
  return null
}

export default function HomePage() {
  const [userCity, setUserCity] = useState('')
  const [userNeighborhood, setUserNeighborhood] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLocationTestOpen, setIsLocationTestOpen] = useState(false)
  const [testCity, setTestCity] = useState('')
  const [testNeighborhood, setTestNeighborhood] = useState('')

  useEffect(() => {
    // Detect user location and get city
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            // Use reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            const data = await response.json()
            if (data.city) {
              setUserCity(data.city)
            } else if (data.locality) {
              setUserCity(data.locality)
            }
            
            // Get neighborhood/area if available
            if (data.principalSubdivision) {
              setUserNeighborhood(data.principalSubdivision)
            } else if (data.subLocality) {
              setUserNeighborhood(data.subLocality)
            }
          } catch (error) {
            console.log('Could not get city from coordinates')
            setUserCity('Atlanta') // Fallback
          }
        },
        (error) => {
          console.log('Location not available')
          setUserCity('Atlanta') // Fallback
        }
      )
    } else {
      setUserCity('Atlanta') // Fallback
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false)
      }
      if (isLocationTestOpen) {
        setIsLocationTestOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, isLocationTestOpen])

  // Function to test different locations
  const testLocation = () => {
    if (testCity.trim()) {
      setUserCity(testCity.trim())
      setUserNeighborhood(testNeighborhood.trim())
      setIsLocationTestOpen(false)
      setTestCity('')
      setTestNeighborhood('')
    }
  }

  return (
    <div className="h-screen bg-white relative overflow-hidden">
      {/* Background Image - Full viewport width */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://bqxetxzxveyfmnvjdime.supabase.co/storage/v1/object/public/citieslandingpage/pexels-burak-nane-846191728-31853609.jpg" 
          alt="Neighbor Hood Community Background"
          className="w-full h-full object-cover bg-gray-100"
        />
      </div>

      {/* Header - Wider spacing to match content below */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 px-20 py-8"
      >
        <div className="max-w-15xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo/Title with City */}
            <div className="flex items-center">
              <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: 'sans-serif' }}>
                Neighborhood: <a href={userCity ? `/${userCity.toLowerCase()}` : '#'} className="hover:text-blue-600 transition-colors cursor-pointer">{userCity || 'Detecting...'}</a>{userNeighborhood && userCity ? ` (${userNeighborhood})` : ''}
              </h1>
            </div>

            {/* Location Test Button */}
            <button 
              onClick={() => setIsLocationTestOpen(!isLocationTestOpen)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mr-3"
            >
              Test Location
            </button>
            <button 
              onClick={() => {
                // Reset to detected location
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      try {
                        const { latitude, longitude } = position.coords
                        const response = await fetch(
                          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        )
                        const data = await response.json()
                        if (data.city) {
                          setUserCity(data.city)
                        } else if (data.locality) {
                          setUserCity(data.locality)
                        }
                        
                        if (data.principalSubdivision) {
                          setUserNeighborhood(data.principalSubdivision)
                        } else if (data.subLocality) {
                          setUserNeighborhood(data.subLocality)
                        }
                      } catch (error) {
                        console.log('Could not get city from coordinates')
                      }
                    }
                  )
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mr-3"
            >
              Reset Location
            </button>

            {/* CTA Button with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2" 
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(0)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
                }}
              >
                <span>Menu</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
                  <a 
                    href={userCity ? `/${userCity.toLowerCase()}` : '#'}
                    className="block w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors border-b border-gray-700"
                    style={{ fontFamily: 'sans-serif' }}
                  >
                    <span className="font-medium">{userCity || 'City'}</span>
                  </a>
                  <a 
                    href="/governance"
                    className="block w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors border-b border-gray-700"
                    style={{ fontFamily: 'sans-serif' }}
                  >
                    <span className="font-medium">About</span>
                  </a>
                  <a 
                    href="#"
                    className="block w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors"
                    style={{ fontFamily: 'sans-serif' }}
                  >
                    <span className="font-medium">Contact</span>
                  </a>
                </div>
              )}
            </div>


          </div>
        </div>
      </motion.header>

      {/* Location Test Modal */}
      {isLocationTestOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>
                Test Different Location
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'sans-serif' }}>
                Enter a city and neighborhood to test how it appears
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  City Name
                </label>
                <input
                  type="text"
                  value={testCity}
                  onChange={(e) => setTestCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Atlanta"
                  style={{ fontFamily: 'sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Neighborhood/Area (Optional)
                </label>
                <input
                  type="text"
                  value={testNeighborhood}
                  onChange={(e) => setTestNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., East Point"
                  style={{ fontFamily: 'sans-serif' }}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsLocationTestOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={testLocation}
                  disabled={!testCity.trim()}
                  className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  Test Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Clean slate for new design */}
      <main className="relative z-20 h-full flex flex-col justify-center items-center px-20">
        {/* Content area ready for new design */}
      </main>


    </div>
  )
}
