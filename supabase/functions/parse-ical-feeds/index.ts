
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ICalEvent {
  uid: string
  dtstart: string
  dtend: string
  summary: string
}

function parseICalData(icalText: string): ICalEvent[] {
  const events: ICalEvent[] = []
  const lines = icalText.split('\n').map(line => line.trim())
  
  let currentEvent: Partial<ICalEvent> = {}
  let inEvent = false
  
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true
      currentEvent = {}
    } else if (line === 'END:VEVENT' && inEvent) {
      if (currentEvent.uid && currentEvent.dtstart && currentEvent.dtend) {
        events.push(currentEvent as ICalEvent)
      }
      inEvent = false
    } else if (inEvent) {
      if (line.startsWith('UID:')) {
        currentEvent.uid = line.substring(4)
      } else if (line.startsWith('DTSTART:') || line.startsWith('DTSTART;')) {
        const dateValue = line.split(':')[1]
        currentEvent.dtstart = dateValue
      } else if (line.startsWith('DTEND:') || line.startsWith('DTEND;')) {
        const dateValue = line.split(':')[1]
        currentEvent.dtend = dateValue
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8)
      }
    }
  }
  
  return events
}

function parseICalDate(dateStr: string): Date {
  // Handle both DATE and DATETIME formats
  if (dateStr.includes('T')) {
    // DATETIME format: 20231215T120000Z
    const cleaned = dateStr.replace(/[TZ]/g, '').substring(0, 8)
    return new Date(
      parseInt(cleaned.substring(0, 4)),
      parseInt(cleaned.substring(4, 6)) - 1,
      parseInt(cleaned.substring(6, 8))
    )
  } else {
    // DATE format: 20231215
    return new Date(
      parseInt(dateStr.substring(0, 4)),
      parseInt(dateStr.substring(4, 6)) - 1,
      parseInt(dateStr.substring(6, 8))
    )
  }
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

    const { vehicleId, feedId } = await req.json()

    console.log(`Parsing iCal feed for vehicle ${vehicleId}, feed ${feedId}`)

    // Get the feed URL
    const { data: feed, error: feedError } = await supabaseClient
      .from('vehicle_calendar_feeds')
      .select('feed_url, feed_name')
      .eq('id', feedId)
      .single()

    if (feedError || !feed) {
      throw new Error(`Feed not found: ${feedError?.message}`)
    }

    // Fetch iCal data
    const icalResponse = await fetch(feed.feed_url)
    if (!icalResponse.ok) {
      throw new Error(`Failed to fetch iCal data: ${icalResponse.statusText}`)
    }

    const icalText = await icalResponse.text()
    console.log(`Fetched iCal data, length: ${icalText.length}`)

    // Parse iCal events
    const events = parseICalData(icalText)
    console.log(`Parsed ${events.length} events`)

    // Clear existing bookings for this feed
    await supabaseClient
      .from('ical_bookings')
      .delete()
      .eq('source_feed_id', feedId)

    // Insert new bookings
    const bookingsToInsert = events.map(event => {
      const startDate = parseICalDate(event.dtstart)
      const endDate = parseICalDate(event.dtend)
      
      return {
        vehicle_id: vehicleId,
        external_event_id: event.uid,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        summary: event.summary || 'External Booking',
        source_feed_id: feedId
      }
    })

    if (bookingsToInsert.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('ical_bookings')
        .insert(bookingsToInsert)

      if (insertError) {
        throw new Error(`Failed to insert bookings: ${insertError.message}`)
      }
    }

    // Update feed sync timestamp
    await supabaseClient
      .from('vehicle_calendar_feeds')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', feedId)

    console.log(`Successfully processed ${bookingsToInsert.length} bookings`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: bookingsToInsert.length,
        feedName: feed.feed_name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error parsing iCal feed:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
