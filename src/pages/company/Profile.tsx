
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import CompanyLayout from '@/components/company/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getCompanyProfile, updateCompanyProfile, createCompanyProfile } from '@/services/companyService';
import { Building, Phone, Mail, MapPin, User, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const CONSTITUENCIES = [
  'Gros Islet',
  'Babonneau',
  'Castries',
  'Anse La Raye / Canaries',
  'Soufrière',
  'Choiseul',
  'Laborie',
  'Vieux Fort',
  'Micoud',
  'Dennery'
];

// Create a schema for the form
const FormSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  contact_person: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  street_address: z.string().min(5, "Please enter a valid street address"),
  constituency: z.string().min(1, "Please select a constituency"),
  description: z.string().optional(),
});

const CompanyProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  
  // Initialize form with schema validation
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      street_address: '',
      constituency: '',
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
        
        // Parse address field if it exists
        let streetAddress = '';
        let constituency = '';
        
        if (profile.address) {
          try {
            const addressObj = JSON.parse(profile.address);
            streetAddress = addressObj.street_address || '';
            constituency = addressObj.constituency || '';
          } catch (e) {
            streetAddress = profile.address;
          }
        }
        
        // Set form values
        form.reset({
          company_name: profile.company_name || '',
          contact_person: profile.contact_person || '',
          email: profile.email || '',
          phone: profile.phone || '',
          street_address: streetAddress,
          constituency: constituency,
          description: profile.description || '',
        });
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
  }, [user, toast, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Combine street_address and constituency into a JSON string
      const formattedData = {
        ...data,
        address: JSON.stringify({
          street_address: data.street_address,
          constituency: data.constituency
        })
      };
      
      // Remove the individual fields that we've combined
      delete formattedData.street_address;
      delete formattedData.constituency;
      
      console.log("Saving company profile with data:", formattedData);
      
      let result;
      
      if (companyData) {
        // Update existing profile
        result = await updateCompanyProfile(user.id, formattedData);
      } else {
        // Create new profile
        result = await createCompanyProfile(user.id, formattedData);
        setCompanyData(result);
      }
      
      console.log("Save result:", result);
      
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Contact Person
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Primary contact person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="company@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1 758 XXX XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="street_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Street Address
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="constituency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Constituency
                    </FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select constituency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONSTITUENCIES.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell customers about your company..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
      </Form>
    </CompanyLayout>
  );
};

export default CompanyProfile;
