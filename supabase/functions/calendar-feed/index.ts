
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.5';
import ical from 'https://esm.sh/ical-generator@6.0.1';

interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: Date;
  end: Date;
}

serve(async (req) => {
  try {
    // Get vehicle ID and token from URL
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    
    // Expected path: /calendar-feed/[vehicle_id]/[token]
    if (parts.length < 4) {
      return new Response('Invalid URL format', { status: 400 });
    }

    const vehicleId = parts[2];
    const token = parts[3];
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify token
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id, name, feed_token, company_id')
      .eq('id', vehicleId)
      .eq('feed_token', token)
      .single();

    if (vehicleError || !vehicle) {
      return new Response('Invalid or expired calendar token', { status: 403 });
    }

    // Get all bookings for this vehicle
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, pickup_date, dropoff_date, status')
      .eq('vehicle_id', vehicleId)
      .not('status', 'eq', 'cancelled');

    if (bookingsError) {
      return new Response('Error fetching booking data', { status: 500 });
    }

    // Get external calendar feeds
    const { data: externalFeeds, error: feedsError } = await supabase
      .from('vehicle_calendar_feeds')
      .select('id, feed_url, feed_name')
      .eq('vehicle_id', vehicleId)
      .eq('is_external', true);

    if (feedsError) {
      return new Response('Error fetching external feeds', { status: 500 });
    }

    // Create calendar
    const calendar = ical({ name: `${vehicle.name} Availability Calendar` });
    calendar.prodId({
      company: 'Caribbean Wheels',
      product: 'Vehicle Calendar',
      language: 'EN'
    });

    // Add bookings to calendar
    if (bookings && bookings.length > 0) {
      bookings.forEach((booking) => {
        if (booking.pickup_date && booking.dropoff_date) {
          calendar.createEvent({
            id: booking.id,
            start: new Date(booking.pickup_date),
            end: new Date(booking.dropoff_date),
            summary: 'Reserved',
            description: `Vehicle booking (${vehicle.name})`,
            busystatus: 'BUSY'
          });
        }
      });
    }

    // Generate ical content
    const icalContent = calendar.toString();
    
    // Return calendar data
    return new Response(icalContent, {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': `attachment; filename="${vehicle.name}-calendar.ics"`,
      },
    });
  } catch (error) {
    console.error('Error generating calendar feed:', error);
    return new Response('Internal server error', { status: 500 });
  }
});
