
import { supabase } from '@/integrations/supabase/client';

export const debugBookingRLS = async () => {
  console.log('=== DEBUGGING BOOKING RLS POLICIES ===');
  
  try {
    // Test 1: Check current auth state
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log('Current session:', !!session);
    console.log('Current user:', !!user);
    console.log('User ID:', user?.id || 'null');
    
    // Test 2: Try a simple select to see if we can read from bookings
    const { data: selectTest, error: selectError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);
    
    console.log('Select test result:', { selectTest, selectError });
    
    // Test 3: Try inserting a minimal test booking (we'll delete it after)
    const testBookingData = {
      vehicle_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      user_id: null, // Explicit null for anonymous
      pickup_date: new Date().toISOString(),
      dropoff_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      pickup_location: 'Test',
      dropoff_location: 'Test',
      driver_name: 'Test User',
      driver_age: 25,
      has_international_license: false,
      total_price: 100,
      deposit_amount: 12,
      status: 'pending' as const
    };
    
    console.log('Attempting test insert with data:', testBookingData);
    
    const { data: insertTest, error: insertError } = await supabase
      .from('bookings')
      .insert(testBookingData)
      .select()
      .single();
    
    console.log('Insert test result:', { insertTest, insertError });
    
    // If successful, clean up the test booking
    if (insertTest?.id) {
      console.log('Cleaning up test booking...');
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', insertTest.id);
      console.log('Delete test result:', { deleteError });
    }
    
  } catch (error) {
    console.error('Error in RLS debug:', error);
  }
  
  console.log('=== END BOOKING RLS DEBUG ===');
};
