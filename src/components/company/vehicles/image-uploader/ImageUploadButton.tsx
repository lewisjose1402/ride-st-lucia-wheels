
import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadButtonProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  onUpload,
  isUploading
}) => {
  return (
    <label className="border border-dashed rounded-lg flex flex-col items-center justify-center h-40 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={onUpload}
        disabled={isUploading}
      />
      {isUploading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      ) : (
        <>
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Upload Images</span>
        </>
      )}
    </label>
  );
};

export default ImageUploadButton;
