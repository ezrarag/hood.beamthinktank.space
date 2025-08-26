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
  const [isDetecting, setIsDetecting] = useState(true)
  const [locationDenied, setLocationDenied] = useState(false)
  const [isBlurred, setIsBlurred] = useState(false)

  // Function to create URL-safe city slug
  const createCitySlug = (cityName: string) => {
    return cityName
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove special characters
  }

  // Re-request location on demand and navigate
  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      setIsDetecting(false)
      setLocationDenied(true)
      return
    }
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
          const hoodName = data.principalSubdivision || data.subLocality || ''
          setUserCity(cityName)
          setUserNeighborhood(hoodName)
          setIsDetecting(false)
          setLocationDenied(false)
          if (cityName) {
            window.location.href = `/${createCitySlug(cityName)}`
          }
        } catch (err) {
          setIsDetecting(false)
          setLocationDenied(true)
        }
      },
      () => {
        setIsDetecting(false)
        setLocationDenied(true)
      }
    )
  }

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
            setIsDetecting(false)
            setLocationDenied(false)
          } catch (error) {
            console.log('Could not get city from coordinates')
            setIsDetecting(false)
            setLocationDenied(true)
          }
        },
        () => {
          console.log('Location not available')
          setIsDetecting(false)
          setLocationDenied(true)
        }
      )
    } else {
      setIsDetecting(false)
      setLocationDenied(true)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Blur loop effect to highlight city name
  useEffect(() => {
    const blurInterval = setInterval(() => {
      setIsBlurred(true)
      setTimeout(() => setIsBlurred(false), 2000) // Blur for 2 seconds
    }, 40000) // Every 40 seconds

    return () => clearInterval(blurInterval)
  }, [])

  return (
    <div className="h-screen bg-white relative overflow-hidden">
      {/* Background Image - Full viewport width */}
      <div className={`absolute inset-0 z-0 transition-all duration-1000 ${isBlurred ? 'blur-sm' : ''}`}>
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
        className="relative z-20 px-4 sm:px-8 lg:px-20 py-8"
      >
        <div className="max-w-15xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo/Title with City */}
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-900" style={{ fontFamily: 'sans-serif' }}>
                Neighborhood: {
                  userCity ? (
                    <a href={`/${createCitySlug(userCity)}`} className="hover:text-blue-600 transition-colors cursor-pointer">{userCity}</a>
                  ) : isDetecting ? (
                    <span>Detecting...</span>
                  ) : (
                    <button onClick={handleEnableLocation} className="underline text-blue-600 hover:text-blue-800">Enable Location</button>
                  )
                }{userNeighborhood && userCity ? ` (${userNeighborhood})` : ''}
              </h1>
            </div>

            {/* CTA Button with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200 flex items-center gap-2" 
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
                <>
                  {/* Blur overlay */}
                  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsDropdownOpen(false)} />
                  
                  {/* Dropdown cards */}
                  <div className="absolute right-0 mt-2 w-80 space-y-3 z-50">
                    {userCity ? (
                      <a 
                        href={`/${createCitySlug(userCity)}`}
                        className="block w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 transition-all duration-200 transform hover:scale-105 shadow-xl border border-gray-600 cursor-pointer"
                        style={{ fontFamily: 'sans-serif' }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">1</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{userCity}</h3>
                            <p className="text-gray-300 leading-relaxed">
                              Explore services and community initiatives in your neighborhood
                            </p>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <button 
                        onClick={handleEnableLocation}
                        className="block w-full text-left bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 transition-all duration-200 transform hover:scale-105 shadow-xl border border-gray-600"
                        style={{ fontFamily: 'sans-serif' }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">1</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">Enable Location</h3>
                            <p className="text-gray-300 leading-relaxed">
                              Allow location access to find services in your area
                            </p>
                          </div>
                        </div>
                      </button>
                    )}
                    
                    <a 
                      href="/governance"
                      className="block w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 transition-all duration-200 transform hover:scale-105 shadow-xl border border-gray-600 cursor-pointer"
                      style={{ fontFamily: 'sans-serif' }}
                    >
                      <div className="flex items-start space-x-4">
                                                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">2</span>
                          </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">About</h3>
                          <p className="text-gray-300 leading-relaxed">
                            Learn about our student-driven governance model and community structure
                          </p>
                        </div>
                      </div>
                    </a>
                    
                    <a 
                      href="/contact"
                      className="block w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 transition-all duration-200 transform hover:scale-105 shadow-xl border border-gray-600 cursor-pointer"
                      style={{ fontFamily: 'sans-serif' }}
                    >
                      <div className="flex items-start space-x-4">
                                                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">3</span>
                          </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">Contact</h3>
                          <p className="text-gray-300 leading-relaxed">
                            Get in touch with our team for questions and support
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </motion.header>

      {/* Main Content - Clean slate for new design */}
      <main className={`relative z-20 h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-20 transition-all duration-1000 ${isBlurred ? 'blur-sm' : ''}`}>
        {/* Content area ready for new design */}
      </main>

    </div>
  )
}
