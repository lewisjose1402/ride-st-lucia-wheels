
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

// Generate or refresh calendar feed token
export const generateCalendarFeedToken = async (vehicleId: string) => {
  const { data, error } = await supabase
    .from('vehicles')
    .update({ feed_token: undefined }) // Set to undefined first to trigger the DEFAULT
    .eq('id', vehicleId)
    .select('feed_token');

  if (error) {
    throw new Error(error.message);
  }

  // If no feed token was generated, generate one explicitly
  if (!data?.[0]?.feed_token) {
    // Generate a UUID for the feed token
    const { data: updateData, error: updateError } = await supabase
      .rpc('generate_uuid_v4')
      .select('uuid')
      .single();
      
    if (updateError) {
      throw new Error(updateError.message);
    }
    
    // Update the vehicle with the new feed token
    const { data: tokenData, error: tokenError } = await supabase
      .from('vehicles')
      .update({ feed_token: updateData.uuid })
      .eq('id', vehicleId)
      .select('feed_token');
      
    if (tokenError) {
      throw new Error(tokenError.message);
    }
    
    return tokenData?.[0]?.feed_token;
  }

  return data?.[0]?.feed_token;
};

// Get vehicle calendar feed URL
export const getVehicleCalendarFeedUrl = async (vehicleId: string) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('id, feed_token')
    .eq('id', vehicleId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.feed_token) {
    const token = await generateCalendarFeedToken(vehicleId);
    return `${window.location.origin}/api/calendar/${vehicleId}/${token}`;
  }

  return `${window.location.origin}/api/calendar/${vehicleId}/${data.feed_token}`;
};
