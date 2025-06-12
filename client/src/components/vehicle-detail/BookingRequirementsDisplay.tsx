
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  User, 
  Car, 
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface BookingRequirementsDisplayProps {
  requirements: {
    requireDriverLicense: boolean;
    minimumDriverAge: number;
    minimumDrivingExperience: number;
    minimumRentalDays: number;
    requireDamageDeposit: boolean;
    damageDepositAmount: number;
    damageDepositType: string;
  } | null;
  isLoading?: boolean;
  error?: string | null;
}

const BookingRequirementsDisplay = ({ 
  requirements, 
  isLoading = false, 
  error = null 
}: BookingRequirementsDisplayProps) => {
  console.log('BookingRequirementsDisplay: Rendering with requirements:', requirements);
  console.log('BookingRequirementsDisplay: isLoading:', isLoading);
  console.log('BookingRequirementsDisplay: error:', error);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" aria-hidden="true" />
            Booking Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner message="Loading booking requirements..." size="sm" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" aria-hidden="true" />
            Booking Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm">
              Unable to load booking requirements at this time. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show default message if no requirements data is available
  if (!requirements) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" aria-hidden="true" />
            Booking Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <p className="text-sm">
              Standard booking requirements apply. Contact the rental company for specific details.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card role="region" aria-labelledby="booking-requirements-title">
      <CardHeader>
        <CardTitle id="booking-requirements-title" className="flex items-center gap-2">
          <Shield className="h-5 w-5" aria-hidden="true" />
          Booking Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Driver's License Requirement */}
        {requirements.requireDriverLicense && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded" role="listitem">
            <CreditCard className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span className="text-sm font-medium">Valid driver's license required</span>
            <Badge variant="secondary" aria-label="This requirement is mandatory">Required</Badge>
          </div>
        )}
        
        {/* Minimum Age */}
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded" role="listitem">
          <User className="h-4 w-4 text-green-600" aria-hidden="true" />
          <span className="text-sm font-medium">
            Minimum age: {requirements.minimumDriverAge} years
          </span>
          <Badge variant="secondary" aria-label="This requirement is mandatory">Required</Badge>
        </div>
        
        {/* Driving Experience */}
        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded" role="listitem">
          <Car className="h-4 w-4 text-purple-600" aria-hidden="true" />
          <span className="text-sm font-medium">
            Minimum driving experience: {requirements.minimumDrivingExperience} year{requirements.minimumDrivingExperience !== 1 ? 's' : ''}
          </span>
          <Badge variant="secondary" aria-label="This requirement is mandatory">Required</Badge>
        </div>

        {/* Minimum Rental Period */}
        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded" role="listitem">
          <Calendar className="h-4 w-4 text-orange-600" aria-hidden="true" />
          <span className="text-sm font-medium">
            Minimum rental period: {requirements.minimumRentalDays} day{requirements.minimumRentalDays !== 1 ? 's' : ''}
          </span>
          <Badge variant="secondary" aria-label="This requirement is mandatory">Required</Badge>
        </div>
        
        {/* Damage Deposit */}
        {requirements.requireDamageDeposit ? (
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded" role="listitem">
            <CreditCard className="h-4 w-4 text-red-600" aria-hidden="true" />
            <span className="text-sm font-medium">
              Damage deposit: ${requirements.damageDepositAmount} ({requirements.damageDepositType})
            </span>
            <Badge variant="secondary" aria-label="This requirement is mandatory">Required</Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded" role="listitem">
            <CreditCard className="h-4 w-4 text-green-600" aria-hidden="true" />
            <span className="text-sm font-medium">No damage deposit required</span>
            <Badge variant="outline" className="bg-green-100 text-green-700" aria-label="No deposit is required">No Deposit</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingRequirementsDisplay;
