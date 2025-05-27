
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
  const [paymentVerified, setPaymentVerified] = useState(false);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    const handlePaymentVerification = async () => {
      if (!sessionId || !bookingId || !user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Verifying payment for session:", sessionId);
        const result = await verifyPayment(sessionId);
        
        if (result) {
          setPaymentVerified(true);
          console.log("Payment verified successfully");
        }

        // Fetch booking details
        const { data: bookingData, error } = await supabase
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
          console.error("Error fetching booking:", error);
        } else {
          setBooking(bookingData as BookingDetails);
          console.log("Booking details loaded:", bookingData);
        }
      } catch (error) {
        console.error("Error in payment verification:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handlePaymentVerification();
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
