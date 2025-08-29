'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  getLeadershipByCity, 
  getDonationActivityByCity, 
  getGovernanceLogsByCity, 
  getTransparencyMetricsByCity,
  hasGovernanceData as checkGovernanceData,
  submitVote,
  type LeadershipMember,
  type DonationActivity,
  type GovernanceLog,
  type TransparencyMetrics
} from '@/lib/supabase/governance'
import LeadershipCard from '@/components/governance/LeadershipCard'
import AllocationBreakdownCard from '@/components/governance/AllocationBreakdownCard'
import DecisionLogsCard from '@/components/governance/DecisionLogsCard'

export default function GovernancePage() {
  const params = useParams()
  const router = useRouter()
  const city = params.city as string
  const [leadership, setLeadership] = useState<LeadershipMember[]>([])
  const [donationActivity, setDonationActivity] = useState<DonationActivity[]>([])
  const [governanceLogs, setGovernanceLogs] = useState<GovernanceLog[]>([])
  const [transparencyMetrics, setTransparencyMetrics] = useState<TransparencyMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasGovernanceData, setHasGovernanceData] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined) // In real app, get from auth context

  useEffect(() => {
    fetchGovernanceData()
  }, [city])

  const fetchGovernanceData = async () => {
    try {
      setLoading(true)
      
      // Check if city has governance data
      const hasData = await checkGovernanceData(city)
      setHasGovernanceData(hasData)

      if (hasData) {
        // Fetch all governance data for the city
        const [leadershipData, donationData, logsData, metricsData] = await Promise.all([
          getLeadershipByCity(city),
          getDonationActivityByCity(city),
          getGovernanceLogsByCity(city),
          getTransparencyMetricsByCity(city)
        ])

        setLeadership(leadershipData)
        setDonationActivity(donationData)
        setGovernanceLogs(logsData)
        setTransparencyMetrics(metricsData)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching governance data:', error)
      setLoading(false)
      setHasGovernanceData(false)
    }
  }

  const handleVote = async (logId: string, vote: 'for' | 'against') => {
    if (!currentUserId) {
      // In real app, redirect to login or show auth modal
      alert('Please log in to vote')
      return
    }

    try {
      const success = await submitVote(logId, currentUserId, vote)
      if (success) {
        // Refresh governance data to show updated vote counts
        await fetchGovernanceData()
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      alert('Failed to submit vote. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading governance data...</p>
        </div>
      </div>
    )
  }

  if (!hasGovernanceData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              This Hood NGO is still being formed
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Check back soon for governance information and leadership details.
            </p>
            <button
              onClick={() => router.push('/governance')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Governance</h1>
              <p className="text-gray-600">{city.charAt(0).toUpperCase() + city.slice(1)} • Transparent Community Leadership</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active Governance
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Leadership Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((member, index) => (
              <LeadershipCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Donation & Subscription Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Donation & Subscription Activity</h3>
              <div className="space-y-4">
                {donationActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{activity.category}</p>
                      <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.donor_type === 'individual' ? 'bg-blue-100 text-blue-800' :
                        activity.donor_type === 'subscription' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {activity.donor_type.charAt(0).toUpperCase() + activity.donor_type.slice(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${activity.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Activity</span>
                  <span className="text-xl font-bold text-green-600">
                    ${donationActivity.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decision Logs */}
          <DecisionLogsCard 
            governanceLogs={governanceLogs}
            onVote={handleVote}
            currentUserId={currentUserId}
          />
        </div>

        {/* Transparency Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Transparency Metrics</h3>
          
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                ${transparencyMetrics?.total_received.toLocaleString()}
              </p>
              <p className="text-sm text-blue-800">Total Received</p>
            </div>
            <div className="text-center p-0 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                ${transparencyMetrics?.total_allocated.toLocaleString()}
              </p>
              <p className="text-sm text-green-800">Total Allocated</p>
            </div>
          </div>

          {/* Allocation Breakdown */}
          {transparencyMetrics && (
            <AllocationBreakdownCard allocationBreakdown={transparencyMetrics.allocation_breakdown} />
          )}

          {/* Service Unlock Progress */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Unlock Progress</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {transparencyMetrics && Object.entries(transparencyMetrics.service_unlock_progress).map(([service, progress]) => (
                <div key={service} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {service.replace('_', ' ').replace(' tier', '')}
                    </span>
                    <span className="text-sm font-bold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Get Involved in Governance</h3>
          <p className="text-lg mb-6 opacity-90">
            Join the decision-making process and help shape your community's future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              Submit Proposal
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              View Meeting Schedule
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
