import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import CompanyLayout from '@/components/company/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  getCompanyProfile,
  getVehicle,
  createVehicle,
  updateVehicle,
  uploadVehicleImage,
  addVehicleImage,
  deleteVehicleImage,
  setPrimaryVehicleImage
} from '@/services/companyService';
import { Car, Upload, Plus, X, Check } from 'lucide-react';

// Define TypeScript interface for form values
interface VehicleFormValues {
  name: string;
  price_per_day: string;
  location: string;
  description: string;
  seats: string;
  transmission: string;
  is_available: boolean;
  features: {
    air_conditioning: boolean;
    bluetooth: boolean;
    gps: boolean;
    usb: boolean;
    child_seat: boolean;
  };
}

const AddEditVehicle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const isEditMode = !!id;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VehicleFormValues>({
    defaultValues: {
      name: '',
      price_per_day: '',
      location: '',
      description: '',
      seats: '',
      transmission: 'automatic',
      is_available: true,
      features: {
        air_conditioning: false,
        bluetooth: false,
        gps: false,
        usb: false,
        child_seat: false
      }
    }
  });

  const features = watch('features');

  useEffect(() => {
    const initializeForm = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const companyProfile = await getCompanyProfile(user.id);
        setCompanyData(companyProfile);
        
        if (isEditMode && id) {
          const vehicleData = await getVehicle(id);
          setVehicle(vehicleData);
          setImages(vehicleData.vehicle_images || []);
          
          // Set form values
          setValue('name', vehicleData.name);
          setValue('price_per_day', vehicleData.price_per_day.toString());
          setValue('location', vehicleData.location);
          setValue('description', vehicleData.description || '');
          setValue('seats', vehicleData.seats.toString());
          setValue('transmission', vehicleData.transmission);
          setValue('is_available', vehicleData.is_available);
          
          // Set features
          if (vehicleData.features) {
            Object.keys(vehicleData.features).forEach((feature) => {
              setValue(`features.${feature as keyof VehicleFormValues['features']}`, 
                vehicleData.features[feature]);
            });
          }
        }
      } catch (error) {
        toast({
          title: isEditMode ? "Error loading vehicle" : "Error initializing form",
          description: "Something went wrong",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeForm();
  }, [user, id, isEditMode, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploadingImages(true);
      
      const files = Array.from(e.target.files);
      
      for (const file of files) {
        const imageUrl = await uploadVehicleImage(file);
        
        if (isEditMode && id) {
          const imageData = await addVehicleImage(id, imageUrl, images.length === 0);
          setImages([...images, imageData]);
        } else {
          // For new vehicles, store the image URLs temporarily
          setImages([...images, { image_url: imageUrl, is_primary: images.length === 0 }]);
        }
      }
      
      toast({
        title: "Images uploaded",
        description: "Images have been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error uploading images",
        description: "Failed to upload images",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (index: number, imageId?: string) => {
    try {
      if (isEditMode && imageId) {
        await deleteVehicleImage(imageId);
      }
      
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      
      // If we removed the primary image, set the first image as primary
      if (images[index].is_primary && updatedImages.length > 0) {
        if (isEditMode && id) {
          await setPrimaryVehicleImage(id, updatedImages[0].id);
          updatedImages[0].is_primary = true;
        } else {
          updatedImages[0].is_primary = true;
        }
      }
      
      setImages(updatedImages);
      
      toast({
        title: "Image removed",
        description: "Image has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error removing image",
        description: "Failed to remove image",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleSetPrimary = async (index: number, imageId: string) => {
    try {
      if (isEditMode && id) {
        await setPrimaryVehicleImage(id, imageId);
      }
      
      const updatedImages = images.map((image, i) => ({
        ...image,
        is_primary: i === index
      }));
      
      setImages(updatedImages);
      
      toast({
        title: "Primary image set",
        description: "Primary image has been updated",
      });
    } catch (error) {
      toast({
        title: "Error updating primary image",
        description: "Failed to update primary image",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const onSubmit = async (data: VehicleFormValues) => {
    if (!companyData) return;
    
    try {
      setIsSubmitting(true);
      
      const vehicleData = {
        ...data,
        company_id: companyData.id,
        price_per_day: parseFloat(data.price_per_day),
        seats: parseInt(data.seats),
        features: data.features
      };
      
      let savedVehicle;
      
      if (isEditMode && id) {
        savedVehicle = await updateVehicle(id, vehicleData);
      } else {
        savedVehicle = await createVehicle(vehicleData);
        
        // Add images for new vehicle
        for (const [index, image] of images.entries()) {
          await addVehicleImage(savedVehicle.id, image.image_url, index === 0);
        }
      }
      
      toast({
        title: isEditMode ? "Vehicle updated" : "Vehicle created",
        description: isEditMode ? "Vehicle has been updated successfully" : "Vehicle has been added successfully",
      });
      
      navigate('/company/vehicles');
    } catch (error) {
      toast({
        title: isEditMode ? "Error updating vehicle" : "Error creating vehicle",
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <CompanyLayout title={isEditMode ? "Edit Vehicle" : "Add New Vehicle"}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout title={isEditMode ? "Edit Vehicle" : "Add New Vehicle"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Vehicle Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Vehicle Images</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden h-40">
                <img 
                  src={image.image_url} 
                  alt={`Vehicle image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-50 text-white p-1 flex justify-between items-center">
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    className={`h-8 px-2 text-white ${image.is_primary ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleSetPrimary(index, image.id)}
                    disabled={image.is_primary}
                  >
                    {image.is_primary ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Primary
                      </>
                    ) : 'Set Primary'}
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:text-red-400"
                    onClick={() => handleRemoveImage(index, image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Upload button */}
            <label className="border border-dashed rounded-lg flex flex-col items-center justify-center h-40 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImages}
              />
              {uploadingImages ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Upload Images</span>
                </>
              )}
            </label>
          </div>
          
          <p className="text-xs text-gray-500">
            Upload high-quality images of your vehicle. The first image will be set as the primary image.
          </p>
        </div>

        {/* Basic Information */}
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
                <p className="text-sm text-red-500">{errors.name.message as string}</p>
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
                <p className="text-sm text-red-500">{errors.price_per_day.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Castries, St. Lucia"
                {...register('location', { required: 'Location is required' })}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seats">Number of Seats</Label>
              <Select
                onValueChange={(value) => setValue('seats', value)}
                defaultValue={vehicle?.seats?.toString() || ''}
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
                <p className="text-sm text-red-500">{errors.seats.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select
                onValueChange={(value) => setValue('transmission', value)}
                defaultValue={vehicle?.transmission || 'automatic'}
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
                <p className="text-sm text-red-500">{errors.transmission.message as string}</p>
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

        {/* Description */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Description</h3>
          
          <div className="space-y-2">
            <Label htmlFor="description">Vehicle Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your vehicle in detail, including special features and conditions..."
              className="min-h-[150px]"
              {...register('description')}
            />
          </div>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Features</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="features.air_conditioning"
                checked={features.air_conditioning}
                onCheckedChange={(checked) => 
                  setValue('features.air_conditioning', checked as boolean)}
              />
              <Label htmlFor="features.air_conditioning" className="font-normal">Air Conditioning</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="features.bluetooth"
                checked={features.bluetooth}
                onCheckedChange={(checked) => 
                  setValue('features.bluetooth', checked as boolean)}
              />
              <Label htmlFor="features.bluetooth" className="font-normal">Bluetooth</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="features.gps"
                checked={features.gps}
                onCheckedChange={(checked) => 
                  setValue('features.gps', checked as boolean)}
              />
              <Label htmlFor="features.gps" className="font-normal">GPS Navigation</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="features.usb"
                checked={features.usb}
                onCheckedChange={(checked) => 
                  setValue('features.usb', checked as boolean)}
              />
              <Label htmlFor="features.usb" className="font-normal">USB Port</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="features.child_seat"
                checked={features.child_seat}
                onCheckedChange={(checked) => 
                  setValue('features.child_seat', checked as boolean)}
              />
              <Label htmlFor="features.child_seat" className="font-normal">Child Seat Compatible</Label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="bg-brand-purple hover:bg-brand-purple-dark" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Car className="mr-2 h-4 w-4" />
                {isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
              </>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/company/vehicles')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </CompanyLayout>
  );
};

export default AddEditVehicle;
