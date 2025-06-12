
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
  
  // First, verify the vehicle belongs to the user's company
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('vehicles')
    .select('company_id')
    .eq('id', vehicleId)
    .single();
    
  if (vehicleError) {
    console.error("Error verifying vehicle ownership:", vehicleError);
    throw new Error("Failed to verify vehicle ownership. " + vehicleError.message);
  }
  
  if (!vehicleData) {
    throw new Error("Vehicle not found or you don't have permission to access it.");
  }
  
  // Now insert the vehicle image with the verified vehicle_id
  const { data, error } = await supabase
    .from('vehicle_images')
    .insert([
      { vehicle_id: vehicleId, image_url: imageUrl, is_primary: isPrimary }
    ])
    .select();

  if (error) {
    console.error("Error adding vehicle image:", error);
    throw new Error("Failed to add vehicle image. " + error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("No data returned from vehicle image creation");
  }

  console.log("Image added to database:", data[0]);
  return data[0];
};

// Delete vehicle image
export const deleteVehicleImage = async (id: string) => {
  console.log("Deleting vehicle image:", id);
  
  // First get the image to verify ownership
  const { data: imageData, error: getError } = await supabase
    .from('vehicle_images')
    .select('vehicle_id')
    .eq('id', id)
    .single();
    
  if (getError) {
    console.error("Error getting vehicle image:", getError);
    throw new Error("Failed to verify image ownership. " + getError.message);
  }
  
  if (!imageData) {
    throw new Error("Image not found or you don't have permission to delete it.");
  }
  
  // Delete the image
  const { error } = await supabase
    .from('vehicle_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting vehicle image:", error);
    throw new Error("Failed to delete vehicle image. " + error.message);
  }

  console.log("Vehicle image deleted successfully");
  return true;
};

// Set primary vehicle image
export const setPrimaryVehicleImage = async (vehicleId: string, imageId: string) => {
  console.log("Setting primary image for vehicle:", vehicleId, "Image ID:", imageId);
  
  // First verify the vehicle belongs to the user's company
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('vehicles')
    .select('company_id')
    .eq('id', vehicleId)
    .single();
    
  if (vehicleError) {
    console.error("Error verifying vehicle ownership:", vehicleError);
    throw new Error("Failed to verify vehicle ownership. " + vehicleError.message);
  }
  
  // First, set all images of this vehicle to non-primary
  const { error: resetError } = await supabase
    .from('vehicle_images')
    .update({ is_primary: false })
    .eq('vehicle_id', vehicleId);

  if (resetError) {
    console.error("Error resetting primary images:", resetError);
    throw new Error("Failed to reset primary images. " + resetError.message);
  }

  // Then, set the selected image as primary
  const { data, error } = await supabase
    .from('vehicle_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .select();

  if (error) {
    console.error("Error setting primary image:", error);
    throw new Error("Failed to set primary image. " + error.message);
  }

  console.log("Primary image updated:", data[0]);
  return data[0];
};
