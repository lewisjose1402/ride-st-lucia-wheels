import { supabase } from "./supabase";
import {
  type Profile,
  type InsertProfile,
  type RentalCompany,
  type InsertRentalCompany,
  type Vehicle,
  type InsertVehicle,
  type VehicleImage,
  type InsertVehicleImage,
  type Booking,
  type InsertBooking,
  type CompanySettings,
  type InsertCompanySettings,
  type VehicleCalendarFeed,
  type VehicleCalendarBlock,
  type IcalBooking,
  type ContactSubmission,
  type InsertContactSubmission,
  type User,
  type InsertUser
} from "@shared/schema";

export interface IStorage {
  // User/Profile management
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Rental company management
  getRentalCompany(id: string): Promise<RentalCompany | undefined>;
  getRentalCompanyByUserId(userId: string): Promise<RentalCompany | undefined>;
  createRentalCompany(company: InsertRentalCompany): Promise<RentalCompany>;
  updateRentalCompany(id: string, company: Partial<InsertRentalCompany>): Promise<RentalCompany | undefined>;
  getAllRentalCompanies(): Promise<RentalCompany[]>;
  
  // Vehicle management
  getVehicle(id: string): Promise<Vehicle | undefined>;
  getVehiclesByCompanyId(companyId: string): Promise<Vehicle[]>;
  getAllVehicles(): Promise<Vehicle[]>;
  getFeaturedVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<boolean>;
  
  // Vehicle images
  getVehicleImages(vehicleId: string): Promise<VehicleImage[]>;
  addVehicleImage(image: InsertVehicleImage): Promise<VehicleImage>;
  deleteVehicleImage(id: string): Promise<boolean>;
  setPrimaryVehicleImage(vehicleId: string, imageId: string): Promise<boolean>;
  
  // Booking management
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByUserId(userId: string): Promise<Booking[]>;
  getBookingsByCompanyId(companyId: string): Promise<Booking[]>;
  getBookingsByVehicleId(vehicleId: string): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  cancelBooking(id: string): Promise<boolean>;
  
  // Company settings
  getCompanySettings(companyId: string): Promise<CompanySettings | undefined>;
  createCompanySettings(settings: InsertCompanySettings): Promise<CompanySettings>;
  updateCompanySettings(id: string, settings: Partial<InsertCompanySettings>): Promise<CompanySettings | undefined>;
  
  // Calendar management
  getVehicleCalendarFeeds(vehicleId: string): Promise<VehicleCalendarFeed[]>;
  addCalendarFeed(feed: Partial<VehicleCalendarFeed>): Promise<VehicleCalendarFeed>;
  deleteCalendarFeed(id: string): Promise<boolean>;
  
  getVehicleCalendarBlocks(vehicleId: string): Promise<VehicleCalendarBlock[]>;
  addCalendarBlock(block: Partial<VehicleCalendarBlock>): Promise<VehicleCalendarBlock>;
  deleteCalendarBlock(id: string): Promise<boolean>;
  
  getIcalBookings(vehicleId: string): Promise<IcalBooking[]>;
  addIcalBooking(booking: Partial<IcalBooking>): Promise<IcalBooking>;
  clearIcalBookings(feedId: string): Promise<boolean>;
  
  // Contact submission management
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmission(id: string): Promise<ContactSubmission | undefined>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined>;
  
