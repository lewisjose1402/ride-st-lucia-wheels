
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import CompanyLayout from "@/components/company/CompanyLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCompanyProfile, getCompanySettings, createDefaultSettings } from "@/services/companyService";
import AvailabilitySettings from "@/components/company/settings/AvailabilitySettings";
import NotificationPreferences from "@/components/company/settings/NotificationPreferences";
import BookingRequirements from "@/components/company/settings/BookingRequirements";
import SecuritySettings from "@/components/company/settings/SecuritySettings";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("availability");
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // First get company data
        const company = await getCompanyProfile(user.id);
        
        if (!company) {
          toast({
            title: "Company profile not found",
            description: "Please complete your company profile before configuring settings",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        setCompanyData(company);
        
        // Then try to get settings
        let settings = await getCompanySettings(company.id);
        
        // If no settings found, create default
        if (!settings) {
          settings = await createDefaultSettings(company.id);
        }
        
        setSettingsData(settings);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error loading settings",
          description: "Failed to load your company settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user, toast]);

  const handleSettingsUpdated = async () => {
    if (!companyData) return;
    
    try {
      const settings = await getCompanySettings(companyData.id);
      setSettingsData(settings);
    } catch (error) {
      console.error("Error refreshing settings:", error);
    }
  };

  return (
    <CompanyLayout title="Settings">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      ) : !settingsData ? (
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <p className="text-center text-gray-600">
            Cannot load settings. Please complete your company profile first.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <Tabs defaultValue="availability" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="booking">Booking Requirements</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="availability">
              <AvailabilitySettings 
                settingsData={settingsData}
                onSettingsUpdated={handleSettingsUpdated}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationPreferences 
                settingsData={settingsData}
                onSettingsUpdated={handleSettingsUpdated}
              />
            </TabsContent>

            <TabsContent value="booking">
              <BookingRequirements 
                settingsData={settingsData}
                onSettingsUpdated={handleSettingsUpdated}
              />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </CompanyLayout>
  );
};

export default Settings;
