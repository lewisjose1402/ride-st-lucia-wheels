import { pgTable, text, serial, integer, boolean, uuid, timestamp, numeric, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "rental_company", "renter"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled", "completed"]);

// Profiles table (equivalent to Supabase auth.users)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  role: userRoleEnum("role").default("renter"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rental companies
export const rentalCompanies = pgTable("rental_companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  description: text("description"),
  logoUrl: text("logo_url"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicle types
export const vehicleTypes = pgTable("vehicle_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vehicles
export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => rentalCompanies.id),
  name: text("name").notNull(),
  description: text("description"),
  typeId: integer("type_id").references(() => vehicleTypes.id),
  transmission: text("transmission").notNull(),
  seats: integer("seats").notNull(),
  pricePerDay: numeric("price_per_day", { precision: 10, scale: 2 }).notNull(),
  features: json("features"),
  location: json("location"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  isFeatured: boolean("is_featured").default(false),
  isAvailable: boolean("is_available").default(true),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  feedToken: text("feed_token"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicle images
export const vehicleImages = pgTable("vehicle_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  userId: uuid("user_id").references(() => profiles.id),
  pickupDate: text("pickup_date").notNull(),
  dropoffDate: text("dropoff_date").notNull(),
  driverName: text("driver_name").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phoneNumber: text("phone_number"),
  driverAge: integer("driver_age").notNull(),
  drivingExperience: integer("driving_experience"),
  hasInternationalLicense: boolean("has_international_license").default(false),
  deliveryLocation: text("delivery_location"),
  driverLicenseUrl: text("driver_license_url"),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  depositAmount: numeric("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  confirmationFeePaid: numeric("confirmation_fee_paid", { precision: 10, scale: 2 }),
  permitFee: numeric("permit_fee", { precision: 10, scale: 2 }),
  youngDriverFee: numeric("young_driver_fee", { precision: 10, scale: 2 }),
  status: bookingStatusEnum("status").default("pending"),
  paymentStatus: text("payment_status"),
  paymentId: text("payment_id"),
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company settings
export const companySettings = pgTable("company_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => rentalCompanies.id),
  acceptBookings: boolean("accept_bookings").default(true),
  requireDriverLicense: boolean("require_driver_license").default(true),
  requireMinimumAge: boolean("require_minimum_age").default(true),
  minimumDriverAge: integer("minimum_driver_age").default(21),
  requireDrivingExperience: boolean("require_driving_experience").default(false),
  minimumDrivingExperience: integer("minimum_driving_experience").default(1),
  minimumRentalDays: integer("minimum_rental_days").default(1),
  requireDamageDeposit: boolean("require_damage_deposit").default(true),
  damageDepositAmount: numeric("damage_deposit_amount", { precision: 10, scale: 2 }).default("500"),
  damageDepositType: text("damage_deposit_type").default("cash"),
  notificationNewBooking: boolean("notification_new_booking").default(true),
  notificationBookingCancellation: boolean("notification_booking_cancellation").default(true),
  notificationBookingFeeCollected: boolean("notification_booking_fee_collected").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicle calendar feeds
export const vehicleCalendarFeeds = pgTable("vehicle_calendar_feeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id),
  feedName: text("feed_name").notNull(),
  feedUrl: text("feed_url").notNull(),
  description: text("description"),
  isExternal: boolean("is_external").default(true),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicle calendar blocks
export const vehicleCalendarBlocks = pgTable("vehicle_calendar_blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  reason: text("reason"),
  createdByUserId: uuid("created_by_user_id").references(() => profiles.id),
  bookingId: uuid("booking_id").references(() => bookings.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// iCal bookings
export const icalBookings = pgTable("ical_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id),
  externalEventId: text("external_event_id").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  summary: text("summary"),
  sourceFeedId: uuid("source_feed_id").references(() => vehicleCalendarFeeds.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  companyId: uuid("company_id").references(() => rentalCompanies.id),
  bookingId: uuid("booking_id").references(() => bookings.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRentalCompanySchema = createInsertSchema(rentalCompanies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySettingsSchema = createInsertSchema(companySettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type RentalCompany = typeof rentalCompanies.$inferSelect;
export type InsertRentalCompany = z.infer<typeof insertRentalCompanySchema>;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type VehicleImage = typeof vehicleImages.$inferSelect;
export type InsertVehicleImage = typeof vehicleImages.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type CompanySettings = typeof companySettings.$inferSelect;
export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;

export type VehicleCalendarFeed = typeof vehicleCalendarFeeds.$inferSelect;
export type VehicleCalendarBlock = typeof vehicleCalendarBlocks.$inferSelect;
export type IcalBooking = typeof icalBookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;

// Legacy compatibility (keeping for now during migration)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
