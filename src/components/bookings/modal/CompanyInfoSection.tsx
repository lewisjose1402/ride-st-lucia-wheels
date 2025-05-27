
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

interface CompanyInfoSectionProps {
  booking: {
    company_name: string;
  };
}

export const CompanyInfoSection = ({ booking }: CompanyInfoSectionProps) => {
  return (
    <Card className="h-fit lg:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-indigo-600" />
          Rental Company
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-indigo-800 mb-1">Company Name</p>
          <p className="text-lg font-semibold text-indigo-900">{booking.company_name}</p>
        </div>
      </CardContent>
    </Card>
  );
};
