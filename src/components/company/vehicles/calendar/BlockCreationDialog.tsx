
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface BlockCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDates: Date[];
  isLoading: boolean;
  onCreateBlock: (reason: string) => Promise<void>;
}

const BlockCreationDialog = ({ 
  isOpen, 
  onClose, 
  selectedDates, 
  isLoading, 
  onCreateBlock 
}: BlockCreationDialogProps) => {
  const [blockReason, setBlockReason] = useState('');

  const handleClose = () => {
    setBlockReason('');
    onClose();
  };

  const handleCreate = async () => {
    await onCreateBlock(blockReason);
    setBlockReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Manual Block</DialogTitle>
          <DialogDescription>
            Block dates from {selectedDates.length === 2 ? 
              `${format(selectedDates[0], 'MMM dd, yyyy')} to ${format(selectedDates[1], 'MMM dd, yyyy')}` 
              : 'selected dates'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., maintenance, owner use, etc."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isLoading}
          >
            Create Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockCreationDialog;
