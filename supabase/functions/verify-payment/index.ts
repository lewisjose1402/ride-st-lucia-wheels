
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

      // Send booking confirmation emails if payment was successful
      if (paymentStatus === 'paid' && currentBooking.payment_status !== 'paid') {
        logStep("Payment successful - triggering confirmation emails");
        try {
          // Fetch complete booking details for email notifications
          const { data: bookingDetails, error: bookingFetchError } = await supabaseClient
            .from('bookings')
            .select(`
              *,
              vehicles (
                name,
                rental_companies (
                  company_name,
                  contact_email,
                  contact_name
                )
              )
            `)
            .eq('id', bookingId)
            .single();

          if (bookingFetchError) {
            logStep("WARNING: Failed to fetch booking details for emails", { error: bookingFetchError });
          } else if (bookingDetails) {
            logStep("Sending booking confirmation emails", { 
              renterEmail: bookingDetails.email,
              companyEmail: bookingDetails.vehicles?.rental_companies?.contact_email,
              vehicleName: bookingDetails.vehicles?.name
            });

            // Send emails to backend API endpoints
            const emailBaseUrl = Deno.env.get('EMAIL_API_BASE_URL') || 'https://ridematchstlucia.com';

            // Send renter confirmation email
            if (bookingDetails.email) {
              try {
                await fetch(`${emailBaseUrl}/api/emails/booking-confirmation-renter`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    renterEmail: bookingDetails.email,
                    renterFirstName: bookingDetails.first_name || bookingDetails.driver_name?.split(' ')[0] || 'Renter',
                    renterLastName: bookingDetails.last_name || bookingDetails.driver_name?.split(' ')[1] || '',
                    vehicleName: bookingDetails.vehicles?.name,
                    pickupDateTime: bookingDetails.pickup_date,
                    dropoffDateTime: bookingDetails.dropoff_date,
                    pickupLocation: bookingDetails.pickup_location,
                    dropoffLocation: bookingDetails.dropoff_location,
                    totalPrice: bookingDetails.total_price,
                    companyName: bookingDetails.vehicles?.rental_companies?.company_name
                  })
                });
                logStep("Renter confirmation email sent");
              } catch (emailError) {
                logStep("WARNING: Failed to send renter confirmation email", { error: emailError });
              }
            }

            // Send company confirmation email
            if (bookingDetails.vehicles?.rental_companies?.contact_email) {
              try {
                await fetch(`${emailBaseUrl}/api/emails/booking-confirmation-company`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    companyEmail: bookingDetails.vehicles?.rental_companies?.contact_email,
                    companyContactName: bookingDetails.vehicles?.rental_companies?.contact_name || 'Manager',
                    vehicleName: bookingDetails.vehicles?.name,
                    renterFirstName: bookingDetails.first_name || bookingDetails.driver_name?.split(' ')[0] || 'Renter',
                    renterLastName: bookingDetails.last_name || bookingDetails.driver_name?.split(' ')[1] || '',
                    pickupDateTime: bookingDetails.pickup_date,
                    dropoffDateTime: bookingDetails.dropoff_date,
                    pickupLocation: bookingDetails.pickup_location,
                    dropoffLocation: bookingDetails.dropoff_location,
                    totalPrice: bookingDetails.total_price
                  })
                });
                logStep("Company confirmation email sent");
              } catch (emailError) {
                logStep("WARNING: Failed to send company confirmation email", { error: emailError });
              }
            }

            // Send admin notification email
            const adminEmail = Deno.env.get('ADMIN_EMAIL');
            if (adminEmail) {
              try {
                await fetch(`${emailBaseUrl}/api/emails/booking-confirmation-admin`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    adminEmail,
                    vehicleName: bookingDetails.vehicles?.name,
                    companyName: bookingDetails.vehicles?.rental_companies?.company_name,
                    renterFirstName: bookingDetails.first_name || bookingDetails.driver_name?.split(' ')[0] || 'Renter',
                    renterLastName: bookingDetails.last_name || bookingDetails.driver_name?.split(' ')[1] || '',
                    pickupDateTime: bookingDetails.pickup_date,
                    returnDateTime: bookingDetails.dropoff_date
                  })
                });
                logStep("Admin notification email sent");
              } catch (emailError) {
                logStep("WARNING: Failed to send admin notification email", { error: emailError });
              }
            }
          }
        } catch (emailError) {
          logStep("WARNING: Error in email notification process", { error: emailError });
          // Don't fail the payment verification if emails fail
        }
      }
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
