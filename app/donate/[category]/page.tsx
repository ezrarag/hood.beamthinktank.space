'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

// Mock data for equipment and real estate needs
const categoryData = {
  'healthcare': {
    title: 'Healthcare Services',
    subtitle: 'Supporting community health and wellness',
    equipment: [
      {
        id: 1,
        name: 'Medical Equipment & Supplies',
        target: 15000,
        progress: 65,
        funded: false,
        description: 'Essential medical equipment for community health center'
      },
      {
        id: 2,
        name: 'Mental Health Support Program',
        target: 8000,
        progress: 40,
        funded: false,
        description: 'Counseling services and mental health resources'
      },
      {
        id: 3,
        name: 'Mobile Health Unit',
        target: 25000,
        progress: 25,
        funded: false,
        description: 'Vehicle to provide healthcare access to remote areas'
      },
      {
        id: 4,
        name: 'Health Education Materials',
        target: 3000,
        progress: 80,
        funded: false,
        description: 'Educational resources for community health awareness'
      }
    ]
  },
  'education': {
    title: 'Education & Learning',
    subtitle: 'Building knowledge and skills in our community',
    equipment: [
      {
        id: 1,
        name: 'Computer Lab Equipment',
        target: 12000,
        progress: 70,
        funded: false,
        description: 'Computers and software for digital literacy programs'
      },
      {
        id: 2,
        name: 'Library Books & Resources',
        target: 5000,
        progress: 90,
        funded: false,
        description: 'Books, e-readers, and educational materials'
      }
    ]
  },
  'infrastructure': {
    title: 'Infrastructure & Development',
    subtitle: 'Building stronger foundations for our community',
    equipment: [
      {
        id: 1,
        name: 'Community Center Renovation',
        target: 35000,
        progress: 30,
        funded: false,
        description: 'Modernizing our community gathering space'
      },
      {
        id: 2,
        name: 'Public Safety Equipment',
        target: 15000,
        progress: 55,
        funded: false,
        description: 'Safety equipment for community protection'
      }
    ]
  }
}

export default function DonatePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const city = searchParams.get('city')
  
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const category = params.category as string
  const categoryInfo = categoryData[category as keyof typeof categoryData]

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-600">The requested category could not be found.</p>
        </div>
      </div>
    )
  }

  const handleItemToggle = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleDonation = async () => {
    if (selectedItems.length === 0 && !customAmount) {
      alert('Please select items to donate to or enter a custom amount.')
      return
    }

    if (!donorInfo.name || !donorInfo.email) {
      alert('Please provide your name and email.')
      return
    }

    setIsLoading(true)

    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedItems.map(id => {
            const item = categoryInfo.equipment.find(eq => eq.id === id)
            return {
              id: item?.id,
              name: item?.name,
              amount: customAmount ? parseFloat(customAmount) : 0
            }
          }),
          customAmount: customAmount ? parseFloat(customAmount) : 0,
          category: category,
          city: city,
          donorInfo: donorInfo
        }),
      })

      const session = await response.json()

      if (session.error) {
        throw new Error(session.error)
      }

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

    } catch (error) {
      console.error('Payment error:', error)
      alert('There was an error processing your donation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const totalSelectedAmount = selectedItems.reduce((total, itemId) => {
    const item = categoryInfo.equipment.find(eq => eq.id === itemId)
    return total + (item?.target || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Donate to {categoryInfo.title}
              </h1>
              {city && (
                <p className="text-gray-600 mt-1">
                  Supporting {city} community
                </p>
              )}
            </div>
            <a 
              href={`/${city}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to {city}
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Equipment Selection */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Select Items to Support
              </h2>
              <p className="text-gray-600 mb-6">
                Choose which equipment or real estate needs you'd like to contribute to:
              </p>
              
              <div className="space-y-4">
                {categoryInfo.equipment.map((item) => (
                  <div 
                    key={item.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      selectedItems.includes(item.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => handleItemToggle(item.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            {item.progress}% funded
                          </span>
                          <span className="font-medium text-gray-900">
                            ${item.target.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Selection Indicator */}
                      <div className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedItems.includes(item.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedItems.includes(item.id) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Or Enter Custom Amount
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Donation Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Donation
              </h2>
              
              {/* Selected Items Summary */}
              {selectedItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Selected Items:</h3>
                  <div className="space-y-2">
                    {selectedItems.map(itemId => {
                      const item = categoryInfo.equipment.find(eq => eq.id === itemId)
                      return (
                        <div key={itemId} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{item?.name}</span>
                          <span className="font-medium text-gray-900">
                            ${item?.target.toLocaleString()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Selected:</span>
                      <span className="text-blue-600">
                        ${totalSelectedAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Amount Summary */}
              {customAmount && (
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Custom Amount:</span>
                    <span className="font-semibold text-gray-900">
                      ${parseFloat(customAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Donor Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Your Information:</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <button
                onClick={handleDonation}
                disabled={isLoading || (selectedItems.length === 0 && !customAmount)}
                className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isLoading || (selectedItems.length === 0 && !customAmount)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Complete Donation'
                )}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                You'll be redirected to Stripe to complete your secure payment.
                Confirmation will be sent to your email and phone (if provided).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
