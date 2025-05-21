
import { supabase } from '@/integrations/supabase/client';

// Upload vehicle image
export const uploadVehicleImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase
    .storage
    .from('vehicle-images')
    .upload(filePath, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrl } = supabase
    .storage
    .from('vehicle-images')
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
};

// Add vehicle image to database
export const addVehicleImage = async (vehicleId: string, imageUrl: string, isPrimary: boolean = false) => {
  const { data, error } = await supabase
    .from('vehicle_images')
    .insert([
      { vehicle_id: vehicleId, image_url: imageUrl, is_primary: isPrimary }
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

// Delete vehicle image
export const deleteVehicleImage = async (id: string) => {
  const { error } = await supabase
    .from('vehicle_images')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

// Set primary vehicle image
export const setPrimaryVehicleImage = async (vehicleId: string, imageId: string) => {
  // First, set all images of this vehicle to non-primary
  const { error: resetError } = await supabase
    .from('vehicle_images')
    .update({ is_primary: false })
    .eq('vehicle_id', vehicleId);

  if (resetError) {
    throw new Error(resetError.message);
  }

  // Then, set the selected image as primary
  const { data, error } = await supabase
    .from('vehicle_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};
