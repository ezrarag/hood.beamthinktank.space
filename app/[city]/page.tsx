'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Type definitions
interface Category {
  id: number
  title: string
  subtitle: string
  services: string[]
  image: string
  description: string
  donationThreshold: number
  impactStory: string
  equipment: {
    name: string
    target: number
    progress: number
    funded: boolean
  }[]
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

export default function CityPage() {
  const params = useParams()
  const city = params.city as string
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDonationMenuOpen, setIsDonationMenuOpen] = useState(false)
  const [showCustomAmount, setShowCustomAmount] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [isBuildDropdownOpen, setIsBuildDropdownOpen] = useState(false)

  // Close build dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isBuildDropdownOpen) {
        setIsBuildDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isBuildDropdownOpen])

  // Mock category data - represents different areas where neighborhood can donate for services
  const categories = [
    {
      id: 1,
      title: 'Education & Skills',
      subtitle: 'Supporting learning and development',
      services: ['Tutoring', 'Job Training', 'Tech Intro Course'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face',
      description: 'Supporting educational initiatives in the community',
      donationThreshold: 75,
      impactStory: 'This service helps fund 2 new tutors in your area',
      equipment: [
        { name: 'Classroom Rental', target: 800, progress: 100, funded: true },
        { name: 'Laptops', target: 1200, progress: 45, funded: false },
        { name: 'Study Materials', target: 300, progress: 80, funded: false }
      ]
    },
    {
      id: 2,
      title: 'Healthcare',
      subtitle: 'Providing essential health services',
      services: ['Medical Checkup', 'Mental Health Support', 'Wellness Programs'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      description: 'Providing healthcare services to residents',
      donationThreshold: 60,
      impactStory: 'This service helps provide free medical checkups for 15 residents',
      equipment: [
        { name: 'Medical Equipment', target: 1500, progress: 100, funded: true },
        { name: 'Examination Room', target: 2000, progress: 30, funded: false },
        { name: 'Wellness Supplies', target: 500, progress: 90, funded: false }
      ]
    },
    {
      id: 3,
      title: 'Environment & Green',
      subtitle: 'Maintaining our local environment',
      services: ['Cleanup', 'Green Spaces', 'Recycling'],
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      description: 'Maintaining and improving our local environment',
      donationThreshold: 45,
      impactStory: 'This service helps maintain 3 community gardens and cleanup events',
      equipment: [
        { name: 'Lawnmower', target: 300, progress: 100, funded: true },
        { name: 'Storage Shed', target: 1200, progress: 45, funded: false },
        { name: 'Garden Tools', target: 400, progress: 75, funded: false }
      ]
    },
    {
      id: 4,
      title: 'Community & Care',
      subtitle: 'Building stronger connections',
      services: ['Daycare', 'Senior Support', 'Youth Mentorship'],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      description: 'Building stronger community connections',
      donationThreshold: 80,
      impactStory: 'This service helps provide daycare for 8 families and senior support',
      equipment: [
        { name: 'Daycare Facility', target: 5000, progress: 100, funded: true },
        { name: 'Senior Center', target: 3000, progress: 60, funded: false },
        { name: 'Youth Center', target: 2500, progress: 40, funded: false }
      ]
    },
    {
      id: 5,
      title: 'Transportation & Repair',
      subtitle: 'Keeping our community mobile',
      services: ['Windshield Repair', 'Brake Check', 'Carpool Support'],
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      description: 'Supporting transportation and repair needs',
      donationThreshold: 55,
      impactStory: 'This service helps provide free car repairs for 5 families',
      equipment: [
        { name: 'Tool Set', target: 800, progress: 100, funded: true },
        { name: 'Work Space', target: 1500, progress: 25, funded: false },
        { name: 'Parts Storage', target: 600, progress: 70, funded: false }
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header - No border */}
      <header className="px-20 py-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-15xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: 'sans-serif' }}>Neighborhood</h1>
            </div>



            {/* CTA Button with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsBuildDropdownOpen(!isBuildDropdownOpen)}
                className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 flex items-center gap-2" 
                style={{
                  fontFamily: 'sans-serif',
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
                <span>Build</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isBuildDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Build Dropdown Menu */}
              {isBuildDropdownOpen && (
                <>
                  {/* Blur overlay */}
                  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsBuildDropdownOpen(false)} />
                  
                  {/* Dropdown cards */}
                  <div className="absolute right-0 mt-2 w-80 space-y-3 z-50">
                    <a 
                      href="/governance"
                      className="block w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 transition-all duration-200 transform hover:scale-105 shadow-xl border border-gray-600 cursor-pointer"
                      style={{ fontFamily: 'sans-serif' }}
                    >
                                              <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">1</span>
                          </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">Governance</h3>
                          <p className="text-gray-300 leading-relaxed">
                            Learn about our student-driven governance model and decision-making process
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
                          <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">Projects</h3>
                          <p className="text-gray-300 leading-relaxed">
                            Explore ongoing community projects and initiatives
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
                          <h3 className="text-xl font-bold text-white mb-2">Community</h3>
                          <p className="text-gray-300 leading-relaxed">
                            Connect with community members and get involved
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
      </header>

      {/* Main Content - Using the Framer CSS template structure */}
      <main 
        className="w-full flex flex-col justify-start items-center px-20 py-16"
        style={{
          boxSizing: 'border-box',
          height: 'min-content',
          padding: '0px 0px 200px 0px',
          alignContent: 'center',
          flexWrap: 'nowrap',
          gap: '0px',
          position: 'relative',
          borderRadius: '0px 0px 0px 0px'
        }}
      >
        {/* City Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left mb-8 w-full max-w-7xl"
        >
          <h2 className="text-5xl font-light text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>
            {city.charAt(0).toUpperCase() + city.slice(1)} Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl font-light" style={{ fontFamily: 'sans-serif' }}>
            Support your community by donating to these service categories
          </p>
        </motion.div>

        {/* Services Grid - 3-column Layout */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-7xl">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => {
                setSelectedCategory(category)
                setIsModalOpen(true)
              }}
            >
              {/* Service Category Card - Less rounded corners */}
              <div className="relative h-80 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                style={{ borderRadius: '20px' }}
              >
                {/* Background Image */}
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Simple Gradient Overlay - No blur */}
                <div className="absolute inset-0" 
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 5%, rgba(0, 0, 0, 0.47315) 49.949245541838124%, rgba(0,0,0,1) 100%)'
                  }}
                ></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Category Title */}
                  <h3 className="text-xl font-light text-white mb-2" style={{ fontFamily: 'sans-serif' }}>
                    {category.title}
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-sm text-white/80 mb-4 font-light" style={{ fontFamily: 'sans-serif' }}>
                    {category.subtitle}
                  </p>
                  
                  {/* Explore Services Button */}
                  <button 
                    onClick={() => {
                      setSelectedCategory(category)
                      setIsModalOpen(true)
                    }}
                    className="px-4 py-2 text-white text-sm rounded-full border border-white/40 font-light hover:bg-white/10 transition-colors flex items-center gap-2"
                    style={{
                      fontFamily: 'Instrument Sans, sans-serif',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    Explore Services
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Services Modal */}
      {isModalOpen && selectedCategory && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setIsModalOpen(false)
            setIsDonationMenuOpen(false)
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden mx-4 sm:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div>
                <h2 className="text-3xl font-light text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  {selectedCategory.title}
                </h2>
                <p className="text-gray-600" style={{ fontFamily: 'sans-serif' }}>
                  {selectedCategory.subtitle}
                </p>
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'sans-serif' }}>
                  Equipment items: {selectedCategory.equipment.length}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Scrollable Equipment List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4" style={{ fontFamily: 'sans-serif' }}>
                    Equipment & Real Estate Needs
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedCategory.equipment.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                        style={{ fontFamily: 'sans-serif' }}
                      >
                        {/* Item Header */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-blue-600">
                              ${item.target.toLocaleString()}
                            </span>
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        
                        {/* Status */}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {item.progress}% funded
                          </span>
                          {item.funded && (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Funded
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Picture Card with Service Buttons */}
                <div className="space-y-6">
                  {/* Picture Card */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="text-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedCategory.title}</h3>
                        <p className="text-gray-600 text-sm">{selectedCategory.subtitle}</p>
                      </div>
                      
                      {/* Service Buttons Overlay */}
                      <div className="grid grid-cols-2 gap-3">
                        {selectedCategory.services.map((service, index) => (
                          <button
                            key={index}
                            className="group relative bg-white hover:bg-blue-50 rounded-xl p-3 border border-gray-200 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                              {service}
                            </span>
                            {/* Hover Popup */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto whitespace-nowrap z-10">
                              Click to learn more about {service}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Donate Now Button */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3" style={{ fontFamily: 'sans-serif' }}>
                      Support This Category
                    </h3>
                    <button 
                      onClick={() => {
                        // Navigate to the healthcare donation page with category info
                        const categorySlug = selectedCategory.title.toLowerCase().replace(/\s+/g, '-')
                        const cityParam = Array.isArray(params.city) ? params.city[0] : params.city
                        window.location.href = `/donate/${categorySlug}?city=${encodeURIComponent(cityParam)}`
                      }}
                      className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      <span>Donate Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom Amount Modal */}
      {showCustomAmount && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Custom Donation Amount
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Enter the amount you'd like to donate
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Amount ($)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCustomAmount(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (customAmount && parseFloat(customAmount) > 0 && selectedCategory) {
                      setSelectedAmount(parseFloat(customAmount))
                      setShowCustomAmount(false)
                      setCustomAmount('')
                      setShowPaymentForm(true)
                    }
                  }}
                  disabled={!customAmount || parseFloat(customAmount) <= 0}
                  className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-600 mb-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-2xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Complete Your Donation
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Supporting {selectedCategory.title} with ${selectedAmount}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share why you're supporting this cause..."
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleStripePayment(selectedCategory.id, selectedCategory.title, selectedAmount)}
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span>Proceed to Payment</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
