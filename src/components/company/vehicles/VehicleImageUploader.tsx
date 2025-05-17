
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Check, Upload, X } from 'lucide-react';
import { 
  uploadVehicleImage, 
  addVehicleImage, 
  deleteVehicleImage, 
  setPrimaryVehicleImage 
} from '@/services/companyService';
import { VehicleImage } from './VehicleFormTypes';

interface VehicleImageUploaderProps {
  images: VehicleImage[];
  setImages: React.Dispatch<React.SetStateAction<VehicleImage[]>>;
  vehicleId?: string;
  isEditMode: boolean;
}

const VehicleImageUploader = ({ 
  images, 
  setImages, 
  vehicleId, 
  isEditMode 
}: VehicleImageUploaderProps) => {
  const { toast } = useToast();
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploadingImages(true);
      
      const files = Array.from(e.target.files);
      
      for (const file of files) {
        const imageUrl = await uploadVehicleImage(file);
        
        if (isEditMode && vehicleId) {
          const imageData = await addVehicleImage(vehicleId, imageUrl, images.length === 0);
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
        if (isEditMode && vehicleId) {
          await setPrimaryVehicleImage(vehicleId, updatedImages[0].id!);
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
      if (isEditMode && vehicleId) {
        await setPrimaryVehicleImage(vehicleId, imageId);
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

  return (
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
                onClick={() => image.id && handleSetPrimary(index, image.id)}
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
  );
};

export default VehicleImageUploader;
