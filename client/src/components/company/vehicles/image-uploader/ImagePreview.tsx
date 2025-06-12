
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  index: number;
  isPrimary: boolean;
  id?: string;
  onSetPrimary: (index: number, imageId: string) => Promise<void>;
  onRemove: (index: number, imageId?: string) => Promise<void>;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  index,
  isPrimary,
  id,
  onSetPrimary,
  onRemove
}) => {
  return (
    <div className="relative border rounded-lg overflow-hidden h-40">
      <img 
        src={imageUrl} 
        alt={`Vehicle image ${index + 1}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-50 text-white p-1 flex justify-between items-center">
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          className={`h-8 px-2 text-white ${isPrimary ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => id && onSetPrimary(index, id)}
          disabled={isPrimary}
        >
          {isPrimary ? (
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
          onClick={() => onRemove(index, id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;
