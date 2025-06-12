
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NextStepsCardProps {
  paymentStatus: string;
}

const NextStepsCard = ({ paymentStatus }: NextStepsCardProps) => {
  if (paymentStatus !== 'paid') return null;

  return (
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
  );
};

export default NextStepsCard;
