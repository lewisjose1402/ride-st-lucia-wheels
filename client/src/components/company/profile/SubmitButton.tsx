
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <Button 
      type="submit" 
      className="bg-brand-purple hover:bg-brand-purple-dark" 
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
