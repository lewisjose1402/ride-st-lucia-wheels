
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';

export const useBookingFormActions = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { createCheckoutSession, isProcessing } = useCheckoutFlow();

  const submitBooking = async (bookingData: any, totalPrice: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a booking",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log("Submitting booking with data:", bookingData);

      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
          total_price: totalPrice,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Error creating booking:", bookingError);
        throw new Error(bookingError.message);
      }

      console.log("Booking created successfully:", booking);

      // Calculate confirmation fee (10% of total price, minimum $10)
      const confirmationFee = Math.max(totalPrice * 0.1, 10);
      
      // Create Stripe checkout session
      const checkoutUrl = await createCheckoutSession(
        booking.id,
        confirmationFee,
        `Booking Confirmation Fee - ${bookingData.vehicle_make} ${bookingData.vehicle_model}`
      );

      if (!checkoutUrl) {
        throw new Error("Failed to create payment session");
      }

      // Open Stripe checkout in a new tab
      window.open(checkoutUrl, '_blank');

      toast({
        title: "Booking Created",
        description: "Please complete your payment in the new window to confirm your booking.",
      });

      return true;
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    submitBooking,
    isProcessing
  };
};
