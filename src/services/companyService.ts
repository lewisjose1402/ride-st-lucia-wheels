import { supabase } from '@/integrations/supabase/client';

// Get company profile by user ID
export const getCompanyProfile = async (userId: string) => {
  // Use select() without single() to avoid errors when multiple or no records are found
  const { data, error } = await supabase
    .from('rental_companies')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching company profile:", error);
    throw new Error(error.message);
  }

  // Return the first company record or null
  return data && data.length > 0 ? data[0] : null;
};

// Update company profile
export const updateCompanyProfile = async (userId: string, companyData: any) => {
  console.log("Updating company profile with data:", companyData);
  
  const { data, error } = await supabase
    .from('rental_companies')
    .update(companyData)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error("Error updating company profile:", error);
    throw new Error(error.message);
  }

  return data && data.length > 0 ? data[0] : null;
};

// Create company profile if it doesn't exist
export const createCompanyProfile = async (userId: string, companyData: any) => {
  console.log("Creating company profile with data:", companyData);
  
  const { data, error } = await supabase
    .from('rental_companies')
    .insert([{ ...companyData, user_id: userId }])
    .select();

  if (error) {
    console.error("Error creating company profile:", error);
    throw new Error(error.message);
  }

  return data && data.length > 0 ? data[0] : null;
};

// Get company vehicles
export const getCompanyVehicles = async (companyId: string) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      vehicle_images(*)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Get single vehicle
export const getVehicle = async (id: string) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      vehicle_images(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Create new vehicle
export const createVehicle = async (vehicleData: any) => {
  const { data, error } = await supabase
    .from('vehicles')
    .insert([vehicleData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

// Update vehicle
export const updateVehicle = async (id: string, vehicleData: any) => {
  const { data, error } = await supabase
    .from('vehicles')
    .update(vehicleData)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

// Delete vehicle
export const deleteVehicle = async (id: string) => {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

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
