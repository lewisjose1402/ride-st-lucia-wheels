
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';

export const useBookingFormActions = (params: {
  vehicle: any;
  formState: any;
  validation: any;
  pricing: any;
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { createCheckoutSession, isProcessing } = useCheckoutFlow();
  const { vehicle, formState, validation, pricing } = params;

  const handleBooking = async () => {
    if (!validation.isValid) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return false;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a booking",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log("Creating booking with data:", {
        vehicle_id: vehicle.id,
        pickup_date: formState.pickupDate,
        dropoff_date: formState.dropoffDate,
        total_price: pricing.totalCost,
        deposit_amount: pricing.damageDeposit,
        driver_name: `${formState.firstName} ${formState.lastName}`,
        driver_age: parseInt(formState.driverAge),
        pickup_location: formState.deliveryLocation,
        dropoff_location: formState.deliveryLocation,
        has_international_license: formState.isInternationalLicense,
        permit_fee: pricing.permitFee,
        young_driver_fee: pricing.underageDeposit
      });

      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          vehicle_id: vehicle.id,
          user_id: user.id,
          pickup_date: formState.pickupDate,
          dropoff_date: formState.dropoffDate,
          total_price: pricing.totalCost,
          deposit_amount: pricing.damageDeposit,
          driver_name: `${formState.firstName} ${formState.lastName}`,
          driver_age: parseInt(formState.driverAge),
          pickup_location: formState.deliveryLocation,
          dropoff_location: formState.deliveryLocation,
          has_international_license: formState.isInternationalLicense,
          permit_fee: pricing.permitFee,
          young_driver_fee: pricing.underageDeposit,
          payment_status: 'pending',
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Error creating booking:", bookingError);
        throw new Error(bookingError.message);
      }

      console.log("Booking created successfully:", booking);

      // Create Stripe checkout session
      const checkoutUrl = await createCheckoutSession(
        booking.id,
        pricing.confirmationFee,
        `Booking Confirmation Fee - ${vehicle.name}`
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
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleBooking,
    isProcessing
  };
};
