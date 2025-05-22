
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { deleteVehicle } from '@/services/vehicleService';
import VehicleTable from './VehicleTable';

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
      setDeletingId(id);
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

  return (
    <VehicleTable
      vehicles={vehicles}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      deletingId={deletingId}
    />
  );
};

export default VehicleListing;
