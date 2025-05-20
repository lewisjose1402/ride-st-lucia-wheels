import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import CompanyLayout from '@/components/company/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getCompanyProfile, updateCompanyProfile } from '@/services/companyService';
import { Building, Phone, Mail, MapPin, User, Save } from 'lucide-react';

const CompanyProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      description: '',
    }
  });

  useEffect(() => {
    const loadCompanyProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const profile = await getCompanyProfile(user.id);
        
        if (!profile) {
          // Handle case where profile doesn't exist
          toast({
            title: "Company profile not found",
            description: "Please complete your company profile information",
            variant: "destructive",
          });
          setCompanyData(null);
          setIsLoading(false);
          return;
        }
        
        setCompanyData(profile);
        
        // Set form values
        setValue('company_name', profile.company_name || '');
        setValue('contact_person', profile.contact_person || '');
        setValue('email', profile.email || '');
        setValue('phone', profile.phone || '');
        setValue('address', profile.address || '');
        setValue('description', profile.description || '');
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
  }, [user, toast, setValue]);

  const onSubmit = async (data: any) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      await updateCompanyProfile(user.id, data);
      
      toast({
        title: "Profile updated",
        description: "Your company profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Failed to update your company profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <CompanyLayout title="Company Profile">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout title="Company Profile">
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <h2 className="text-xl font-semibold">Company Information</h2>
        <p className="text-gray-600">Update your company profile information</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_name" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Company Name
              </Label>
              <Input
                id="company_name"
                placeholder="Your company name"
                {...register('company_name', { required: 'Company name is required' })}
              />
              {errors.company_name && (
                <p className="text-sm text-red-500">{errors.company_name.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_person" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Contact Person
              </Label>
              <Input
                id="contact_person"
                placeholder="Primary contact person"
                {...register('contact_person')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="company@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+1 758 XXX XXXX"
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Address
              </Label>
              <Input
                id="address"
                placeholder="Your business address"
                {...register('address')}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                placeholder="Tell customers about your company..."
                className="min-h-[150px]"
                {...register('description')}
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="bg-brand-purple hover:bg-brand-purple-dark" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </CompanyLayout>
  );
};

export default CompanyProfile;
