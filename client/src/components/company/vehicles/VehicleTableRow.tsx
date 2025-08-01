
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ImageIcon } from 'lucide-react';
import { getAddressFromLocationData } from '@/utils/locationHelpers';

interface VehicleTableRowProps {
  vehicle: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  deletingId: string | null;
}

const VehicleTableRow: React.FC<VehicleTableRowProps> = ({
  vehicle,
  onEdit,
  onDelete,
  isDeleting,
  deletingId
}) => {
  // Function to get vehicle image
  const getVehicleImage = (vehicle: any) => {
    if (!vehicle.vehicle_images || vehicle.vehicle_images.length === 0) {
      return null;
    }
    
    // First try to find the primary image
    const primaryImage = vehicle.vehicle_images.find((img: any) => img.is_primary);
    if (primaryImage) {
      return primaryImage.image_url;
    }
    
    // If no primary image, return the first one
    return vehicle.vehicle_images[0].image_url;
  };

  // Function to format location
  const formatLocation = (location: any) => {
    if (!location) return "N/A";
    
    const { street_address, constituency } = getAddressFromLocationData(location);
    const parts = [];
    if (street_address) parts.push(street_address);
    if (constituency) parts.push(constituency);
    return parts.join(', ') || "N/A";
  };

  const imageUrl = getVehicleImage(vehicle);
  
  return (
    <TableRow key={vehicle.id}>
      <TableCell className="font-medium">
        <div className="flex items-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={vehicle.name}
              className="w-10 h-10 rounded-md object-cover mr-3"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
              <ImageIcon size={16} className="text-gray-500" />
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
            onClick={() => onEdit(vehicle.id)}
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
                  onClick={() => onDelete(vehicle.id)}
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
  );
};

export default VehicleTableRow;
