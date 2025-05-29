
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
}

const BookingRequirementsDisplay = ({ requirements }: BookingRequirementsDisplayProps) => {
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
          <p className="text-sm text-gray-600">Loading requirements...</p>
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
      <CardContent className="space-y-3">
        {requirements.requireDriverLicense && (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Valid driver's license required</span>
            <Badge variant="secondary">Required</Badge>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-green-600" />
          <span className="text-sm">Minimum age: {requirements.minimumDriverAge} years</span>
          <Badge variant="secondary">Required</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-purple-600" />
          <span className="text-sm">
            Minimum driving experience: {requirements.minimumDrivingExperience} year{requirements.minimumDrivingExperience !== 1 ? 's' : ''}
          </span>
          <Badge variant="secondary">Required</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-600" />
          <span className="text-sm">
            Minimum rental period: {requirements.minimumRentalDays} day{requirements.minimumRentalDays !== 1 ? 's' : ''}
          </span>
          <Badge variant="secondary">Required</Badge>
        </div>
        
        {requirements.requireDamageDeposit && (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-red-600" />
            <span className="text-sm">
              Damage deposit: ${requirements.damageDepositAmount} ({requirements.damageDepositType})
            </span>
            <Badge variant="secondary">Required</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingRequirementsDisplay;
