
import { Upload, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface DriverInfoFieldsProps {
  driverLicense: File | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  driverAge: string;
  setDriverAge: (value: string) => void;
  drivingExperience: string;
  setDrivingExperience: (value: string) => void;
  deliveryLocation: string;
  setDeliveryLocation: (value: string) => void;
  isInternationalLicense: boolean;
  setIsInternationalLicense: (value: boolean) => void;
}

const DriverInfoFields = ({
  driverLicense,
  handleFileUpload,
  driverAge,
  setDriverAge,
  drivingExperience,
  setDrivingExperience,
  deliveryLocation,
  setDeliveryLocation,
  isInternationalLicense,
  setIsInternationalLicense
}: DriverInfoFieldsProps) => {
  return (
    <>
      {/* Driver's License Upload */}
      <div>
        <Label htmlFor="driverLicense">Driver's License</Label>
        <div className="relative mt-1">
          <Input
            id="driverLicense"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="w-full"
          />
          <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
        {driverLicense && (
          <p className="text-sm text-green-600 mt-1">
            ✓ {driverLicense.name}
          </p>
        )}
      </div>

      {/* International License Question */}
      <div>
        <Label className="text-sm font-medium">Is this an international driver's license?</Label>
        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            variant={isInternationalLicense ? "default" : "outline"}
            size="sm"
            onClick={() => setIsInternationalLicense(true)}
            className={isInternationalLicense ? "bg-brand-purple hover:bg-brand-purple/90" : ""}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={!isInternationalLicense ? "default" : "outline"}
            size="sm"
            onClick={() => setIsInternationalLicense(false)}
            className={!isInternationalLicense ? "bg-brand-purple hover:bg-brand-purple/90" : ""}
          >
            No
          </Button>
        </div>
      </div>

      {/* Driver Information */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="driverAge">Driver's Age</Label>
          <Input
            id="driverAge"
            type="number"
            value={driverAge}
            onChange={(e) => setDriverAge(e.target.value)}
            placeholder="25"
            min="18"
            max="100"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="drivingExperience">Years of Experience</Label>
          <Input
            id="drivingExperience"
            type="number"
            value={drivingExperience}
            onChange={(e) => setDrivingExperience(e.target.value)}
            placeholder="5"
            min="0"
            max="50"
            className="mt-1"
          />
        </div>
      </div>

      {/* Delivery Location */}
      <div>
        <Label htmlFor="deliveryLocation">Vehicle Delivery Location</Label>
        <div className="relative mt-1">
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
    </>
  );
};

export default DriverInfoFields;
