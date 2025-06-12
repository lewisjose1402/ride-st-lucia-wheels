
import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCheckoutFlow = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use ref to track ongoing verification to prevent multiple calls
  const verificationInProgress = useRef(false);

  const createCheckoutSession = async (bookingId: string, amount: number, description?: string, customerEmail?: string) => {
    try {
      setIsProcessing(true);
      console.log("Creating checkout session for booking:", bookingId, "amount:", amount, "user:", user ? 'authenticated' : 'anonymous');

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          bookingId,
          amount,
          description,
          customerEmail: customerEmail || user?.email // Use provided email or user email
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

  const verifyPayment = async (sessionId: string, showToast: boolean = true) => {
    // Prevent multiple simultaneous verification calls
    if (verificationInProgress.current) {
      console.log("Verification already in progress, skipping");
      return null;
    }

    verificationInProgress.current = true;
    
    try {
      setIsVerifying(true);
      console.log("Starting payment verification for session:", sessionId);

      if (!sessionId) {
        throw new Error("No session ID provided for verification");
      }

      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      console.log("Payment verification response:", { data, error });

      if (error) {
        console.error("Error verifying payment:", error);
        throw new Error(error.message || "Failed to verify payment");
      }

      if (data?.success) {
        console.log("Payment verification successful:", data);
        if (showToast) {
          toast({
            title: "Payment Verified",
            description: "Your payment has been successfully verified",
          });
        }
        return data;
      } else {
        console.log("Payment verification returned non-success result:", data);
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      if (showToast) {
        toast({
          title: "Verification Error",
          description: error instanceof Error ? error.message : "Failed to verify payment",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsVerifying(false);
      verificationInProgress.current = false;
    }
  };

  return {
    createCheckoutSession,
    verifyPayment,
    isProcessing,
    isVerifying
  };
};
