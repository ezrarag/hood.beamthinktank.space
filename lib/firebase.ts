import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'beam-hood.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'beam-hood',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'beam-hood.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined')

let app: any = null
let db: any = null
let auth: any = null

try {
  if (isFirebaseConfigured || getApps().length > 0) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  }
} catch (error) {
  console.error('Firebase client initialization error:', error)
}

export interface HoodFundAllocation {
  travelPercent: number
  housingPercent: number
  mealsPercent: number
  maintenancePercent: number
}

export interface ParticipantProfile {
  fullName: string
  email: string
  primaryRole: string
  division?: 'orchestra' | 'forge' | 'law' | 'grounds' | 'dance' | 'education' | 'transportation' | 'business'
  // Which BEAM_DIVISIONS (see lib/divisions.ts) this participant is actively part of —
  // drives the "Reach across BEAM" badges on the public participant page.
  activeDivisions?: string[]
  entityType?: 'individual' | 'cohort'
  cohortName?: string
  skillsOrTags?: string[]
  originProject?: string
  primaryInstrument?: string
  homeHub?: string
  usdTotalEarned?: number
  hoodVillageBalance: number
  hoodAllocations?: HoodFundAllocation
  headshotUrl?: string
  bio?: string
  portfolioMedia?: Array<{
    id: string
    title: string
    url: string
    category: string
    composer?: string
  }>
}

export { app, db, auth }
