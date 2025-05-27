
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';

interface BookingActionsProps {
  paymentStatus: string;
  onManualVerification?: () => void;
  isVerifying?: boolean;
  showManualVerification?: boolean;
  verificationError?: string | null;
}

const BookingActions = ({ 
  paymentStatus, 
  onManualVerification,
  isVerifying = false,
  showManualVerification = false,
  verificationError
}: BookingActionsProps) => {
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
              {verificationError && (
                <p className="text-xs text-red-600 mt-1">{verificationError}</p>
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
        {paymentStatus === 'paid' && (
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingActions;
