import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { calculateDaysBetween } from '@/utils/pricingCalculations';

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

  // Calculate detailed pricing breakdown
  const rentalDays = calculateDaysBetween(booking.pickup_date, booking.dropoff_date);
  const confirmationFee = booking.confirmation_fee_paid;
  const permitFee = booking.permit_fee || 0;
  const youngDriverFee = booking.young_driver_fee || 0;
  const damageDeposit = booking.deposit_amount;
  
  // Calculate base cost (working backwards from total)
  const baseCost = booking.total_price - confirmationFee - permitFee - youngDriverFee - damageDeposit;
  const pricePerDay = baseCost / rentalDays;
  
  // Calculate taxable amount and government tax
  const taxableAmount = baseCost - confirmationFee;
  const governmentTax = taxableAmount * 0.125; // 12.5% tax rate

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
            .breakdown-item { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .breakdown-item.total { border-top: 1px solid #d1d5db; padding-top: 8px; font-weight: bold; }
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
            <h3>💰 Price Breakdown</h3>
            <div class="breakdown-item">
              <span>Rental Cost (${rentalDays} ${rentalDays === 1 ? 'day' : 'days'} × ${formatCurrency(pricePerDay)})</span>
              <span>${formatCurrency(baseCost)}</span>
            </div>
            <div class="breakdown-item" style="color: #b45309;">
              <span>Non-Refundable Confirmation Fee (12%)</span>
              <span>${formatCurrency(confirmationFee)}</span>
            </div>
            <div class="breakdown-item" style="color: #6b7280; font-size: 12px;">
              <span>Taxable Amount (Base - Confirmation Fee)</span>
              <span>${formatCurrency(taxableAmount)}</span>
            </div>
            <div class="breakdown-item">
              <span>Government Tax (12.5%)</span>
              <span>${formatCurrency(governmentTax)}</span>
            </div>
            ${permitFee > 0 ? `
              <div class="breakdown-item" style="color: #d97706;">
                <span>Permit Fee (No International License)</span>
                <span>${formatCurrency(permitFee)}</span>
              </div>
            ` : ''}
            ${youngDriverFee > 0 ? `
              <div class="breakdown-item" style="color: #ea580c;">
                <span>Underage Deposit (Refundable)</span>
                <span>${formatCurrency(youngDriverFee)}</span>
              </div>
            ` : ''}
            ${damageDeposit > 0 ? `
              <div class="breakdown-item" style="color: #2563eb;">
                <span>Damage Deposit (Cash) - Paid at Delivery</span>
                <span>${formatCurrency(damageDeposit)}</span>
              </div>
            ` : ''}
            <div class="breakdown-item total">
              <span>Total Cost</span>
              <span>${formatCurrency(booking.total_price)}</span>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">💰 Price Breakdown</h3>
          
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span>Rental Cost ({rentalDays} {rentalDays === 1 ? 'day' : 'days'} × {formatCurrency(pricePerDay)})</span>
              <span className="font-medium">{formatCurrency(baseCost)}</span>
            </div>
            
            <div className="flex justify-between text-yellow-700">
              <span>Non-Refundable Confirmation Fee (12%)</span>
              <span className="font-medium">{formatCurrency(confirmationFee)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600 text-xs">
              <span>Taxable Amount (Base - Confirmation Fee)</span>
              <span>{formatCurrency(taxableAmount)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Government Tax (12.5%)</span>
              <span className="font-medium">{formatCurrency(governmentTax)}</span>
            </div>
            
            {permitFee > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Permit Fee (No International License)</span>
                <span className="font-medium">{formatCurrency(permitFee)}</span>
              </div>
            )}
            
            {youngDriverFee > 0 && (
              <div className="flex justify-between text-orange-700">
                <span>Underage Deposit (Refundable)</span>
                <span className="font-medium">{formatCurrency(youngDriverFee)}</span>
              </div>
            )}
            
            {damageDeposit > 0 && (
              <div className="flex justify-between text-blue-700">
                <span>Damage Deposit (Cash) - Paid at Delivery</span>
                <span className="font-medium">{formatCurrency(damageDeposit)}</span>
              </div>
            )}
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Cost</span>
                <span>{formatCurrency(booking.total_price)}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-600 mt-2 space-y-1">
              <div>Non-refundable confirmation fee ({formatCurrency(confirmationFee)}) paid now</div>
              {(youngDriverFee > 0 || damageDeposit > 0) && (
                <div>* Deposits are refundable upon vehicle return in good condition</div>
              )}
              {damageDeposit > 0 && (
                <div>* Damage deposit paid at delivery</div>
              )}
            </div>
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
