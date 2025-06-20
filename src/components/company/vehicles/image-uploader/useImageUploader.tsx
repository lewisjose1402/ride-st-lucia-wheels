
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  uploadVehicleImage, 
  addVehicleImage, 
  deleteVehicleImage, 
  setPrimaryVehicleImage 
} from '@/services/vehicleImageService';
import { VehicleImage } from '../VehicleFormTypes';

export const useImageUploader = (
  images: VehicleImage[],
  setImages: React.Dispatch<React.SetStateAction<VehicleImage[]>>,
  vehicleId?: string,
  isEditMode: boolean = false
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be signed in to upload images",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUploadingImages(true);
      
      const files = Array.from(e.target.files);
      console.log(`Uploading ${files.length} files`);
      
      for (const file of files) {
        console.log(`Processing file: ${file.name}`);
        try {
          const imageUrl = await uploadVehicleImage(file);
          console.log(`File uploaded, got URL: ${imageUrl}`);
          
          if (isEditMode && vehicleId) {
            console.log(`Adding image to existing vehicle ${vehicleId}`);
            const imageData = await addVehicleImage(vehicleId, imageUrl, images.length === 0);
            setImages(prev => [...prev, imageData]);
          } else {
            console.log(`Storing image temporarily for new vehicle`);
            // For new vehicles, store the image URLs temporarily
            setImages(prev => [...prev, { image_url: imageUrl, is_primary: prev.length === 0 }]);
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          toast({
            title: `Error uploading ${file.name}`,
            description: fileError instanceof Error ? fileError.message : "Unknown error",
            variant: "destructive",
          });
        }
      }
      
      toast({
        title: "Images uploaded",
        description: "Images have been uploaded successfully",
      });
    } catch (error) {
      console.error("Error in upload process:", error);
      toast({
        title: "Error uploading images",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (index: number, imageId?: string) => {
    try {
      if (isEditMode && imageId) {
        console.log(`Deleting image with ID: ${imageId}`);
        await deleteVehicleImage(imageId);
      }
      
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      
      // If we removed the primary image, set the first image as primary
      if (images[index].is_primary && updatedImages.length > 0) {
        if (isEditMode && vehicleId && updatedImages[0].id) {
          console.log(`Setting new primary image: ${updatedImages[0].id}`);
          await setPrimaryVehicleImage(vehicleId, updatedImages[0].id);
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
      console.error("Error removing image:", error);
      toast({
        title: "Error removing image",
        description: error instanceof Error ? error.message : "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (index: number, imageId: string) => {
    try {
      if (isEditMode && vehicleId) {
        console.log(`Setting primary image ID: ${imageId} for vehicle: ${vehicleId}`);
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
      console.error("Error updating primary image:", error);
      toast({
        title: "Error updating primary image",
        description: error instanceof Error ? error.message : "Failed to update primary image",
        variant: "destructive",
      });
    }
  };

  return {
    uploadingImages,
    handleImageUpload,
    handleRemoveImage,
    handleSetPrimary
  };
};
