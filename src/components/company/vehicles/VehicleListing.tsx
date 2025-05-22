
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { deleteVehicle } from '@/services/vehicleService';
import VehicleEmptyState from './VehicleEmptyState';

interface VehicleListingProps {
  vehicles: any[];
  setVehicles: React.Dispatch<React.SetStateAction<any[]>>;
  isLoading: boolean;
}

const VehicleListing: React.FC<VehicleListingProps> = ({ vehicles, setVehicles, isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleEdit = (id: string) => {
    navigate(`/company/vehicles/edit/${id}`);
  };
  
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteVehicle(id);
      
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      
      toast({
        title: "Vehicle deleted",
        description: "Vehicle has been removed successfully",
      });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast({
        title: "Error deleting vehicle",
        description: error instanceof Error ? error.message : "Failed to delete vehicle",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // Function to format location from object or string
  const formatLocation = (location: any) => {
    if (!location) return "N/A";
    
    // If location is an object with constituency and street_address
    if (typeof location === 'object' && location !== null) {
      const parts = [];
      if (location.street_address) parts.push(location.street_address);
      if (location.constituency) parts.push(location.constituency);
      return parts.join(', ') || "N/A";
    }
    
    // If it's a string or anything else, convert to string
    return String(location);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return <VehicleEmptyState />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableCaption>List of your vehicles</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Price/Day</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map(vehicle => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {vehicle.vehicle_images && vehicle.vehicle_images.length > 0 ? (
                    <img 
                      src={vehicle.vehicle_images.find(img => img.is_primary)?.image_url || vehicle.vehicle_images[0].image_url} 
                      alt={vehicle.name}
                      className="w-10 h-10 rounded-md object-cover mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                      <span className="text-xs text-gray-500">No img</span>
                    </div>
                  )}
                  <span>{vehicle.name}</span>
                </div>
              </TableCell>
              <TableCell>${vehicle.price_per_day}</TableCell>
              <TableCell className="hidden md:table-cell">{formatLocation(vehicle.location)}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {vehicle.is_available ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Unavailable</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEdit(vehicle.id)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 w-8 p-0 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete vehicle</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this vehicle? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(vehicle.id)}
                          disabled={isDeleting && deletingId === vehicle.id}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                          {isDeleting && deletingId === vehicle.id ? (
                            <span className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Deleting...
                            </span>
                          ) : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleListing;
