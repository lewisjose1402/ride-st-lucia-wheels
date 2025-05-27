
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error("Missing session_id");
    }
    logStep("Session ID received", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { 
      sessionId: session.id, 
      paymentStatus: session.payment_status,
      metadata: session.metadata 
    });

    const bookingId = session.metadata?.booking_id;
    if (!bookingId) {
      throw new Error("No booking_id in session metadata");
    }

    // Update booking based on payment status
    let paymentStatus = 'pending';
    let confirmationFeePaid = 0;

    if (session.payment_status === 'paid') {
      paymentStatus = 'paid';
      confirmationFeePaid = (session.amount_total || 0) / 100; // Convert from cents
    } else if (session.payment_status === 'unpaid') {
      paymentStatus = 'failed';
    }

    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({ 
        payment_status: paymentStatus,
        confirmation_fee_paid: confirmationFeePaid,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (updateError) {
      logStep("Error updating booking", { error: updateError });
      throw new Error(`Failed to update booking: ${updateError.message}`);
    }
    logStep("Booking updated", { paymentStatus, confirmationFeePaid });

    return new Response(JSON.stringify({ 
      success: true,
      payment_status: paymentStatus,
      amount_paid: confirmationFeePaid
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
