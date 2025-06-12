
import React from 'react';
import { VehicleImage } from '../VehicleFormTypes';
import { useImageUploader } from './useImageUploader';
import VehicleImageGallery from './VehicleImageGallery';

interface VehicleImageUploaderProps {
  images: VehicleImage[];
  setImages: React.Dispatch<React.SetStateAction<VehicleImage[]>>;
  vehicleId?: string;
  isEditMode: boolean;
}

const VehicleImageUploader: React.FC<VehicleImageUploaderProps> = ({ 
  images, 
  setImages, 
  vehicleId, 
  isEditMode 
}) => {
  const {
    uploadingImages,
    handleImageUpload,
    handleRemoveImage,
    handleSetPrimary
  } = useImageUploader(images, setImages, vehicleId, isEditMode);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Vehicle Images</h3>
      
      <VehicleImageGallery
        images={images}
        uploadingImages={uploadingImages}
        onUpload={handleImageUpload}
        onSetPrimary={handleSetPrimary}
        onRemove={handleRemoveImage}
      />
      
      <p className="text-xs text-gray-500">
        Upload high-quality images of your vehicle. The first image will be set as the primary image.
      </p>
    </div>
  );
};

export default VehicleImageUploader;
