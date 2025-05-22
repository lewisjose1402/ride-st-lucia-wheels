
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteVehicle } from '@/services/vehicleService';
import { Car, Edit, Trash, MoreHorizontal, Check, X, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import VehicleEmptyState from './VehicleEmptyState';

interface VehicleListingProps {
  vehicles: any[];
  setVehicles: React.Dispatch<React.SetStateAction<any[]>>;
  isLoading: boolean;
}

const VehicleListing: React.FC<VehicleListingProps> = ({ vehicles, setVehicles, isLoading }) => {
  const { toast } = useToast();
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return <VehicleEmptyState />;
  }

  return (
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
                    <Link to={`/company/vehicles/edit/${vehicle.id}?tab=calendar`}>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Calendar
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
  );
};

export default VehicleListing;
