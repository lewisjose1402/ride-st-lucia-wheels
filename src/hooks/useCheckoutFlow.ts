
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useCheckoutFlow = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createCheckoutSession = async (bookingId: string, amount: number, description?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with payment",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsProcessing(true);
      console.log("Creating checkout session for booking:", bookingId, "amount:", amount);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          bookingId,
          amount,
          description
        }
      });

      if (error) {
        console.error("Error creating checkout session:", error);
        throw new Error(error.message || "Failed to create checkout session");
      }

      if (!data?.url) {
        throw new Error("No checkout URL received");
      }

      console.log("Checkout session created successfully:", data.url);
      return data.url;
    } catch (error) {
      console.error("Checkout flow error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (sessionId: string) => {
    try {
      console.log("Verifying payment for session:", sessionId);

      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) {
        console.error("Error verifying payment:", error);
        throw new Error(error.message || "Failed to verify payment");
      }

      console.log("Payment verification result:", data);
      return data;
    } catch (error) {
      console.error("Payment verification error:", error);
      toast({
        title: "Verification Error",
        description: error instanceof Error ? error.message : "Failed to verify payment",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    createCheckoutSession,
    verifyPayment,
    isProcessing
  };
};
