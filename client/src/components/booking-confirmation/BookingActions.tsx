
import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';

interface BookingActionsProps {
  paymentStatus: string;
  booking?: {
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
  onManualVerification?: () => void;
  isVerifying?: boolean;
  showManualVerification?: boolean;
  verificationError?: boolean;
  verificationErrorMessage?: string | null;
}

const BookingActions = ({ 
  paymentStatus, 
  booking,
  onManualVerification,
  isVerifying = false,
  showManualVerification = false,
  verificationError = false,
  verificationErrorMessage
}: BookingActionsProps) => {
  
  const downloadReceipt = () => {
    if (!booking) return;
    
    // Open a new window with the receipt
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

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
                <span class="value">${booking.vehicle.rental_companies.company_name}</span>
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
                <span class="label">International License:</span>
                <span class="value">${booking.has_international_license ? 'Yes' : 'No (Temporary permit processed)'}</span>
              </div>
            </div>
          </div>

          <div class="total-price">
            Total Cost: $${booking.total_price}
          </div>

          <div class="section">
            <h3>🏢 Company Contact Information</h3>
            <div class="info-item">
              <span class="label">Company Name:</span>
              <span class="value">${booking.vehicle.rental_companies.company_name}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">${booking.vehicle.rental_companies.email}</span>
            </div>
            <div class="info-item">
              <span class="label">Phone:</span>
              <span class="value">${booking.vehicle.rental_companies.phone}</span>
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
    <div className="space-y-4">
      {/* Manual verification section */}
      {showManualVerification && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Payment Verification</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {verificationError 
                  ? "There was an issue verifying your payment. Click to retry."
                  : "Your payment status is still pending. Click to refresh and verify your payment."
                }
              </p>
              {verificationError && verificationErrorMessage && (
                <p className="text-xs text-red-600 mt-1">{verificationErrorMessage}</p>
              )}
            </div>
            <Button
              onClick={onManualVerification}
              disabled={isVerifying}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Main action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/vehicles">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vehicles
          </Button>
        </Link>
        {paymentStatus === 'paid' && booking && (
          <Button onClick={downloadReceipt}>
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingActions;
