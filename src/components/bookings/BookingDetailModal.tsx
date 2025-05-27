
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, MapPin, Calendar, User, Phone, Mail, Car, FileText } from 'lucide-react';

interface BookingDetail {
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
  vehicle_name: string;
  company_name?: string;
}

interface BookingDetailModalProps {
  booking: BookingDetail;
  children: React.ReactNode;
}

const BookingDetailModal = ({ booking, children }: BookingDetailModalProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const downloadPDF = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Booking Details - ${booking.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .section h3 { margin-top: 0; color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; }
            .status { padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
            .status.confirmed { background: #e7f5e7; color: #2d5a2d; }
            .status.pending { background: #fff3cd; color: #856404; }
            .status.cancelled { background: #f8d7da; color: #721c24; }
            .status.completed { background: #d4edda; color: #155724; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booking Confirmation</h1>
            <p>Booking ID: ${booking.id}</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h3>Booking Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Vehicle:</div>
                <div class="value">${booking.vehicle_name}</div>
              </div>
              <div class="info-item">
                <div class="label">Status:</div>
                <div class="value">
                  <span class="status ${booking.status}">${booking.status.toUpperCase()}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="label">Pickup Date:</div>
                <div class="value">${new Date(booking.pickup_date).toLocaleDateString()}</div>
              </div>
              <div class="info-item">
                <div class="label">Dropoff Date:</div>
                <div class="value">${new Date(booking.dropoff_date).toLocaleDateString()}</div>
              </div>
              <div class="info-item">
                <div class="label">Pickup Location:</div>
                <div class="value">${booking.pickup_location}</div>
              </div>
              <div class="info-item">
                <div class="label">Dropoff Location:</div>
                <div class="value">${booking.dropoff_location}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Renter Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Name:</div>
                <div class="value">${booking.first_name && booking.last_name ? `${booking.first_name} ${booking.last_name}` : booking.driver_name}</div>
              </div>
              <div class="info-item">
                <div class="label">Email:</div>
                <div class="value">${booking.email || 'Not provided'}</div>
              </div>
              <div class="info-item">
                <div class="label">Phone:</div>
                <div class="value">${booking.phone_number || 'Not provided'}</div>
              </div>
              <div class="info-item">
                <div class="label">Age:</div>
                <div class="value">${booking.driver_age} years</div>
              </div>
              <div class="info-item">
                <div class="label">Driving Experience:</div>
                <div class="value">${booking.driving_experience || 'Not provided'} years</div>
              </div>
              <div class="info-item">
                <div class="label">International License:</div>
                <div class="value">${booking.has_international_license ? 'Yes' : 'No'}</div>
              </div>
            </div>
            ${booking.delivery_location ? `
              <div class="info-item">
                <div class="label">Delivery Location:</div>
                <div class="value">${booking.delivery_location}</div>
              </div>
            ` : ''}
          </div>

          <div class="section">
            <h3>Payment Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Total Price:</div>
                <div class="value">$${booking.total_price}</div>
              </div>
              <div class="info-item">
                <div class="label">Deposit Amount:</div>
                <div class="value">$${booking.deposit_amount}</div>
              </div>
            </div>
          </div>

          ${booking.company_name ? `
            <div class="section">
              <h3>Rental Company</h3>
              <div class="info-item">
                <div class="label">Company:</div>
                <div class="value">${booking.company_name}</div>
              </div>
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Booking Details</DialogTitle>
            <div className="flex gap-2">
              <Badge variant={getStatusBadgeVariant(booking.status)}>
                {booking.status}
              </Badge>
              <Button onClick={downloadPDF} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-medium">{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  {booking.vehicle_name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Pickup Date</p>
                  <p className="font-medium">{new Date(booking.pickup_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dropoff Date</p>
                  <p className="font-medium">{new Date(booking.dropoff_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pickup Location</p>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {booking.pickup_location}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dropoff Location</p>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {booking.dropoff_location}
                </p>
              </div>
              {booking.delivery_location && (
                <div>
                  <p className="text-sm text-gray-600">Delivery Location</p>
                  <p className="font-medium">{booking.delivery_location}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Renter Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Renter Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">
                  {booking.first_name && booking.last_name 
                    ? `${booking.first_name} ${booking.last_name}` 
                    : booking.driver_name}
                </p>
              </div>
              {booking.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {booking.email}
                  </p>
                </div>
              )}
              {booking.phone_number && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {booking.phone_number}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium">{booking.driver_age} years</p>
                </div>
                {booking.driving_experience && (
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{booking.driving_experience} years</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">International License</p>
                <p className="font-medium">
                  {booking.has_international_license ? 'Yes' : 'No'}
                </p>
              </div>
              {booking.driver_license_url && (
                <div>
                  <p className="text-sm text-gray-600">Driver's License</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(booking.driver_license_url, '_blank')}
                    className="mt-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View License
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="font-medium text-lg">${booking.total_price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deposit Paid</p>
                  <p className="font-medium text-lg text-green-600">${booking.deposit_amount}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          {booking.company_name && (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-gray-600">Rental Company</p>
                  <p className="font-medium">{booking.company_name}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
