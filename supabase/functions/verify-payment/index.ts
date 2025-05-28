
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY is not set");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    logStep("Supabase client initialized");

    const requestBody = await req.json();
    const { sessionId } = requestBody;
    
    if (!sessionId) {
      logStep("ERROR: Missing session_id in request");
      throw new Error("Missing session_id");
    }
    logStep("Session ID received", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve the checkout session
    logStep("Retrieving Stripe session");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { 
      sessionId: session.id, 
      paymentStatus: session.payment_status,
      paymentIntent: session.payment_intent,
      amountTotal: session.amount_total,
      metadata: session.metadata 
    });

    const bookingId = session.metadata?.booking_id;
    if (!bookingId) {
      logStep("ERROR: No booking_id in session metadata");
      throw new Error("No booking_id in session metadata");
    }
    logStep("Booking ID found", { bookingId });

    // Check current booking status first
    const { data: currentBooking, error: fetchError } = await supabaseClient
      .from('bookings')
      .select('payment_status, confirmation_fee_paid, status')
      .eq('id', bookingId)
      .single();

    if (fetchError) {
      logStep("ERROR: Failed to fetch current booking", { error: fetchError });
      throw new Error(`Failed to fetch booking: ${fetchError.message}`);
    }
    logStep("Current booking status", currentBooking);

    // Update booking based on payment status
    let paymentStatus = 'pending';
    let bookingStatus = currentBooking.status;
    let confirmationFeePaid = currentBooking.confirmation_fee_paid || 0;

    if (session.payment_status === 'paid') {
      paymentStatus = 'paid';
      bookingStatus = 'confirmed'; // Update booking status to confirmed when payment is successful
      confirmationFeePaid = (session.amount_total || 0) / 100; // Convert from cents
      logStep("Payment successful - updating booking to confirmed", { paymentStatus, bookingStatus, confirmationFeePaid });
    } else if (session.payment_status === 'unpaid') {
      paymentStatus = 'failed';
      logStep("Payment failed", { paymentStatus });
    } else {
      logStep("Payment status unclear", { stripeStatus: session.payment_status });
    }

    // Only update if status has changed
    if (currentBooking.payment_status !== paymentStatus || currentBooking.confirmation_fee_paid !== confirmationFeePaid || currentBooking.status !== bookingStatus) {
      logStep("Updating booking status", { 
        oldPaymentStatus: currentBooking.payment_status, 
        newPaymentStatus: paymentStatus,
        oldBookingStatus: currentBooking.status,
        newBookingStatus: bookingStatus,
        oldFee: currentBooking.confirmation_fee_paid,
        newFee: confirmationFeePaid
      });

      const { error: updateError } = await supabaseClient
        .from('bookings')
        .update({ 
          payment_status: paymentStatus,
          confirmation_fee_paid: confirmationFeePaid,
          status: bookingStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (updateError) {
        logStep("ERROR: Failed to update booking", { error: updateError });
        throw new Error(`Failed to update booking: ${updateError.message}`);
      }
      logStep("Booking updated successfully");
    } else {
      logStep("No update needed - status unchanged");
    }

    const response = { 
      success: true,
      payment_status: paymentStatus,
      booking_status: bookingStatus,
      amount_paid: confirmationFeePaid,
      session_status: session.payment_status,
      booking_id: bookingId
    };
    
    logStep("Verification completed successfully", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
