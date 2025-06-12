
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const PolicyUpdater = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const updatePolicies = async () => {
    setIsUpdating(true);
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('update-calendar-policies');
      
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Policies updated successfully! Calendar data is now publicly accessible.');
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-medium mb-2">Update Calendar Policies</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click to enable public access to calendar availability data
      </p>
      <Button onClick={updatePolicies} disabled={isUpdating}>
        {isUpdating ? 'Updating...' : 'Update Policies'}
      </Button>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default PolicyUpdater;
