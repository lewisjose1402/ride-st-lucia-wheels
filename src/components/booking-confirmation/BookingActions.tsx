
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';

interface BookingActionsProps {
  paymentStatus: string;
}

const BookingActions = ({ paymentStatus }: BookingActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/vehicles">
        <Button variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vehicles
        </Button>
      </Link>
      {paymentStatus === 'paid' && (
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
      )}
    </div>
  );
};

export default BookingActions;
