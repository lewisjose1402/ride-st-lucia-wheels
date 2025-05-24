
import { useState, useEffect } from 'react';

interface VehicleImageGalleryProps {
  vehicle: any;
}

const VehicleImageGallery = ({ vehicle }: VehicleImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState('');
  const images = vehicle.vehicle_images || [];

  useEffect(() => {
    if (images.length > 0) {
      const primaryImage = images.find((img: any) => img.is_primary);
      setSelectedImage(primaryImage?.image_url || images[0]?.image_url || '/placeholder.svg');
    }
  }, [images]);

  return (
    <div className="mb-8">
      {selectedImage && (
        <div className="w-full h-[300px] md:h-[400px] bg-white rounded-lg overflow-hidden mb-2">
          <img 
            src={selectedImage} 
            alt={vehicle.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image: any, index: number) => (
            <div 
              key={image.id} 
              className={`h-16 md:h-24 bg-white rounded overflow-hidden cursor-pointer
                ${selectedImage === image.image_url ? 'ring-2 ring-brand-purple' : ''}`}
              onClick={() => setSelectedImage(image.image_url)}
            >
              <img 
                src={image.image_url} 
                alt={`${vehicle.name} view ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleImageGallery;
