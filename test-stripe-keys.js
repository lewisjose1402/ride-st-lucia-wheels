#!/usr/bin/env node

// Test script to verify Stripe keys are live vs sandbox
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

console.log('Testing Stripe Key Configuration...\n');

// Check if keys are present
if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set');
  process.exit(1);
}

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('❌ STRIPE_PUBLISHABLE_KEY is not set');
  process.exit(1);
}

// Check if keys are live or test
const isLiveSecret = STRIPE_SECRET_KEY.startsWith('sk_live_');
const isLivePublishable = STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_');

console.log('🔑 Stripe Key Analysis:');
console.log(`Secret Key: ${isLiveSecret ? '✅ LIVE' : '⚠️  TEST/SANDBOX'} (${STRIPE_SECRET_KEY.substring(0, 12)}...)`);
console.log(`Publishable Key: ${isLivePublishable ? '✅ LIVE' : '⚠️  TEST/SANDBOX'} (${STRIPE_PUBLISHABLE_KEY.substring(0, 12)}...)`);

if (isLiveSecret && isLivePublishable) {
  console.log('\n🎉 Both keys are configured for LIVE environment!');
} else {
  console.log('\n❌ Keys are still in TEST/SANDBOX mode');
  console.log('\nTo fix this:');
  console.log('1. Update your Supabase Edge Functions environment variables');
  console.log('2. Set STRIPE_SECRET_KEY to your live secret key (starts with sk_live_)');
  console.log('3. Set STRIPE_PUBLISHABLE_KEY to your live publishable key (starts with pk_live_)');
}