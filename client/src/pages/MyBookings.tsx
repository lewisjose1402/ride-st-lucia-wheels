import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Car, Download, Eye, FileText, X } from 'lucide-react';
import LoadingState from '@/components/company/dashboard/LoadingState';
import BookingReceipt from '@/components/bookings/BookingReceipt';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MyBooking {
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
  confirmation_fee_paid: number;
  permit_fee?: number;
  young_driver_fee?: number;
  status: string;
  payment_status: string;
  vehicle: {
    name: string;
    rental_companies: {
      company_name: string;
      email: string;
      phone: string;
    };
  };
}

const MyBookings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching detailed bookings for user:', user.id);
        
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
            confirmation_fee_paid,
            permit_fee,
            young_driver_fee,
            status,
            payment_status,
            vehicle:vehicles (
              name,
              rental_companies!vehicles_company_id_fkey (
                company_name,
                email,
                phone
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          toast({
            title: "Error loading bookings",
            description: "Failed to load your bookings",
            variant: "destructive",
          });
        } else {
          console.log('Detailed bookings loaded:', data);
          setBookings(data || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBookings();
  }, [user, toast]);

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' && status === 'confirmed') {
      return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
    } else if (paymentStatus === 'failed') {
      return <Badge variant="destructive">Payment Failed</Badge>;
    } else if (status === 'cancelled') {
      return <Badge variant="outline" className="text-gray-600">Cancelled</Badge>;
    } else {
      return <Badge variant="outline">Pending</Badge>;
    }
  };

  const viewDriverLicense = async (url: string) => {
    try {
      console.log('User viewing driver license:', url);
      
      // First try to open the original URL directly
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('Error viewing driver license for user:', error);
      toast({
        title: "Error",
        description: "Could not view driver license",
        variant: "destructive",
      });
    }
  };

  const canCancelBooking = (booking: MyBooking) => {
    // Can only cancel if status is confirmed/pending and payment is successful
    if (booking.status === 'cancelled' || booking.payment_status === 'failed') {
      return false;
    }

    // Check if pickup date is more than 2 days away
    const pickupDate = new Date(booking.pickup_date);
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));
    
    return pickupDate > twoDaysFromNow;
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      setCancellingBooking(bookingId);
      console.log('Cancelling booking:', bookingId);

      // Use the backend API route that triggers email notifications
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      console.log('Booking cancelled successfully');
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully. Email notifications have been sent.",
      });
      
      // Update the local state to reflect the cancellation
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Failed to cancel your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancellingBooking(null);
    }
  };

  const downloadReceipt = (booking: MyBooking) => {
    // Create a temporary BookingReceipt component and trigger download
    const receiptComponent = document.createElement('div');
    receiptComponent.style.display = 'none';
    document.body.appendChild(receiptComponent);
    
    // Trigger the PDF download using the BookingReceipt logic
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const companyInfo = booking.vehicle.rental_companies;
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
                <span class="value">${booking.vehicle.name}</span>
              </div>
              <div class="info-item">
                <span class="label">Rental Company:</span>
                <span class="value">${companyInfo.company_name}</span>
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
                <span class="label">Non-refundable Booking Fee Paid:</span>
                <span class="value price">$${booking.confirmation_fee_paid.toFixed(2)}</span>
              </div>
            </div>
            <div class="total-price">
              Total Amount: $${booking.total_price.toFixed(2)}
            </div>
          </div>

          <div class="section">
            <h3>🏢 Company Contact Information</h3>
            <div class="info-item">
              <span class="label">Company Name:</span>
              <span class="value">${companyInfo.company_name}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">${companyInfo.email}</span>
            </div>
            <div class="info-item">
              <span class="label">Phone:</span>
              <span class="value">${companyInfo.phone}</span>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    
    document.body.removeChild(receiptComponent);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow mt-16">
          <LoadingState />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow mt-16 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please sign in to view your bookings.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow mt-16 bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">View and manage your vehicle bookings</p>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500">
                  When you make vehicle bookings, they will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Car className="h-5 w-5" />
                          {booking.vehicle.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.vehicle.rental_companies.company_name}
                        </p>
                      </div>
                      {getStatusBadge(booking.status, booking.payment_status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Pickup</p>
                          <p className="font-medium">
                            {new Date(booking.pickup_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Return</p>
                          <p className="font-medium">
                            {new Date(booking.dropoff_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium break-words text-sm overflow-hidden">
                            {booking.delivery_location || booking.pickup_location}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="font-medium text-lg">${booking.total_price}</p>
                      </div>
                      {booking.confirmation_fee_paid > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Non-refundable Booking Fee Paid</p>
                          <p className="font-medium text-green-600">
                            ${booking.confirmation_fee_paid}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-4 flex-wrap">
                      {booking.driver_license_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewDriverLicense(booking.driver_license_url!)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View License
                        </Button>
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Receipt
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Booking Receipt</DialogTitle>
                          </DialogHeader>
                          <BookingReceipt booking={booking} showDownloadButton={true} />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(booking)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </Button>

                      {canCancelBooking(booking) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel Booking
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking? This action cannot be undone.
                                You can only cancel bookings up to 2 days before the pickup date.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => cancelBooking(booking.id)}
                                disabled={cancellingBooking === booking.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {cancellingBooking === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;
