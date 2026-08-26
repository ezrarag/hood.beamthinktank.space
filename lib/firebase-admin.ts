import { initializeApp, getApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import fs from 'fs'
import path from 'path'

let app: App | null = null
let adminDb: ReturnType<typeof getFirestore> | null = null
let adminStorage: ReturnType<typeof getStorage> | null = null
const ADMIN_APP_NAME = 'hood-beam-admin-sdk'

function getAdminProjectId() {
  return (
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'beam-hood'
  )
}

function getAdminClientEmail() {
  return process.env.FIREBASE_ADMIN_CLIENT_EMAIL || ''
}

function getNormalizedPrivateKey() {
  return (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n')
}

function initializeAdminSDK() {
  if (app) return app

  try {
    const existing = getApps().find((a) => a.name === ADMIN_APP_NAME)
    if (existing) {
      app = getApp(ADMIN_APP_NAME)
    } else {
      // 1. Try local service-account.json if present
      const serviceAccountPath = path.join(process.cwd(), 'service-account.json')
      if (fs.existsSync(serviceAccountPath)) {
        try {
          const raw = fs.readFileSync(serviceAccountPath, 'utf8')
          const parsed = JSON.parse(raw)
          if (parsed.private_key && parsed.client_email) {
            app = initializeApp({
              credential: cert({
                projectId: parsed.project_id || getAdminProjectId(),
                privateKey: parsed.private_key,
                clientEmail: parsed.client_email,
              }),
            }, ADMIN_APP_NAME)
            console.info(`Hood Firebase Admin SDK initialized via local service-account.json`)
          }
        } catch (err) {
          console.warn('Failed reading local service-account.json:', err)
        }
      }

      // 2. Try env credentials if not initialized yet
      if (!app) {
        const privateKey = getNormalizedPrivateKey()
        const clientEmail = getAdminClientEmail()
        const isPlaceholder = privateKey.includes('your_private_key_here') || clientEmail.includes('your_admin_service_account_email')

        if (privateKey && clientEmail && !isPlaceholder) {
          try {
            app = initializeApp({
              credential: cert({
                projectId: getAdminProjectId(),
                privateKey,
                clientEmail,
              }),
            }, ADMIN_APP_NAME)
            console.info(`Hood Firebase Admin SDK initialized via env variables`)
          } catch (certErr) {
            console.warn('Firebase Admin cert initialization skipped due to invalid private key in env.')
          }
        }
      }
    }

    if (app) {
      adminDb = getFirestore(app)
      try {
        adminStorage = getStorage(app)
      } catch (e) {
        console.warn('Firebase Admin Storage init skipped:', e)
      }
    }
  } catch (error) {
    console.error('Failed to initialize Hood Firebase Admin SDK:', error)
  }

  return app
}

initializeAdminSDK()

export { adminDb, adminStorage }
