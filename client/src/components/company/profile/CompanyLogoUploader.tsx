
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CompanyLogoUploaderProps {
  existingLogoUrl: string | null;
  onLogoChange: (url: string) => void;
  companyName: string;
}

const CompanyLogoUploader: React.FC<CompanyLogoUploaderProps> = ({ 
  existingLogoUrl,
  onLogoChange,
  companyName
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(existingLogoUrl);

  // Update local state when prop changes
  useEffect(() => {
    setLogoUrl(existingLogoUrl);
  }, [existingLogoUrl]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `company-logos/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('company-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('company-assets')
        .getPublicUrl(filePath);
      
      const newLogoUrl = urlData.publicUrl;
      
      console.log("Logo uploaded successfully, URL:", newLogoUrl);
      
      // Update both local state and parent component
      setLogoUrl(newLogoUrl);
      onLogoChange(newLogoUrl);
      
      toast({
        title: "Logo uploaded",
        description: "Your company logo has been successfully uploaded",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar className="h-24 w-24 mb-4">
        {logoUrl ? (
          <AvatarImage src={logoUrl} alt={`${companyName} logo`} />
        ) : (
          <AvatarFallback className="bg-brand-purple text-white text-xl">
            {getInitials(companyName || 'Company')}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          size="sm"
          disabled={isUploading}
          className="relative"
          type="button"
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Logo"}
        </Button>
      </div>
    </div>
  );
};

export default CompanyLogoUploader;
