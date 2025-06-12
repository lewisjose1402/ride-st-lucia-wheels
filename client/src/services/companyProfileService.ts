
import { supabase } from '@/integrations/supabase/client';

// Get company profile by user ID
export const getCompanyProfile = async (userId: string) => {
  // Use select() without single() to avoid errors when multiple or no records are found
  const { data, error } = await supabase
    .from('rental_companies')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching company profile:", error);
    throw new Error(error.message);
  }

  // Return the first company record or null
  return data && data.length > 0 ? data[0] : null;
};

// Update company profile
export const updateCompanyProfile = async (userId: string, companyData: any) => {
  console.log("Updating company profile with data:", companyData);
  
  const { data, error } = await supabase
    .from('rental_companies')
    .update(companyData)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error("Error updating company profile:", error);
    throw new Error(error.message);
  }

  return data && data.length > 0 ? data[0] : null;
};

// Create company profile if it doesn't exist
export const createCompanyProfile = async (userId: string, companyData: any) => {
  console.log("Creating company profile with data:", companyData);
  
  const { data, error } = await supabase
    .from('rental_companies')
    .insert([{ ...companyData, user_id: userId }])
    .select();

  if (error) {
    console.error("Error creating company profile:", error);
    throw new Error(error.message);
  }

  return data && data.length > 0 ? data[0] : null;
};
