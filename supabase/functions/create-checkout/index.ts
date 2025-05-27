
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { bookingId, amount, description, customerEmail } = await req.json();
    if (!bookingId || !amount) {
      throw new Error("Missing required fields: bookingId, amount");
    }
    logStep("Request data parsed", { bookingId, amount, description, customerEmail });

    // Try to get authenticated user, but don't require it
    let user = null;
    let userEmail = customerEmail;
    
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
        if (!userError && userData.user?.email) {
          user = userData.user;
          userEmail = userData.user.email;
          logStep("User authenticated", { userId: user.id, email: user.email });
        }
      } catch (authError) {
        logStep("Authentication failed, proceeding as anonymous", { error: authError });
      }
    }

    if (!userEmail) {
      throw new Error("No customer email provided for checkout");
    }

    logStep("Processing checkout", { 
      isAuthenticated: !!user, 
      customerEmail: userEmail,
      bookingId 
    });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("Creating new customer");
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          user_id: user?.id || 'anonymous',
          booking_id: bookingId
        }
      });
      customerId = customer.id;
      logStep("Created new customer", { customerId });
    }

    // Get the origin for success/cancel URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: description || "Booking Confirmation Fee",
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/booking-confirmation?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${origin}/vehicles`,
      metadata: {
        booking_id: bookingId,
        user_id: user?.id || 'anonymous',
      },
    });

    // Update booking with session ID
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({ 
        stripe_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (updateError) {
      logStep("Error updating booking", { error: updateError });
      throw new Error(`Failed to update booking: ${updateError.message}`);
    }
    logStep("Booking updated with session ID");

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
