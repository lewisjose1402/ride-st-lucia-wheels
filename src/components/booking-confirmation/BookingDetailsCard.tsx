
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAddressFromLocationData } from '@/utils/locationHelpers';

interface BookingDetailsCardProps {
  booking: {
    id: string;
    pickup_date: string;
    dropoff_date: string;
    total_price: number;
    payment_status: string;
    confirmation_fee_paid: number;
    delivery_location?: string;
    pickup_location?: string;
    vehicle: {
      name: string;
    };
  };
}

const BookingDetailsCard = ({ booking }: BookingDetailsCardProps) => {
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

  // Get the primary location for display
  const primaryLocation = booking.delivery_location || booking.pickup_location;
  const { street_address } = getAddressFromLocationData(primaryLocation);
  
  // Format the location for display
  const formatLocationForDisplay = (location: string) => {
    // Check if it's an airport code format (e.g., "UVF – Hewanorra International Airport")
    if (location.includes('–') && (location.includes('UVF') || location.includes('GFL'))) {
      return location; // Already formatted
    }
    
    // Check if it's a Google Maps URL
    if (location.startsWith('https://maps.google.com') || location.startsWith('https://goo.gl')) {
      return 'Google Maps Location (Click to view)';
    }
    
    // Return as is for other formats
    return location;
  };

  return (
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
            <p className="font-medium">{booking.vehicle.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pickup Date</p>
            <p className="font-medium">
              {new Date(booking.pickup_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Dropoff Date</p>
            <p className="font-medium">
              {new Date(booking.dropoff_date).toLocaleDateString()}
            </p>
          </div>
          {primaryLocation && (
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Pickup/Delivery Location</p>
              {primaryLocation.startsWith('https://') ? (
                <a 
                  href={primaryLocation} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800 underline"
                >
                  {formatLocationForDisplay(primaryLocation)}
                </a>
              ) : (
                <p className="font-medium">{formatLocationForDisplay(primaryLocation)}</p>
              )}
            </div>
          )}
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
  );
};

export default BookingDetailsCard;
