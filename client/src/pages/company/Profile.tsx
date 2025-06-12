
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import CompanyLayout from '@/components/company/CompanyLayout';
import { getCompanyProfile } from '@/services/companyProfileService';
import CompanyProfileHeader from '@/components/company/profile/CompanyProfileHeader';
import CompanyProfileForm from '@/components/company/profile/CompanyProfileForm';

const CompanyProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  
  useEffect(() => {
    const loadCompanyProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const profile = await getCompanyProfile(user.id);
        
        if (!profile) {
          toast({
            title: "Company profile not found",
            description: "Please complete your company profile information",
            variant: "destructive",
          });
          setCompanyData(null);
          return;
        }
        
        console.log("Loaded company profile:", profile);
        setCompanyData(profile);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading profile",
          description: "Failed to load your company profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCompanyProfile();
  }, [user, toast]);

  return (
    <CompanyLayout title="Company Profile">
      <CompanyProfileHeader isLoading={isLoading} />
      
      {!isLoading && (
        <CompanyProfileForm 
          userId={user?.id || ''} 
          companyData={companyData}
          setCompanyData={setCompanyData}
        />
      )}
    </CompanyLayout>
  );
};

export default CompanyProfile;
