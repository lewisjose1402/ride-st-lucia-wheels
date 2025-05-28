
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import LoadingState from '@/components/company/dashboard/LoadingState';
import BookingStatusHeader from '@/components/booking-confirmation/BookingStatusHeader';
import BookingDetailsCard from '@/components/booking-confirmation/BookingDetailsCard';
import CompanyDetailsCard from '@/components/booking-confirmation/CompanyDetailsCard';
import BookingActions from '@/components/booking-confirmation/BookingActions';
import NextStepsCard from '@/components/booking-confirmation/NextStepsCard';
import BookingNotFound from '@/components/booking-confirmation/BookingNotFound';

interface BookingDetails {
  id: string;
  pickup_date: string;
  dropoff_date: string;
  total_price: number;
  payment_status: string;
  confirmation_fee_paid: number;
  stripe_session_id?: string;
  vehicle: {
    name: string;
    rental_companies: {
      company_name: string;
      email: string;
      phone: string;
    };
  };
}

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const { verifyPayment, isVerifying } = useCheckoutFlow();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [hasVerifiedPayment, setHasVerifiedPayment] = useState(false);
  
  // Use refs to prevent multiple simultaneous calls
  const verificationInProgress = useRef(false);
  const fetchInProgress = useRef(false);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  const fetchBookingDetails = async () => {
    if (fetchInProgress.current) return null;
    fetchInProgress.current = true;
    
    console.log("Fetching booking details", { bookingId, user: !!user });
    
    if (!user) {
      console.log("No user found, stopping process");
      fetchInProgress.current = false;
      return null;
    }

    try {
      let bookingData;
      
      if (bookingId) {
        console.log("Fetching booking by ID:", bookingId);
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            pickup_date,
            dropoff_date,
            total_price,
            payment_status,
            confirmation_fee_paid,
            stripe_session_id,
            vehicle:vehicles (
              name,
              rental_companies!vehicles_company_id_fkey (
                company_name,
                email,
                phone
              )
            )
          `)
          .eq('id', bookingId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching booking by ID:", error);
        } else {
          bookingData = data;
        }
      }

      // If no booking found by ID or no ID provided, get the most recent booking
      if (!bookingData) {
        console.log("Fetching most recent booking for user");
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            pickup_date,
            dropoff_date,
            total_price,
            payment_status,
            confirmation_fee_paid,
            stripe_session_id,
            vehicle:vehicles (
              name,
              rental_companies!vehicles_company_id_fkey (
                company_name,
                email,
                phone
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching recent booking:", error);
        } else {
          bookingData = data;
        }
      }

      if (bookingData) {
        console.log("Booking details loaded:", bookingData);
        return bookingData as BookingDetails;
      } else {
        console.log("No booking found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      return null;
    } finally {
      fetchInProgress.current = false;
    }
  };

  const handlePaymentVerificationAndBookingFetch = async () => {
    if (verificationInProgress.current) return;
    verificationInProgress.current = true;
    
    console.log("Starting booking confirmation process", { sessionId, bookingId, user: !!user });
    
    if (!user) {
      console.log("No user found, stopping process");
      setIsLoading(false);
      verificationInProgress.current = false;
      return;
    }

    try {
      setVerificationError(null);

      // If we have a session_id and haven't verified yet, verify the payment first
      if (sessionId && !hasVerifiedPayment) {
        console.log("Verifying payment for session:", sessionId);
        try {
          const result = await verifyPayment(sessionId, false);
          console.log("Payment verification result:", result);
          setHasVerifiedPayment(true);
        } catch (error) {
          console.error("Payment verification failed:", error);
          setVerificationError(error instanceof Error ? error.message : "Payment verification failed");
        }
      }

      // Fetch booking details
      const bookingData = await fetchBookingDetails();
      setBooking(bookingData);
    } catch (error) {
      console.error("Error in booking confirmation process:", error);
    } finally {
      setIsLoading(false);
      verificationInProgress.current = false;
    }
  };

  const handleManualVerification = async () => {
    if (verificationInProgress.current || (!booking?.stripe_session_id && !sessionId)) {
      console.error("Verification in progress or no session ID available");
      return;
    }

    const sessionIdToUse = sessionId || booking?.stripe_session_id;
    if (!sessionIdToUse) return;

    verificationInProgress.current = true;
    try {
      console.log("Manual verification triggered for session:", sessionIdToUse);
      await verifyPayment(sessionIdToUse, true);
      
      // Refetch booking details after verification
      const updatedBooking = await fetchBookingDetails();
      if (updatedBooking) {
        setBooking(updatedBooking);
        setVerificationError(null);
        setHasVerifiedPayment(true);
      }
    } catch (error) {
      console.error("Manual verification failed:", error);
      setVerificationError(error instanceof Error ? error.message : "Manual verification failed");
    } finally {
      verificationInProgress.current = false;
    }
  };

  useEffect(() => {
    // Only run the effect once when the component mounts or when user changes
    if (user && !verificationInProgress.current) {
      handlePaymentVerificationAndBookingFetch();
    }
  }, [user]); // Only depend on user, not on sessionId or bookingId to prevent loops

  if (isLoading) {
    return <LoadingState />;
  }

  if (!booking) {
    return <BookingNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <BookingStatusHeader paymentStatus={booking.payment_status} />
        
        <BookingDetailsCard booking={booking} />
        
        <CompanyDetailsCard companyData={booking.vehicle.rental_companies} />
        
        <BookingActions 
          paymentStatus={booking.payment_status}
          onManualVerification={handleManualVerification}
          isVerifying={isVerifying}
          showManualVerification={booking.payment_status === 'pending' && Boolean(sessionId || booking.stripe_session_id)}
          verificationError={Boolean(verificationError)}
          verificationErrorMessage={verificationError}
        />
        
        <NextStepsCard paymentStatus={booking.payment_status} />
      </div>
    </div>
  );
};

export default BookingConfirmation;
