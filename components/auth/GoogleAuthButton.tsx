'use client'

import { useState, useEffect } from 'react'
import { auth, db, ParticipantProfile } from '@/lib/firebase'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { LogIn, LogOut, User as UserIcon, CheckCircle2 } from 'lucide-react'

interface GoogleAuthButtonProps {
  onUserChanged?: (profile: ParticipantProfile | null) => void
}

export default function GoogleAuthButton({ onUserChanged }: GoogleAuthButtonProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ParticipantProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!auth) {
      setIsLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser && currentUser.email) {
        await syncUserProfile(currentUser)
      } else {
        setProfile(null)
        if (onUserChanged) onUserChanged(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const syncUserProfile = async (firebaseUser: User) => {
    const email = firebaseUser.email?.toLowerCase().trim() || ''
    if (!email || !db) return

    try {
      const docRef = doc(db, 'participantProfiles', email)
      const snap = await getDoc(docRef)

      let userProfile: ParticipantProfile

      if (snap.exists()) {
        userProfile = snap.data() as ParticipantProfile
      } else {
        // Create initial profile if it doesn't exist
        const isEzra = email === 'ezra.haugabrooks@gmail.com'
        userProfile = {
          fullName: firebaseUser.displayName || (isEzra ? 'Ezra Haugabrooks' : email.split('@')[0]),
          email,
          primaryRole: isEzra ? 'BEAM Ecosystem Steward & Senior Fellow' : 'BEAM Community Member',
          division: isEzra ? 'orchestra' : 'forge',
          entityType: 'individual',
          primaryInstrument: isEzra ? 'Violin / Full-Stack Systems' : 'Community Supporter',
          homeHub: 'Atlanta Community Node',
          headshotUrl: firebaseUser.photoURL || undefined,
          hoodVillageBalance: isEzra ? 3850 : 0,
          hoodAllocations: { travelPercent: 40, housingPercent: 35, mealsPercent: 15, maintenancePercent: 10 }
        }

        await setDoc(docRef, userProfile, { merge: true })
      }

      setProfile(userProfile)
      if (onUserChanged) onUserChanged(userProfile)
    } catch (err) {
      console.warn('Profile sync error:', err)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) {
      alert('Firebase Auth is initializing or credentials are missing in .env.local')
      return
    }

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      console.error('Google Sign-In error:', err)
    }
  }

  const handleSignOut = async () => {
    if (!auth) return
    try {
      await signOut(auth)
      setUser(null)
      setProfile(null)
      if (onUserChanged) onUserChanged(null)
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  if (isLoading) {
    return <div className="text-xs text-slate-500 animate-pulse">Checking Auth...</div>
  }

  if (user && profile) {
    return (
      <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2">
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-slate-950 font-bold overflow-hidden">
          {profile.headshotUrl ? (
            <img src={profile.headshotUrl} alt={profile.fullName} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-4 h-4 text-white" />
          )}
        </div>

        <div className="text-left">
          <div className="text-xs font-bold text-white flex items-center">
            {profile.fullName} <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-1" />
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{profile.email}</div>
        </div>

        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors ml-2"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
    >
      <LogIn className="w-4 h-4" />
      <span>Sign In with Google</span>
    </button>
  )
}
