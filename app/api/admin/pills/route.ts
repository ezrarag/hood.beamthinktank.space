import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export interface HomepagePill {
  id: string
  label: string
  icon?: string
  category: string
  linkUrl?: string
  badgeText?: string
  active: boolean
}

const DEFAULT_PILLS: HomepagePill[] = [
  { id: '1', label: 'Steinway Recording Stipends', icon: '🎻', category: 'Orchestra', linkUrl: '/community?division=orchestra', badgeText: 'Orchestra', active: true },
  { id: '2', label: 'Civic Tech & Open Source Incubators', icon: '⚡', category: 'Forge', linkUrl: '/community?division=forge', badgeText: 'Forge', active: true },
  { id: '3', label: 'Pro Bono Legal Advocacy & Defense', icon: '⚖️', category: 'Law', linkUrl: '/community?division=law', badgeText: 'Law', active: true },
  { id: '4', label: 'Community Gardens & Urban Agriculture', icon: '🌱', category: 'Grounds', linkUrl: '/community?division=grounds', badgeText: 'Grounds', active: true },
  { id: '5', label: 'Dance & Choreography Residencies', icon: '💃', category: 'Dance', linkUrl: '/community?division=dance', badgeText: 'Dance', active: true },
  { id: '6', label: 'Youth Mentorship & Music Academies', icon: '🎓', category: 'Education', linkUrl: '/community?division=education', badgeText: 'Education', active: true },
]

export async function GET() {
  try {
    if (adminDb) {
      const docRef = adminDb.collection('siteConfig').doc('pills')
      const snap = await docRef.get()
      if (snap.exists && snap.data()?.pills) {
        return NextResponse.json({ pills: snap.data()?.pills })
      }
    }
  } catch (err) {
    console.warn('Failed fetching pills from Firestore:', err)
  }

  return NextResponse.json({ pills: DEFAULT_PILLS })
}

export async function POST(request: NextRequest) {
  try {
    const { pills } = await request.json()

    if (!Array.isArray(pills)) {
      return NextResponse.json({ error: 'Invalid pills data format' }, { status: 400 })
    }

    if (adminDb) {
      const docRef = adminDb.collection('siteConfig').doc('pills')
      await docRef.set({
        pills,
        updatedAt: new Date().toISOString(),
      }, { merge: true })
    }

    return NextResponse.json({ success: true, pills })
  } catch (error: any) {
    console.error('Error saving pills:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update homepage pills' }, { status: 500 })
  }
}
