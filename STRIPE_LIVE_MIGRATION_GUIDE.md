# Stripe Live Environment Migration Guide

## Problem Identified
Your Stripe checkout is still showing "Sandbox" because the **Supabase Edge Functions** are using old sandbox keys, even though your local environment has the live keys.

## Root Cause
- Local Replit environment: ✅ Live keys configured
- Supabase Edge Functions: ❌ Still using sandbox keys
- The Edge Functions (`create-checkout` and `verify-payment`) have their own environment variables

## Solution Steps

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `bmkoiaglbvkxszbipzul`

### Step 2: Navigate to Edge Functions Settings
1. Click on "Edge Functions" in the left sidebar
2. Look for "Environment Variables" or "Secrets" section
3. This might be under "Settings" → "Edge Functions" → "Environment Variables"

### Step 3: Update the Following Secrets
Replace the existing keys with your live keys:

**STRIPE_SECRET_KEY**
- Current: `sk_test_...` (sandbox)
- Update to: `sk_live_51Ow...` (your live secret key)

**STRIPE_PUBLISHABLE_KEY** 
- Add this new secret: `pk_live_51Ow...` (your live publishable key)

### Step 4: Verify the Update
After updating the secrets:
1. Wait 2-3 minutes for the changes to propagate
2. Test a new checkout session
3. The Stripe checkout should no longer show "Sandbox"

## Technical Details
- Edge Functions: `create-checkout` and `verify-payment`
- Both functions use `Deno.env.get("STRIPE_SECRET_KEY")`
- The checkout interface displays "Sandbox" when using test keys

## Alternative: CLI Method (if you have admin access)
```bash
supabase secrets set STRIPE_SECRET_KEY="sk_live_51Ow..." --project-ref bmkoiaglbvkxszbipzul
supabase secrets set STRIPE_PUBLISHABLE_KEY="pk_live_51Ow..." --project-ref bmkoiaglbvkxszbipzul
```

## Verification
Once updated, the checkout page should:
- Remove the "Sandbox" indicator
- Process real payments
- Show live currency conversion rates