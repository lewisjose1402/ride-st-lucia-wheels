
import React from 'react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import VehicleTableRow from './VehicleTableRow';
import LoadingIndicator from './LoadingIndicator';
import VehicleEmptyState from './VehicleEmptyState';

interface VehicleTableProps {
  vehicles: any[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  deletingId: string | null;
}

const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
  deletingId
}) => {
  if (isLoading) {
    return <LoadingIndicator />;
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
            <VehicleTableRow
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
              deletingId={deletingId}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleTable;
