import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "./db";
import { supabase } from "./supabase";
import {
  profiles,
  rentalCompanies,
  vehicles,
  vehicleImages,
  bookings,
  companySettings,
  vehicleCalendarFeeds,
  vehicleCalendarBlocks,
  icalBookings,
  reviews,
  contactSubmissions,
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
  users,
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

export class DatabaseStorage implements IStorage {
  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db.update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return result[0];
  }

  // Rental company methods
  async getRentalCompany(id: string): Promise<RentalCompany | undefined> {
    const result = await db.select().from(rentalCompanies).where(eq(rentalCompanies.id, id)).limit(1);
    return result[0];
  }

  async getRentalCompanyByUserId(userId: string): Promise<RentalCompany | undefined> {
    const result = await db.select().from(rentalCompanies).where(eq(rentalCompanies.userId, userId)).limit(1);
    return result[0];
  }

  async createRentalCompany(company: InsertRentalCompany): Promise<RentalCompany> {
    const result = await db.insert(rentalCompanies).values(company).returning();
    return result[0];
  }

  async updateRentalCompany(id: string, company: Partial<InsertRentalCompany>): Promise<RentalCompany | undefined> {
    const result = await db.update(rentalCompanies)
      .set({ ...company, updatedAt: new Date() })
      .where(eq(rentalCompanies.id, id))
      .returning();
    return result[0];
  }

  async getAllRentalCompanies(): Promise<RentalCompany[]> {
    try {
      // Try Drizzle first, fall back to Supabase client
      try {
        return await db.select().from(rentalCompanies).orderBy(desc(rentalCompanies.createdAt));
      } catch (drizzleError) {
        console.log('Drizzle connection failed, trying Supabase client...');
        const { data, error } = await supabase
          .from('rental_companies')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        return data || [];
      }
    } catch (error) {
      console.error('Error getting all rental companies:', error);
      throw error;
    }
  }

  // Vehicle methods
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
    return result[0];
  }

  async getVehiclesByCompanyId(companyId: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles)
      .where(eq(vehicles.companyId, companyId))
      .orderBy(desc(vehicles.createdAt));
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      // Try Drizzle first, fall back to Supabase client
      try {
        // Join with rental companies to filter out vehicles from deactivated companies
        const result = await db.select({
          vehicle: vehicles,
        }).from(vehicles)
          .innerJoin(rentalCompanies, eq(vehicles.companyId, rentalCompanies.id))
          .where(and(
            eq(vehicles.isAvailable, true),
            eq(rentalCompanies.isApproved, true)
          ))
          .orderBy(desc(vehicles.createdAt));
        
        return result.map(r => r.vehicle);
      } catch (drizzleError) {
        console.log('Drizzle connection failed, trying Supabase client...');
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
          throw error;
        }
        
        return data || [];
      }
    } catch (error) {
      console.error('Error getting all vehicles:', error);
      throw error;
    }
  }

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    try {
      // Join with rental companies to filter out vehicles from deactivated companies
      const result = await db.select({
        vehicle: vehicles,
      }).from(vehicles)
        .innerJoin(rentalCompanies, eq(vehicles.companyId, rentalCompanies.id))
        .where(and(
          eq(vehicles.isAvailable, true),
          eq(vehicles.isFeatured, true),
          eq(rentalCompanies.isApproved, true)
        ))
        .orderBy(desc(vehicles.createdAt))
        .limit(6);
      
      return result.map(r => r.vehicle);
    } catch (error) {
      console.error('Error getting featured vehicles:', error);
      throw error;
    }
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const result = await db.insert(vehicles).values(vehicle).returning();
    return result[0];
  }

  async updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const result = await db.update(vehicles)
      .set({ ...vehicle, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning();
    return result[0];
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const result = await db.delete(vehicles).where(eq(vehicles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Vehicle image methods
  async getVehicleImages(vehicleId: string): Promise<VehicleImage[]> {
    return await db.select().from(vehicleImages)
      .where(eq(vehicleImages.vehicleId, vehicleId))
      .orderBy(desc(vehicleImages.isPrimary), desc(vehicleImages.createdAt));
  }

  async addVehicleImage(image: InsertVehicleImage): Promise<VehicleImage> {
    const result = await db.insert(vehicleImages).values(image).returning();
    return result[0];
  }

  async deleteVehicleImage(id: string): Promise<boolean> {
    const result = await db.delete(vehicleImages).where(eq(vehicleImages.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async setPrimaryVehicleImage(vehicleId: string, imageId: string): Promise<boolean> {
    // First, set all images for this vehicle to non-primary
    await db.update(vehicleImages)
      .set({ isPrimary: false })
      .where(eq(vehicleImages.vehicleId, vehicleId));
    
    // Then set the specified image as primary
    const result = await db.update(vehicleImages)
      .set({ isPrimary: true })
      .where(and(eq(vehicleImages.id, imageId), eq(vehicleImages.vehicleId, vehicleId)));
    
    return (result.rowCount ?? 0) > 0;
  }

  // Booking methods
  async getBooking(id: string): Promise<Booking | undefined> {
    try {
      // Try Drizzle first, fall back to Supabase client
      try {
        const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
        return result[0];
      } catch (drizzleError) {
        console.log('Drizzle connection failed, trying Supabase client...');
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No rows found
            return undefined;
          }
          throw error;
        }
        
        return data;
      }
    } catch (error) {
      console.error('Error getting booking:', error);
      throw error;
    }
  }

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBookingsByCompanyId(companyId: string): Promise<Booking[]> {
    // Join with vehicles to get bookings for a company
    const result = await db.select({
      booking: bookings,
    }).from(bookings)
      .innerJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
      .where(eq(vehicles.companyId, companyId))
      .orderBy(desc(bookings.createdAt));
    
    return result.map(r => r.booking);
  }

  async getBookingsByVehicleId(vehicleId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.vehicleId, vehicleId))
      .orderBy(desc(bookings.createdAt));
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      // Try Drizzle first, fall back to Supabase client
      try {
        return await db.select().from(bookings)
          .orderBy(desc(bookings.createdAt));
      } catch (drizzleError) {
        console.log('Drizzle connection failed, trying Supabase client...');
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        return data || [];
      }
    } catch (error) {
      console.error('Error getting all bookings:', error);
      throw error;
    }
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }

  async updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const result = await db.update(bookings)
      .set({ ...booking, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return result[0];
  }

  async cancelBooking(id: string): Promise<boolean> {
    const result = await db.update(bookings)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(bookings.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Company settings methods
  async getCompanySettings(companyId: string): Promise<CompanySettings | undefined> {
    const result = await db.select().from(companySettings)
      .where(eq(companySettings.companyId, companyId)).limit(1);
    return result[0];
  }

  async createCompanySettings(settings: InsertCompanySettings): Promise<CompanySettings> {
    const result = await db.insert(companySettings).values(settings).returning();
    return result[0];
  }

  async updateCompanySettings(id: string, settings: Partial<InsertCompanySettings>): Promise<CompanySettings | undefined> {
    const result = await db.update(companySettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(companySettings.id, id))
      .returning();
    return result[0];
  }

  // Calendar methods
  async getVehicleCalendarFeeds(vehicleId: string): Promise<VehicleCalendarFeed[]> {
    return await db.select().from(vehicleCalendarFeeds)
      .where(eq(vehicleCalendarFeeds.vehicleId, vehicleId))
      .orderBy(desc(vehicleCalendarFeeds.createdAt));
  }

  async addCalendarFeed(feed: Partial<VehicleCalendarFeed>): Promise<VehicleCalendarFeed> {
    const result = await db.insert(vehicleCalendarFeeds).values(feed as any).returning();
    return result[0];
  }

  async deleteCalendarFeed(id: string): Promise<boolean> {
    const result = await db.delete(vehicleCalendarFeeds).where(eq(vehicleCalendarFeeds.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getVehicleCalendarBlocks(vehicleId: string): Promise<VehicleCalendarBlock[]> {
    return await db.select().from(vehicleCalendarBlocks)
      .where(eq(vehicleCalendarBlocks.vehicleId, vehicleId))
      .orderBy(desc(vehicleCalendarBlocks.createdAt));
  }

  async addCalendarBlock(block: Partial<VehicleCalendarBlock>): Promise<VehicleCalendarBlock> {
    const result = await db.insert(vehicleCalendarBlocks).values(block as any).returning();
    return result[0];
  }

  async deleteCalendarBlock(id: string): Promise<boolean> {
    const result = await db.delete(vehicleCalendarBlocks).where(eq(vehicleCalendarBlocks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getIcalBookings(vehicleId: string): Promise<IcalBooking[]> {
    return await db.select().from(icalBookings)
      .where(eq(icalBookings.vehicleId, vehicleId))
      .orderBy(desc(icalBookings.createdAt));
  }

  async addIcalBooking(booking: Partial<IcalBooking>): Promise<IcalBooking> {
    const result = await db.insert(icalBookings).values(booking as any).returning();
    return result[0];
  }

  async clearIcalBookings(feedId: string): Promise<boolean> {
    const result = await db.delete(icalBookings).where(eq(icalBookings.sourceFeedId, feedId));
    return (result.rowCount ?? 0) > 0;
  }

  // Legacy user methods (for compatibility)
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Contact submission methods
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    try {
      const result = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
      return result;
    } catch (error) {
      console.error('Drizzle connection failed, trying direct SQL query...');
      const { data, error: supabaseError } = await supabase.rpc('sql', {
        query: 'SELECT * FROM contact_submissions ORDER BY created_at DESC'
      });
      
      if (supabaseError) throw supabaseError;
      return data || [];
    }
  }

  async getContactSubmission(id: string): Promise<ContactSubmission | undefined> {
    try {
      const result = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Drizzle connection failed, trying Supabase client...');
      const { data, error: supabaseError } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (supabaseError) throw supabaseError;
      return data;
    }
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    try {
      const result = await db.insert(contactSubmissions).values(submission).returning();
      return result[0];
    } catch (error) {
      console.error('Drizzle connection failed, trying Supabase client...');
      const { data, error: supabaseError } = await supabase
        .from('contact_submissions')
        .insert(submission)
        .select()
        .single();
      
      if (supabaseError) throw supabaseError;
      return data;
    }
  }

  async updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined> {
    try {
      const result = await db.update(contactSubmissions)
        .set({ status, updatedAt: new Date() })
        .where(eq(contactSubmissions.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Drizzle connection failed, trying Supabase client...');
      const { data, error: supabaseError } = await supabase
        .from('contact_submissions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (supabaseError) throw supabaseError;
      return data;
    }
  }
}

export const storage = new DatabaseStorage();
