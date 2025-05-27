
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface PaymentInfoSectionProps {
  booking: {
    total_price: number;
    deposit_amount: number;
    created_at: string;
  };
}

export const PaymentInfoSection = ({ booking }: PaymentInfoSectionProps) => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-purple-600" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">Total Price</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(booking.total_price)}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-green-800">Deposit Paid</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(booking.deposit_amount)}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Booking Created</p>
            <p className="text-gray-900">{formatDate(booking.created_at, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Payment Type</p>
          <p className="text-sm text-gray-600">
            Deposit paid via card • Remaining balance payable in cash at pickup
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
