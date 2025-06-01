
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  User, 
  Car, 
  Calendar,
  Shield 
} from 'lucide-react';

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
}

const BookingRequirementsDisplay = ({ requirements, isLoading = false }: BookingRequirementsDisplayProps) => {
  console.log('BookingRequirementsDisplay: Rendering with requirements:', requirements);
  console.log('BookingRequirementsDisplay: isLoading:', isLoading);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Booking Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
            <Shield className="h-5 w-5" />
            Booking Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Loading booking requirements...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Booking Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Driver's License Requirement */}
        {requirements.requireDriverLicense && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Valid driver's license required</span>
            <Badge variant="secondary">Required</Badge>
          </div>
        )}
        
        {/* Minimum Age */}
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
          <User className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">
            Minimum age: {requirements.minimumDriverAge} years
          </span>
          <Badge variant="secondary">Required</Badge>
        </div>
        
        {/* Driving Experience */}
        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
          <Car className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium">
            Minimum driving experience: {requirements.minimumDrivingExperience} year{requirements.minimumDrivingExperience !== 1 ? 's' : ''}
          </span>
          <Badge variant="secondary">Required</Badge>
        </div>

        {/* Minimum Rental Period - Now using actual data */}
        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
          <Calendar className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium">
            Minimum rental period: {requirements.minimumRentalDays} day{requirements.minimumRentalDays !== 1 ? 's' : ''}
          </span>
          <Badge variant="secondary">Required</Badge>
        </div>
        
        {/* Damage Deposit - Now using actual data */}
        {requirements.requireDamageDeposit ? (
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
            <CreditCard className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium">
              Damage deposit: ${requirements.damageDepositAmount} ({requirements.damageDepositType})
            </span>
            <Badge variant="secondary">Required</Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
            <CreditCard className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">No damage deposit required</span>
            <Badge variant="outline" className="bg-green-100 text-green-700">No Deposit</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingRequirementsDisplay;
