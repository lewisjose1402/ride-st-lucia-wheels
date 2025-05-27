
import React, { useEffect, useState } from 'react';
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
  const { verifyPayment } = useCheckoutFlow();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    const handlePaymentVerificationAndBookingFetch = async () => {
      console.log("Starting booking confirmation process", { sessionId, bookingId, user: !!user });
      
      if (!user) {
        console.log("No user found, stopping process");
        setIsLoading(false);
        return;
      }

      try {
        // If we have a session_id, verify the payment first
        if (sessionId) {
          console.log("Verifying payment for session:", sessionId);
          const result = await verifyPayment(sessionId);
          console.log("Payment verification result:", result);
        }

        // Fetch booking details - either by bookingId or find the most recent booking
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
          setBooking(bookingData as BookingDetails);
        } else {
          console.log("No booking found");
        }
      } catch (error) {
        console.error("Error in booking confirmation process:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handlePaymentVerificationAndBookingFetch();
  }, [sessionId, bookingId, user, verifyPayment]);

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
        
        <BookingActions paymentStatus={booking.payment_status} />
        
        <NextStepsCard paymentStatus={booking.payment_status} />
      </div>
    </div>
  );
};

export default BookingConfirmation;
