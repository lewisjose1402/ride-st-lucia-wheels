
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyDetailsCardProps {
  companyData: {
    company_name: string;
    email: string;
    phone: string;
  };
}

const CompanyDetailsCard = ({ companyData }: CompanyDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Company</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">{companyData.company_name}</p>
          <p className="text-gray-600">{companyData.email}</p>
          <p className="text-gray-600">{companyData.phone}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailsCard;
