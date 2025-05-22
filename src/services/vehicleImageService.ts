
import { supabase } from '@/integrations/supabase/client';

// Upload vehicle image
export const uploadVehicleImage = async (file: File) => {
  console.log("Uploading file:", file.name, "size:", file.size);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { data, error } = await supabase
      .storage
      .from('vehicle-images')
      .upload(filePath, file);

    if (error) {
      console.error("Storage upload error:", error);
      throw new Error(error.message);
    }

    console.log("File uploaded successfully:", data);

    const { data: publicUrl } = supabase
      .storage
      .from('vehicle-images')
      .getPublicUrl(filePath);

    console.log("Public URL generated:", publicUrl);
    return publicUrl.publicUrl;
  } catch (error) {
    console.error("Unexpected error during upload:", error);
    throw error;
  }
};

// Add vehicle image to database
export const addVehicleImage = async (vehicleId: string, imageUrl: string, isPrimary: boolean = false) => {
  console.log("Adding image to vehicle:", vehicleId, "URL:", imageUrl, "isPrimary:", isPrimary);
  
  const { data, error } = await supabase
    .from('vehicle_images')
    .insert([
      { vehicle_id: vehicleId, image_url: imageUrl, is_primary: isPrimary }
    ])
    .select();

  if (error) {
    console.error("Error adding vehicle image:", error);
    throw new Error(error.message);
  }

  console.log("Image added to database:", data[0]);
  return data[0];
};

// Delete vehicle image
export const deleteVehicleImage = async (id: string) => {
  console.log("Deleting vehicle image:", id);
  
  const { error } = await supabase
    .from('vehicle_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting vehicle image:", error);
    throw new Error(error.message);
  }

  console.log("Vehicle image deleted successfully");
  return true;
};

// Set primary vehicle image
export const setPrimaryVehicleImage = async (vehicleId: string, imageId: string) => {
  console.log("Setting primary image for vehicle:", vehicleId, "Image ID:", imageId);
  
  // First, set all images of this vehicle to non-primary
  const { error: resetError } = await supabase
    .from('vehicle_images')
    .update({ is_primary: false })
    .eq('vehicle_id', vehicleId);

  if (resetError) {
    console.error("Error resetting primary images:", resetError);
    throw new Error(resetError.message);
  }

  // Then, set the selected image as primary
  const { data, error } = await supabase
    .from('vehicle_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .select();

  if (error) {
    console.error("Error setting primary image:", error);
    throw new Error(error.message);
  }

  console.log("Primary image updated:", data[0]);
  return data[0];
};
