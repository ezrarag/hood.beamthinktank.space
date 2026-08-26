import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

const DEFAULT_BACKGROUND_URL = 'https://firebasestorage.googleapis.com/v0/b/beam-orchestra-platform.firebasestorage.app/o/pexels-afroromanzo-4028878.jpg?alt=media&token=b95bbe32-cc29-4ff7-815a-3dd558efa561'

export async function GET() {
  try {
    if (adminDb) {
      const docRef = adminDb.collection('siteConfig').doc('homepage')
      const snap = await docRef.get()
      if (snap.exists) {
        return NextResponse.json(snap.data())
      }
    }
  } catch (error) {
    console.warn('Failed to fetch siteConfig from Firestore:', error)
  }

  return NextResponse.json({
    backgroundUrl: DEFAULT_BACKGROUND_URL,
    updatedAt: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { backgroundUrl, imageTitle } = await request.json()

    if (!backgroundUrl) {
      return NextResponse.json({ error: 'Missing backgroundUrl' }, { status: 400 })
    }

    if (adminDb) {
      const docRef = adminDb.collection('siteConfig').doc('homepage')
      await docRef.set({
        backgroundUrl,
        imageTitle: imageTitle || 'Landing Page Background',
        updatedAt: new Date().toISOString(),
      }, { merge: true })
    }

    return NextResponse.json({
      success: true,
      backgroundUrl,
      updatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error updating siteConfig:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update site media config' }, { status: 500 })
  }
}
