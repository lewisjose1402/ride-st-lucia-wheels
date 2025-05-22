
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from '@/components/ui/use-toast';
import { updateCompanyProfile, createCompanyProfile } from '@/services/companyProfileService';
import { Form } from "@/components/ui/form";
import { CompanyProfileSchema, CompanyProfileFormValues } from './validation-schema';
import { getStreetAddressFromCompanyData, getConstituencyFromCompanyData } from './helpers';
import CompanyInformation from './CompanyInformation';
import ContactInformation from './ContactInformation';
import AddressInformation from './AddressInformation';
import CompanyDescription from './CompanyDescription';
import CompanyLogoUploader from './CompanyLogoUploader';
import SubmitButton from './SubmitButton';

interface CompanyProfileFormProps {
  userId: string;
  companyData: any;
  setCompanyData: React.Dispatch<React.SetStateAction<any>>;
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ 
  userId, 
  companyData, 
  setCompanyData 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(companyData?.logo_url || null);
  
  // Initialize form with schema validation
  const form = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(CompanyProfileSchema),
    defaultValues: {
      company_name: companyData?.company_name || '',
      contact_person: companyData?.contact_person || '',
      email: companyData?.email || '',
      phone: companyData?.phone || '',
      street_address: getStreetAddressFromCompanyData(companyData),
      constituency: getConstituencyFromCompanyData(companyData),
      description: companyData?.description || '',
    }
  });

  const handleLogoChange = (url: string) => {
    setLogoUrl(url);
  };

  const onSubmit = async (data: CompanyProfileFormValues) => {
    if (!userId) return;
    
    try {
      setIsSubmitting(true);
      
      // Combine street_address and constituency into a JSON string
      const formattedData = {
        ...data,
        logo_url: logoUrl,
        address: JSON.stringify({
          street_address: data.street_address,
          constituency: data.constituency
        }),
        user_id: userId // Explicitly include user_id to satisfy RLS policy
      };
      
      // Remove the individual fields that we've combined
      delete (formattedData as any).street_address;
      delete (formattedData as any).constituency;
      
      console.log("Saving company profile with data:", formattedData);
      
      let result;
      
      if (companyData) {
        // Update existing profile
        result = await updateCompanyProfile(userId, formattedData);
      } else {
        // Create new profile
        result = await createCompanyProfile(userId, formattedData);
      }
      
      setCompanyData(result);
      console.log("Save result:", result);
      
      toast({
        title: "Profile updated",
        description: "Your company profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Failed to update your company profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center mb-6">
            <CompanyLogoUploader 
              existingLogoUrl={logoUrl}
              onLogoChange={handleLogoChange}
              companyName={form.watch('company_name')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CompanyInformation form={form} />
            <ContactInformation form={form} />
            <AddressInformation form={form} />
            <CompanyDescription form={form} />
          </div>
        </div>
        
        <div className="flex gap-4">
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </form>
    </Form>
  );
};

export default CompanyProfileForm;
