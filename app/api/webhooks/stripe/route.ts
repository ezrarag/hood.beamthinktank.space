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
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
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

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    // Update user subscription status in Supabase
    // This would typically involve:
    // 1. Getting the customer email from the subscription
    // 2. Updating the user's subscription_status in your users table
    // 3. Setting subscription_start_date and other relevant fields
    
    console.log('Subscription created:', subscription.id)
    
    // Example Supabase update (you'll need to implement this):
    // await supabase
    //   .from('users')
    //   .update({
    //     subscription_status: 'active',
    //     subscription_id: subscription.id,
    //     subscription_start_date: new Date().toISOString(),
    //     subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
    //   })
    //   .eq('email', customer.email)
    
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription updated:', subscription.id)
    
    // Update subscription status based on current status
    const status = subscription.status
    const endDate = new Date(subscription.current_period_end * 1000).toISOString()
    
    // Example Supabase update:
    // await supabase
    //   .from('users')
    //   .update({
    //     subscription_status: status,
    //     subscription_end_date: endDate
    //   })
    //   .eq('subscription_id', subscription.id)
    
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription deleted:', subscription.id)
    
    // Mark subscription as cancelled in Supabase
    // await supabase
    //   .from('users')
    //   .update({
    //     subscription_status: 'cancelled',
    //     subscription_end_date: new Date().toISOString()
    //   })
    //   .eq('subscription_id', subscription.id)
    
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('Payment succeeded for invoice:', invoice.id)
    
    // Update subscription benefits or reset monthly allowances
    // This could involve updating a benefits table or user profile
    
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log('Payment failed for invoice:', invoice.id)
    
    // Handle failed payment - maybe send email notification
    // or update subscription status to 'past_due'
    
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}
