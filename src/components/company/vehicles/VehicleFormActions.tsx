
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';

interface VehicleFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
}

const VehicleFormActions: React.FC<VehicleFormActionsProps> = ({ isSubmitting, isEditMode }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-4">
      <Button 
        type="submit" 
        className="bg-brand-purple hover:bg-brand-purple-dark" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {isEditMode ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            <Car className="mr-2 h-4 w-4" />
            {isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
          </>
        )}
      </Button>
      
      <Button 
        type="button" 
        variant="outline"
        onClick={() => navigate('/company/vehicles')}
      >
        Cancel
      </Button>
    </div>
  );
};

export default VehicleFormActions;
