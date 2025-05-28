
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BookingReceiptProps {
  booking: {
    id: string;
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
    pickup_location: string;
    total_price: number;
    deposit_amount: number;
    confirmation_fee_paid: number;
    permit_fee?: number;
    young_driver_fee?: number;
    vehicle: {
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

const BookingReceipt = ({ booking, showDownloadButton = false }: BookingReceiptProps) => {
  const fullName = booking.first_name && booking.last_name 
    ? `${booking.first_name} ${booking.last_name}` 
    : booking.driver_name;
  const primaryLocation = booking.delivery_location || booking.pickup_location;
  const companyInfo = booking.vehicle.rental_companies;

  const downloadReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

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
                <span class="value price">$${(booking.total_price - (booking.permit_fee || 0) - (booking.young_driver_fee || 0) - booking.confirmation_fee_paid).toFixed(2)}</span>
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🚗 Vehicle Rental Receipt</h1>
        <p className="text-lg"><strong>Booking ID:</strong> {booking.id}</p>
        <p className="text-sm text-gray-600"><strong>Issue Date:</strong> {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">🚙 Vehicle & Rental Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Vehicle:</span>
              <span className="text-gray-900">{booking.vehicle.name}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Rental Company:</span>
              <span className="text-gray-900">{companyInfo.company_name}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Pickup Date:</span>
              <span className="text-gray-900">{new Date(booking.pickup_date).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Return Date:</span>
              <span className="text-gray-900">{new Date(booking.dropoff_date).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Pickup Location:</span>
              <span className="text-gray-900">{primaryLocation}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Return Location:</span>
              <span className="text-gray-900">TBD</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">👤 Renter Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Full Name:</span>
              <span className="text-gray-900">{fullName}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Age:</span>
              <span className="text-gray-900">{booking.driver_age} years</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Email:</span>
              <span className="text-gray-900">{booking.email || 'Not provided'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Phone:</span>
              <span className="text-gray-900">{booking.phone_number || 'Not provided'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Driving Experience:</span>
              <span className="text-gray-900">{booking.driving_experience || 'Not provided'} years</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">International License:</span>
              <span className="text-gray-900">{booking.has_international_license ? 'Yes' : 'No (Temporary permit processed)'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">💰 Payment Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Rental Fee:</span>
              <span className="text-lg font-bold text-green-600">${(booking.total_price - (booking.permit_fee || 0) - (booking.young_driver_fee || 0) - booking.confirmation_fee_paid).toFixed(2)}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Security Deposit:</span>
              <span className="text-lg font-bold text-green-600">${booking.deposit_amount.toFixed(2)}</span>
            </div>
            {booking.permit_fee && (
              <div>
                <span className="font-semibold text-gray-700 block mb-1">Permit Fee:</span>
                <span className="text-lg font-bold text-green-600">${booking.permit_fee.toFixed(2)}</span>
              </div>
            )}
            {booking.young_driver_fee && (
              <div>
                <span className="font-semibold text-gray-700 block mb-1">Young Driver Fee:</span>
                <span className="text-lg font-bold text-green-600">${booking.young_driver_fee.toFixed(2)}</span>
              </div>
            )}
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Non-refundable Booking Fee Paid:</span>
              <span className="text-lg font-bold text-green-600">${booking.confirmation_fee_paid.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
            <span className="text-2xl font-bold text-green-600">Total Amount: ${booking.total_price.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">🏢 Company Contact Information</h3>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Company Name:</span>
              <span className="text-gray-900">{companyInfo.company_name}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Email:</span>
              <span className="text-gray-900">{companyInfo.email}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Phone:</span>
              <span className="text-gray-900">{companyInfo.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {showDownloadButton && (
        <div className="mt-8 text-center">
          <Button onClick={downloadReceipt} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingReceipt;
