
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Updating RLS policies for public calendar access...')

    // Update RLS policies to allow public read access to calendar data
    const { error: policyError } = await supabaseClient.rpc('exec', {
      query: `
        -- Allow public read access to vehicle calendar blocks
        DROP POLICY IF EXISTS "Public can view vehicle calendar blocks" ON public.vehicle_calendar_blocks;
        CREATE POLICY "Public can view vehicle calendar blocks" 
          ON public.vehicle_calendar_blocks 
          FOR SELECT 
          TO public
          USING (true);

        -- Allow public read access to ical bookings  
        DROP POLICY IF EXISTS "Public can view ical bookings" ON public.ical_bookings;
        CREATE POLICY "Public can view ical bookings" 
          ON public.ical_bookings 
          FOR SELECT 
          TO public
          USING (true);

        -- Allow public read access to vehicle calendar feeds
        DROP POLICY IF EXISTS "Public can view vehicle calendar feeds" ON public.vehicle_calendar_feeds;
        CREATE POLICY "Public can view vehicle calendar feeds" 
          ON public.vehicle_calendar_feeds 
          FOR SELECT 
          TO public
          USING (true);
      `
    })

    if (policyError) {
      console.error('Policy update error:', policyError)
      throw new Error(`Failed to update policies: ${policyError.message}`)
    }

    console.log('RLS policies updated successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Calendar policies updated for public access' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error updating calendar policies:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
