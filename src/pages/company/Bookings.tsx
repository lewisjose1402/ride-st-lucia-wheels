
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import CompanyLayout from '@/components/company/CompanyLayout';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Calendar, User, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Booking {
  id: string;
  driver_name: string;
  pickup_date: string;
  dropoff_date: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
  total_price: number;
  vehicle: {
    name: string;
  };
}

const CompanyBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // First get the company ID from rental_companies table
        const { data: companyData, error: companyError } = await supabase
          .from('rental_companies')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (companyError || !companyData) {
          console.error("Error fetching company:", companyError);
          toast({
            title: "Error",
            description: "Could not find your company details",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
          
        // Then get bookings for vehicles owned by this company
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            vehicle:vehicles(name)
          `)
          .eq('vehicles.company_id', companyData.id);
        
        if (error) {
          console.error("Error fetching bookings:", error);
          toast({
            title: "Error loading bookings",
            description: "Failed to load booking data",
            variant: "destructive",
          });
        } else {
          setBookings(data || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, toast]);

  return (
    <CompanyLayout title="Bookings">
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Your Bookings</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No bookings yet</h3>
              <p className="text-gray-500 mt-1">
                When customers book your vehicles, they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-500 mr-2" />
                          {booking.driver_name}
                        </div>
                      </TableCell>
                      <TableCell>{booking.vehicle?.name || "Unknown Vehicle"}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>From: {new Date(booking.pickup_date).toLocaleDateString()}</p>
                          <p>To: {new Date(booking.dropoff_date).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.pickup_location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>${booking.total_price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </CompanyLayout>
  );
};

export default CompanyBookings;
