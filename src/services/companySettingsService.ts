
import { supabase } from '@/integrations/supabase/client';

// Get company settings
export const getCompanySettings = async (companyId: string) => {
  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching company settings:", error);
    throw new Error(error.message);
  }

  return data;
};

// Create default settings if they don't exist
export const createDefaultSettings = async (companyId: string) => {
  const { data, error } = await supabase
    .from('company_settings')
    .insert([{ company_id: companyId }])
    .select();

  if (error) {
    console.error("Error creating default settings:", error);
    throw new Error(error.message);
  }

  return data && data.length > 0 ? data[0] : null;
};

// Update company settings
export const updateCompanySettings = async (settingsId: string, settings: any) => {
  const { data, error } = await supabase
    .from('company_settings')
    .update(settings)
    .eq('id', settingsId)
    .select();

  if (error) {
    console.error("Error updating settings:", error);
    throw new Error(error.message);
  }

  return data && data.length > 0 ? data[0] : null;
};
