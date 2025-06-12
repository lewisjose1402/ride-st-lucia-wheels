
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface SelectionInstructionsProps {
  selectedDates: Date[];
  onCancelSelection: () => void;
}

const SelectionInstructions = ({ selectedDates, onCancelSelection }: SelectionInstructionsProps) => {
  if (selectedDates.length === 0) return null;

  return (
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
          onClick={onCancelSelection}
        >
          Cancel Selection
        </Button>
      )}
    </div>
  );
};

export default SelectionInstructions;
