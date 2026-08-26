import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { 
      items, 
      customAmount, 
      category, 
      city, 
      donorInfo,
      participantEmail,
      participantName,
      backingType // 'one_time' | 'monthly'
    } = await request.json()

    const finalAmount = Number(customAmount) || 0
    if ((!items || items.length === 0) && finalAmount <= 0) {
      return NextResponse.json({ error: 'No items or valid amount provided' }, { status: 400 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    // Direct Participant Village Backing
    if (participantEmail && finalAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Patron Backing for ${participantName || participantEmail}`,
            description: `Village fund backing to support travel, lodging, meals, and instrument care for ${participantName || participantEmail}`,
          },
          unit_amount: Math.round(finalAmount * 100),
        },
        quantity: 1,
      })
    }

    // Selected Equipment / Items
    if (items && items.length > 0) {
      items.forEach((item: { name?: string; amount?: number }) => {
        if (item.amount && item.amount > 0) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name || 'Donation Item',
                description: `Donation to ${item.name} in ${category || 'general'} category${city ? ` for ${city}` : ''}`,
              },
              unit_amount: Math.round(item.amount * 100),
            },
            quantity: 1,
          })
        }
      })
    }

    // General Custom Donation
    if (!participantEmail && customAmount && Number(customAmount) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Custom Village Contribution',
            description: `Community donation to ${category || 'Village Fund'}${city ? ` in ${city}` : ''}`,
          },
          unit_amount: Math.round(Number(customAmount) * 100),
        },
        quantity: 1,
      })
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'No valid donation line items generated' }, { status: 400 })
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: backingType === 'monthly' ? 'subscription' : 'payment',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&participant=${encodeURIComponent(participantEmail || '')}`,
      cancel_url: `${origin}/payment-cancelled`,
      metadata: {
        category: category || 'village_fund',
        city: city || '',
        participantEmail: participantEmail ? participantEmail.toLowerCase() : '',
        participantName: participantName || '',
        donorName: donorInfo?.name || '',
        donorEmail: donorInfo?.email || '',
        customAmount: finalAmount.toString(),
      },
    })

    return NextResponse.json({ id: session.id })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
