'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PaymentCancelledPage() {
  const [countdown, setCountdown] = useState(5)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Cancelled Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Cancelled Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          Your payment was cancelled. No charges were made to your account.
        </p>

        {/* Redirect Message */}
        <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          Redirecting to home page in {countdown} seconds...
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Return Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  )
}
