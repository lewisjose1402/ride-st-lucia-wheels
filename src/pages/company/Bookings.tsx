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
import { Calendar, User, Eye, Download, FileText } from 'lucide-react';
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
  permit_fee?: number;
  young_driver_fee?: number;
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
            permit_fee,
            young_driver_fee,
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
      console.log('Company attempting to view driver license:', url);
      
      // Simply open the URL directly - let the browser handle the authentication
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('Error viewing driver license:', error);
      toast({
        title: "Error",
        description: "Could not view driver license",
        variant: "destructive",
      });
    }
  };

  const downloadBookingReceipt = (booking: Booking) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Could not open print window. Please check your popup blocker.",
        variant: "destructive",
      });
      return;
    }

    const fullName = booking.first_name && booking.last_name 
      ? `${booking.first_name} ${booking.last_name}` 
      : booking.driver_name;
    const primaryLocation = booking.delivery_location || booking.pickup_location;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Booking Receipt - ${booking.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .header h1 { color: #1f2937; margin-bottom: 10px; }
            .section { margin-bottom: 25px; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px; background: #f9fafb; }
            .section h3 { margin-top: 0; color: #374151; font-size: 18px; border-bottom: 1px solid #d1d5db; padding-bottom: 8px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
            .info-item { margin-bottom: 12px; }
            .label { font-weight: bold; color: #6b7280; margin-bottom: 4px; display: block; }
            .value { color: #1f2937; }
            .price { font-size: 18px; font-weight: bold; color: #059669; }
            .total-price { font-size: 24px; font-weight: bold; color: #059669; text-align: center; padding: 15px; background: #ecfdf5; border-radius: 8px; margin: 20px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚗 Vehicle Rental Receipt</h1>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h3>🚙 Vehicle & Rental Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Vehicle:</span>
                <span class="value">${booking.vehicle_name}</span>
              </div>
              <div class="info-item">
                <span class="label">Rental Company:</span>
                <span class="value">${booking.company_name || 'Company'}</span>
              </div>
              <div class="info-item">
                <span class="label">Pickup Date:</span>
                <span class="value">${new Date(booking.pickup_date).toLocaleDateString()}</span>
              </div>
              <div class="info-item">
                <span class="label">Return Date:</span>
                <span class="value">${new Date(booking.dropoff_date).toLocaleDateString()}</span>
              </div>
              <div class="info-item">
                <span class="label">Pickup Location:</span>
                <span class="value">${primaryLocation}</span>
              </div>
              <div class="info-item">
                <span class="label">Return Location:</span>
                <span class="value">TBD</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>👤 Renter Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Full Name:</span>
                <span class="value">${fullName}</span>
              </div>
              <div class="info-item">
                <span class="label">Age:</span>
                <span class="value">${booking.driver_age} years</span>
              </div>
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">${booking.email || 'Not provided'}</span>
              </div>
              <div class="info-item">
                <span class="label">Phone:</span>
                <span class="value">${booking.phone_number || 'Not provided'}</span>
              </div>
              <div class="info-item">
                <span class="label">Driving Experience:</span>
                <span class="value">${booking.driving_experience || 'Not provided'} years</span>
              </div>
              <div class="info-item">
                <span class="label">International License:</span>
                <span class="value">${booking.has_international_license ? 'Yes' : 'No (Temporary permit processed)'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>💰 Payment Breakdown</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Rental Fee:</span>
                <span class="value price">$${(booking.total_price - (booking.permit_fee || 0) - (booking.young_driver_fee || 0)).toFixed(2)}</span>
              </div>
              <div class="info-item">
                <span class="label">Security Deposit:</span>
                <span class="value price">$${booking.deposit_amount.toFixed(2)}</span>
              </div>
              ${booking.permit_fee ? `
                <div class="info-item">
                  <span class="label">Permit Fee:</span>
                  <span class="value price">$${booking.permit_fee.toFixed(2)}</span>
                </div>
              ` : ''}
              ${booking.young_driver_fee ? `
                <div class="info-item">
                  <span class="label">Young Driver Fee:</span>
                  <span class="value price">$${booking.young_driver_fee.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="info-item">
                <span class="label">Confirmation Fee Paid:</span>
                <span class="value price">$${booking.confirmation_fee_paid.toFixed(2)}</span>
              </div>
            </div>
            <div class="total-price">
              Total Amount: $${booking.total_price.toFixed(2)}
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
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
                        <div className="flex gap-2 flex-wrap">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadBookingReceipt(booking)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Receipt
                          </Button>
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
