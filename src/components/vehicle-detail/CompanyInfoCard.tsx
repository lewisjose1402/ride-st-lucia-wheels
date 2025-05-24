
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CompanyInfoCardProps {
  companyData: any;
}

const CompanyInfoCard = ({ companyData }: CompanyInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 mr-3">
            {companyData?.logo_url ? (
              <img 
                src={companyData.logo_url} 
                alt={companyData.company_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-brand-purple text-white flex items-center justify-center text-lg font-bold">
                {companyData?.company_name?.charAt(0) || 'RC'}
              </div>
            )}
          </div>
          <div>
            <CardTitle className="text-lg">{companyData?.company_name || 'Rental Company'}</CardTitle>
            <CardDescription>{companyData?.contact_person || 'Vehicle Provider'}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          <p className="mb-2">{companyData?.description || 'Quality vehicle rental service in St. Lucia.'}</p>
          {companyData?.address && (
            <p className="mb-2">📍 {companyData.address}</p>
          )}
          {companyData?.phone && (
            <p className="mb-2">📞 {companyData.phone}</p>
          )}
          {companyData?.email && (
            <p className="mb-2">✉️ {companyData.email}</p>
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between text-sm">
          <span>Status</span>
          <span className={`font-medium ${companyData?.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
            {companyData?.is_approved ? 'Verified' : 'Pending Verification'}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>Member since</span>
          <span className="font-medium">
            {companyData?.created_at ? new Date(companyData.created_at).getFullYear() : new Date().getFullYear()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoCard;
