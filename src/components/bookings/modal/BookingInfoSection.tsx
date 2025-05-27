
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Car, MapPin, Navigation } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface BookingInfoSectionProps {
  booking: {
    id: string;
    vehicle_name: string;
    pickup_date: string;
    dropoff_date: string;
    pickup_location: string;
    dropoff_location: string;
    delivery_location?: string;
  };
}

export const BookingInfoSection = ({ booking }: BookingInfoSectionProps) => {
  const openInMaps = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
          Booking Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-600 mb-1">Booking ID</p>
          <p className="font-mono text-sm text-gray-900 break-all">{booking.id}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Vehicle</p>
          <div className="flex items-center gap-2 text-gray-900">
            <Car className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{booking.vehicle_name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pickup Date</p>
            <p className="text-gray-900 font-medium">{formatDate(booking.pickup_date)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Dropoff Date</p>
            <p className="text-gray-900 font-medium">{formatDate(booking.dropoff_date)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Pickup Location</p>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 break-words">{booking.pickup_location}</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => openInMaps(booking.pickup_location)}
                  className="p-0 h-auto text-blue-600 text-xs mt-1"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  View on Map
                </Button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Dropoff Location</p>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 break-words">{booking.dropoff_location}</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => openInMaps(booking.dropoff_location)}
                  className="p-0 h-auto text-blue-600 text-xs mt-1"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  View on Map
                </Button>
              </div>
            </div>
          </div>

          {booking.delivery_location && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Delivery Location</p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 break-words">{booking.delivery_location}</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => openInMaps(booking.delivery_location)}
                    className="p-0 h-auto text-blue-600 text-xs mt-1"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    View on Map
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
