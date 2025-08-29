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
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null)
  const [showEquipmentDonation, setShowEquipmentDonation] = useState(false)
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false)
  const [workOrderForm, setWorkOrderForm] = useState({
    workOrderType: '',
    dateTime: '',
    phoneNumber: '',
    message: ''
  })
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

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

  // Handle work order form submission
  const handleWorkOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would typically send the work order to your backend
    console.log('Work Order Submitted:', {
      category: selectedCategory?.title,
      city: city,
      ...workOrderForm
    })
    
    // Reset form and close modal
    setWorkOrderForm({ workOrderType: '', dateTime: '', phoneNumber: '', message: '' })
    setShowWorkOrderModal(false)
    
    // Show success message (you can implement this as needed)
    alert('Work order submitted successfully! We will contact you soon.')
  }

  // Handle subscription checkout
  const handleSubscriptionCheckout = async () => {
    try {
      // Create Stripe checkout session for subscription
      const response = await fetch('/api/create-subscription-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: city,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/${city}`,
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
    <div className="min-h-screen" style={{ backgroundColor: '#FEFEE8' }}>
      {/* Header - No border */}
      <header className="px-20 py-8" style={{ backgroundColor: '#FEFEE8', height: '88px' }}>
        <div className="max-w-15xl mx-auto">
          <div className="flex justify-between items-center h-full">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: 'sans-serif' }}>Neighborhood</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => window.location.href = '/governance'}
                className="text-sm font-light text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                style={{ fontFamily: 'sans-serif' }}
              >
                About
              </button>
              
              <button 
                onClick={() => window.location.href = '/contact'}
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
          <h2 className="text-2xl font-light text-gray-900 mb-1" style={{ fontFamily: 'sans-serif' }}>
            {city.charAt(0).toUpperCase() + city.slice(1)} neighbors join in strengthening the community.
          </h2>
          <p className="text-2xl font-light text-gray-600 max-w-2xl" style={{ fontFamily: 'sans-serif' }}>
          Choose a service to support today.
          </p>
        </motion.div>

        {/* Services Grid - 2-column Layout */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-7xl">
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
                    className="px-4 py-2 text-white text-sm rounded-lg border border-white/40 font-light hover:bg-white/10 transition-colors flex items-center gap-2"
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
                  {/* Donor Blurb */}
                  <div className="bg-black text-white rounded-2xl p-6 mb-6" style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(0)',
                    transition: 'all 0.2s ease'
                  }}>
                    <p className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'sans-serif' }}>
                      As a donor, these are the ways you can help.
                    </p>
                    <p className="text-sm text-gray-200" style={{ fontFamily: 'sans-serif' }}>
                      Click on any item below to contribute to specific equipment or facility needs.
                    </p>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedCategory.equipment.map((item, index) => (
                      <div 
                        key={index} 
                        onClick={() => {
                          setSelectedEquipment(item)
                          setShowEquipmentDonation(true)
                        }}
                        className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:border-blue-300 hover:bg-blue-50"
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
                        
                        {/* Click Indicator */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600 font-medium">Click to donate</span>
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Card Slider */}
                <div className="space-y-4">
                  {/* Card Display Area */}
                  <div className="relative">
                    {/* Card 1: Total Amount */}
                    {currentCardIndex === 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900 mb-2">Total Raised</h3>
                          <p className="text-4xl font-bold text-blue-700 mb-2">
                            ${selectedCategory.equipment.reduce((acc, item) => 
                              acc + Math.round((item.progress / 100) * item.target), 0
                            ).toLocaleString()}
                          </p>
                          <p className="text-sm text-blue-600">
                            of ${selectedCategory.equipment.reduce((acc, item) => acc + item.target, 0).toLocaleString()} goal
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Card 2: Work Orders */}
                    {currentCardIndex === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                        onClick={() => setShowWorkOrderModal(true)}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-green-900 mb-2">Work Orders</h3>
                          <p className="text-lg text-green-700 mb-2">
                            {selectedCategory.equipment.filter(item => item.progress >= 90).length} Ready
                          </p>
                          <p className="text-sm text-green-600">
                            {selectedCategory.equipment.filter(item => item.progress < 90).length} Pending
                          </p>
                          <div className="mt-4">
                            <div className="w-full bg-green-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min(100, Math.round(selectedCategory.equipment.reduce((acc, item) => acc + item.progress, 0) / selectedCategory.equipment.length))}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              {Math.round(selectedCategory.equipment.reduce((acc, item) => acc + item.progress, 0) / selectedCategory.equipment.length)}% Complete
                            </p>
                          </div>
                          <p className="text-xs text-green-600 mt-2 font-medium">Click to submit work order</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Card 3: Equipment Status */}
                    {currentCardIndex === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-lg"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-purple-900 mb-2">Equipment Status</h3>
                          <div className="space-y-2">
                            {selectedCategory.equipment.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                                <span className="text-sm text-purple-800">{item.name}</span>
                                <span className={`text-sm font-medium ${
                                  item.funded ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                  {item.funded ? 'Funded' : `${item.progress}%`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Card 4: Community Impact */}
                    {currentCardIndex === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 shadow-lg"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-orange-900 mb-2">Community Impact</h3>
                          <div className="space-y-3">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-orange-700">
                                {selectedCategory.equipment.filter(item => item.funded).length}
                              </p>
                              <p className="text-sm text-orange-600">Items Funded</p>
                            </div>
                            <div className="text-center">
                              <p className="text-3xl font-bold text-orange-700">
                                {Math.round(selectedCategory.equipment.reduce((acc, item) => acc + item.progress, 0) / selectedCategory.equipment.length)}%
                              </p>
                              <p className="text-sm text-orange-600">Overall Progress</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setCurrentCardIndex(prev => prev === 0 ? 3 : prev - 1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3].map((index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentCardIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            currentCardIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentCardIndex(prev => prev === 3 ? 0 : prev + 1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
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

      {/* Equipment Donation Modal */}
      {showEquipmentDonation && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Support {selectedEquipment.name}
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'sans-serif' }}>
                  Help fund this specific equipment or facility need
                </p>
              </div>
              <button 
                onClick={() => setShowEquipmentDonation(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Equipment Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Target Amount</p>
                  <p className="text-xl font-bold text-gray-900">${selectedEquipment.target.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Progress</p>
                  <p className="text-xl font-bold text-blue-600">{selectedEquipment.progress}%</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedEquipment.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ${Math.round((selectedEquipment.progress / 100) * selectedEquipment.target).toLocaleString()} of ${selectedEquipment.target.toLocaleString()} raised
                </p>
              </div>
            </div>

            {/* Donation Options */}
            <div className="space-y-4 mb-6">
              <h4 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'sans-serif' }}>
                Choose Your Donation Amount
              </h4>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { amount: 25, label: 'Small' },
                  { amount: 100, label: 'Medium' },
                  { amount: 250, label: 'Large' }
                ].map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => {
                      setSelectedAmount(option.amount)
                      setShowEquipmentDonation(false)
                      setShowPaymentForm(true)
                    }}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center"
                  >
                    <div className="text-2xl font-bold text-gray-900">${option.amount}</div>
                    <div className="text-sm text-gray-600">{option.label}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => {
                  setShowEquipmentDonation(false)
                  setShowCustomAmount(true)
                }}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center"
              >
                <div className="text-lg font-medium text-blue-600">Custom Amount</div>
                <div className="text-sm text-gray-600">Enter your own donation amount</div>
              </button>
            </div>

            {/* Quick Donate Button */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowEquipmentDonation(false)
                  setShowCustomAmount(true)
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                style={{ fontFamily: 'sans-serif' }}
              >
                Custom Amount
              </button>
              <button
                onClick={() => {
                  setSelectedAmount(100)
                  setShowEquipmentDonation(false)
                  setShowPaymentForm(true)
                }}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                style={{ fontFamily: 'sans-serif' }}
              >
                <span>Quick Donate $100</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Work Order Modal */}
      {showWorkOrderModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowWorkOrderModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <button
                onClick={() => setShowWorkOrderModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-2xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>
                Submit Work Order
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'sans-serif' }}>
                {selectedCategory?.title} • {city.charAt(0).toUpperCase() + city.slice(1)}
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              // Handle work order submission logic here
              alert('Work order submitted successfully! We will contact you soon.')
              setShowWorkOrderModal(false)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Work Order Type *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  <option value="">Select a type</option>
                  <option value="repair">Repair</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="installation">Installation</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., +1 (555) 123-4567"
                  style={{ fontFamily: 'sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the work needed, any specific requirements, or additional information..."
                  style={{ fontFamily: 'sans-serif' }}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  <span>Submit Work Order</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
    </div>
  )
}
