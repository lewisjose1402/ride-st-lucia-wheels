
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UseBookingFormActionsProps {
  vehicle: any;
  formState: any;
  validation: any;
  pricing: any;
}

export const useBookingFormActions = ({ 
  vehicle, 
  formState, 
  validation, 
  pricing 
}: UseBookingFormActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { createCheckoutSession } = useCheckoutFlow();
  const { toast } = useToast();
  const navigate = useNavigate();

  const uploadDriverLicense = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${vehicle.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('driver-licenses')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('driver-licenses')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading driver license:', error);
      return null;
    }
  };

  const handleBooking = async () => {
    if (!validation.isValid || !user) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Upload driver license if provided
      let driverLicenseUrl = null;
      if (formState.driverLicense) {
        driverLicenseUrl = await uploadDriverLicense(formState.driverLicense);
        if (!driverLicenseUrl) {
          toast({
            title: "Upload Error",
            description: "Failed to upload driver's license. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Create booking record with all form data
      const bookingData = {
        vehicle_id: vehicle.id,
        user_id: user.id,
        pickup_date: formState.pickupDate,
        dropoff_date: formState.dropoffDate,
        pickup_location: "TBD", // This should come from form in the future
        dropoff_location: "TBD", // This should come from form in the future
        driver_name: `${formState.firstName} ${formState.lastName}`,
        first_name: formState.firstName,
        last_name: formState.lastName,
        email: formState.email,
        phone_number: formState.phoneNumber,
        driver_age: parseInt(formState.driverAge),
        driving_experience: formState.drivingExperience ? parseInt(formState.drivingExperience) : null,
        has_international_license: formState.isInternationalLicense,
        delivery_location: formState.deliveryLocation,
        driver_license_url: driverLicenseUrl,
        total_price: pricing.totalCost,
        deposit_amount: pricing.confirmationFee,
        status: 'pending'
      };

      console.log("Creating booking with data:", bookingData);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) {
        console.error("Booking creation error:", bookingError);
        throw new Error(bookingError.message);
      }

      console.log("Booking created successfully:", booking);

      // Create checkout session for the confirmation fee
      const checkoutUrl = await createCheckoutSession(
        booking.id,
        pricing.confirmationFee,
        `Confirmation fee for ${vehicle.name} rental`
      );

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }

    } catch (error) {
      console.error("Booking creation error:", error);
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleBooking,
    isProcessing
  };
};
