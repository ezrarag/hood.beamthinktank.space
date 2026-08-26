import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature || !webhookSecret) {
      // In dev mode without webhook secret set, log signature warning
      console.warn('Stripe webhook received without webhookSecret or signature.')
      return NextResponse.json({ received: true, note: 'Skipping signature verification in dev mode' })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Invalid signature: ${err.message}` },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {}
  const participantEmail = metadata.participantEmail
  const amountTotalCents = session.amount_total || 0
  const amountUSD = amountTotalCents / 100

  if (participantEmail && amountUSD > 0) {
    await incrementParticipantBalance(participantEmail, amountUSD)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const lines = invoice.lines?.data || []
  for (const line of lines) {
    const metadata = line.metadata || {}
    const participantEmail = metadata.participantEmail
    const amountUSD = (line.amount || 0) / 100

    if (participantEmail && amountUSD > 0) {
      await incrementParticipantBalance(participantEmail, amountUSD)
    }
  }
}

async function incrementParticipantBalance(email: string, amountUSD: number) {
  if (!adminDb) {
    console.warn(`Admin SDK not initialized. Could not update hoodVillageBalance for ${email}`)
    return
  }

  const normalizedEmail = email.toLowerCase().trim()
  try {
    const docRef = adminDb.collection('participantProfiles').doc(normalizedEmail)
    await docRef.set({
      email: normalizedEmail,
      hoodVillageBalance: FieldValue.increment(amountUSD),
      updatedAt: new Date().toISOString(),
    }, { merge: true })

    console.log(`Successfully incremented hoodVillageBalance by $${amountUSD} for participant: ${normalizedEmail}`)
  } catch (error) {
    console.error(`Failed updating hoodVillageBalance for ${normalizedEmail}:`, error)
  }
}
