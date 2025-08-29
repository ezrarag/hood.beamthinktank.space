'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import LoginModal from '@/components/auth/LoginModal'
import OnboardingModal from '@/components/auth/OnboardingModal'

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onToggle }: { 
  question: string; 
  answer: string; 
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.div 
      className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden cursor-pointer"
      style={{ fontFamily: 'sans-serif' }}
      onClick={onToggle}
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

// Subscription checkout handler
const handleSubscriptionCheckout = async () => {
  try {
    // Create Stripe checkout session for subscription
    const response = await fetch('/api/create-subscription-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: 'home',
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: `${window.location.origin}`,
      }),
    })

    const { sessionId } = await response.json()
    
    // Redirect to Stripe Checkout
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        console.error('Stripe error:', error)
        alert('There was an error processing your subscription. Please try again.')
      }
    }
  } catch (error) {
    console.error('Subscription error:', error)
    alert('There was an error processing your subscription. Please try again.')
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
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null)

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

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {userCity ? (
                <button 
                  onClick={() => router.push(`/${createCitySlug(userCity)}`)} 
                  className="text-sm font-light text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  {userCity}
                </button>
              ) : (
                <button 
                  onClick={handleEnableLocation} 
                  className="text-sm font-light text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  Enable Location
                </button>
              )}
              
              <button 
                onClick={() => router.push('/governance')}
                className="text-sm font-light text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                style={{ fontFamily: 'sans-serif' }}
              >
                About
              </button>
              
              <button 
                onClick={() => router.push('/contact')}
                className="text-sm font-light text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                style={{ fontFamily: 'sans-serif' }}
              >
                Contact
              </button>

              <button 
                onClick={() => setShowSubscriptionModal(true)}
                className="text-sm font-light text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                style={{ fontFamily: 'sans-serif' }}
              >
                Subscribe
              </button>

              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-sm font-light text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                style={{ fontFamily: 'sans-serif' }}
              >
                Login
              </button>
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
              isOpen={openFAQIndex === 0}
              onToggle={() => setOpenFAQIndex(openFAQIndex === 0 ? null : 0)}
            />
            <FAQItem 
              question="Support neighborhood equipment needs"
              answer="Contribute to funding essential tools and equipment. From lawnmowers to community center supplies, every donation helps build a better neighborhood."
              isOpen={openFAQIndex === 1}
              onToggle={() => setOpenFAQIndex(openFAQIndex === 1 ? null : 1)}
            />
            <FAQItem 
              question="What do I get with a Community Subscription?"
              answer="As a subscriber, you unlock a full package of benefits for $75/month. This includes 1 domestic round-trip flight, 6 hotel nights, 1 meal per day, 6 Uber rides, and a monthly health exam. These perks are designed to support your lifestyle while contributing to your neighborhood's growth."
              isOpen={openFAQIndex === 2}
              onToggle={() => setOpenFAQIndex(openFAQIndex === 2 ? null : 2)}
            />
            <FAQItem 
              question="Access food assistance programs"
              answer="Support and access community food banks, meal programs, and grocery assistance. This service becomes available when your neighborhood reaches the food tier."
              isOpen={openFAQIndex === 3}
              onToggle={() => setOpenFAQIndex(openFAQIndex === 3 ? null : 3)}
            />
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          // Redirect to dashboard after successful login
          router.push('/dashboard')
        }}
      />

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSubscriptionModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-3xl font-medium text-gray-900 mb-4" style={{ fontFamily: 'sans-serif' }}>
                Premium Neighborhood Subscription
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'sans-serif' }}>
                Unlock exclusive benefits and support your community with our premium subscription package
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* Benefits Description */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'sans-serif' }}>
                  What's Included:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700" style={{ fontFamily: 'sans-serif' }}>Flight credits for community events</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700" style={{ fontFamily: 'sans-serif' }}>Hotel accommodations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700" style={{ fontFamily: 'sans-serif' }}>Meal vouchers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700" style={{ fontFamily: 'sans-serif' }}>Uber ride credits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700" style={{ fontFamily: 'sans-serif' }}>Health examination coverage</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-800" style={{ fontFamily: 'sans-serif' }}>
                    <strong>Price:</strong> $75/month
                  </p>
                </div>
              </div>

              {/* Video Player */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'sans-serif' }}>
                  See What's Included:
                </h4>
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-sm" style={{ fontFamily: 'sans-serif' }}>
                      Video placeholder for subscription benefits
                    </p>
                    <p className="text-gray-400 text-xs" style={{ fontFamily: 'sans-serif' }}>
                      YouTube/Vimeo integration coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscribe Button */}
            <div className="text-center">
              <button
                onClick={handleSubscriptionCheckout}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'sans-serif' }}
              >
                <span className="text-lg">Subscribe Now - $75/month</span>
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <p className="text-sm text-gray-500 mt-3" style={{ fontFamily: 'sans-serif' }}>
                Cancel anytime • No setup fees
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={false} // This will be controlled by the dashboard
        onClose={() => {}}
        onComplete={() => {}}
        userId=""
      />
    </div>
  )
}
