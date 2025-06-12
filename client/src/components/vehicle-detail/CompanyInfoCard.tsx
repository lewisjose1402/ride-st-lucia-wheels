
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getStreetAddressFromCompanyData, getConstituencyFromCompanyData } from '@/components/company/profile/helpers';

interface CompanyInfoCardProps {
  companyData: any;
  vehicle?: any;
}

const CompanyInfoCard = ({ companyData, vehicle }: CompanyInfoCardProps) => {
  console.log('CompanyInfoCard rendering with:', {
    companyData,
    hasCompanyData: !!companyData,
    companyDataType: typeof companyData,
    companyDataKeys: companyData ? Object.keys(companyData) : null,
    vehicle: vehicle?.id
  });

  const formatCompanyAddress = (companyData: any): string => {
    if (!companyData || !companyData.address) return '';
    
    const streetAddress = getStreetAddressFromCompanyData(companyData);
    const constituency = getConstituencyFromCompanyData(companyData);
    
    const parts = [];
    if (streetAddress) parts.push(streetAddress);
    if (constituency) parts.push(constituency);
    
    return parts.join(', ') || companyData.address;
  };

  // If no company data is available, show vehicle-based fallback info
  if (!companyData) {
    console.log('No company data available, showing fallback');
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarFallback className="bg-brand-purple text-white text-lg font-bold">
                VP
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Vehicle Provider</h3>
              <p className="text-sm text-gray-600">Rental Company</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>St. Lucia</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>Contact for details</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('Rendering with actual company data:', {
    companyName: companyData.company_name,
    contactPerson: companyData.contact_person,
    address: companyData.address,
    phone: companyData.phone,
    email: companyData.email,
    isApproved: companyData.is_approved
  });

  const formattedAddress = formatCompanyAddress(companyData);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            <AvatarImage 
              src={companyData.logo_url} 
              alt={companyData.company_name}
            />
            <AvatarFallback className="bg-brand-purple text-white text-lg font-bold">
              {companyData.company_name?.charAt(0) || 'RC'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {companyData.company_name || 'Rental Company'}
            </h3>
            {companyData.contact_person && (
              <p className="text-sm text-gray-600">{companyData.contact_person}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {formattedAddress && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{formattedAddress}</span>
            </div>
          )}
          {companyData.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{companyData.phone}</span>
            </div>
          )}
          {companyData.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <span>{companyData.email}</span>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <Badge 
            variant={companyData.is_approved ? "default" : "secondary"}
            className={companyData.is_approved 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
            }
          >
            {companyData.is_approved ? 'Verified' : 'Unverified'}
          </Badge>
        </div>
        
        {companyData.created_at && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">Member since</span>
            <span className="text-sm font-medium">
              {new Date(companyData.created_at).getFullYear()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyInfoCard;
