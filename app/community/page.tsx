'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db, ParticipantProfile } from '@/lib/firebase'
import { BEAM_DIVISIONS, CROSS_DIVISION_ROSTER } from '@/lib/divisions'
import ParticipantCard from '@/components/ParticipantCard'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'
import { 
  Search, 
  Users, 
  Heart, 
  MapPin, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  Layers, 
  Building2, 
  User, 
  CreditCard,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Lock
} from 'lucide-react'

export default function CommunityDirectoryPage() {
  const [participants, setParticipants] = useState<ParticipantProfile[]>(CROSS_DIVISION_ROSTER)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDivision, setSelectedDivision] = useState<string>('all')
  const [entityTypeFilter, setEntityTypeFilter] = useState<'all' | 'individual' | 'cohort'>('all')
  const [userProfile, setUserProfile] = useState<ParticipantProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'directory'>('directory')

  useEffect(() => {
    async function loadParticipants() {
      try {
        if (db) {
          const snap = await getDocs(collection(db, 'participantProfiles'))
          if (!snap.empty) {
            const fetched = snap.docs.map(doc => doc.data() as ParticipantProfile)
            
            const mergedMap = new Map<string, ParticipantProfile>()
            CROSS_DIVISION_ROSTER.forEach(p => mergedMap.set(p.email.toLowerCase(), p))
            fetched.forEach(p => mergedMap.set(p.email.toLowerCase(), p))

            setParticipants(Array.from(mergedMap.values()))
          }
        }
      } catch (err) {
        console.warn('Firestore fetch warning, displaying cross-division roster defaults:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadParticipants()
  }, [])

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.primaryRole && p.primaryRole.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.homeHub && p.homeHub.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.primaryInstrument && p.primaryInstrument.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDivision = 
      selectedDivision === 'all' || p.division === selectedDivision

    const matchesEntityType = 
      entityTypeFilter === 'all' || 
      (entityTypeFilter === 'cohort' ? p.entityType === 'cohort' : p.entityType !== 'cohort')

    return matchesSearch && matchesDivision && matchesEntityType
  })

  const totalVillageBalance = participants.reduce((sum, p) => sum + (p.hoodVillageBalance || 0), 0)
  const cohortCount = participants.filter(p => p.entityType === 'cohort').length
  const individualCount = participants.length - cohortCount

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Auth Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> BEAM Community Network
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">Orchestra • Forge • Law • Grounds • Dance • Education</span>
          </div>

          <GoogleAuthButton onUserChanged={(profile) => {
            setUserProfile(profile)
            if (profile && activeTab === 'directory') {
              setActiveTab('dashboard')
            }
          }} />
        </div>
      </div>

      {/* GOOGLE AUTH GATE (If user is not signed in) */}
      {!userProfile ? (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Sign In to Access Your BEAM Community Hub & Subscription Dashboard
            </h1>

            <p className="max-w-xl mx-auto text-slate-300 text-sm leading-relaxed">
              Authenticate with your Google account to manage your patron subscriptions, track your village backing allocations, and interact with community fellows and institutional cohorts.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <GoogleAuthButton onUserChanged={(profile) => setUserProfile(profile)} />
              
              <button
                onClick={() => setActiveTab('directory')}
                className="text-xs text-slate-400 hover:text-white underline font-semibold py-2 px-4"
              >
                Browse Public Roster Preview ↓
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* LOGGED-IN DASHBOARD HERO & TAB NAVIGATION */
        <div className="bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 border-b border-slate-800 py-10 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
                  Authenticated Member Profile
                </span>
                <h1 className="text-3xl font-black text-white mt-2 flex items-center">
                  Welcome back, {userProfile.fullName} <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-2" />
                </h1>
                <p className="text-xs text-slate-300 font-mono mt-0.5">{userProfile.email} • {userProfile.primaryRole}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex space-x-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>My Subscriptions & Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('directory')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'directory' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Browse Roster & Divisions</span>
                </button>
              </div>
            </div>

            {/* User Stats Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <p className="text-[10px] uppercase font-bold text-slate-400">Synced Village Balance</p>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  ${(userProfile.hoodVillageBalance || 0).toLocaleString()} USD
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Available for backing stipends</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <p className="text-[10px] uppercase font-bold text-slate-400">Primary Hub</p>
                <p className="text-base font-bold text-white mt-1">{userProfile.homeHub || 'Atlanta Community Node'}</p>
                <p className="text-[10px] text-slate-500 mt-1">Division: {userProfile.division || 'Orchestra'}</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <p className="text-[10px] uppercase font-bold text-slate-400">Patron Subscriptions</p>
                <p className="text-base font-bold text-white mt-1">Active Community Member</p>
                <p className="text-[10px] text-emerald-400 mt-1">Stripe Billing Synchronized</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD TAB: MY SUBSCRIPTIONS & PROFILE */}
      {userProfile && activeTab === 'dashboard' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">My Active Patron Subscriptions</h2>
            <p className="text-xs text-slate-400 mb-6">
              Manage your recurring monthly backing pledges to community participants and institutional cohorts.
            </p>

            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold">
                    <Heart className="w-6 h-6 fill-emerald-400/20" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">BEAM Village Patron Subscription</h3>
                    <p className="text-xs text-slate-400">Monthly support distributed across Travel, Housing, Meals, & Maintenance stipends</p>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md mt-1 inline-block">
                      $75.00 / month • Auto-renews
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" /> Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECTORY TAB: BROWSE ROSTER & DIVISIONS */}
      {(activeTab === 'directory' || !userProfile) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
          
          {/* Entity Type Toggle (All vs Individuals vs Cohorts) */}
          <div className="flex justify-center mb-6">
            <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex space-x-1">
              <button
                onClick={() => setEntityTypeFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  entityTypeFilter === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Entities ({participants.length})
              </button>
              <button
                onClick={() => setEntityTypeFilter('individual')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  entityTypeFilter === 'individual' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Individuals ({individualCount})</span>
              </button>
              <button
                onClick={() => setEntityTypeFilter('cohort')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  entityTypeFilter === 'cohort' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Institutional Cohorts ({cohortCount})</span>
              </button>
            </div>
          </div>

          {/* Division Selector Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            <button
              onClick={() => setSelectedDivision('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedDivision === 'all'
                  ? 'bg-slate-100 text-slate-950 border-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Divisions ({participants.length})
            </button>
            {BEAM_DIVISIONS.map((div) => {
              const count = participants.filter(p => p.division === div.id).length
              return (
                <button
                  key={div.id}
                  onClick={() => setSelectedDivision(div.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap border ${
                    selectedDivision === div.id
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{div.icon}</span>
                  <span>{div.name}</span>
                  <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded-full text-slate-300">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-10">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search participant, instrument, role, or hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Directory Grid */}
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-xs text-slate-400">Harvesting BEAM Cross-Division Directory...</p>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">No Participants Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try selecting another division or entity filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParticipants.map((participant) => (
                <ParticipantCard key={participant.email} participant={participant} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
