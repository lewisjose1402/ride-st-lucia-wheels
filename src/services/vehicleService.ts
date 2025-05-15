
import { supabase } from '@/integrations/supabase/client';

export interface SearchParams {
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  dropoffDate?: string;
  priceRange?: number;
  vehicleType?: string;
  seats?: string;
}

export const fetchFeaturedVehicles = async () => {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      vehicle_images(image_url, is_primary),
      vehicle_types:type_id(name)
    `)
    .eq('is_featured', true)
    .eq('is_available', true)
    .limit(6);

  if (error) {
    console.error('Error fetching featured vehicles:', error);
    throw error;
  }

  return data;
};

export const searchVehicles = async (params: SearchParams) => {
  let query = supabase
    .from('vehicles')
    .select(`
      *,
      vehicle_images(image_url, is_primary),
      vehicle_types:type_id(name)
    `)
    .eq('is_available', true);

  // Filter by price
  if (params.priceRange) {
    query = query.lte('price_per_day', params.priceRange);
  }

  // Filter by vehicle type
  if (params.vehicleType && params.vehicleType !== 'all') {
    // Assuming we have a vehicle_types table with type names
    query = query.eq('vehicle_types.name', params.vehicleType);
  }

  // Filter by number of seats
  if (params.seats && params.seats !== 'all') {
    query = query.eq('seats', parseInt(params.seats));
  }

  // Execute the query
  const { data, error } = await query;

  if (error) {
    console.error('Error searching vehicles:', error);
    throw error;
  }

  return data;
};

export const getVehicleById = async (id: string) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      vehicle_images(image_url, is_primary),
      vehicle_types:type_id(name),
      rental_companies(company_name, phone, email)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching vehicle details:', error);
    throw error;
  }

  return data;
};
