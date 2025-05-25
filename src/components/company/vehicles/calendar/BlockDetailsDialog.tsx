
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { CalendarBlock } from '@/services/calendarService';

interface BlockDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  block: CalendarBlock | null;
  isLoading: boolean;
  onRemoveBlock: (blockId: string) => Promise<void>;
}

const BlockDetailsDialog = ({ 
  isOpen, 
  onClose, 
  block, 
  isLoading, 
  onRemoveBlock 
}: BlockDetailsDialogProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (!block) return;
    
    try {
      setIsRemoving(true);
      await onRemoveBlock(block.id);
      onClose();
    } catch (error) {
      console.error('Error removing block:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  if (!block) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Block Details</DialogTitle>
          <DialogDescription>
            Review the details of this blocked period and choose whether to remove it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700">Date Range</h4>
            <p className="text-sm">
              {format(new Date(block.start_date), 'MMM dd, yyyy')} - {format(new Date(block.end_date), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700">Reason</h4>
            <p className="text-sm">
              {block.reason || 'No reason provided'}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700">Created</h4>
            <p className="text-sm text-gray-600">
              {format(new Date(block.created_at), 'MMM dd, yyyy at HH:mm')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRemoving}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? 'Removing...' : 'Remove Block'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockDetailsDialog;
