
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import CompanyLayout from '@/components/company/CompanyLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCompanyVehicles } from '@/services/companyService';
import { Car, Plus, Star, CalendarRange } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get company directly from rental_companies table
        const { data: company, error: companyError } = await supabase
          .from('rental_companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (companyError) {
          console.error("Error fetching company:", companyError);
          toast({
            title: "Error loading dashboard",
            description: "Failed to load your company data. Please try again later.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        if (!company) {
          // If no company record exists, we need to create one from user metadata
          const { data: userData } = await supabase.auth.getUser();
          const userMetadata = userData?.user?.user_metadata;
          
          if (userMetadata && userMetadata.company_name) {
            // Create a new company record
            const { data: newCompany, error: insertError } = await supabase
              .from('rental_companies')
              .insert([{
                user_id: user.id,
                company_name: userMetadata.company_name,
                email: user.email || '',
                phone: userMetadata.phone || ''
              }])
              .select()
              .single();
            
            if (insertError) {
              console.error("Error creating company:", insertError);
              toast({
                title: "Error setting up company",
                description: "Failed to set up your company profile",
                variant: "destructive",
              });
              setIsLoading(false);
              return;
            }
            
            setCompanyData(newCompany);
            // No vehicles yet for a new company
            setVehicles([]);
          } else {
            toast({
              title: "Company profile missing",
              description: "Please complete your company profile",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
        } else {
          // We have a company, set it and load vehicles
          setCompanyData(company);
          
          try {
            const vehiclesData = await getCompanyVehicles(company.id);
            setVehicles(vehiclesData || []);
          } catch (vehicleError) {
            console.error("Error loading vehicles:", vehicleError);
            toast({
              title: "Error loading vehicles",
              description: "Failed to load your vehicles",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error loading dashboard",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user, toast]);

  if (isLoading) {
    return (
      <CompanyLayout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </CompanyLayout>
    );
  }
  
  // If still no companyData after loading, show missing profile message
  if (!companyData) {
    return (
      <CompanyLayout title="Dashboard">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600">Company Profile Missing</h2>
          <p className="text-gray-600 mt-2 mb-4">
            Your company profile needs to be created before you can access the dashboard.
          </p>
          <Link to="/company/profile">
            <Button>Complete Your Profile</Button>
          </Link>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout title="Dashboard">
      {/* Welcome message */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold">
          Welcome back, {companyData?.company_name || "Company"}!
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your vehicles, bookings, and company profile from your dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-gray-500">Vehicles in your fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-gray-500">Average customer rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarRange className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">Active bookings this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/company/vehicles/add">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add New Vehicle
            </Button>
          </Link>
          <Link to="/company/vehicles">
            <Button variant="outline" className="w-full justify-start">
              <Car className="mr-2 h-4 w-4" />
              Manage Vehicles
            </Button>
          </Link>
          <Link to="/company/profile">
            <Button variant="outline" className="w-full justify-start">
              <Star className="mr-2 h-4 w-4" />
              Update Company Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Vehicles</h3>
          <Link to="/company/vehicles">
            <Button variant="link" className="text-brand-purple p-0">View All</Button>
          </Link>
        </div>
        
        {vehicles.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No vehicles yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first vehicle.</p>
            <div className="mt-6">
              <Link to="/company/vehicles/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Day
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.slice(0, 5).map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {vehicle.vehicle_images?.find((img: any) => img.is_primary)?.image_url ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={vehicle.vehicle_images.find((img: any) => img.is_primary)?.image_url} 
                              alt={vehicle.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Car className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.transmission}, {vehicle.seats} seats
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${vehicle.price_per_day}/day</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicle.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {vehicle.is_available ? 'Available' : 'Not Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
};

export default CompanyDashboard;
