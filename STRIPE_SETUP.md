# Stripe Payment Integration Setup

## Overview
This project now includes a complete Stripe payment flow for accepting donations to support community service categories.

## Environment Variables
Create a `.env.local` file in your project root with the following variables:

```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Stripe Dashboard Setup

### 1. Get Your API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers → API Keys
3. Copy your Publishable Key and Secret Key
4. Use test keys for development, live keys for production

### 2. Configure Webhooks
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`
5. Copy the webhook signing secret

### 3. Test the Integration
1. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
2. Use any future expiry date and any 3-digit CVC

## Payment Flow

### 1. User Journey
1. User clicks "Support This Category" in a service modal
2. Chooses donation amount ($25, $50, or $100)
3. Redirected to Stripe Checkout
4. Completes payment
5. Redirected back to success/cancel page

### 2. Backend Processing
1. Stripe webhook fires on successful payment
2. Webhook handler processes the payment
3. Updates donation progress in database (Supabase)
4. Modal shows updated progress when user returns

## API Endpoints

### Create Checkout Session
- **POST** `/api/create-checkout-session`
- Creates Stripe checkout session
- Returns session ID for redirect

### Webhook Handler
- **POST** `/api/webhooks/stripe`
- Processes Stripe webhooks
- Updates donation progress

## Database Integration (Future)
Currently, the webhook logs successful payments. To integrate with Supabase:

1. Add Supabase client
2. Create donation tracking tables
3. Update webhook to modify database
4. Implement real-time updates

## Testing
1. Install dependencies: `npm install`
2. Set environment variables
3. Run development server: `npm run dev`
4. Test payment flow with test cards
5. Check webhook logs in Stripe dashboard

## Security Notes
- Never expose secret keys in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Add rate limiting for production use
