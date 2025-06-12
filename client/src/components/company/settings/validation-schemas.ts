
import { z } from "zod";

export const AvailabilitySettingsSchema = z.object({
  accept_bookings: z.boolean().default(true),
});

export const NotificationSettingsSchema = z.object({
  notification_new_booking: z.boolean().default(true),
  notification_booking_cancellation: z.boolean().default(true),
  notification_booking_fee_collected: z.boolean().default(true),
});

export const BookingRequirementsSchema = z.object({
  require_driver_license: z.boolean().default(true),
  require_minimum_age: z.boolean().default(true),
  require_driving_experience: z.boolean().default(true),
  minimum_driver_age: z.number().min(18).max(100).default(25),
  minimum_driving_experience: z.number().min(0).max(50).default(3),
  require_damage_deposit: z.boolean().default(false),
  damage_deposit_type: z.enum(['Cash', 'Card']).default('Cash'),
  damage_deposit_amount: z.number().min(1).max(10000).default(250),
  minimum_rental_days: z.number().min(1).max(365).default(1),
});

export const SecuritySettingsSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});
