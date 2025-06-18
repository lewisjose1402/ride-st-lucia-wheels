
import React from 'react';
import { MapPin, Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface DeliveryLocationSelectorProps {
  deliveryLocationType: 'google_maps' | 'airport';
  setDeliveryLocationType: (type: 'google_maps' | 'airport') => void;
  deliveryLocation: string;
  setDeliveryLocation: (location: string) => void;
  selectedAirport: string;
  setSelectedAirport: (airport: string) => void;
}

const airports = [
  { code: 'UVF', name: 'Hewanorra International Airport' },
  { code: 'GFL', name: 'George F. L. Charles Airport' }
];

const DeliveryLocationSelector = ({
  deliveryLocationType,
  setDeliveryLocationType,
  deliveryLocation,
  setDeliveryLocation,
  selectedAirport,
  setSelectedAirport
}: DeliveryLocationSelectorProps) => {
  
  const handleTypeChange = (type: 'google_maps' | 'airport') => {
    setDeliveryLocationType(type);
    // Clear the other field when switching types
    if (type === 'google_maps') {
      setSelectedAirport('');
    } else {
      setDeliveryLocation('');
    }
  };

  const handleAirportChange = (airportCode: string) => {
    setSelectedAirport(airportCode);
    const airport = airports.find(a => a.code === airportCode);
    if (airport) {
      setDeliveryLocation(`${airport.code} – ${airport.name}`);
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-3 block">Vehicle Delivery Location</Label>
      
      {/* Type Selection Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={deliveryLocationType === 'google_maps' ? "default" : "outline"}
          size="sm"
          onClick={() => handleTypeChange('google_maps')}
          className={`flex items-center gap-2 ${
            deliveryLocationType === 'google_maps' ? "bg-brand-purple hover:bg-brand-purple/90" : ""
          }`}
        >
          <MapPin size={16} />
          Google Maps Link
        </Button>
        <Button
          type="button"
          variant={deliveryLocationType === 'airport' ? "default" : "outline"}
          size="sm"
          onClick={() => handleTypeChange('airport')}
          className={`flex items-center gap-2 ${
            deliveryLocationType === 'airport' ? "bg-brand-purple hover:bg-brand-purple/90" : ""
          }`}
        >
          <Plane size={16} />
          Airport
        </Button>
      </div>

      {/* Google Maps Input */}
      {deliveryLocationType === 'google_maps' && (
        <div>
          <div className="relative">
            <Input
              id="deliveryLocation"
              type="url"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full"
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Share a Google Maps link for vehicle delivery
          </p>
        </div>
      )}

      {/* Airport Selection */}
      {deliveryLocationType === 'airport' && (
        <div>
          <Select value={selectedAirport} onValueChange={handleAirportChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select airport for delivery" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  {airport.code} – {airport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Vehicle will be delivered to the selected airport
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryLocationSelector;