  // Legacy user methods (for compatibility during migration)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class SupabaseStorage implements IStorage {
  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting profile:', error);
      return undefined;
    }
    return data || undefined;
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error getting profile by email:', error);
      return undefined;
    }
    return data || undefined;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    return data;
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...profile, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return undefined;
    }
    return data || undefined;
  }

  // Rental company methods
  async getRentalCompany(id: string): Promise<RentalCompany | undefined> {
    const { data, error } = await supabase
      .from('rental_companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting rental company:', error);
      return undefined;
    }
    return data || undefined;
  }

  async getRentalCompanyByUserId(userId: string): Promise<RentalCompany | undefined> {
    const { data, error } = await supabase
      .from('rental_companies')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error getting rental company by user ID:', error);
      return undefined;
    }
    return data || undefined;
  }

  async createRentalCompany(company: InsertRentalCompany): Promise<RentalCompany> {
    const { data, error } = await supabase
      .from('rental_companies')
      .insert(company)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating rental company:', error);
      throw error;
    }
    return data;
  }

  async updateRentalCompany(id: string, company: any): Promise<RentalCompany | undefined> {
    console.log('Updating company with data:', company);
    const { data, error } = await supabase
      .from('rental_companies')
      .update({ ...company, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating rental company:', error);
      return undefined;
    }
    return data || undefined;
  }

  async getAllRentalCompanies(): Promise<RentalCompany[]> {
    const { data, error } = await supabase
      .from('rental_companies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting all rental companies:', error);
      throw error;
    }
    
    return data || [];
  }

  // Helper method to check if a company accepts bookings
  async getCompanyAcceptBookingsStatus(companyId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('company_settings')
      .select('accept_bookings')
      .eq('company_id', companyId)
      .single();
    
    if (error) {
      // If no settings exist, default to accepting bookings (true)
      return true;
    }
    
    // Return the actual setting value, defaulting to true if null
    return data?.accept_bookings ?? true;
  }

  // Vehicle methods - CRITICAL: These now filter by company approval status AND accept_bookings setting
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        rental_companies!inner(is_approved)
      `)
      .eq('id', id)
      .eq('rental_companies.is_approved', true)
      .single();
    
    if (error) {
      console.error('Error getting vehicle:', error);
      return undefined;
    }
    
    if (!data) return undefined;
    
    // Check company settings for accept_bookings
    const { data: settings } = await supabase
      .from('company_settings')
      .select('accept_bookings')
      .eq('company_id', data.company_id)
      .single();
    
    // Default to true if no settings exist, otherwise use the actual value
    const acceptsBookings = settings?.accept_bookings ?? true;
    if (!acceptsBookings) {
      return undefined; // Hide vehicle if company doesn't accept bookings
    }
    
    return data;
  }

  async getVehiclesByCompanyId(companyId: string): Promise<Vehicle[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting vehicles by company ID:', error);
      throw error;
    }
    return data || [];
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        rental_companies!inner(is_approved)
      `)
      .eq('is_available', true)
      .eq('rental_companies.is_approved', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting all vehicles:', error);
      throw error;
    }
    
    if (!data) return [];
    
    // Filter vehicles by company accept_bookings status
    const filteredVehicles = [];
    for (const vehicle of data) {
      const { data: settings } = await supabase
        .from('company_settings')
        .select('accept_bookings')
        .eq('company_id', vehicle.company_id)
        .single();
      
      // Default to true if no settings exist, otherwise use the actual value
      const acceptsBookings = settings?.accept_bookings ?? true;
      if (acceptsBookings) {
        filteredVehicles.push(vehicle);
      }
    }
    
    return filteredVehicles;
  }

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        rental_companies!inner(is_approved)
      `)
      .eq('is_available', true)
      .eq('is_featured', true)
      .eq('rental_companies.is_approved', true)
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (error) {
      console.error('Error getting featured vehicles:', error);
      throw error;
    }
    
    if (!data) return [];
    
    // Filter featured vehicles by company accept_bookings status
    const filteredVehicles = [];
    for (const vehicle of data) {
      const { data: settings } = await supabase
        .from('company_settings')
        .select('accept_bookings')
        .eq('company_id', vehicle.company_id)
        .single();
      
      // Default to true if no settings exist, otherwise use the actual value
      const acceptsBookings = settings?.accept_bookings ?? true;
      if (acceptsBookings) {
        filteredVehicles.push(vehicle);
      }
    }
    
    return filteredVehicles;
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicle)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
    return data;
  }

  async updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const { data, error } = await supabase
      .from('vehicles')
      .update({ ...vehicle, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating vehicle:', error);
      return undefined;
    }
    return data || undefined;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting vehicle:', error);
      return false;
    }
    return true;
  }

  // Vehicle image methods
  async getVehicleImages(vehicleId: string): Promise<VehicleImage[]> {
    const { data, error } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting vehicle images:', error);
      return [];
    }
    return data || [];
  }

  async addVehicleImage(image: InsertVehicleImage): Promise<VehicleImage> {
    const { data, error } = await supabase
      .from('vehicle_images')
      .insert(image)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding vehicle image:', error);
      throw error;
    }
    return data;
  }

  async deleteVehicleImage(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting vehicle image:', error);
      return false;
    }
    return true;
  }

  async setPrimaryVehicleImage(vehicleId: string, imageId: string): Promise<boolean> {
    // First, set all images for this vehicle to non-primary
    const { error: resetError } = await supabase
      .from('vehicle_images')
      .update({ is_primary: false })
      .eq('vehicle_id', vehicleId);
    
    if (resetError) {
      console.error('Error resetting primary images:', resetError);
      return false;
    }
    
    // Then set the specific image as primary
    const { error } = await supabase
      .from('vehicle_images')
      .update({ is_primary: true })
      .eq('id', imageId);
    
    if (error) {
      console.error('Error setting primary image:', error);
      return false;
    }
    return true;
  }

  // Booking methods
  async getBooking(id: string): Promise<Booking | undefined> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting booking:', error);
      return undefined;
    }
    return data || undefined;
  }

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting bookings by user ID:', error);
      return [];
    }
    return data || [];
  }

  async getBookingsByCompanyId(companyId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicles!inner(company_id)
      `)
      .eq('vehicles.company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting bookings by company ID:', error);
      return [];
    }
    return data || [];
  }

  async getBookingsByVehicleId(vehicleId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting bookings by vehicle ID:', error);
      return [];
    }
    return data || [];
  }

  async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting all bookings:', error);
      return [];
    }
    return data || [];
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
    return data;
  }

  async updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ ...booking, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating booking:', error);
      return undefined;
    }
    return data || undefined;
  }

  async cancelBooking(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error cancelling booking:', error);
      return false;
    }
    return !!data;
  }

  // Company settings methods
  async getCompanySettings(companyId: string): Promise<CompanySettings | undefined> {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('company_id', companyId)
      .single();
    
    if (error) {
      console.error('Error getting company settings:', error);
      return undefined;
    }
    return data || undefined;
  }

  async createCompanySettings(settings: InsertCompanySettings): Promise<CompanySettings> {
    const { data, error } = await supabase
      .from('company_settings')
      .insert(settings)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating company settings:', error);
      throw error;
    }
    return data;
  }

  async updateCompanySettings(id: string, settings: Partial<InsertCompanySettings>): Promise<CompanySettings | undefined> {
    const { data, error } = await supabase
      .from('company_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating company settings:', error);
      return undefined;
    }
    return data || undefined;
  }

  // Calendar management methods
  async getVehicleCalendarFeeds(vehicleId: string): Promise<VehicleCalendarFeed[]> {
    const { data, error } = await supabase
      .from('vehicle_calendar_feeds')
      .select('*')
      .eq('vehicle_id', vehicleId);
    
    if (error) {
      console.error('Error getting calendar feeds:', error);
      return [];
    }
    return data || [];
  }

  async addCalendarFeed(feed: Partial<VehicleCalendarFeed>): Promise<VehicleCalendarFeed> {
    const { data, error } = await supabase
      .from('vehicle_calendar_feeds')
      .insert(feed)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding calendar feed:', error);
      throw error;
    }
    return data;
  }

  async deleteCalendarFeed(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('vehicle_calendar_feeds')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting calendar feed:', error);
      return false;
    }
    return true;
  }

  async getVehicleCalendarBlocks(vehicleId: string): Promise<VehicleCalendarBlock[]> {
    const { data, error } = await supabase
      .from('vehicle_calendar_blocks')
      .select('*')
      .eq('vehicle_id', vehicleId);
    
    if (error) {
      console.error('Error getting calendar blocks:', error);
      return [];
    }
    return data || [];
  }

  async addCalendarBlock(block: Partial<VehicleCalendarBlock>): Promise<VehicleCalendarBlock> {
    const { data, error } = await supabase
      .from('vehicle_calendar_blocks')
      .insert(block)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding calendar block:', error);
      throw error;
    }
    return data;
  }

  async deleteCalendarBlock(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('vehicle_calendar_blocks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting calendar block:', error);
      return false;
    }
    return true;
  }

  async getIcalBookings(vehicleId: string): Promise<IcalBooking[]> {
    const { data, error } = await supabase
      .from('ical_bookings')
      .select('*')
      .eq('vehicle_id', vehicleId);
    
    if (error) {
      console.error('Error getting iCal bookings:', error);
      return [];
    }
    return data || [];
  }

  async addIcalBooking(booking: Partial<IcalBooking>): Promise<IcalBooking> {
    const { data, error } = await supabase
      .from('ical_bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding iCal booking:', error);
      throw error;
    }
    return data;
  }

  async clearIcalBookings(feedId: string): Promise<boolean> {
    const { error } = await supabase
      .from('ical_bookings')
      .delete()
      .eq('feed_id', feedId);
    
    if (error) {
      console.error('Error clearing iCal bookings:', error);
      return false;
    }
    return true;
  }

  // Contact submission methods
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting contact submissions:', error);
      return [];
    }
    return data || [];
  }

  async getContactSubmission(id: string): Promise<ContactSubmission | undefined> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting contact submission:', error);
      return undefined;
    }
    return data || undefined;
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert(submission)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact submission:', error);
      throw error;
    }
    return data;
  }

  async updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating contact submission status:', error);
      return undefined;
    }
    return data || undefined;
  }

  // Legacy user methods (minimal implementation for compatibility)
  async getUser(id: number): Promise<User | undefined> {
    // Legacy method - not used in current application
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Legacy method - not used in current application
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    // Legacy method - not used in current application
    throw new Error('Legacy user creation not supported');
  }
}

export const storage = new SupabaseStorage();