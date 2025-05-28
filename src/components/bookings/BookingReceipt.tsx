
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, MapPin, Calendar, User, Car, FileText, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface BookingReceiptProps {
  booking: {
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
    vehicle_name?: string;
    company_name?: string;
    vehicle?: {
      name: string;
      rental_companies: {
        company_name: string;
        email: string;
        phone: string;
      };
    };
  };
  showDownloadButton?: boolean;
}

const BookingReceipt = ({ booking, showDownloadButton = true }: BookingReceiptProps) => {
  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' && status === 'confirmed') {
      return <Badge className="bg-green-100 text-green-800">Confirmed & Paid</Badge>;
    } else if (paymentStatus === 'failed') {
      return <Badge variant="destructive">Payment Failed</Badge>;
    } else if (status === 'cancelled') {
      return <Badge variant="outline" className="text-gray-600">Cancelled</Badge>;
    } else {
      return <Badge variant="outline">Pending Payment</Badge>;
    }
  };

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const companyInfo = booking.vehicle?.rental_companies || { 
      company_name: booking.company_name || 'Unknown Company',
      email: '',
      phone: '' 
    };

    const vehicleName = booking.vehicle?.name || booking.vehicle_name || 'Unknown Vehicle';
    const fullName = booking.first_name && booking.last_name 
      ? `${booking.first_name} ${booking.last_name}` 
      : booking.driver_name;

    // Use delivery location as primary location, fallback to pickup location
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
            .status { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; }
            .status.confirmed { background: #d1fae5; color: #065f46; }
            .status.pending { background: #fef3c7; color: #92400e; }
            .status.cancelled { background: #fee2e2; color: #991b1b; }
            .price { font-size: 18px; font-weight: bold; color: #059669; }
            .total-price { font-size: 24px; font-weight: bold; color: #059669; text-align: center; padding: 15px; background: #ecfdf5; border-radius: 8px; margin: 20px 0; }
            .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚗 Vehicle Rental Receipt</h1>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p>
            <div class="status ${booking.status}">${getStatusText(booking.status, booking.payment_status)}</div>
          </div>

          <div class="section">
            <h3>🚙 Vehicle & Rental Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Vehicle:</span>
                <span class="value">${vehicleName}</span>
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
                <span class="value">${primaryLocation}</span>
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
                <span class="value price">${formatCurrency(booking.total_price - (booking.permit_fee || 0) - (booking.young_driver_fee || 0))}</span>
              </div>
              <div class="info-item">
                <span class="label">Security Deposit:</span>
                <span class="value price">${formatCurrency(booking.deposit_amount)}</span>
              </div>
              ${booking.permit_fee ? `
                <div class="info-item">
                  <span class="label">Permit Fee:</span>
                  <span class="value price">${formatCurrency(booking.permit_fee)}</span>
                </div>
              ` : ''}
              ${booking.young_driver_fee ? `
                <div class="info-item">
                  <span class="label">Young Driver Fee:</span>
                  <span class="value price">${formatCurrency(booking.young_driver_fee)}</span>
                </div>
              ` : ''}
              <div class="info-item">
                <span class="label">Confirmation Fee Paid:</span>
                <span class="value price">${formatCurrency(booking.confirmation_fee_paid)}</span>
              </div>
            </div>
            <div class="total-price">
              Total Amount: ${formatCurrency(booking.total_price)}
            </div>
          </div>

          <div class="section">
            <h3>🏢 Company Contact Information</h3>
            <div class="info-item">
              <span class="label">Company Name:</span>
              <span class="value">${companyInfo.company_name}</span>
            </div>
            ${companyInfo.email ? `
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">${companyInfo.email}</span>
              </div>
            ` : ''}
            ${companyInfo.phone ? `
              <div class="info-item">
                <span class="label">Phone:</span>
                <span class="value">${companyInfo.phone}</span>
              </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>Thank you for choosing our vehicle rental service!</p>
            <p>This is an official receipt for your booking. Please keep this for your records.</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusText = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' && status === 'confirmed') {
      return 'CONFIRMED & PAID';
    } else if (paymentStatus === 'failed') {
      return 'PAYMENT FAILED';
    } else if (status === 'cancelled') {
      return 'CANCELLED';
    } else {
      return 'PENDING PAYMENT';
    }
  };

  const companyInfo = booking.vehicle?.rental_companies || { 
    company_name: booking.company_name || 'Unknown Company',
    email: '',
    phone: '' 
  };

  const vehicleName = booking.vehicle?.name || booking.vehicle_name || 'Unknown Vehicle';
  const fullName = booking.first_name && booking.last_name 
    ? `${booking.first_name} ${booking.last_name}` 
    : booking.driver_name;

  // Use delivery location as primary location, fallback to pickup location
  const primaryLocation = booking.delivery_location || booking.pickup_location;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold mb-2">🚗 Vehicle Rental Receipt</CardTitle>
            <p className="text-gray-600">Booking ID: {booking.id}</p>
            <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(booking.status, booking.payment_status)}
            {showDownloadButton && (
              <Button onClick={downloadPDF} size="sm" variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Vehicle & Rental Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="h-5 w-5 text-blue-600" />
              Vehicle & Rental Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehicle</p>
              <p className="font-medium">{vehicleName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rental Company</p>
              <p className="font-medium">{companyInfo.company_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pickup Date</p>
              <p className="font-medium">{new Date(booking.pickup_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Return Date</p>
              <p className="font-medium">{new Date(booking.dropoff_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pickup Location</p>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-green-600" />
                <p className="font-medium">{primaryLocation}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Return Location</p>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-green-600" />
                <p className="font-medium">{primaryLocation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Renter Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-purple-600" />
              Renter Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Full Name</p>
              <p className="font-medium">{fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Age</p>
              <p className="font-medium">{booking.driver_age} years</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="font-medium">{booking.email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="font-medium">{booking.phone_number || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Driving Experience</p>
              <p className="font-medium">{booking.driving_experience || 'Not provided'} years</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">International License</p>
              <p className="font-medium">{booking.has_international_license ? 'Yes' : 'No (Temporary permit processed)'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
              Payment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Rental Fee</p>
                <p className="font-medium text-lg">{formatCurrency(booking.total_price - (booking.permit_fee || 0) - (booking.young_driver_fee || 0))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Security Deposit</p>
                <p className="font-medium text-lg">{formatCurrency(booking.deposit_amount)}</p>
              </div>
              {booking.permit_fee && booking.permit_fee > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Permit Fee</p>
                  <p className="font-medium text-lg">{formatCurrency(booking.permit_fee)}</p>
                </div>
              )}
              {booking.young_driver_fee && booking.young_driver_fee > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Young Driver Fee</p>
                  <p className="font-medium text-lg">{formatCurrency(booking.young_driver_fee)}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmation Fee Paid</p>
                <p className="font-medium text-lg text-green-600">{formatCurrency(booking.confirmation_fee_paid)}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-green-700">{formatCurrency(booking.total_price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Contact Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-orange-600" />
              Company Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Company Name</p>
              <p className="font-medium">{companyInfo.company_name}</p>
            </div>
            {companyInfo.email && (
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="font-medium">{companyInfo.email}</p>
              </div>
            )}
            {companyInfo.phone && (
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="font-medium">{companyInfo.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default BookingReceipt;
