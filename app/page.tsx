'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

// FAQ Item Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <motion.div 
      className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden cursor-pointer"
      style={{ fontFamily: 'sans-serif' }}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* Question Header */}
      <div className="p-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 pr-4">
          {question}
        </h3>
        <div className="flex-shrink-0">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5 flex items-center justify-center"
          >
            {isOpen ? (
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Answer Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

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
const loadStripe = async (publishableKey: string) => {
  if (typeof window !== "undefined") {
    const stripeModule = await import("@stripe/stripe-js")
    return stripeModule.loadStripe(publishableKey)
  }
  return null
}

export default function HomePage() {
  const router = useRouter()
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
            router.push(`/${createCitySlug(cityName)}`)
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
                    <button 
                      onClick={() => router.push(`/${createCitySlug(userCity)}`)} 
                      className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {userCity}
                    </button>
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
                className="text-lg font-light text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: 'sans-serif' }}
              >
                Menu
              </button>
              
              {/* Full Screen Modal */}
              {isDropdownOpen && (
                <>
                  {/* Full screen modal overlay */}
                  <div className="fixed inset-0 bg-white z-50 flex flex-col">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-8 border-b border-gray-200">
                      <h2 className="text-2xl font-light text-gray-900" style={{ fontFamily: 'sans-serif' }}>
                        Navigation Menu
                      </h2>
                      <button 
                        onClick={() => setIsDropdownOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Modal Content */}
                    <div className="flex-1 flex items-center justify-center p-8">
                      <div className="max-w-4xl w-full space-y-8">
                        {userCity ? (
                          <button 
                            onClick={() => {
                              setIsDropdownOpen(false)
                              router.push(`/${createCitySlug(userCity)}`)
                            }}
                            className="block w-full text-left bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 transition-all duration-200 transform hover:scale-[1.02] shadow-lg border border-gray-200 cursor-pointer"
                            style={{ fontFamily: 'sans-serif' }}
                          >
                            <div className="flex items-start space-x-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-2xl">1</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-3xl font-light text-gray-900 mb-4">{userCity}</h3>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                  Explore services and community initiatives in your neighborhood
                                </p>
                              </div>
                            </div>
                          </button>
                        ) : (
                          <button 
                            onClick={handleEnableLocation}
                            className="block w-full text-left bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 transition-all duration-200 transform hover:scale-[1.02] shadow-lg border border-gray-200"
                            style={{ fontFamily: 'sans-serif' }}
                          >
                            <div className="flex items-start space-x-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-2xl">1</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-3xl font-light text-gray-900 mb-4">Enable Location</h3>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                  Allow location access to find services in your area
                                </p>
                              </div>
                            </div>
                          </button>
                        )}
                        
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false)
                            router.push('/governance')
                          }}
                          className="block w-full text-left bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 transition-all duration-200 transform hover:scale-[1.02] shadow-lg border border-gray-200 cursor-pointer"
                          style={{ fontFamily: 'sans-serif' }}
                        >
                          <div className="flex items-start space-x-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-2xl">2</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-3xl font-light text-gray-900 mb-4">About</h3>
                              <p className="text-xl text-gray-600 leading-relaxed">
                                Learn about our student-driven governance model and community structure
                              </p>
                            </div>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false)
                            router.push('/contact')
                          }}
                          className="block w-full text-left bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 transition-all duration-200 transform hover:scale-[1.02] shadow-lg border border-gray-200 cursor-pointer"
                          style={{ fontFamily: 'sans-serif' }}
                        >
                          <div className="flex items-start space-x-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-2xl">3</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-3xl font-light text-gray-900 mb-4">Contact</h3>
                              <p className="text-xl text-gray-600 leading-relaxed">
                                Get in touch with our team for questions and support
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </motion.header>

      {/* Main Content - Clean slate for new design */}
      <main className={`relative z-20 h-full flex flex-col justify-center items-end px-4 sm:px-8 lg:px-20 transition-all duration-1000 ${isBlurred ? 'blur-sm' : ''}`}>
        {/* Content area ready for new design */}
        
        {/* FAQ Dropdown Section - Right-aligned and smaller */}
        <div className="w-full max-w-md ml-auto mt-20">
          {/* FAQ Header Button */}
          <div className="flex justify-end mb-6">
            <div className="bg-black text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm" style={{
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(0)',
              transition: 'all 0.2s ease'
            }}>
              <span>I'm here to help you</span>
            </div>
          </div>
          
          {/* FAQ Cards - Smaller and right-aligned */}
          <div className="space-y-3">
            <FAQItem 
              question="Book a neighborhood cleaning service"
              answer="Schedule professional cleaning for your area. Our team handles everything from street cleanup to community garden maintenance. Available once your neighborhood reaches the cleaning tier."
            />
            <FAQItem 
              question="Support neighborhood equipment needs"
              answer="Contribute to funding essential tools and equipment. From lawnmowers to community center supplies, every donation helps build a better neighborhood."
            />
            <FAQItem 
              question="Join community skill-sharing classes"
              answer="Participate in workshops and classes offered by your neighbors. Learn new skills while building community connections. Classes unlock at the first donation tier."
            />
            <FAQItem 
              question="Access food assistance programs"
              answer="Support and access community food banks, meal programs, and grocery assistance. This service becomes available when your neighborhood reaches the food tier."
            />
          </div>
        </div>
      </main>

    </div>
  )
}
