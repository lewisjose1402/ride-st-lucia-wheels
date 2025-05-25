
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

export interface AvailabilityData {
  date: Date;
  status: 'available' | 'booked-ical' | 'blocked-manual';
  reason?: string;
  source?: string;
}

// Get calendar feeds for a vehicle
export const getVehicleCalendarFeeds = async (vehicleId: string): Promise<CalendarFeed[]> => {
  const { data, error } = await supabase
    .from('vehicle_calendar_feeds')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

// Get manual blocks for a vehicle
export const getVehicleManualBlocks = async (vehicleId: string): Promise<CalendarBlock[]> => {
  const { data, error } = await supabase
    .from('vehicle_calendar_blocks')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('start_date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

// Add a manual block
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

// Remove a manual block
export const removeManualBlock = async (blockId: string): Promise<void> => {
  const { error } = await supabase
    .from('vehicle_calendar_blocks')
    .delete()
    .eq('id', blockId);

  if (error) {
    throw new Error(error.message);
  }
};

// Get combined availability data (iCal + manual blocks)
export const getVehicleAvailability = async (vehicleId: string): Promise<AvailabilityData[]> => {
  const manualBlocks = await getVehicleManualBlocks(vehicleId);
  const availabilityData: AvailabilityData[] = [];
  
  // Add manual blocks to availability data
  manualBlocks.forEach(block => {
    const startDate = new Date(block.start_date);
    const endDate = new Date(block.end_date);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      availabilityData.push({
        date: new Date(date),
        status: 'blocked-manual',
        reason: block.reason || 'Manually blocked',
        source: 'manual'
      });
    }
  });

  // TODO: Add iCal feed data processing here when iCal parsing is implemented
  // For now, we'll simulate some booked dates
  const today = new Date();
  const mockBookedDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
  ];
  
  mockBookedDates.forEach(date => {
    availabilityData.push({
      date: new Date(date),
      status: 'booked-ical',
      reason: 'Booked via external calendar',
      source: 'ical'
    });
  });

  return availabilityData;
};

// Check if a date range conflicts with existing bookings
export const checkDateConflicts = async (vehicleId: string, startDate: string, endDate: string): Promise<boolean> => {
  const availability = await getVehicleAvailability(vehicleId);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return availability.some(item => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end && item.status !== 'available';
  });
};

// Add a new external calendar feed
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

// Remove calendar feed
export const deleteCalendarFeed = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('vehicle_calendar_feeds')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

// Sync external calendar feed (would typically be handled by a server cron job)
export const syncExternalCalendarFeed = async (feedId: string): Promise<void> => {
  const { error } = await supabase
    .from('vehicle_calendar_feeds')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('id', feedId);

  if (error) {
    throw new Error(error.message);
  }
};
