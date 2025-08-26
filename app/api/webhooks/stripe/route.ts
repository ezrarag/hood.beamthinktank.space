import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Extract metadata
      const { categoryId, categoryName, amount } = session.metadata!
      
      // Here you would update your database (Supabase) with the donation
      // For now, we'll log the successful payment
      console.log('Payment successful:', {
        categoryId,
        categoryName,
        amount: parseFloat(amount),
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
      })

      // TODO: Update Supabase database with donation progress
      // await updateDonationProgress(categoryId, parseFloat(amount))
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
