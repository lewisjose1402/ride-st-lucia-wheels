
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Car, Download, Eye } from 'lucide-react';
import LoadingState from '@/components/company/dashboard/LoadingState';

interface MyBooking {
  id: string;
  pickup_date: string;
  dropoff_date: string;
  total_price: number;
  status: string;
  payment_status: string;
  confirmation_fee_paid: number;
  driver_license_url?: string;
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

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching bookings for user:', user.id);
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            pickup_date,
            dropoff_date,
            total_price,
            status,
            payment_status,
            confirmation_fee_paid,
            driver_license_url,
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
          console.log('Bookings loaded:', data);
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

  const viewDriverLicense = (url: string) => {
    window.open(url, '_blank');
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
                      <div>
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="font-medium text-lg">${booking.total_price}</p>
                      </div>
                      {booking.confirmation_fee_paid > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Confirmation Fee Paid</p>
                          <p className="font-medium text-green-600">
                            ${booking.confirmation_fee_paid}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-4">
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
                      {booking.payment_status === 'paid' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </Button>
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
