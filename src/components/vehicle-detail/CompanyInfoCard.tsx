
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface CompanyInfoCardProps {
  companyData: any;
  vehicle?: any;
}

const CompanyInfoCard = ({ companyData, vehicle }: CompanyInfoCardProps) => {
  console.log('CompanyInfoCard received companyData:', companyData);
  console.log('CompanyInfoCard received vehicle:', vehicle);

  // If no company data is available, show vehicle-based fallback info
  if (!companyData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarFallback className="bg-brand-purple text-white text-lg font-bold">
                VP
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">Vehicle Provider</h3>
              <p className="text-sm text-gray-600">Rental Company</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-4">
            <p className="mb-2">Professional vehicle rental service in St. Lucia.</p>
            <p className="mb-2">📍 St. Lucia</p>
            <p className="mb-2">📞 Contact for details</p>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Vehicle ID</span>
            <span className="font-medium text-xs">{vehicle?.id?.slice(-8) || 'N/A'}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <div>
            <h3 className="text-lg font-semibold">{companyData.company_name}</h3>
            <p className="text-sm text-gray-600">{companyData.contact_person}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          <p className="mb-2">{companyData.description || 'Quality vehicle rental service in St. Lucia.'}</p>
          {companyData.address && (
            <p className="mb-2">📍 {companyData.address}</p>
          )}
          {companyData.phone && (
            <p className="mb-2">📞 {companyData.phone}</p>
          )}
          {companyData.email && (
            <p className="mb-2">✉️ {companyData.email}</p>
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between text-sm">
          <span>Status</span>
          <span className={`font-medium ${companyData.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
            {companyData.is_approved ? 'Verified' : 'Pending Verification'}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>Member since</span>
          <span className="font-medium">
            {companyData.created_at ? new Date(companyData.created_at).getFullYear() : new Date().getFullYear()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoCard;
