
import { supabase } from '@/integrations/supabase/client';

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
