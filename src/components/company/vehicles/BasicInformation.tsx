
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getCompanyProfile } from "@/services/companyProfileService";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleFormValues } from "./VehicleFormTypes";
import { Copy } from "lucide-react";

// Constants for constituencies
const CONSTITUENCIES = [
  'Gros Islet',
  'Babonneau',
  'Castries',
  'Anse La Raye / Canaries',
  'Soufrière',
  'Choiseul',
  'Laborie',
  'Vieux Fort',
  'Micoud',
  'Dennery'
];

const BasicInformation = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<VehicleFormValues>();
  const [isLoadingCompanyAddress, setIsLoadingCompanyAddress] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const copyCompanyAddress = async () => {
    if (!user) return;
    
    try {
      setIsLoadingCompanyAddress(true);
      const companyProfile = await getCompanyProfile(user.id);
      
      if (!companyProfile || !companyProfile.address) {
        toast({
          title: "Company address not found",
          description: "Please set your company address in the Company Profile section first.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        const addressObj = JSON.parse(companyProfile.address);
        setValue('street_address', addressObj.street_address || '');
        setValue('constituency', addressObj.constituency || '');
        
        toast({
          title: "Address copied",
          description: "Company address has been applied to this vehicle.",
        });
      } catch (e) {
        // If address is not in JSON format
        setValue('street_address', companyProfile.address || '');
        setValue('constituency', '');
      }
    } catch (error) {
      console.error("Error loading company profile:", error);
      toast({
        title: "Error loading company address",
        description: "Failed to load your company profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCompanyAddress(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Vehicle Name</Label>
          <Input
            id="name"
            placeholder="e.g. Toyota Camry 2022"
            {...register('name', { required: 'Vehicle name is required' })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price_per_day">Price Per Day ($)</Label>
          <Input
            id="price_per_day"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 59.99"
            {...register('price_per_day', { required: 'Price per day is required' })}
          />
          {errors.price_per_day && (
            <p className="text-sm text-red-500">{errors.price_per_day.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="street_address">Street Address</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={copyCompanyAddress}
              disabled={isLoadingCompanyAddress}
              className="text-xs h-6 px-2"
            >
              {isLoadingCompanyAddress ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-brand-purple"></div>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Same as Company Address
                </>
              )}
            </Button>
          </div>
          <Input
            id="street_address"
            placeholder="e.g. 123 Main Street, Castries"
            {...register('street_address', { required: 'Street address is required' })}
          />
          {errors.street_address && (
            <p className="text-sm text-red-500">{errors.street_address.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="constituency">Constituency</Label>
          <Select
            onValueChange={(value) => setValue('constituency', value)}
            value={watch('constituency')}
          >
            <SelectTrigger id="constituency">
              <SelectValue placeholder="Select constituency" />
            </SelectTrigger>
            <SelectContent>
              {CONSTITUENCIES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.constituency && (
            <p className="text-sm text-red-500">{errors.constituency.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seats">Number of Seats</Label>
          <Select
            onValueChange={(value) => setValue('seats', value)}
            value={watch('seats')}
          >
            <SelectTrigger id="seats">
              <SelectValue placeholder="Select number of seats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 seats</SelectItem>
              <SelectItem value="4">4 seats</SelectItem>
              <SelectItem value="5">5 seats</SelectItem>
              <SelectItem value="7">7 seats</SelectItem>
              <SelectItem value="9">9+ seats</SelectItem>
            </SelectContent>
          </Select>
          {errors.seats && (
            <p className="text-sm text-red-500">{errors.seats.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select
            onValueChange={(value) => setValue('transmission', value)}
            value={watch('transmission')}
          >
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Select transmission type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
          {errors.transmission && (
            <p className="text-sm text-red-500">{errors.transmission.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label className="mb-2">Availability</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_available"
              checked={watch('is_available')}
              onCheckedChange={(checked) => setValue('is_available', checked as boolean)}
            />
            <Label htmlFor="is_available" className="font-normal">
              This vehicle is available for booking
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
