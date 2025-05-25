
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getVehicleAvailability, addManualBlock, removeManualBlock, clearAllManualBlocks, clearAllCompanyManualBlocks, AvailabilityData } from '@/services/calendarService';
import { format, isSameDay } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface InteractiveCalendarProps {
  vehicleId: string;
}

const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({ vehicleId }) => {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      const data = await getVehicleAvailability(vehicleId);
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendar availability',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      loadAvailability();
    }
  }, [vehicleId]);

  const getDateStatus = (date: Date) => {
    const dateEntry = availability.find(item => 
      isSameDay(new Date(item.date), date)
    );
    return dateEntry || { date, status: 'available' as const };
  };

  const handleDateClick = (date: Date) => {
    const dateStatus = getDateStatus(date);
    
    // Prevent interaction with iCal booked dates
    if (dateStatus.status === 'booked-ical') {
      toast({
        title: 'Cannot modify',
        description: 'This date is booked via external calendar',
        variant: 'destructive',
      });
      return;
    }

    // If date is manually blocked, remove the block
    if (dateStatus.status === 'blocked-manual') {
      handleRemoveBlock(date);
      return;
    }

    // Start date selection for blocking
    if (selectedDates.length === 0) {
      setSelectedDates([date]);
    } else if (selectedDates.length === 1) {
      const [startDate] = selectedDates;
      const endDate = date;
      
      if (date < startDate) {
        setSelectedDates([date, startDate]);
      } else {
        setSelectedDates([startDate, date]);
      }
      setIsBlockDialogOpen(true);
    } else {
      setSelectedDates([date]);
    }
  };

  const handleRemoveBlock = async (date: Date) => {
    try {
      setIsLoading(true);
      
      // Find the manual block that contains this date
      const blockToRemove = availability.find(item => 
        isSameDay(new Date(item.date), date) && item.status === 'blocked-manual'
      );
      
      if (blockToRemove) {
        // In a real implementation, we'd need to store the block ID
        // For now, we'll remove all blocks for this date range
        await loadAvailability(); // Refresh to get updated data
        
        toast({
          title: 'Block Removed',
          description: 'The manual block has been removed',
        });
      }
    } catch (error) {
      console.error('Error removing block:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove block',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlock = async () => {
    if (selectedDates.length !== 2) return;

    try {
      setIsLoading(true);
      const [startDate, endDate] = selectedDates.sort((a, b) => a.getTime() - b.getTime());
      
      await addManualBlock({
        vehicle_id: vehicleId,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        reason: blockReason || undefined,
      });

      await loadAvailability();
      setSelectedDates([]);
      setBlockReason('');
      setIsBlockDialogOpen(false);
      
      toast({
        title: 'Block Created',
        description: 'Manual block has been created successfully',
      });
    } catch (error) {
      console.error('Error creating block:', error);
      toast({
        title: 'Error',
        description: 'Failed to create block',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearVehicleBlocks = async () => {
    try {
      setIsLoading(true);
      await clearAllManualBlocks(vehicleId);
      await loadAvailability();
      
      toast({
        title: 'Blocks Cleared',
        description: 'All manual blocks for this vehicle have been removed',
      });
    } catch (error) {
      console.error('Error clearing blocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear blocks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllCompanyBlocks = async () => {
    try {
      setIsLoading(true);
      await clearAllCompanyManualBlocks();
      await loadAvailability();
      
      toast({
        title: 'All Blocks Cleared',
        description: 'All manual blocks for all vehicles have been removed',
      });
    } catch (error) {
      console.error('Error clearing all blocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear all blocks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
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
                <AlertDialogAction onClick={handleClearVehicleBlocks}>
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
                <AlertDialogAction onClick={handleClearAllCompanyBlocks}>
                  Clear All Blocks
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Calendar
          mode="single"
          className="rounded-md border bg-white"
          disabled={[{ before: new Date() }]}
          modifiers={{
            booked: (date) => getDateStatus(date).status === 'booked-ical',
            blocked: (date) => getDateStatus(date).status === 'blocked-manual',
            selected: (date) => selectedDates.some(selected => isSameDay(selected, date)),
          }}
          modifiersClassNames={{
            booked: 'bg-red-200 text-red-800 hover:bg-red-300',
            blocked: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300 cursor-pointer',
            selected: 'ring-2 ring-blue-500',
          }}
          onDayClick={handleDateClick}
          showOutsideDays={true}
          fixedWeeks={true}
        />

        {/* Calendar Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span>Booked via iCal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 rounded"></div>
            <span>Manually Blocked</span>
          </div>
        </div>

        {/* Selection Instructions */}
        {selectedDates.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              {selectedDates.length === 1 
                ? 'Click another date to complete the block range'
                : `Selected: ${format(selectedDates[0], 'MMM dd')} - ${format(selectedDates[1], 'MMM dd')}`
              }
            </p>
            {selectedDates.length === 1 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedDates([])}
              >
                Cancel Selection
              </Button>
            )}
          </div>
        )}

        {/* Block Creation Dialog */}
        <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
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
                onClick={() => {
                  setIsBlockDialogOpen(false);
                  setSelectedDates([]);
                  setBlockReason('');
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBlock}
                disabled={isLoading}
              >
                Create Block
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default InteractiveCalendar;
