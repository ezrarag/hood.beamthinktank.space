'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HomePage() {
  const [userCity, setUserCity] = useState('Atlanta')
  const [showDashboard, setShowDashboard] = useState(false)

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
            }
          } catch (error) {
            console.log('Could not get city from coordinates, using default')
          }
        },
        (error) => {
          console.log('Location not available, using default city')
        }
      )
    }
  }, [])

  return (
    <div className="h-screen bg-white relative overflow-hidden">
      {/* Background Image - Full viewport with better centering */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://bqxetxzxveyfmnvjdime.supabase.co/storage/v1/object/public/home/pexels-theiykeibeh-17791531.jpg" 
          alt="Neighbor Hood Community Background"
          className="w-full h-full object-contain object-center bg-gray-100"
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
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: 'sans-serif' }}>Neighborhood</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href={`/${userCity.toLowerCase()}`} className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm" style={{ fontFamily: 'sans-serif' }}>
                {userCity}
              </a>
              <a href="/governance" className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm" style={{ fontFamily: 'sans-serif' }}>
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm" style={{ fontFamily: 'sans-serif' }}>
                Contact
              </a>
            </nav>

            {/* CTA Button */}
            <button className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200" 
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
              Build
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Locked to viewport height with no scrolling */}
      <main className="relative z-20 h-full flex flex-col justify-end px-20 pb-20">
        {/* Bottom Content Section - Positioned at bottom with proper spacing */}
        <div className="grid lg:grid-cols-2 gap-20 items-end">
          {/* Left Column - Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowDashboard(true)}
                className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
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
                Dashboard
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                style={{
                  boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3), 0 4px 16px rgba(147, 51, 234, 0.2)',
                  transform: 'translateY(0)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(147, 51, 234, 0.4), 0 6px 20px rgba(147, 51, 234, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(147, 51, 234, 0.3), 0 4px 16px rgba(147, 51, 234, 0.2)'
                }}
              >
                New Hood
              </button>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Description Text */}
            <div className="max-w-md">
              <p className="text-gray-600 leading-relaxed font-light" style={{ fontFamily: 'sans-serif' }}>
                As a community platform with a strong focus on neighborhood collaboration and BEAM services, we work closely with local organizations to craft seamless, user-centered experiences that bring communities together and unlock local potential.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Dashboard Modal */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDashboard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'sans-serif' }}>Hood Dashboard</h3>
                <button 
                  onClick={() => setShowDashboard(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'sans-serif' }}>47</p>
                    <p className="text-sm text-gray-600 font-light" style={{ fontFamily: 'sans-serif' }}>Active Hoods</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'sans-serif' }}>156</p>
                    <p className="text-sm text-gray-600 font-light" style={{ fontFamily: 'sans-serif' }}>Services</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'sans-serif' }}>$284k</p>
                    <p className="text-sm text-gray-600 font-light" style={{ fontFamily: 'sans-serif' }}>Donations</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <button className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                    View Full Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
