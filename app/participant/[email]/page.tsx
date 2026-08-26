'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db, ParticipantProfile } from '@/lib/firebase'
import { loadStripe } from '@stripe/stripe-js'
import { 
  Heart, 
  Plane, 
  Home, 
  Utensils, 
  Wrench, 
  ShieldCheck, 
  ExternalLink, 
  Award, 
  Music, 
  CheckCircle2, 
  ArrowLeft,
  DollarSign
} from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock')

// Helper function to calculate allocation breakdown based on percentages
function calculateFundBreakdown(balance: number, allocations?: ParticipantProfile['hoodAllocations']) {
  const travelPct = allocations?.travelPercent ?? 40
  const housingPct = allocations?.housingPercent ?? 35
  const mealsPct = allocations?.mealsPercent ?? 15
  const maintPct = allocations?.maintenancePercent ?? 10

  return {
    travelUSD: (balance * travelPct) / 100,
    housingUSD: (balance * housingPct) / 100,
    mealsUSD: (balance * mealsPct) / 100,
    maintenanceUSD: (balance * maintPct) / 100,
    percentages: { travelPct, housingPct, mealsPct, maintPct }
  }
}

export default function ParticipantProfilePage() {
  const params = useParams()
  const router = useRouter()
  const rawEmail = Array.isArray(params.email) ? params.email[0] : params.email
  const participantEmail = decodeURIComponent(rawEmail || '').toLowerCase()

  const [profile, setProfile] = useState<ParticipantProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBackingModalOpen, setIsBackingModalOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number>(25)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [backingType, setBackingType] = useState<'one_time' | 'monthly'>('one_time')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function fetchProfile() {
      if (!participantEmail) return
      setIsLoading(true)

      try {
        if (db) {
          const docRef = doc(db, 'participantProfiles', participantEmail)
          const snap = await getDoc(docRef)
          if (snap.exists()) {
            setProfile(snap.data() as ParticipantProfile)
            setIsLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('Firestore fetch error, falling back to mock profile:', err)
      }

      // Fallback demo profile if Firestore doc doesn't exist yet
      setProfile({
        fullName: participantEmail.split('@')[0].replace('.', ' ').toUpperCase() || 'BEAM Musician',
        email: participantEmail,
        primaryRole: 'Steinway Recording Artist & Resident Fellow',
        originProject: 'BEAM Orchestra Initiative',
        primaryInstrument: 'Violin / Chamber Strings',
        homeHub: 'Atlanta Node #4',
        hoodVillageBalance: 1250,
        bio: 'Dedicated to community outreach, youth mentorship, and classical chamber music performance.',
        hoodAllocations: {
          travelPercent: 40,
          housingPercent: 35,
          mealsPercent: 15,
          maintenancePercent: 10,
        },
        portfolioMedia: [
          { id: '1', title: 'Steinway Session No. 4', url: '#', category: 'Recording', composer: 'Bach' },
          { id: '2', title: 'Community Masterclass', url: '#', category: 'Education' }
        ]
      })

      setIsLoading(false)
    }

    fetchProfile()
  }, [participantEmail])

  const handleStripeCheckout = async () => {
    setIsSubmitting(true)
    setErrorMessage('')
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount

    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid backing amount.')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantEmail: profile?.email,
          participantName: profile?.fullName,
          customAmount: amount,
          backingType,
          donorInfo: { name: donorName, email: donorEmail },
        }),
      })

      const session = await response.json()
      if (session.error) {
        setErrorMessage(session.error)
        setIsSubmitting(false)
        return
      }

      const stripe = await stripePromise
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: session.id })
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setErrorMessage('Failed to initiate payment. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <h1 className="text-2xl font-bold mb-4">Participant Profile Not Found</h1>
        <button 
          onClick={() => router.push('/community')}
          className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors"
        >
          Return to Community Directory
        </button>
      </div>
    )
  }

  const balance = profile.hoodVillageBalance || 0
  const breakdown = calculateFundBreakdown(balance, profile.hoodAllocations)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner & Navigation */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push('/community')}
            className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Community Hub
          </button>

          <a 
            href={`https://orchestra.beamthinktank.space/profile?musician=${encodeURIComponent(profile.email)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full"
          >
            <Music className="w-3.5 h-3.5 mr-1.5" /> Orchestra Portfolio <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Bio & Participant Identity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-4xl font-bold text-slate-950 shadow-xl overflow-hidden flex-shrink-0">
                  {profile.headshotUrl ? (
                    <img src={profile.headshotUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                  ) : (
                    profile.fullName.substring(0, 2)
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                      Verified Participant
                    </span>
                    {profile.homeHub && (
                      <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                        {profile.homeHub}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-extrabold text-white mt-1">{profile.fullName}</h1>
                  <p className="text-slate-300 font-medium">{profile.primaryRole}</p>
                  {profile.primaryInstrument && (
                    <p className="text-sm text-emerald-400 mt-1 flex items-center">
                      <Music className="w-4 h-4 mr-1.5" /> Instrument: {profile.primaryInstrument}
                    </p>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="mt-6 text-slate-300 text-sm leading-relaxed border-t border-slate-800/80 pt-4">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Fund Allocation Breakdown Cards */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Village Backing Allocation</h2>
                  <p className="text-xs text-slate-400">
                    Transparent percentage breakdown configured for travel, lodging, meals, and instrument care.
                  </p>
                </div>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  Total: ${balance.toLocaleString()} USD
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Travel */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-blue-950/80 text-blue-400 rounded-xl border border-blue-800/50">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Transit & Travel</h3>
                        <p className="text-xs text-slate-400">{breakdown.percentages.travelPct}% allocation</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-400">${breakdown.travelUSD.toFixed(2)}</span>
                  </div>
                </div>

                {/* Housing */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-purple-950/80 text-purple-400 rounded-xl border border-purple-800/50">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Housing & Lodging</h3>
                        <p className="text-xs text-slate-400">{breakdown.percentages.housingPct}% allocation</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-purple-400">${breakdown.housingUSD.toFixed(2)}</span>
                  </div>
                </div>

                {/* Meals */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-amber-950/80 text-amber-400 rounded-xl border border-amber-800/50">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Meals & Per Diem</h3>
                        <p className="text-xs text-slate-400">{breakdown.percentages.mealsPct}% allocation</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-amber-400">${breakdown.mealsUSD.toFixed(2)}</span>
                  </div>
                </div>

                {/* Maintenance */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-emerald-950/80 text-emerald-400 rounded-xl border border-emerald-800/50">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Instrument & Luthier</h3>
                        <p className="text-xs text-slate-400">{breakdown.percentages.maintPct}% allocation</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-emerald-400">${breakdown.maintenanceUSD.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar CTA & Village Balance Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-emerald-950/90 to-slate-900 border border-emerald-800/60 rounded-3xl p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Heart className="w-40 h-40 text-emerald-400" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
                Village Backing Fund
              </span>

              <div className="mt-4">
                <p className="text-xs text-slate-400">Total Patron & Stream Backing</p>
                <div className="text-4xl font-black text-white mt-1">
                  ${balance.toLocaleString()} <span className="text-sm font-normal text-slate-400">USD</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                Direct patron contributions empower this participant to perform, travel, and maintain instruments across the BEAM network.
              </p>

              <button
                onClick={() => setIsBackingModalOpen(true)}
                className="w-full mt-6 py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <Heart className="w-5 h-5 fill-slate-950" />
                <span>Back This Participant</span>
              </button>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1" /> Secure Stripe Processing
                </span>
                <a 
                  href="https://orchestra.beamthinktank.space/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-200"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Backing Payment Modal */}
      <AnimatePresence>
        {isBackingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Back {profile.fullName}</h3>
                  <p className="text-xs text-slate-400">Directly fund performance, travel, & instrument care</p>
                </div>
                <button
                  onClick={() => setIsBackingModalOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6">
                <button
                  onClick={() => setBackingType('one_time')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    backingType === 'one_time' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  One-Time Gift
                </button>
                <button
                  onClick={() => setBackingType('monthly')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    backingType === 'monthly' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly Patron Backing
                </button>
              </div>

              {/* Amount Selection */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt)
                      setCustomAmount('')
                    }}
                    className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${
                      selectedAmount === amt && !customAmount
                        ? 'border-emerald-500 bg-emerald-950/80 text-emerald-400'
                        : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  placeholder="Custom Amount (USD)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm font-mono"
                />
              </div>

              {/* Optional Donor Info */}
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
                <input
                  type="email"
                  placeholder="Your Email for Receipt"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-400 mb-4 bg-rose-950/50 border border-rose-800 p-2 rounded-lg">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={handleStripeCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Connecting to Stripe...</span>
                ) : (
                  <span>Proceed to Stripe Checkout (${customAmount || selectedAmount})</span>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
