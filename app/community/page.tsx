'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
import { db, ParticipantProfile } from '@/lib/firebase'
import { BEAM_DIVISIONS, CROSS_DIVISION_ROSTER } from '@/lib/divisions'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'
import Link from 'next/link'
import { 
  Search, 
  Users, 
  Heart, 
  MapPin, 
  Sparkles, 
  Layers, 
  Building2, 
  User as UserIcon, 
  CreditCard,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Lock,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Plus
} from 'lucide-react'

interface MemberInfo {
  name: string
  hub: string
  publicSupport: boolean
  supports: string[]
}

const MEMBERS_LIST: MemberInfo[] = [
  { name: 'Jordan Ellis', hub: 'Atlanta Node #2', publicSupport: true, supports: ['Elena Rostova', 'Black Diaspora Symphony Orchestra'] },
  { name: 'Maya Okafor', hub: 'Decatur Tech Node', publicSupport: true, supports: ['Marcus Vance', 'BEAM Forge Hardware Incubator'] },
  { name: 'Sam Whitfield', hub: 'Midtown Hub #1', publicSupport: false, supports: [] },
  { name: 'Priya Chandra', hub: 'Atlanta Node #4', publicSupport: true, supports: ['Ezra Haugabrooks'] },
  { name: 'Devon Blake', hub: 'Midtown Legal Hub', publicSupport: false, supports: [] },
  { name: 'Renee Castillo', hub: 'Atlanta Node #4', publicSupport: true, supports: ['Sophia Liang', 'Elena Rostova'] },
]

