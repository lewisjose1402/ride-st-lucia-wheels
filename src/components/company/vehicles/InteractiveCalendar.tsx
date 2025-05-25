
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useInteractiveCalendar } from '@/hooks/useInteractiveCalendar';
import CalendarLegend from './calendar/CalendarLegend';
import SelectionInstructions from './calendar/SelectionInstructions';
import ClearBlocksActions from './calendar/ClearBlocksActions';
import BlockCreationDialog from './calendar/BlockCreationDialog';
import BlockDetailsDialog from './calendar/BlockDetailsDialog';
import { isSameDay } from 'date-fns';

interface InteractiveCalendarProps {
  vehicleId: string;
}

const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({ vehicleId }) => {
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  
  const {
    availability,
    selectedDates,
    selectedBlock,
    isLoading,
    getDateStatus,
    handleDateClick,
    handleCreateBlock,
    handleRemoveBlock,
    handleClearVehicleBlocks,
    handleClearAllCompanyBlocks,
    handleCloseBlockDialog,
    setSelectedDates
  } = useInteractiveCalendar({ vehicleId });

  const onDateClick = (date: Date) => {
    handleDateClick(date);
    
    // Open dialog when two dates are selected
    if (selectedDates.length === 1) {
      const dateStatus = getDateStatus(date);
      if (dateStatus.status === 'available') {
        setIsBlockDialogOpen(true);
      }
    }
  };

  const handleBlockCreate = async (reason: string) => {
    await handleCreateBlock(reason);
  };

  const handleCancelSelection = () => {
    setSelectedDates([]);
  };

  const handleDialogClose = () => {
    setIsBlockDialogOpen(false);
    setSelectedDates([]);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ClearBlocksActions
          isLoading={isLoading}
          onClearVehicleBlocks={handleClearVehicleBlocks}
          onClearAllCompanyBlocks={handleClearAllCompanyBlocks}
        />

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
          onDayClick={onDateClick}
          showOutsideDays={true}
          fixedWeeks={true}
        />

        <CalendarLegend />

        <SelectionInstructions
          selectedDates={selectedDates}
          onCancelSelection={handleCancelSelection}
        />

        <BlockCreationDialog
          isOpen={isBlockDialogOpen}
          onClose={handleDialogClose}
          selectedDates={selectedDates}
          isLoading={isLoading}
          onCreateBlock={handleBlockCreate}
        />

        <BlockDetailsDialog
          isOpen={!!selectedBlock}
          onClose={handleCloseBlockDialog}
          block={selectedBlock}
          isLoading={isLoading}
          onRemoveBlock={handleRemoveBlock}
        />
      </div>
    </TooltipProvider>
  );
};

export default InteractiveCalendar;
