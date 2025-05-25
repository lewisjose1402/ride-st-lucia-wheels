
import { formatCurrency } from '@/utils/formatters';

interface PriceBreakdownProps {
  rentalDays: number;
  baseCost: number;
  confirmationFee: number;
  taxableAmount: number;
  governmentTax: number;
  permitFee: number;
  underageDeposit: number;
  damageDeposit: number;
  totalCost: number;
  pricePerDay: number;
  damageDepositType?: string;
}

const PriceBreakdown = ({
  rentalDays,
  baseCost,
  confirmationFee,
  taxableAmount,
  governmentTax,
  permitFee,
  underageDeposit,
  damageDeposit,
  totalCost,
  pricePerDay,
  damageDepositType = 'Cash'
}: PriceBreakdownProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
      <h4 className="font-semibold text-gray-800 mb-3">Price Breakdown</h4>
      
      <div className="flex justify-between">
        <span>Rental Cost ({rentalDays} {rentalDays === 1 ? 'day' : 'days'} × {formatCurrency(pricePerDay)})</span>
        <span className="font-medium">{formatCurrency(baseCost)}</span>
      </div>
      
      <div className="flex justify-between text-green-700">
        <span>Booking Confirmation Fee (12%) ✅ Paid Now</span>
        <span className="font-medium">{formatCurrency(confirmationFee)}</span>
      </div>
      
      <div className="flex justify-between text-gray-600 text-xs">
        <span>Taxable Amount (Base - Confirmation Fee)</span>
        <span>{formatCurrency(taxableAmount)}</span>
      </div>
      
      <div className="flex justify-between">
        <span>Government Tax (25%)</span>
        <span className="font-medium">{formatCurrency(governmentTax)}</span>
      </div>
      
      {permitFee > 0 && (
        <div className="flex justify-between text-amber-700">
          <span>Permit Fee (No International License)</span>
          <span className="font-medium">{formatCurrency(permitFee)}</span>
        </div>
      )}
      
      {underageDeposit > 0 && (
        <div className="flex justify-between text-orange-700">
          <span>Underage Deposit (Refundable)</span>
          <span className="font-medium">{formatCurrency(underageDeposit)}</span>
        </div>
      )}
      
      {damageDeposit > 0 && (
        <div className="flex justify-between text-blue-700">
          <span>Damage Deposit ({damageDepositType}) - Paid at Delivery</span>
          <span className="font-medium">{formatCurrency(damageDeposit)}</span>
        </div>
      )}
      
      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between font-bold text-lg">
          <span>Total Cost</span>
          <span>{formatCurrency(totalCost)}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 mt-2 space-y-1">
        <div>✅ Confirmation fee ({formatCurrency(confirmationFee)}) paid now</div>
        {(underageDeposit > 0 || damageDeposit > 0) && (
          <div>* Deposits are refundable upon vehicle return in good condition</div>
        )}
        {damageDeposit > 0 && (
          <div>* Damage deposit paid at delivery</div>
        )}
      </div>
    </div>
  );
};

export default PriceBreakdown;
