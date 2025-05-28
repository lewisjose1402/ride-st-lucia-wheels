
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
import { Button } from '@/components/ui/button';
import { Calendar, User, MapPin, Eye, Download, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';

interface Booking {
  id: string;
  created_at: string;
  pickup_date: string;
  dropoff_date: string;
  driver_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  driver_age: number;
  driving_experience?: number;
  has_international_license: boolean;
  delivery_location?: string;
  driver_license_url?: string;
  pickup_location: string;
  dropoff_location: string;
  total_price: number;
  deposit_amount: number;
  status: string;
  payment_status: string;
  confirmation_fee_paid: number;
  vehicle_name: string;
  company_name?: string;
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
          
        // Then get bookings for vehicles owned by this company with all details
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            created_at,
            pickup_date,
            dropoff_date,
            driver_name,
            first_name,
            last_name,
            email,
            phone_number,
            driver_age,
            driving_experience,
            has_international_license,
            delivery_location,
            driver_license_url,
            pickup_location,
            dropoff_location,
            total_price,
            deposit_amount,
            status,
            payment_status,
            confirmation_fee_paid,
            vehicle:vehicles!inner(
              name,
              company_id,
              rental_companies!vehicles_company_id_fkey(company_name)
            )
          `)
          .eq('vehicle.company_id', companyData.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching bookings:", error);
          toast({
            title: "Error loading bookings",
            description: "Failed to load booking data",
            variant: "destructive",
          });
        } else {
          // Transform the data to match our interface
          const transformedBookings = (data || []).map(booking => ({
            ...booking,
            vehicle_name: booking.vehicle.name,
            company_name: booking.vehicle.rental_companies?.company_name
          }));
          setBookings(transformedBookings);
          console.log('Company bookings loaded:', transformedBookings);
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

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' && status === 'confirmed') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Confirmed
        </span>
      );
    } else if (paymentStatus === 'failed') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Payment Failed
        </span>
      );
    } else if (status === 'cancelled') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Cancelled
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
  };

  const viewDriverLicense = async (url: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'driver-licenses');
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        const filePath = urlParts.slice(bucketIndex + 1).join('/');
        
        // Get the signed URL for viewing
        const { data, error } = await supabase.storage
          .from('driver-licenses')
          .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
        
        if (error) {
          console.error('Error creating signed URL:', error);
          // Fallback to original URL
          window.open(url, '_blank');
        } else if (data) {
          window.open(data.signedUrl, '_blank');
        }
      } else {
        // Fallback to original URL
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error viewing driver license:', error);
      // Fallback to original URL
      window.open(url, '_blank');
    }
  };

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
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-500 mr-2" />
                          <div>
                            <p className="font-medium">
                              {booking.first_name && booking.last_name 
                                ? `${booking.first_name} ${booking.last_name}` 
                                : booking.driver_name}
                            </p>
                            <p className="text-sm text-gray-500">{booking.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.vehicle_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>From: {new Date(booking.pickup_date).toLocaleDateString()}</p>
                          <p>To: {new Date(booking.dropoff_date).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status, booking.payment_status)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">${booking.total_price}</p>
                          {booking.confirmation_fee_paid > 0 && (
                            <p className="text-sm text-green-600">
                              ${booking.confirmation_fee_paid} paid
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <BookingDetailModal booking={booking}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </BookingDetailModal>
                          {booking.driver_license_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewDriverLicense(booking.driver_license_url!)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              License
                            </Button>
                          )}
                        </div>
                      </TableCell>
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
