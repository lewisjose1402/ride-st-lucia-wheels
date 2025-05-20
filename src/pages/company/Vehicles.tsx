import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import CompanyLayout from '@/components/company/CompanyLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getCompanyVehicles, getCompanyProfile, deleteVehicle } from '@/services/companyService';
import { Car, Plus, Edit, Trash, MoreHorizontal, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CompanyVehicles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const companyProfile = await getCompanyProfile(user.id);
        
        if (!companyProfile) {
          toast({
            title: "Company profile missing",
            description: "Please complete your company profile first",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        setCompanyData(companyProfile);
        
        if (companyProfile.id) {
          try {
            const vehiclesData = await getCompanyVehicles(companyProfile.id);
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
        console.error("Error loading company data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load your company data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVehicles();
  }, [user, toast]);

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    try {
      await deleteVehicle(vehicleToDelete);
      
      // Update local state
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleToDelete));
      
      toast({
        title: "Vehicle deleted",
        description: "Vehicle has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error deleting vehicle",
        description: "Failed to delete the vehicle",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setVehicleToDelete(null);
    }
  };

  return (
    <CompanyLayout title="Manage Vehicles">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Your Vehicles</h2>
          <p className="text-gray-600">Manage all your vehicles in one place</p>
        </div>
        <Link to="/company/vehicles/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
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
                        <div className="font-medium">{vehicle.name}</div>
                        <div className="text-sm text-gray-500">
                          {vehicle.transmission}, {vehicle.seats} seats
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${vehicle.price_per_day}/day</TableCell>
                  <TableCell>{vehicle.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {vehicle.is_available ? 
                        <Check className="h-5 w-5 text-green-500 mr-1" /> : 
                        <X className="h-5 w-5 text-red-500 mr-1" />}
                      {vehicle.is_available ? 'Available' : 'Not Available'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link to={`/company/vehicles/edit/${vehicle.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <AlertDialog open={vehicleToDelete === vehicle.id} onOpenChange={(isOpen) => !isOpen && setVehicleToDelete(null)}>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              setVehicleToDelete(vehicle.id);
                            }}>
                              <Trash className="mr-2 h-4 w-4 text-red-500" />
                              <span className="text-red-500">Delete</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this vehicle? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteVehicle} className="bg-red-500 hover:bg-red-600">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CompanyLayout>
  );
};

export default CompanyVehicles;
