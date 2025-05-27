
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

  const uploadDriverLicense = async (file: File, bookingId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      // Use booking ID for anonymous users, user ID for authenticated users
      const userId = user?.id || bookingId;
      const fileName = `${userId}/${vehicle.id}/${bookingId}/${Date.now()}.${fileExt}`;
      
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
    const isAnonymousBooking = !user;
    console.log('handleBooking called with validation state:', {
      isValid: validation.isValid,
      errorsCount: validation.errors.length,
      blockingErrorsCount: validation.blockingErrors.length,
      userAuthenticated: !!user,
      isAnonymousBooking
    });

    // Check validation first
    if (!validation.isValid) {
      console.log('Validation failed, showing validation error');
      toast({
        title: "Validation Error",
        description: "Please complete all required fields before proceeding",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Starting booking process...', isAnonymousBooking ? 'Anonymous user' : 'Authenticated user');

      // Create booking record with all form data
      const bookingData = {
        vehicle_id: vehicle.id,
        user_id: user?.id || null, // Allow null for anonymous users
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
        driver_license_url: null, // Will be updated after upload
        total_price: pricing.totalCost,
        deposit_amount: pricing.confirmationFee,
        status: 'pending' as const
      };

      console.log("Creating booking with data:", bookingData);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        console.error("Booking creation error:", bookingError);
        toast({
          title: "Booking Creation Failed",
          description: `Failed to create booking: ${bookingError.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log("Booking created successfully:", booking);

      // Upload driver license if provided, now that we have the booking ID
      if (formState.driverLicense) {
        console.log('Uploading driver license...');
        const driverLicenseUrl = await uploadDriverLicense(formState.driverLicense, booking.id);
        if (driverLicenseUrl) {
          // Update booking with driver license URL
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ driver_license_url: driverLicenseUrl })
            .eq('id', booking.id);
          
          if (updateError) {
            console.error('Error updating booking with driver license URL:', updateError);
          } else {
            console.log('Driver license uploaded and booking updated successfully');
          }
        } else {
          toast({
            title: "Upload Warning",
            description: "Driver's license upload failed, but booking will continue. You can upload it later.",
            variant: "destructive",
          });
        }
      }

      // Create checkout session for the confirmation fee
      console.log('Creating checkout session...');
      const checkoutUrl = await createCheckoutSession(
        booking.id,
        pricing.confirmationFee,
        `Confirmation fee for ${vehicle.name} rental`,
        formState.email // Pass email for both anonymous and authenticated users
      );

      if (checkoutUrl) {
        console.log('Redirecting to checkout:', checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }

    } catch (error) {
      console.error("Booking process error:", error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during booking",
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
