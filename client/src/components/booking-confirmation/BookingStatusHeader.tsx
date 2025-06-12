
import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface BookingStatusHeaderProps {
  paymentStatus: string;
}

const BookingStatusHeader = ({ paymentStatus }: BookingStatusHeaderProps) => {
  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'paid':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'failed':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'paid':
        return "Your booking has been confirmed and payment processed successfully.";
      case 'failed':
        return "Payment failed. Please try again or contact support.";
      default:
        return "Payment is being processed. You'll receive an update shortly.";
    }
  };

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        {getStatusIcon()}
      </div>
      <h1 className="text-3xl font-bold mb-2">
        {paymentStatus === 'paid' ? 'Booking Confirmed!' : 'Booking Status'}
      </h1>
      <p className="text-gray-600">{getStatusMessage()}</p>
    </div>
  );
};

export default BookingStatusHeader;
