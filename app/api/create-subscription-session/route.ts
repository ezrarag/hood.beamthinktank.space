import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { city, successUrl, cancelUrl } = await request.json()

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID, // You'll need to create this price in Stripe
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        city: city,
        type: 'subscription',
      },
      customer_email: 'customer@example.com', // You can get this from user session
      subscription_data: {
        metadata: {
          city: city,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating subscription session:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription session' },
      { status: 500 }
    )
  }
}
