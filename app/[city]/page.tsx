'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'

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

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm" style={{ fontFamily: 'sans-serif' }}>
                Home
              </a>
              <a href="/governance" className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm" style={{ fontFamily: 'sans-serif' }}>
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm" style={{ fontFamily: 'sans-serif' }}>
                Contact
              </a>
            </nav>

            {/* CTA Button */}
            <button className="bg-black hover:bg-gray-800 text-white font-light py-3 px-6 rounded-lg transition-colors duration-200" 
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
              Build
            </button>
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
          className="text-left mb-8 w-full max-w-6xl"
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
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
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
            <div className="p-6 overflow-hidden">
              <div className={`flex transition-transform duration-500 ease-in-out ${showPaymentForm ? '-translate-x-full' : 'translate-x-0'}`}>
                {/* First Panel - Category Details */}
                <div className="min-w-full flex-shrink-0">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Services & Overview */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2" style={{ fontFamily: 'sans-serif' }}>
                          Services Available
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCategory.services.map((service, index) => (
                            <span 
                              key={index}
                              className="px-3 py-2 text-gray-700 text-sm rounded-md border border-gray-200 font-light"
                              style={{
                                fontFamily: 'sans-serif',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)'
                              }}
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2" style={{ fontFamily: 'sans-serif' }}>
                          Overview
                        </h3>
                        <p className="text-gray-700 mb-4" style={{ fontFamily: 'sans-serif' }}>
                          {selectedCategory.description}
                        </p>
                        <p className="text-gray-700" style={{ fontFamily: 'sans-serif' }}>
                          Support this category by making a donation. Once the threshold is reached, 
                          community members can request these services through our work order system.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2" style={{ fontFamily: 'sans-serif' }}>
                          Impact Story
                        </h3>
                        <p className="text-gray-700" style={{ fontFamily: 'sans-serif' }}>
                          {selectedCategory.impactStory}
                        </p>
                      </div>
                    </div>

                    {/* Middle Column - Donation Progress & Equipment Cards */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2" style={{ fontFamily: 'sans-serif' }}>
                          Donation Progress
                        </h3>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${selectedCategory.donationThreshold}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2" style={{ fontFamily: 'sans-serif' }}>
                          {selectedCategory.donationThreshold}% of goal reached
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-sm font-medium text-gray-500 mb-2" style={{ fontFamily: 'sans-serif' }}>
                          Equipment & Real Estate Needs ({selectedCategory.equipment.length} items)
                        </h3>
                        <div className="space-y-3">
                          {selectedCategory.equipment.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                                  {item.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                                    ${item.target.toLocaleString()}
                                  </span>
                                  {item.funded ? (
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-600" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                                  {item.progress}% funded
                                </span>
                                {item.funded && (
                                  <span className="text-xs text-green-600 font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                                    ✅ Funded
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Work Order & Donation */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2" style={{ fontFamily: 'sans-serif' }}>
                          Work Order Form
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-600 text-sm" style={{ fontFamily: 'sans-serif' }}>
                            Work order forms will be available once the donation threshold is reached. 
                            This ensures we can provide quality services to all community members.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2" style={{ fontFamily: 'sans-serif' }}>
                          Donate Now
                        </h3>
                        <div className="relative">
                          <button 
                            onClick={() => setIsDonationMenuOpen(!isDonationMenuOpen)}
                            className="w-full bg-black hover:bg-gray-800 text-white font-light py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
                          >
                            <span style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Support This Category</span>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${isDonationMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {/* Upward Menu */}
                          {isDonationMenuOpen && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                              <button 
                                onClick={() => {
                                  setSelectedAmount(25)
                                  setShowPaymentForm(true)
                                  setIsDonationMenuOpen(false)
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                              >
                                <span className="font-medium">$25</span>
                                <span className="text-gray-600 text-sm ml-2">Quick Support</span>
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedAmount(50)
                                  setShowPaymentForm(true)
                                  setIsDonationMenuOpen(false)
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                              >
                                <span className="font-medium">$50</span>
                                <span className="text-gray-600 text-sm ml-2">Standard Support</span>
                              </button>
                              <button 
                                onClick={() => {
                                  setShowCustomAmount(true)
                                  setIsDonationMenuOpen(false)
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                              >
                                <span className="font-medium">Custom Amount</span>
                                <span className="text-gray-600 text-sm ml-2">Choose your own</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Panel - Payment Form */}
                <div className="min-w-full flex-shrink-0">
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
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
    </div>
  )
}
