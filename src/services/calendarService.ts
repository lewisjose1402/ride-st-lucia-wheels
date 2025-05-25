
import { supabase } from '@/integrations/supabase/client';

export interface CalendarFeed {
  id: string;
  vehicle_id: string;
  feed_name: string;
  feed_url: string;
  description: string | null;
  is_external: boolean;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarBlock {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICalBooking {
  id: string;
  vehicle_id: string;
  external_event_id: string;
  start_date: string;
  end_date: string;
  summary: string | null;
  source_feed_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityData {
  date: Date;
  status: 'available' | 'booked-ical' | 'blocked-manual';
  reason?: string;
  source?: string;
  blockId?: string;
  feedName?: string;
}

// Get calendar feeds for a vehicle (public access)
export const getVehicleCalendarFeeds = async (vehicleId: string): Promise<CalendarFeed[]> => {
  console.log('Fetching calendar feeds for vehicle:', vehicleId);
  
  // Create a new supabase client without auth for public access
  const { data, error } = await supabase
    .from('vehicle_calendar_feeds')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching calendar feeds:', error);
    return []; // Return empty array instead of throwing for public access
  }

  console.log('Calendar feeds fetched:', data?.length || 0);
  return data || [];
};

// Get manual blocks for a vehicle (public access)
export const getVehicleManualBlocks = async (vehicleId: string): Promise<CalendarBlock[]> => {
  console.log('Fetching manual blocks for vehicle:', vehicleId);
  
  const { data, error } = await supabase
    .from('vehicle_calendar_blocks')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching manual blocks:', error);
    return []; // Return empty array instead of throwing for public access
  }

  console.log('Manual blocks fetched:', data?.length || 0);
  return data || [];
};

// Get iCal bookings for a vehicle (public access)
export const getVehicleICalBookings = async (vehicleId: string): Promise<ICalBooking[]> => {
  console.log('Fetching iCal bookings for vehicle:', vehicleId);
  
  const { data, error } = await supabase
    .from('ical_bookings')
    .select(`
      *,
      vehicle_calendar_feeds(feed_name)
    `)
    .eq('vehicle_id', vehicleId)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching iCal bookings:', error);
    return []; // Return empty array instead of throwing for public access
  }

  console.log('iCal bookings fetched:', data?.length || 0);
  return data || [];
};

// Get combined availability data (iCal + manual blocks) - public access
export const getVehicleAvailability = async (vehicleId: string): Promise<AvailabilityData[]> => {
  console.log('Getting vehicle availability for:', vehicleId);
  
  try {
    const [manualBlocks, icalBookings] = await Promise.all([
      getVehicleManualBlocks(vehicleId),
      getVehicleICalBookings(vehicleId)
    ]);
    
    console.log('Raw data - Manual blocks:', manualBlocks.length, 'iCal bookings:', icalBookings.length);
    
    const availabilityData: AvailabilityData[] = [];
    
    // Add manual blocks to availability data
    manualBlocks.forEach(block => {
      const startDate = new Date(block.start_date);
      const endDate = new Date(block.end_date);
      
      console.log('Processing manual block:', block.start_date, 'to', block.end_date);
      
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        availabilityData.push({
          date: new Date(date),
          status: 'blocked-manual',
          reason: block.reason || 'Manually blocked',
          source: 'manual',
          blockId: block.id
        });
      }
    });

    // Add iCal bookings to availability data
    icalBookings.forEach(booking => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      const feedName = (booking as any).vehicle_calendar_feeds?.feed_name || 'External Calendar';
      
      console.log('Processing iCal booking:', booking.start_date, 'to', booking.end_date);
      
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        availabilityData.push({
          date: new Date(date),
          status: 'booked-ical',
          reason: booking.summary || 'External booking',
          source: 'ical',
          feedName: feedName
        });
      }
    });

    console.log('Final availability data:', availabilityData.length, 'blocked dates');
    return availabilityData;
  } catch (error) {
    console.error('Error fetching vehicle availability:', error);
    return []; // Return empty array for public access on error
  }
};

// Check if a date range conflicts with existing bookings (public access)
export const checkDateConflicts = async (vehicleId: string, startDate: string, endDate: string): Promise<boolean> => {
  try {
    const availability = await getVehicleAvailability(vehicleId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return availability.some(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end && item.status !== 'available';
    });
  } catch (error) {
    console.error('Error checking date conflicts:', error);
    return false; // Assume no conflicts on error for public access
  }
};

// --- AUTHENTICATED FUNCTIONS BELOW ---
// These require authentication and are for rental company management

// Add a manual block (requires auth)
export const addManualBlock = async (blockData: {
  vehicle_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
}): Promise<CalendarBlock> => {
  const { data, error } = await supabase
    .from('vehicle_calendar_blocks')
    .insert([{
      ...blockData,
      created_by_user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Get manual block by date (requires auth)
export const getManualBlockByDate = async (vehicleId: string, date: Date): Promise<CalendarBlock | null> => {
  const dateString = date.toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('vehicle_calendar_blocks')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .lte('start_date', dateString)
    .gte('end_date', dateString)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No block found
    }
    throw new Error(error.message);
  }

  return data;
};

// Remove a manual block (requires auth)
export const removeManualBlock = async (blockId: string): Promise<void> => {
  const { error } = await supabase
    .from('vehicle_calendar_blocks')
    .delete()
    .eq('id', blockId);

  if (error) {
    throw new Error(error.message);
  }
};

// Clear all manual blocks for a vehicle (requires auth)
export const clearAllManualBlocks = async (vehicleId: string): Promise<void> => {
  const { error } = await supabase
    .from('vehicle_calendar_blocks')
    .delete()
    .eq('vehicle_id', vehicleId);

  if (error) {
    throw new Error(error.message);
  }
};

// Clear all manual blocks for all vehicles of a company (requires auth)
export const clearAllCompanyManualBlocks = async (): Promise<void> => {
  // Get current user
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    throw new Error('User not authenticated');
  }

  // Get company ID for the current user
  const { data: company } = await supabase
    .from('rental_companies')
    .select('id')
    .eq('user_id', user.user.id)
    .single();

  if (!company) {
    throw new Error('Company not found');
  }

  // Get all vehicles for this company
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id')
    .eq('company_id', company.id);

  if (!vehicles) return;

  // Delete all manual blocks for all company vehicles
  const vehicleIds = vehicles.map(v => v.id);
  
  if (vehicleIds.length > 0) {
    const { error } = await supabase
      .from('vehicle_calendar_blocks')
      .delete()
      .in('vehicle_id', vehicleIds);

    if (error) {
      throw new Error(error.message);
    }
  }
};

// Sync external calendar feed (requires auth)
export const syncExternalCalendarFeed = async (feedId: string, vehicleId: string): Promise<void> => {
  const { error } = await supabase.functions.invoke('parse-ical-feeds', {
    body: { feedId, vehicleId }
  });

  if (error) {
    throw new Error(error.message);
  }
};

// Add a new external calendar feed (requires auth)
export const addExternalCalendarFeed = async (feedData: {
  vehicle_id: string;
  feed_name: string;
  feed_url: string;
  description?: string;
}): Promise<CalendarFeed> => {
  const { data, error } = await supabase
    .from('vehicle_calendar_feeds')
    .insert([{
      ...feedData,
      is_external: true
    }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Remove calendar feed (requires auth)
export const deleteCalendarFeed = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('vehicle_calendar_feeds')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};
