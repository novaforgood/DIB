# How to Get Your Stripe Publishable Key

## Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Sign up" or "Start now"
3. Create your account (it's free to sign up)

## Step 2: Get Your API Keys

1. **Log in to your Stripe Dashboard**: [https://dashboard.stripe.com](https://dashboard.stripe.com)

2. **Navigate to Developers → API keys**:
   - Click on "Developers" in the left sidebar
   - Click on "API keys"

3. **Find your Publishable key**:
   - You'll see two keys:
     - **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
     - **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)
   
   - **For development/testing**: Use the **Test mode** publishable key (starts with `pk_test_`)
   - **For production**: Use the **Live mode** publishable key (starts with `pk_live_`)

4. **Copy the Publishable key**:
   - Click the "Reveal test key" or "Reveal live key" button
   - Copy the key (it looks like: `pk_test_51AbCdEf...`)

## Step 3: Add the Key to Your Project

1. **Create a `.env` file** in the root of your project (same directory as `package.json`)

2. **Add your Stripe key**:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

   Replace `pk_test_your_actual_key_here` with your actual publishable key from Stripe.

3. **Restart your development server**:
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again

## Example `.env` File

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcdefghijklmnopqrstuvwxyz

# PayPal Configuration (if using PayPal)
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Supabase Configuration (if using Supabase)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
```

## Important Notes

- **Never commit your `.env` file to Git** - it should already be in `.gitignore`
- **Test keys** (starting with `pk_test_`) are safe to use in frontend code
- **Secret keys** (starting with `sk_test_` or `sk_live_`) should **NEVER** be exposed in frontend code - only use them on your backend
- For testing, you can use Stripe's test card numbers:
  - Card: `4242 4242 4242 4242`
  - Expiry: Any future date (e.g., `12/34`)
  - CVC: Any 3 digits (e.g., `123`)
  - ZIP: Any 5 digits (e.g., `12345`)

## Quick Links

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Keys](https://dashboard.stripe.com/apikeys)
- [Stripe Test Cards](https://stripe.com/docs/testing)

