import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { items, customAmount, category, city, donorInfo } = await request.json()

    if ((!items || items.length === 0) && !customAmount) {
      return NextResponse.json({ error: 'No items or custom amount provided' }, { status: 400 })
    }

    // Create line items for Stripe
    const lineItems: any[] = []

    // Add selected equipment items
    if (items && items.length > 0) {
      items.forEach((item: any) => {
        if (item.amount && item.amount > 0) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name || 'Donation Item',
                description: `Donation to ${item.name} in ${category} category for ${city}`,
              },
              unit_amount: Math.round(item.amount * 100), // Convert to cents
            },
            quantity: 1,
          })
        }
      })
    }

    // Add custom amount if provided
    if (customAmount && customAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Custom Donation Amount',
            description: `Custom donation to ${category} category in ${city}`,
          },
          unit_amount: Math.round(customAmount * 100), // Convert to cents
        },
        quantity: 1,
      })
    }

    // If no line items were created, return error
    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'No valid donation amounts provided' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-cancelled`,
      metadata: {
        category,
        city,
        donorName: donorInfo?.name || '',
        donorEmail: donorInfo?.email || '',
        donorPhone: donorInfo?.phone || '',
        items: JSON.stringify(items || []),
        customAmount: customAmount?.toString() || '0',
      },
    })

    return NextResponse.json({ id: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
