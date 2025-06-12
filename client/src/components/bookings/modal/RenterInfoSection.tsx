
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Eye, FileText, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RenterInfoSectionProps {
  booking: {
    driver_name: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    driver_age: number;
    driving_experience?: number;
    has_international_license: boolean;
    driver_license_url?: string;
  };
}

export const RenterInfoSection = ({ booking }: RenterInfoSectionProps) => {
  const { toast } = useToast();
  const fullName = booking.first_name && booking.last_name 
    ? `${booking.first_name} ${booking.last_name}` 
    : booking.driver_name;

  const viewDriverLicense = async (url: string) => {
    try {
      console.log('Company viewing driver license:', url);
      
      // First try to open the original URL directly
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('Error viewing driver license for company:', error);
      toast({
        title: "Error",
        description: "Could not view driver license",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-green-600" />
          Renter Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">Full Name</p>
          <p className="font-medium text-gray-900">{fullName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {booking.email && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-gray-900 break-all">{booking.email}</p>
              </div>
            </div>
          )}
          
          {booking.phone_number && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600" />
                <p className="text-sm text-gray-900">{booking.phone_number}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Age</p>
            <p className="font-medium text-gray-900">{booking.driver_age} years</p>
          </div>
          
          {booking.driving_experience !== null && booking.driving_experience !== undefined && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Driving Experience</p>
              <p className="font-medium text-gray-900">{booking.driving_experience} years</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            {booking.has_international_license ? (
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">International License</p>
              {booking.has_international_license ? (
                <p className="text-sm text-green-700 font-medium">Yes - Valid international license</p>
              ) : (
                <div>
                  <p className="text-sm text-orange-700 font-medium">No</p>
                  <p className="text-xs text-orange-600 mt-1">
                    System will process a temporary driving permit
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 mb-3">Driver's License</p>
          {booking.driver_license_url ? (
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => viewDriverLicense(booking.driver_license_url!)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Driver's License
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-4 rounded-lg">
              <FileText className="h-5 w-5" />
              <p className="text-sm">No license image uploaded</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
