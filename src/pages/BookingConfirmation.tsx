
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, ArrowLeft, Download } from 'lucide-react';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import LoadingState from '@/components/company/dashboard/LoadingState';

interface BookingDetails {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  payment_status: string;
  confirmation_fee_paid: number;
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
  rental_company: {
    company_name: string;
    email: string;
    phone: string;
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
            start_date,
            end_date,
            total_price,
            payment_status,
            confirmation_fee_paid,
            vehicle:vehicles (
              make,
              model,
              year
            ),
            rental_company:rental_companies (
              company_name,
              email,
              phone
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find the booking details. Please check your booking history.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (booking.payment_status) {
      case 'paid':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'failed':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (booking.payment_status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Payment Confirmed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Payment Failed</Badge>;
      default:
        return <Badge variant="outline">Payment Pending</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (booking.payment_status) {
      case 'paid':
        return "Your booking has been confirmed and payment processed successfully.";
      case 'failed':
        return "Payment failed. Please try again or contact support.";
      default:
        return "Payment is being processed. You'll receive an update shortly.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {booking.payment_status === 'paid' ? 'Booking Confirmed!' : 'Booking Status'}
          </h1>
          <p className="text-gray-600">{getStatusMessage()}</p>
        </div>

        {/* Booking Details Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Booking Details</CardTitle>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-medium">{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium">
                  {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">
                  {new Date(booking.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium">
                  {new Date(booking.end_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Price</p>
                <p className="font-medium">${booking.total_price}</p>
              </div>
              {booking.confirmation_fee_paid > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Confirmation Fee Paid</p>
                  <p className="font-medium text-green-600">
                    ${booking.confirmation_fee_paid}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{booking.rental_company.company_name}</p>
              <p className="text-gray-600">{booking.rental_company.email}</p>
              <p className="text-gray-600">{booking.rental_company.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/vehicles">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
          {booking.payment_status === 'paid' && (
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          )}
        </div>

        {/* Next Steps */}
        {booking.payment_status === 'paid' && (
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• You'll receive a confirmation email with your booking details</li>
                <li>• The rental company will contact you before your pickup date</li>
                <li>• Bring a valid driver's license and credit card for pickup</li>
                <li>• Contact the rental company if you need to modify your booking</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;
