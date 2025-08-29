'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createParticipant } from '@/lib/supabase/auth'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  userId: string
}

export default function OnboardingModal({ isOpen, onClose, onComplete, userId }: OnboardingModalProps) {
  const [formData, setFormData] = useState({
    university: '',
    status: 'enrolled' as 'enrolled' | 'alumni',
    role: '',
    city: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const universities = [
    'University of Central Florida',
    'University of Miami',
    'Florida State University',
    'University of Florida',
    'Florida International University',
    'University of South Florida',
    'Other'
  ]

  const roles = [
    'Student Director',
    'Alumni Coordinator', 
    'Community Partner',
    'Volunteer'
  ]

  const cities = [
    'Orlando',
    'Miami',
    'Tampa',
    'Jacksonville',
    'Tallahassee',
    'Gainesville',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.university || !formData.role || !formData.city) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const participant = await createParticipant(
        userId,
        formData.university,
        formData.status,
        formData.role,
        formData.city
      )
      
      if (participant) {
        onComplete()
        onClose()
      } else {
        setError('Failed to create participant profile. Please try again.')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Beam!</h2>
          <p className="text-gray-600">Complete your profile to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University/College *
            </label>
            <select
              value={formData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select your university</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>{uni}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="enrolled"
                  checked={formData.status === 'enrolled'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Currently Enrolled</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="alumni"
                  checked={formData.status === 'alumni'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Alumni</span>
              </label>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desired Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select your desired role</option>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select your city</option>
              {cities.map((city) => (
                <option key={city} value={city.toLowerCase()}>{city}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Profile...</span>
                </div>
              ) : (
                'Complete Profile & Continue'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your information helps us connect you with relevant governance opportunities in your area
          </p>
        </div>
      </motion.div>
    </div>
  )
}
