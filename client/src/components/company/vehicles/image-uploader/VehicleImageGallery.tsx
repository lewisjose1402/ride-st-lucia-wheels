
import React from 'react';
import ImagePreview from './ImagePreview';
import ImageUploadButton from './ImageUploadButton';
import { VehicleImage } from '../VehicleFormTypes';

interface VehicleImageGalleryProps {
  images: VehicleImage[];
  uploadingImages: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSetPrimary: (index: number, imageId: string) => Promise<void>;
  onRemove: (index: number, imageId?: string) => Promise<void>;
}

const VehicleImageGallery: React.FC<VehicleImageGalleryProps> = ({
  images,
  uploadingImages,
  onUpload,
  onSetPrimary,
  onRemove
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
      {images.map((image, index) => (
        <ImagePreview 
          key={index}
          imageUrl={image.image_url}
          index={index}
          isPrimary={image.is_primary} 
          id={image.id}
          onSetPrimary={onSetPrimary}
          onRemove={onRemove}
        />
      ))}
      
      <ImageUploadButton 
        onUpload={onUpload}
        isUploading={uploadingImages}
      />
    </div>
  );
};

export default VehicleImageGallery;
