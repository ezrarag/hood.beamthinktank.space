'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Image as ImageIcon, 
  Users, 
  Heart, 
  Layers, 
  Upload, 
  CheckCircle2, 
  Edit3, 
  Plus, 
  ExternalLink, 
  ShieldAlert, 
  Save, 
  RefreshCw,
  Search,
  Sparkles,
  ArrowRight,
  Tag,
  Trash2
} from 'lucide-react'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
import { db, ParticipantProfile } from '@/lib/firebase'
import { CROSS_DIVISION_ROSTER } from '@/lib/divisions'

const PRESET_IMAGES = [
  {
    title: 'BEAM Orchestra Performance',
    url: 'https://firebasestorage.googleapis.com/v0/b/beam-orchestra-platform.firebasestorage.app/o/pexels-afroromanzo-4028878.jpg?alt=media&token=b95bbe32-cc29-4ff7-815a-3dd558efa561',
  },
  {
    title: 'Community Village Sound Lab',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Steinway Studio Recital',
    url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1600&q=80',
  }
]

export default function HoodAdminPortal() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'media' | 'community' | 'pills' | 'interop'>('media')

  // Media Tab State
  const [currentBgUrl, setCurrentBgUrl] = useState<string>('')
  const [customBgInput, setCustomBgInput] = useState<string>('')
  const [isUpdatingMedia, setIsUpdatingMedia] = useState<boolean>(false)
  const [mediaSuccessMsg, setMediaSuccessMsg] = useState<string>('')

  // Pills Tab State
  const [pillsList, setPillsList] = useState<any[]>([])
  const [newPillLabel, setNewPillLabel] = useState<string>('')
  const [newPillIcon, setNewPillIcon] = useState<string>('✨')
  const [newPillCategory, setNewPillCategory] = useState<string>('Orchestra')
  const [newPillLink, setNewPillLink] = useState<string>('/community')
  const [isSavingPills, setIsSavingPills] = useState<boolean>(false)
  const [pillsSuccessMsg, setPillsSuccessMsg] = useState<string>('')

  // Community Tab State
  const [participants, setParticipants] = useState<ParticipantProfile[]>([])
  const [isLoadingParticipants, setIsLoadingParticipants] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantProfile | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [saveStatus, setSaveStatus] = useState<string>('')

  // Edit Participant Form State
  const [editForm, setEditForm] = useState<ParticipantProfile>({
    fullName: '',
    email: '',
    primaryRole: '',
    primaryInstrument: '',
    homeHub: '',
    bio: '',
    hoodVillageBalance: 0,
    hoodAllocations: {
      travelPercent: 40,
      housingPercent: 35,
      mealsPercent: 15,
      maintenancePercent: 10,
    }
  })

  // Load Active Site Config & Roster on Mount
  useEffect(() => {
    fetchMediaConfig()
    fetchPillsConfig()
    fetchCommunityRoster()
  }, [])

  const fetchMediaConfig = async () => {
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        if (data.backgroundUrl) {
          setCurrentBgUrl(data.backgroundUrl)
          setCustomBgInput(data.backgroundUrl)
        }
      }
    } catch (err) {
      console.error('Failed loading site media config:', err)
    }
  }

  const fetchPillsConfig = async () => {
    try {
      const res = await fetch('/api/admin/pills')
      if (res.ok) {
        const data = await res.json()
        if (data.pills) {
          setPillsList(data.pills)
        }
      }
    } catch (err) {
      console.error('Failed loading pills config:', err)
    }
  }

  const fetchCommunityRoster = async () => {
    setIsLoadingParticipants(true)
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'participantProfiles'))
        if (!snap.empty) {
          const list = snap.docs.map(doc => doc.data() as ParticipantProfile)
          setParticipants(list)
          setIsLoadingParticipants(false)
          return
        }
      }
    } catch (err) {
      console.warn('Firestore fetch warning, using fallback participants:', err)
    }

    // Default Fallback Roster
    setParticipants(CROSS_DIVISION_ROSTER)
    setIsLoadingParticipants(false)
  }

  const handleUpdateBackground = async (newUrl: string) => {
    setIsUpdatingMedia(true)
    setMediaSuccessMsg('')

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backgroundUrl: newUrl }),
      })

      if (res.ok) {
        setCurrentBgUrl(newUrl)
        setCustomBgInput(newUrl)
        setMediaSuccessMsg('Homepage background successfully updated!')
      }
    } catch (err) {
      console.error('Failed updating background URL:', err)
    } finally {
      setIsUpdatingMedia(false)
    }
  }

  const handleSavePills = async (updatedPills: any[]) => {
    setIsSavingPills(true)
    setPillsSuccessMsg('')

    try {
      const res = await fetch('/api/admin/pills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pills: updatedPills }),
      })

      if (res.ok) {
        setPillsList(updatedPills)
        setPillsSuccessMsg('Homepage pills successfully saved!')
      }
    } catch (err) {
      console.error('Failed saving pills:', err)
    } finally {
      setIsSavingPills(false)
    }
  }

  const handleAddPill = () => {
    if (!newPillLabel.trim()) return
    const newPill = {
      id: Date.now().toString(),
      label: newPillLabel.trim(),
      icon: newPillIcon.trim() || '✨',
      category: newPillCategory,
      linkUrl: newPillLink.trim() || '/community',
      active: true
    }
    const updated = [...pillsList, newPill]
    handleSavePills(updated)
    setNewPillLabel('')
  }

  const handleTogglePill = (id: string) => {
    const updated = pillsList.map(p => p.id === id ? { ...p, active: !p.active } : p)
    handleSavePills(updated)
  }

  const handleDeletePill = (id: string) => {
    const updated = pillsList.filter(p => p.id !== id)
    handleSavePills(updated)
  }

  const handleOpenEditModal = (participant?: ParticipantProfile) => {
    if (participant) {
      setSelectedParticipant(participant)
      setEditForm({
        ...participant,
        hoodAllocations: participant.hoodAllocations || {
          travelPercent: 40,
          housingPercent: 35,
          mealsPercent: 15,
          maintenancePercent: 10,
        }
      })
    } else {
      setSelectedParticipant(null)
      setEditForm({
        fullName: '',
        email: '',
        primaryRole: 'BEAM Participant',
        primaryInstrument: 'Strings',
        homeHub: 'Atlanta Node #1',
        bio: '',
        hoodVillageBalance: 500,
        hoodAllocations: { travelPercent: 40, housingPercent: 35, mealsPercent: 15, maintenancePercent: 10 }
      })
    }
    setIsEditModalOpen(true)
  }

  const handleSaveParticipant = async () => {
    if (!editForm.email) return
    setSaveStatus('Saving...')

    try {
      if (db) {
        const normalizedEmail = editForm.email.toLowerCase().trim()
        await setDoc(doc(db, 'participantProfiles', normalizedEmail), editForm, { merge: true })
      }

      setParticipants(prev => {
        const exists = prev.some(p => p.email.toLowerCase() === editForm.email.toLowerCase())
        if (exists) {
          return prev.map(p => p.email.toLowerCase() === editForm.email.toLowerCase() ? editForm : p)
        } else {
          return [...prev, editForm]
        }
      })

      setSaveStatus('Saved!')
      setTimeout(() => {
        setIsEditModalOpen(false)
        setSaveStatus('')
      }, 800)
    } catch (err) {
      console.error('Error saving participant profile:', err)
      setSaveStatus('Error saving profile')
    }
  }

  const filteredParticipants = participants.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.primaryRole && p.primaryRole.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Admin Console
              </span>
              <span className="text-xs text-slate-400 font-mono">beam-hood</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Hood Administration Portal</h1>
          </div>

          <button
            onClick={() => router.push('/community')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <span>View Public Community Directory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex border-b border-slate-800 space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('media')}
            className={`pb-4 text-sm font-bold flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Frontend Media</span>
          </button>

          <button
            onClick={() => setActiveTab('pills')}
            className={`pb-4 text-sm font-bold flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'pills'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Homepage Pills & Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`pb-4 text-sm font-bold flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'community'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community & Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('interop')}
            className={`pb-4 text-sm font-bold flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'interop'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Cross-Site Interoperability</span>
          </button>
        </div>

        {/* TAB 1: MEDIA & HERO VISUALS */}
        {activeTab === 'media' && (
          <div className="pt-8 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-2">Homepage Background Image</h2>
              <p className="text-xs text-slate-400 mb-6">
                Update the active background image displayed on the landing page of <code className="text-emerald-400">hood.beamthinktank.space</code>.
              </p>

              {/* Live Preview */}
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 mb-6 bg-slate-950 flex items-center justify-center">
                {currentBgUrl ? (
                  <img src={currentBgUrl} alt="Active Background Preview" className="w-full h-full object-cover" />
                ) : (
                  <p className="text-xs text-slate-500">No active background URL configured</p>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 border border-emerald-800 text-emerald-400 px-2.5 py-0.5 rounded-full">
                      Currently Active
                    </span>
                    <p className="text-xs text-slate-300 font-mono mt-1 truncate max-w-xl">{currentBgUrl}</p>
                  </div>
                </div>
              </div>

              {/* URL Customizer */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-300">Set Custom Image URL or Firebase Storage Download Link</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    placeholder="https://firebasestorage.googleapis.com/v0/b/beam-hood.firebasestorage.app/o/..."
                    value={customBgInput}
                    onChange={(e) => setCustomBgInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    onClick={() => handleUpdateBackground(customBgInput)}
                    disabled={isUpdatingMedia}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isUpdatingMedia ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Apply New Background</span>
                      </>
                    )}
                  </button>
                </div>

                {mediaSuccessMsg && (
                  <p className="text-xs text-emerald-400 font-medium flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> {mediaSuccessMsg}
                  </p>
                )}
              </div>
            </div>

            {/* Presets Gallery */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4">Quick Preset Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {PRESET_IMAGES.map((preset, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group">
                    <div className="h-40 overflow-hidden relative">
                      <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-white mb-3">{preset.title}</h4>
                      <button
                        onClick={() => handleUpdateBackground(preset.url)}
                        className="w-full py-2 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>Select as Active</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: HOMEPAGE PILLS MANAGER */}
        {activeTab === 'pills' && (
          <div className="pt-8 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Homepage Pills & Categories Manager</h2>
                  <p className="text-xs text-slate-400">Add, edit, or toggle interactive category pills rendered on the landing page.</p>
                </div>
                {pillsSuccessMsg && (
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {pillsSuccessMsg}
                  </span>
                )}
              </div>

              {/* Add New Pill Input */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-8 space-y-4">
                <h4 className="text-xs font-bold text-slate-300">Add New Category Pill</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Pill Label (e.g. Steinway Stipends)"
                    value={newPillLabel}
                    onChange={(e) => setNewPillLabel(e.target.value)}
                    className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Icon Emoji (e.g. 🎻)"
                    value={newPillIcon}
                    onChange={(e) => setNewPillIcon(e.target.value)}
                    className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Link URL (e.g. /community?division=orchestra)"
                    value={newPillLink}
                    onChange={(e) => setNewPillLink(e.target.value)}
                    className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    onClick={handleAddPill}
                    disabled={isSavingPills}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add & Save Pill</span>
                  </button>
                </div>
              </div>

              {/* Active Pills List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Homepage Pills ({pillsList.length})</h4>
                {pillsList.map((pill) => (
                  <div key={pill.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{pill.icon}</span>
                      <div>
                        <h5 className="text-xs font-bold text-white">{pill.label}</h5>
                        <p className="text-[10px] text-slate-500 font-mono">{pill.linkUrl}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleTogglePill(pill.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                          pill.active !== false
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {pill.active !== false ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleDeletePill(pill.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMMUNITY & PARTICIPANT ROSTER */}
        {activeTab === 'community' && (
          <div className="pt-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search roster by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => handleOpenEditModal()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Participant Profile</span>
              </button>
            </div>

            {/* Roster Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Registered Participants ({filteredParticipants.length})</h3>
                <button 
                  onClick={fetchCommunityRoster}
                  className="text-xs text-slate-400 hover:text-white flex items-center"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
                </button>
              </div>

              {isLoadingParticipants ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading participant roster...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/60 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-6">Participant</th>
                        <th className="py-3.5 px-6">Role & Instrument</th>
                        <th className="py-3.5 px-6">Home Hub</th>
                        <th className="py-3.5 px-6">Village Balance</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredParticipants.map((p) => (
                        <tr key={p.email} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-white">{p.fullName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{p.email}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div>{p.primaryRole}</div>
                            <div className="text-emerald-400 text-[11px]">{p.primaryInstrument}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-slate-800 px-2.5 py-1 rounded-full text-[11px]">
                              {p.homeHub || 'Unassigned'}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-emerald-400">
                            ${(p.hoodVillageBalance || 0).toLocaleString()} USD
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg transition-colors font-medium text-[11px] inline-flex items-center space-x-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CROSS-SITE INTEROPERABILITY */}
        {activeTab === 'interop' && (
          <div className="pt-8 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-2">Subdomain Interoperability Status</h2>
              <p className="text-xs text-slate-400 mb-6">
                Connected to shared backend specs with <code className="text-emerald-400">orchestra.beamthinktank.space</code>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Shared Firestore Schema</h3>
                      <p className="text-xs text-slate-400">Collection: participantProfiles</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Updates to participant balances or allocations on Hood sync to the underlying musician demographic profile.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-950 text-blue-400 rounded-xl">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Privacy Policy Endpoint</h3>
                      <p className="text-xs text-slate-400">Google OAuth Consent Compliance</p>
                    </div>
                  </div>
                  <a
                    href="https://orchestra.beamthinktank.space/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center mt-2"
                  >
                    https://orchestra.beamthinktank.space/privacy <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Participant Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedParticipant ? `Edit ${selectedParticipant.fullName}` : 'Add New Participant'}
                  </h3>
                  <p className="text-xs text-slate-400">Update demographic profile and fund allocation percentages</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled={!!selectedParticipant}
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Primary Role</label>
                    <input
                      type="text"
                      value={editForm.primaryRole}
                      onChange={(e) => setEditForm({ ...editForm, primaryRole: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Primary Instrument</label>
                    <input
                      type="text"
                      value={editForm.primaryInstrument || ''}
                      onChange={(e) => setEditForm({ ...editForm, primaryInstrument: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Home Hub</label>
                  <input
                    type="text"
                    value={editForm.homeHub || ''}
                    onChange={(e) => setEditForm({ ...editForm, homeHub: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Village Balance ($ USD)</label>
                  <input
                    type="number"
                    value={editForm.hoodVillageBalance}
                    onChange={(e) => setEditForm({ ...editForm, hoodVillageBalance: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Fund Allocation Percentages */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-slate-300">Fund Allocation Percentages (%)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-blue-400">Travel %</label>
                      <input
                        type="number"
                        value={editForm.hoodAllocations?.travelPercent ?? 40}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          hoodAllocations: { ...editForm.hoodAllocations!, travelPercent: Number(e.target.value) }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-400">Housing %</label>
                      <input
                        type="number"
                        value={editForm.hoodAllocations?.housingPercent ?? 35}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          hoodAllocations: { ...editForm.hoodAllocations!, housingPercent: Number(e.target.value) }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-amber-400">Meals %</label>
                      <input
                        type="number"
                        value={editForm.hoodAllocations?.mealsPercent ?? 15}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          hoodAllocations: { ...editForm.hoodAllocations!, mealsPercent: Number(e.target.value) }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-emerald-400">Maintenance %</label>
                      <input
                        type="number"
                        value={editForm.hoodAllocations?.maintenancePercent ?? 10}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          hoodAllocations: { ...editForm.hoodAllocations!, maintenancePercent: Number(e.target.value) }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveParticipant}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    {saveStatus || 'Save Participant'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