export default function NeighborHoodCommunityHub() {
  const [participants, setParticipants] = useState<ParticipantProfile[]>(CROSS_DIVISION_ROSTER)
  const [userProfile, setUserProfile] = useState<ParticipantProfile | null>(null)
  const [activeNavTab, setActiveNavTab] = useState<'dashboard' | 'members' | 'participants' | 'cohort' | 'invite'>('dashboard')
  
  // State for user interactions
  const [supportedEmails, setSupportedEmails] = useState<Record<string, boolean>>({
    'elena.rostova@beam.org': true,
    'bdso-cohort@beam.org': true,
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDivision, setSelectedDivision] = useState<string>('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Cohort creation state
  const [cohortTargetEmail, setCohortTargetEmail] = useState<string>('elena.rostova@beam.org')
  const [cohortName, setCohortName] = useState('')
  const [cohortTarget, setCohortTarget] = useState('150')
  const [cohortMessage, setCohortMessage] = useState('')
  const [invitedMembers, setInvitedMembers] = useState<Record<string, boolean>>({})
  const [cohortLaunched, setCohortLaunched] = useState(false)

  // Nomination / Invite state
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteHub, setInviteHub] = useState('')
  const [inviteNote, setInviteNote] = useState('')
  const [inviteDivision, setInviteDivision] = useState('orchestra')
  const [inviteSubmitted, setInviteSubmitted] = useState(false)

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
        console.warn('Firestore fetch warning:', err)
      }
    }
    loadParticipants()
  }, [])

  const getInitials = (name: string) => {
    const parts = name.replace(/[()]/g, '').split(' ').filter(Boolean)
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'BE'
  }

  const toggleSupport = (email: string) => {
    setSupportedEmails(prev => ({ ...prev, [email]: !prev[email] }))
  }

  const startCohortFor = (email: string) => {
    setCohortTargetEmail(email)
    setCohortLaunched(false)
    setCohortName('')
    setCohortMessage('')
    setInvitedMembers({})
    setActiveNavTab('cohort')
  }

  const toggleCohortInvite = (memberName: string) => {
    setInvitedMembers(prev => ({ ...prev, [memberName]: !prev[memberName] }))
  }

  const supportedList = participants.filter(p => supportedEmails[p.email.toLowerCase()])
  const recommendedList = participants.filter(p => !supportedEmails[p.email.toLowerCase()]).slice(0, 3)

  const monthlyTotal = supportedList.reduce((sum, p) => {
    if (p.email.toLowerCase().includes('bdso')) return sum + 60
    if (p.email.toLowerCase().includes('elena')) return sum + 25
    return sum + 25
  }, 0)

  const filteredParticipants = participants.filter(p => {
    const q = searchQuery.toLowerCase()
    const matchesQ = !q || p.fullName.toLowerCase().includes(q) || p.primaryRole.toLowerCase().includes(q) || (p.homeHub && p.homeHub.toLowerCase().includes(q))
    const matchesDiv = selectedDivision === 'all' || p.division === selectedDivision
    return matchesQ && matchesDiv
  })

  const cohortTargetParticipant = participants.find(p => p.email.toLowerCase() === cohortTargetEmail.toLowerCase()) || participants[2]

  return (
    <div className="min-h-screen bg-[#FEFEE8] text-[#111111] font-['Instrument_Sans',sans-serif] selection:bg-[#111111] selection:text-[#FEFEE8]">
      
      {/* ================= HEADER & NAV ================= */}
      {userProfile && (
        <header className="sticky top-0 z-40 bg-[#FEFEE8]/80 backdrop-blur-md border-b border-[#111111]/10">
          <div className="max-w-[1180px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
            
            {/* Wordmark & Location */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/" className="text-xl font-light tracking-tight text-[#111111] hover:opacity-80 transition-opacity">
                Neighbor Hood
              </Link>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#111111]/15 bg-white/70 text-xs font-light text-[#111111] hover:bg-[#F5F5EE] transition-colors">
                <span>Atlanta, GA</span>
                <ChevronDown className="w-3 h-3 text-[#111111]" />
              </button>
            </div>

            {/* Nav Tabs */}
            <nav className="flex items-center gap-1 bg-white/80 border border-[#111111]/10 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setActiveNavTab('dashboard')}
                className={`px-4 py-1.5 rounded-xl text-xs font-normal transition-all ${
                  activeNavTab === 'dashboard'
                    ? 'bg-[#111111] text-[#FEFEE8] font-medium'
                    : 'text-[#5C5C54] hover:bg-[#111111]/5'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveNavTab('members')}
                className={`px-4 py-2 rounded-xl text-xs font-normal transition-all ${
                  activeNavTab === 'members'
                    ? 'bg-[#111111] text-[#FEFEE8] font-medium'
                    : 'text-[#5C5C54] hover:bg-[#111111]/5'
                }`}
              >
                Members
              </button>
              <button
                onClick={() => setActiveNavTab('participants')}
                className={`px-4 py-2 rounded-xl text-xs font-normal transition-all ${
                  activeNavTab === 'participants'
                    ? 'bg-[#111111] text-[#FEFEE8] font-medium'
                    : 'text-[#5C5C54] hover:bg-[#111111]/5'
                }`}
              >
                Participants
              </button>
            </nav>

            {/* CTA & User Avatar Dropdown */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setActiveNavTab('participants')}
                className="px-4 py-2 rounded-xl bg-[#111111] text-[#FEFEE8] text-xs font-semibold hover:bg-[#2A2A26] transition-colors shadow-sm"
              >
                Support a participant
              </button>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-9 h-9 rounded-xl bg-[#10B981] text-white font-bold text-xs flex items-center justify-center border border-emerald-600 shadow-sm hover:scale-105 transition-transform"
                >
                  {getInitials(userProfile.fullName)}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-12 w-60 bg-white border border-[#111111]/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-[#111111]/10 mb-1">
                      <p className="text-xs font-bold text-[#111111]">{userProfile.fullName}</p>
                      <p className="text-[11px] text-[#8A8A80] font-mono truncate">{userProfile.email}</p>
                    </div>
                    <Link href="/governance" className="block px-3 py-2 rounded-xl text-xs text-[#111111] hover:bg-[#F5F5EE]">About</Link>
                    <Link href="/contact" className="block px-3 py-2 rounded-xl text-xs text-[#111111] hover:bg-[#F5F5EE]">Contact</Link>
                    <Link href="/admin" className="block px-3 py-2 rounded-xl text-xs text-[#111111] hover:bg-[#F5F5EE]">Admin Console</Link>
                    <div className="h-px bg-[#111111]/10 my-1" />
                    <button
                      onClick={() => setUserProfile(null)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-700 hover:bg-rose-50 flex items-center justify-between"
                    >
                      <span>Log out</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </header>
      )}

      {/* ================= GOOGLE AUTH GATE ================= */}
      {!userProfile ? (
        <div className="min-h-[85vh] flex items-center justify-center p-6">
          <div className="max-w-[440px] w-full bg-white border border-[#111111]/10 rounded-[28px] p-10 text-center shadow-[0_1px_3px_rgba(17,17,17,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#FEFEE8] flex items-center justify-center mx-auto mb-6 shadow-md">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-semibold text-[#111111] mb-3 tracking-tight">
              Sign in to your Community Hub
            </h1>

            <p className="text-xs text-[#5C5C54] leading-relaxed mb-8">
              Manage the participants you support, start cohorts with your neighbors, and see your BEAM subscriptions in one place.
            </p>

            <div className="flex justify-center">
              <GoogleAuthButton onUserChanged={(profile) => setUserProfile(profile)} />
            </div>

            <p className="text-[11px] text-[#9A9A8F] mt-6">
              Authenticated accounts sync seamlessly across all BEAM division portals.
            </p>
          </div>
        </div>
      ) : (
        <main>
          {/* ================= TAB 1: DASHBOARD ================= */}
          {activeNavTab === 'dashboard' && (
            <div>
              {/* Hero Photo Banner */}
              <div className="relative h-[48vh] min-h-[360px] overflow-hidden -mt-[73px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110"
                  style={{ backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/beam-orchestra-platform.firebasestorage.app/o/pexels-afroromanzo-4028878.jpg?alt=media&token=b95bbe32-cc29-4ff7-815a-3dd558efa561')` }}
                />
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/beam-orchestra-platform.firebasestorage.app/o/pexels-afroromanzo-4028878.jpg?alt=media&token=b95bbe32-cc29-4ff7-815a-3dd558efa561')`,
                    WebkitMaskImage: 'radial-gradient(ellipse 62% 62% at center, black 50%, transparent 100%)',
                    maskImage: 'radial-gradient(ellipse 62% 62% at center, black 50%, transparent 100%)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-8 max-w-[1180px] mx-auto w-full">
                  <h1 className="text-3xl sm:text-4xl font-light text-white mb-1 tracking-tight">
                    Welcome back, {userProfile.fullName.split(' ')[0]}
                  </h1>
                  <p className="text-xs text-white/80 font-light">
                    {userProfile.homeHub || 'Atlanta Node #2'} · {userProfile.email}
                  </p>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="max-w-[1180px] mx-auto px-6 py-8 pb-20">

                {/* Three Stat Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  <div className="bg-white border border-[#111111]/10 rounded-[20px] p-6 shadow-[0_1px_3px_rgba(17,17,17,0.04)] hover:shadow-md transition-shadow">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A80] mb-2">Monthly support committed</p>
                    <p className="text-3xl font-bold text-[#111111]">
                      ${monthlyTotal} <span className="text-xs font-normal text-[#8A8A80]">/ mo</span>
                    </p>
                  </div>

                  <div className="bg-white border border-[#111111]/10 rounded-[20px] p-6 shadow-[0_1px_3px_rgba(17,17,17,0.04)] hover:shadow-md transition-shadow">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A80] mb-2">Participants you support</p>
                    <p className="text-3xl font-bold text-[#111111]">{supportedList.length}</p>
                  </div>

                  <div className="bg-white border border-[#111111]/10 rounded-[20px] p-6 shadow-[0_1px_3px_rgba(17,17,17,0.04)] hover:shadow-md transition-shadow">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A80] mb-2">Cohorts started</p>
                    <p className="text-3xl font-bold text-[#111111]">1</p>
                  </div>
                </div>

                {/* "People you support" Section */}
                <div className="mb-10 relative">
                  <div className="flex items-baseline justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#111111]">People you support</h2>
                    <button onClick={() => setActiveNavTab('participants')} className="text-xs font-semibold text-[#111111] hover:underline">
                      Browse more →
                    </button>
                  </div>

                  {supportedList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {supportedList.map((p) => (
                        <div key={p.email} className="bg-white border border-[#111111]/10 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(17,17,17,0.04)] flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-11 h-11 rounded-xl bg-[#111111] text-[#FEFEE8] font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {getInitials(p.fullName)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#111111] truncate">{p.fullName}</p>
                                <p className="text-[11px] text-[#8A8A80]">🎻 Orchestra</p>
                              </div>
                            </div>
                            <p className="text-xs text-[#5C5C54] mb-4">
                              ${p.email.includes('bdso') ? '60' : '25'}/mo · {p.homeHub || 'Atlanta Node'}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => startCohortFor(p.email)}
                              className="flex-1 py-2 px-3 rounded-xl border border-[#111111]/15 bg-white text-xs font-semibold text-[#111111] hover:bg-[#F5F5EE] transition-colors"
                            >
                              Start cohort
                            </button>
                            <button
                              onClick={() => toggleSupport(p.email)}
                              className="flex-1 py-2 px-3 rounded-xl border border-rose-200 bg-white text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                            >
                              Stop supporting
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-dashed border-[#111111]/20 rounded-[20px] p-8 text-center">
                      <p className="text-xs text-[#5C5C54] mb-4">You're not supporting anyone yet.</p>
                      <button
                        onClick={() => setActiveNavTab('participants')}
                        className="px-4 py-2 rounded-xl bg-[#111111] text-[#FEFEE8] text-xs font-semibold"
                      >
                        Browse participants
                      </button>
                    </div>
                  )}
                </div>

                {/* Node Connector Line Visual */}
                <div className="flex justify-center my-2">
                  <div className="w-px h-8 border-r border-dashed border-[#111111]/25" />
                </div>

                {/* "Your Subscription" Anchor Banner */}
                <div className="bg-[#111111] text-[#FEFEE8] rounded-[24px] p-7 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl border border-white/10">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#10B981]">Your subscription</span>
                    <h3 className="text-base font-semibold mt-1">BEAM Village Patron Subscription</h3>
                    <p className="text-xs text-[#C9C9BE] mt-0.5">
                      $75.00/mo · distributed across travel, housing, meals & maintenance stipends
                    </p>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-[#10B981]/20 text-[#34D399] text-xs font-semibold whitespace-nowrap">
                    ● Active
                  </span>
                </div>

                {/* "Recommended for you" Grid */}
                <div className="mb-10">
                  <h2 className="text-lg font-semibold text-[#111111] mb-4">Recommended for you</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recommendedList.map((p) => (
                      <div key={p.email} className="bg-white border border-[#111111]/10 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(17,17,17,0.04)] flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-11 h-11 rounded-xl bg-[#F0F0E8] text-[#111111] font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {getInitials(p.fullName)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#111111] truncate">{p.fullName}</p>
                              <p className="text-[11px] text-[#8A8A80]">⚡ {p.division || 'BEAM Division'}</p>
                            </div>
                          </div>
                          <p className="text-xs text-[#5C5C54] mb-4 line-clamp-2">{p.primaryRole}</p>
                        </div>

                        <button
                          onClick={() => toggleSupport(p.email)}
                          className="w-full py-2.5 rounded-xl bg-[#111111] text-[#FEFEE8] text-xs font-semibold hover:bg-[#2A2A26] transition-colors"
                        >
                          Support
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two Footer CTA Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => startCohortFor('elena.rostova@beam.org')}
                    className="text-left bg-white border border-[#111111]/10 hover:border-[#111111]/30 rounded-[20px] p-6 transition-all shadow-[0_1px_3px_rgba(17,17,17,0.04)]"
                  >
                    <p className="text-sm font-semibold text-[#111111] mb-1">Start a cohort →</p>
                    <p className="text-xs text-[#5C5C54]">Rally neighbors to pool support behind one participant.</p>
                  </button>

                  <button
                    onClick={() => setActiveNavTab('invite')}
                    className="text-left bg-white border border-[#111111]/10 hover:border-[#111111]/30 rounded-[20px] p-6 transition-all shadow-[0_1px_3px_rgba(17,17,17,0.04)]"
                  >
                    <p className="text-sm font-semibold text-[#111111] mb-1">Invite someone to participate →</p>
                    <p className="text-xs text-[#5C5C54]">Nominate someone you know for a BEAM division.</p>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 2: MEMBERS ================= */}
          {activeNavTab === 'members' && (
            <div className="max-w-[1180px] mx-auto px-6 py-10 pb-20">
              <h1 className="text-2xl font-semibold text-[#111111] mb-2 tracking-tight">Community members</h1>
              <p className="text-xs text-[#5C5C54] mb-8 max-w-lg">
                See who else in your neighborhood is backing BEAM participants. Members choose whether to share who they support.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {MEMBERS_LIST.map((m) => (
                  <div key={m.name} className="bg-white border border-[#111111]/10 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(17,17,17,0.04)]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#F0F0E8] text-[#111111] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {getInitials(m.name)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#111111]">{m.name}</p>
                        <p className="text-[11px] text-[#8A8A80]">{m.hub}</p>
                      </div>
                    </div>

                    {m.publicSupport && m.supports.length > 0 ? (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8A80] mb-2">Publicly supports</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.supports.map((name) => (
                            <span key={name} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F5F5EE] text-[#8A8A80]">
                        Support kept private
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: PARTICIPANTS ================= */}
          {activeNavTab === 'participants' && (
            <div className="max-w-[1180px] mx-auto px-6 py-10 pb-20">
              <h1 className="text-2xl font-semibold text-[#111111] mb-2 tracking-tight">Find a participant to support</h1>
              <p className="text-xs text-[#5C5C54] mb-6 max-w-lg">
                Search by name, instrument, or hub — or browse by division.
              </p>

              {/* Search input */}
              <div className="relative max-w-md mb-6">
                <Search className="w-4 h-4 text-[#8A8A80] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search participants, instruments, hubs…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#111111]/15 rounded-2xl text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Division Filter Chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setSelectedDivision('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedDivision === 'all'
                      ? 'bg-[#111111] text-[#FEFEE8] border-[#111111]'
                      : 'bg-white text-[#111111] border-[#111111]/15 hover:border-[#111111]/40'
                  }`}
                >
                  ✦ All ({participants.length})
                </button>

                {BEAM_DIVISIONS.map((div) => {
                  const count = participants.filter(p => p.division === div.id).length
                  const active = selectedDivision === div.id
                  return (
                    <button
                      key={div.id}
                      onClick={() => setSelectedDivision(div.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-[#111111] text-[#FEFEE8] border-[#111111]'
                          : 'bg-white text-[#111111] border-[#111111]/15 hover:border-[#111111]/40'
                      }`}
                    >
                      {div.icon} {div.name} <span className="opacity-60">{count}</span>
                    </button>
                  )
                })}
              </div>

              {/* Grid of Participants */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParticipants.map((p) => {
                  const isSupported = !!supportedEmails[p.email.toLowerCase()]
                  return (
                    <div key={p.email} className="bg-white border border-[#111111]/10 rounded-[22px] p-5 shadow-[0_1px_3px_rgba(17,17,17,0.04)] flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-11 h-11 rounded-xl bg-[#111111] text-[#FEFEE8] font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {getInitials(p.fullName)}
                          </div>
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F5EE] text-[#5C5C54]">
                            {p.division || 'Orchestra'}
                          </span>
                        </div>
                        <p className="text-base font-semibold text-[#111111] mb-1">{p.fullName}</p>
                        <p className="text-xs text-[#5C5C54] mb-3">{p.primaryRole}</p>
                        <p className="text-xs text-[#8A8A80] mb-1">{p.homeHub || 'Atlanta Node'}</p>
                        <p className="text-xs font-semibold text-emerald-700 mb-4">${(p.hoodVillageBalance || 0).toLocaleString()} raised</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleSupport(p.email)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-colors ${
                            isSupported
                              ? 'bg-[#111111] text-[#FEFEE8]'
                              : 'bg-white border border-[#111111] text-[#111111] hover:bg-[#F5F5EE]'
                          }`}
                        >
                          {isSupported ? 'Supporting ✓' : 'Support'}
                        </button>
                        <button
                          onClick={() => startCohortFor(p.email)}
                          className="flex-1 py-2 px-3 rounded-xl border border-[#111111]/15 bg-white text-xs font-semibold text-[#111111] hover:bg-[#F5F5EE] transition-colors"
                        >
                          Start cohort
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ================= VIEW: START COHORT ================= */}
          {activeNavTab === 'cohort' && (
            <div className="max-w-[720px] mx-auto px-6 py-10 pb-20">
              <button
                onClick={() => setActiveNavTab('dashboard')}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5C5C54] hover:text-[#111111] mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back to dashboard
              </button>

              {!cohortLaunched ? (
                <div>
                  <h1 className="text-2xl font-semibold text-[#111111] mb-1">
                    Start a cohort for {cohortTargetParticipant.fullName}
                  </h1>
                  <p className="text-xs text-[#5C5C54] mb-6">
                    Pool recurring support from your neighbors behind one participant.
                  </p>

                  <div className="bg-white border border-[#111111]/10 rounded-2xl p-4 flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#FEFEE8] font-bold text-xs flex items-center justify-center">
                      {getInitials(cohortTargetParticipant.fullName)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#111111]">{cohortTargetParticipant.fullName}</p>
                      <p className="text-[11px] text-[#8A8A80]">{cohortTargetParticipant.primaryRole} · {cohortTargetParticipant.homeHub}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">Cohort name</label>
                      <input
                        type="text"
                        placeholder="e.g. Neighbors for Elena"
                        value={cohortName}
                        onChange={(e) => setCohortName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">Monthly target ($)</label>
                      <input
                        type="number"
                        placeholder="150"
                        value={cohortTarget}
                        onChange={(e) => setCohortTarget(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">Message to invitees</label>
                      <textarea
                        rows={3}
                        placeholder="Tell your neighbors why you're rallying support…"
                        value={cohortMessage}
                        onChange={(e) => setCohortMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-[#111111] mb-3">Invite neighbors</p>
                  <div className="space-y-2 mb-8">
                    {MEMBERS_LIST.map((m) => {
                      const isInvited = !!invitedMembers[m.name]
                      return (
                        <button
                          key={m.name}
                          onClick={() => toggleCohortInvite(m.name)}
                          className={`w-full p-3 rounded-xl border flex items-center justify-between transition-colors ${
                            isInvited
                              ? 'bg-[#F5F5EE] border-[#111111] text-[#111111]'
                              : 'bg-white border-[#111111]/15 text-[#5C5C54] hover:border-[#111111]/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#F0F0E8] text-[#111111] font-bold text-[10px] flex items-center justify-center">
                              {getInitials(m.name)}
                            </div>
                            <span className="text-xs font-medium">{m.name}</span>
                          </div>
                          <span className="text-xs font-semibold">{isInvited ? 'Invited ✓' : 'Invite'}</span>
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCohortLaunched(true)}
                    className="w-full py-3.5 rounded-xl bg-[#111111] text-[#FEFEE8] text-xs font-semibold hover:bg-[#2A2A26] transition-colors"
                  >
                    Launch cohort
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-[#111111]/10 rounded-[22px] p-10 text-center">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#111111] mb-2">Cohort launched</h2>
                  <p className="text-xs text-[#5C5C54] mb-6">
                    "{cohortName || 'Neighbors Cohort'}" is live for {cohortTargetParticipant.fullName}.
                  </p>
                  <button
                    onClick={() => setActiveNavTab('dashboard')}
                    className="px-6 py-2.5 rounded-xl bg-[#111111] text-[#FEFEE8] text-xs font-semibold"
                  >
                    Back to dashboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW: INVITE ================= */}
          {activeNavTab === 'invite' && (
            <div className="max-w-[640px] mx-auto px-6 py-10 pb-20">
              <button
                onClick={() => setActiveNavTab('dashboard')}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5C5C54] hover:text-[#111111] mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back to dashboard
              </button>

              {!inviteSubmitted ? (
                <div>
                  <h1 className="text-2xl font-semibold text-[#111111] mb-1">Invite someone to participate</h1>
                  <p className="text-xs text-[#5C5C54] mb-6">
                    Nominate someone you know for a BEAM division. Our team follows up to onboard them.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">Their name</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">Their email</label>
                      <input
                        type="email"
                        placeholder="name@email.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">Which division fits them?</label>
                      <div className="flex flex-wrap gap-2">
                        {BEAM_DIVISIONS.map((div) => {
                          const active = inviteDivision === div.id
                          return (
                            <button
                              key={div.id}
                              onClick={() => setInviteDivision(div.id)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                active
                                  ? 'bg-[#111111] text-[#FEFEE8] border-[#111111]'
                                  : 'bg-white text-[#111111] border-[#111111]/15 hover:border-[#111111]/40'
                              }`}
                            >
                              {div.icon} {div.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">Home hub / neighborhood</label>
                      <input
                        type="text"
                        placeholder="e.g. Atlanta Node #2"
                        value={inviteHub}
                        onChange={(e) => setInviteHub(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">Why are you nominating them?</label>
                      <textarea
                        rows={3}
                        placeholder="A short note helps our team reach out well…"
                        value={inviteNote}
                        onChange={(e) => setInviteNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setInviteSubmitted(true)}
                    className="w-full py-3.5 rounded-xl bg-[#111111] text-[#FEFEE8] text-xs font-semibold hover:bg-[#2A2A26] transition-colors"
                  >
                    Send invitation
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-[#111111]/10 rounded-[22px] p-10 text-center">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#111111] mb-2">Invitation sent</h2>
                  <p className="text-xs text-[#5C5C54] mb-6">
                    We'll reach out to {inviteName || 'your nominee'} about joining the division.
                  </p>
                  <button
                    onClick={() => setActiveNavTab('dashboard')}
                    className="px-6 py-2.5 rounded-xl bg-[#111111] text-[#FEFEE8] text-xs font-semibold"
                  >
                    Back to dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      )}
    </div>
  )
}
