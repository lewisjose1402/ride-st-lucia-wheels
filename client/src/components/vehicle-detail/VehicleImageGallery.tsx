
import { useState, useEffect } from 'react';

interface VehicleImageGalleryProps {
  vehicle: any;
}

const VehicleImageGallery = ({ vehicle }: VehicleImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const images = vehicle.vehicle_images || [];

  useEffect(() => {
    if (images.length > 0) {
      const primaryImage = images.find((img: any) => img.is_primary);
      const defaultImage = primaryImage?.image_url || images[0]?.image_url || '/placeholder.svg';
      setSelectedImage(defaultImage);
    }
  }, [images]);

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl));
    // If the selected image fails to load, switch to placeholder
    if (selectedImage === imageUrl) {
      setSelectedImage('/placeholder.svg');
    }
  };

  const getImageSrc = (imageUrl: string) => {
    return imageErrors.has(imageUrl) ? '/placeholder.svg' : imageUrl;
  };

  return (
    <div className="mb-8">
      {selectedImage && (
        <div className="w-full h-[300px] md:h-[400px] bg-white rounded-lg overflow-hidden mb-2">
          <img 
            src={getImageSrc(selectedImage)} 
            alt={vehicle.name} 
            className="w-full h-full object-cover"
            onError={() => handleImageError(selectedImage)}
            loading="lazy"
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
                src={getImageSrc(image.image_url)} 
                alt={`${vehicle.name} view ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={() => handleImageError(image.image_url)}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleImageGallery;
