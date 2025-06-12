
import { supabase } from '@/integrations/supabase/client';

export const debugBookingRLS = async () => {
  console.log('=== RLS DEBUG: Checking booking policies ===');
  
  try {
    // Check current auth state
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log('Auth State:', {
      hasSession: !!session,
      hasUser: !!user,
      userId: user?.id || 'none'
    });
    
    // Test read access to bookings
    const { data: bookings, error: selectError } = await supabase
      .from('bookings')
      .select('id, user_id, status')
      .limit(5);
    
    console.log('Read Test:', { 
      success: !selectError, 
      error: selectError?.message,
      bookingsCount: bookings?.length || 0
    });
    
  } catch (error) {
    console.error('RLS Debug Error:', error);
  }
  
  console.log('=== END RLS DEBUG ===');
};
