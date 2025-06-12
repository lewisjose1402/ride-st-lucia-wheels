
import { Button } from '@/components/ui/button';
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
import { Trash2 } from 'lucide-react';

interface ClearBlocksActionsProps {
  isLoading: boolean;
  onClearVehicleBlocks: () => void;
  onClearAllCompanyBlocks: () => void;
}

const ClearBlocksActions = ({ 
  isLoading, 
  onClearVehicleBlocks, 
  onClearAllCompanyBlocks 
}: ClearBlocksActionsProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Vehicle Blocks
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Blocks for This Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all manual blocks for this vehicle. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClearVehicleBlocks}>
              Clear Blocks
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Company Blocks
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Blocks for All Vehicles</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all manual blocks for ALL your vehicles. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClearAllCompanyBlocks}>
              Clear All Blocks
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClearBlocksActions;
