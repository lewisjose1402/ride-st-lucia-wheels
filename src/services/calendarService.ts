
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
