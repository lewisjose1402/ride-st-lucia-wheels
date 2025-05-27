import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { BookingInfoSection } from './modal/BookingInfoSection';
import { RenterInfoSection } from './modal/RenterInfoSection';
import { PaymentInfoSection } from './modal/PaymentInfoSection';
import { CompanyInfoSection } from './modal/CompanyInfoSection';
import { formatCurrency } from '@/utils/formatters';

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
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Booking Details - ${booking.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .section { margin-bottom: 25px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; }
            .section h3 { margin-top: 0; color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
            .info-item { margin-bottom: 12px; }
            .label { font-weight: bold; color: #555; margin-bottom: 4px; }
            .value { color: #333; }
            .status { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; }
            .status.confirmed { background: #e7f5e7; color: #2d5a2d; }
            .status.pending { background: #fff3cd; color: #856404; }
            .status.cancelled { background: #f8d7da; color: #721c24; }
            .status.completed { background: #d4edda; color: #155724; }
            .price { font-size: 16px; font-weight: bold; color: #2563eb; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booking Confirmation</h1>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h3>📅 Booking Information</h3>
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
            ${booking.delivery_location ? `
              <div class="info-item">
                <div class="label">Delivery Location:</div>
                <div class="value">${booking.delivery_location}</div>
              </div>
            ` : ''}
          </div>

          <div class="section">
            <h3>👤 Renter Information</h3>
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
                <div class="value">${booking.has_international_license ? 'Yes' : 'No (Temporary permit will be processed)'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>💳 Payment Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Total Price:</div>
                <div class="value price">${formatCurrency(booking.total_price)}</div>
              </div>
              <div class="info-item">
                <div class="label">Deposit Amount:</div>
                <div class="value price">${formatCurrency(booking.deposit_amount)}</div>
              </div>
            </div>
          </div>

          ${booking.company_name ? `
            <div class="section">
              <h3>🏢 Rental Company</h3>
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <DialogTitle className="text-xl font-semibold">Booking Details</DialogTitle>
            <div className="flex items-center gap-3">
              <Badge variant={getStatusBadgeVariant(booking.status)} className="text-sm">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <Button onClick={downloadPDF} size="sm" variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <BookingInfoSection booking={booking} />
          <RenterInfoSection booking={booking} />
          <PaymentInfoSection booking={booking} />
          <CompanyInfoSection booking={booking} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
