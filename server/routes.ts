import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertRentalCompanySchema, insertVehicleSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { getEmailService } from "./services/emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication & Profiles
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, role, companyName } = req.body;
      
      // Create profile
      const profileData = {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        role: role || 'renter'
      };
      
      const profile = await storage.createProfile(profileData);
      
      // If registering as rental company, create company record
      if (role === 'rental_company' && companyName) {
        await storage.createRentalCompany({
          userId: profile.id,
          companyName,
          email,
          phone: '',
        });
      }

      // Send welcome email based on role
      const emailService = getEmailService();
      if (emailService) {
        try {
          if (role === 'renter' || !role) {
            // Send welcome email to new renter
            await emailService.sendWelcomeEmail(email, firstName, lastName);
            console.log(`Welcome email sent to new renter: ${email}`);
          } else if (role === 'rental_company' && companyName) {
            // Send company signup notification (when you create that template)
            await emailService.sendCompanySignupEmail(email, companyName, firstName);
            console.log(`Company signup email sent to: ${email}`);
          }
        } catch (emailError) {
          console.error('Failed to send registration email:', emailError);
          // Don't fail the registration if email fails
        }
      }
      
      res.json({ success: true, user: profile });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // Vehicles
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      
      // Get images for each vehicle
      const vehiclesWithImages = await Promise.all(
        vehicles.map(async (vehicle) => {
          const images = await storage.getVehicleImages(vehicle.id);
          const company = await storage.getRentalCompany(vehicle.companyId);
          return {
            ...vehicle,
            vehicle_images: images,
            rental_companies: company ? { company_name: company.companyName } : null
          };
        })
      );
      
      res.json(vehiclesWithImages);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
  });

  app.get("/api/vehicles/featured", async (req, res) => {
    try {
      const vehicles = await storage.getFeaturedVehicles();
      
      const vehiclesWithImages = await Promise.all(
        vehicles.map(async (vehicle) => {
          const images = await storage.getVehicleImages(vehicle.id);
          const company = await storage.getRentalCompany(vehicle.companyId);
          return {
            ...vehicle,
            vehicle_images: images,
            rental_companies: company ? { company_name: company.companyName } : null
          };
        })
      );
      
      res.json(vehiclesWithImages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch featured vehicles' });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      
      const images = await storage.getVehicleImages(vehicle.id);
      const company = await storage.getRentalCompany(vehicle.companyId);
      
      res.json({
        ...vehicle,
        vehicle_images: images,
        rental_companies: company
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const validatedData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(validatedData);
      res.json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid vehicle data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  });

  app.put("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.updateVehicle(req.params.id, req.body);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update vehicle' });
    }
  });

  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const success = await storage.deleteVehicle(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  });

  // Rental Companies
  app.get("/api/rental-companies/user/:userId", async (req, res) => {
    try {
      const company = await storage.getRentalCompanyByUserId(req.params.userId);
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch company' });
    }
  });

  app.get("/api/rental-companies/:id", async (req, res) => {
    try {
      const company = await storage.getRentalCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch company' });
    }
  });

  app.post("/api/rental-companies", async (req, res) => {
    try {
      const validatedData = insertRentalCompanySchema.parse(req.body);
      const company = await storage.createRentalCompany(validatedData);
      res.json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid company data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create company' });
    }
  });

  app.put("/api/rental-companies/:id", async (req, res) => {
    try {
      const company = await storage.updateRentalCompany(req.params.id, req.body);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update company' });
    }
  });

  app.get("/api/rental-companies/:id/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getVehiclesByCompanyId(req.params.id);
      
      const vehiclesWithImages = await Promise.all(
        vehicles.map(async (vehicle) => {
          const images = await storage.getVehicleImages(vehicle.id);
          return { ...vehicle, vehicle_images: images };
        })
      );
      
      res.json(vehiclesWithImages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch company vehicles' });
    }
  });

  // Bookings
  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByUserId(req.params.userId);
      
      // Get vehicle and company details for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          if (!booking.vehicleId) return booking;
          
          const vehicle = await storage.getVehicle(booking.vehicleId);
          if (!vehicle) return booking;
          
          const company = await storage.getRentalCompany(vehicle.companyId);
          
          return {
            ...booking,
            vehicle: {
              name: vehicle.name,
              rental_companies: company ? {
                company_name: company.companyName,
                email: company.email,
                phone: company.phone
              } : null
            }
          };
        })
      );
      
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
  });

  app.get("/api/bookings/company/:companyId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByCompanyId(req.params.companyId);
      
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          if (!booking.vehicleId) return booking;
          const vehicle = await storage.getVehicle(booking.vehicleId);
          return {
            ...booking,
            vehicle_name: vehicle?.name || 'Unknown Vehicle'
          };
        })
      );
      
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch company bookings' });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid booking data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      // Get vehicle and company details
      if (booking.vehicleId) {
        const vehicle = await storage.getVehicle(booking.vehicleId);
        if (vehicle) {
          const company = await storage.getRentalCompany(vehicle.companyId);
          const bookingWithDetails = {
            ...booking,
            vehicle: {
              name: vehicle.name,
              rental_companies: company ? {
                company_name: company.companyName,
                email: company.email,
                phone: company.phone
              } : null
            }
          };
          return res.json(bookingWithDetails);
        }
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  });

  app.put("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  app.put("/api/bookings/:id/cancel", async (req, res) => {
    try {
      const success = await storage.cancelBooking(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  });

  // Company Settings
  app.get("/api/company-settings/:companyId", async (req, res) => {
    try {
      const settings = await storage.getCompanySettings(req.params.companyId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch company settings' });
    }
  });

  app.post("/api/company-settings", async (req, res) => {
    try {
      const settings = await storage.createCompanySettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create company settings' });
    }
  });

  app.put("/api/company-settings/:id", async (req, res) => {
    try {
      const settings = await storage.updateCompanySettings(req.params.id, req.body);
      if (!settings) {
        return res.status(404).json({ error: 'Settings not found' });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update company settings' });
    }
  });

  // Vehicle Images
  app.get("/api/vehicles/:vehicleId/images", async (req, res) => {
    try {
      const images = await storage.getVehicleImages(req.params.vehicleId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vehicle images' });
    }
  });

  app.post("/api/vehicles/:vehicleId/images", async (req, res) => {
    try {
      const { imageUrl, isPrimary } = req.body;
      const image = await storage.addVehicleImage({
        vehicleId: req.params.vehicleId,
        imageUrl,
        isPrimary: isPrimary || false
      });
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add vehicle image' });
    }
  });

  app.delete("/api/vehicle-images/:id", async (req, res) => {
    try {
      const success = await storage.deleteVehicleImage(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Image not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete vehicle image' });
    }
  });

  app.put("/api/vehicles/:vehicleId/images/:imageId/primary", async (req, res) => {
    try {
      const success = await storage.setPrimaryVehicleImage(req.params.vehicleId, req.params.imageId);
      if (!success) {
        return res.status(404).json({ error: 'Image not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to set primary image' });
    }
  });

  // Calendar management
  app.get("/api/vehicles/:vehicleId/calendar-feeds", async (req, res) => {
    try {
      const feeds = await storage.getVehicleCalendarFeeds(req.params.vehicleId);
      res.json(feeds);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch calendar feeds' });
    }
  });

  app.get("/api/vehicles/:vehicleId/calendar-blocks", async (req, res) => {
    try {
      const blocks = await storage.getVehicleCalendarBlocks(req.params.vehicleId);
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch calendar blocks' });
    }
  });

  app.get("/api/vehicles/:vehicleId/ical-bookings", async (req, res) => {
    try {
      const bookings = await storage.getIcalBookings(req.params.vehicleId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ical bookings' });
    }
  });

  app.post("/api/calendar-feeds", async (req, res) => {
    try {
      const feed = await storage.addCalendarFeed(req.body);
      res.json(feed);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add calendar feed' });
    }
  });

  app.delete("/api/calendar-feeds/:id", async (req, res) => {
    try {
      const success = await storage.deleteCalendarFeed(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Feed not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete calendar feed' });
    }
  });

  app.post("/api/calendar-blocks", async (req, res) => {
    try {
      const block = await storage.addCalendarBlock(req.body);
      res.json(block);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add calendar block' });
    }
  });

  app.delete("/api/calendar-blocks/:id", async (req, res) => {
    try {
      const success = await storage.deleteCalendarBlock(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Block not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete calendar block' });
    }
  });

  // Payment/Stripe integration - placeholder for now
  app.post("/api/create-checkout", async (req, res) => {
    try {
      // This would integrate with Stripe
      // For now, return a placeholder response
      res.json({ 
        sessionId: 'placeholder-session-id',
        url: '/booking-confirmation?placeholder=true' 
      });
    } catch (error) {
      res.status(500).json({ error: 'Payment processing not configured' });
    }
  });

  app.post("/api/verify-payment", async (req, res) => {
    try {
      // This would verify payment with Stripe
      // For now, return a placeholder response
      res.json({ 
        success: true,
        payment_status: 'paid',
        booking_status: 'confirmed'
      });
    } catch (error) {
      res.status(500).json({ error: 'Payment verification not configured' });
    }
  });

  // Email endpoints
  app.post("/api/emails/welcome", async (req, res) => {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return res.status(503).json({ error: 'Email service not initialized' });
      }

      const { email, firstName, lastName } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email address required' });
      }

      const result = await emailService.sendWelcomeEmail(email, firstName, lastName);
      
      if (result) {
        console.log(`Welcome email sent to: ${email}`);
        res.json({ success: true, message: 'Welcome email sent successfully' });
      } else {
        console.error(`Failed to send welcome email to: ${email}`);
        res.status(500).json({ success: false, error: 'Failed to send welcome email' });
      }
    } catch (error) {
      console.error('Welcome email error:', error);
      res.status(500).json({ error: 'Failed to send welcome email' });
    }
  });

  app.post("/api/emails/company-signup", async (req, res) => {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return res.status(503).json({ error: 'Email service not initialized' });
      }

      const { email, companyName, contactPerson } = req.body;
      if (!email || !companyName) {
        return res.status(400).json({ error: 'Email address and company name required' });
      }

      const result = await emailService.sendCompanySignupEmail(email, companyName, contactPerson);
      
      if (result) {
        console.log(`Company signup email sent to: ${email} for company: ${companyName}`);
        res.json({ success: true, message: 'Company signup email sent successfully' });
      } else {
        console.error(`Failed to send company signup email to: ${email}`);
        res.status(500).json({ success: false, error: 'Failed to send company signup email' });
      }
    } catch (error) {
      console.error('Company signup email error:', error);
      res.status(500).json({ error: 'Failed to send company signup email' });
    }
  });

  app.post("/api/emails/booking-confirmation", async (req, res) => {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return res.status(503).json({ error: 'Email service not initialized' });
      }

      const { 
        renterEmail, 
        vehicleName, 
        pickupDate, 
        pickupLocation, 
        dropoffDate, 
        dropoffLocation,
        bookingLink 
      } = req.body;
      
      if (!renterEmail || !vehicleName || !pickupDate || !dropoffDate) {
        return res.status(400).json({ error: 'Missing required booking details' });
      }

      // Use the sendEvent method directly for testing
      const result = await emailService.sendEvent('booking-confirmation-renter', renterEmail, {
        'vehicle-name': vehicleName,
        'pickup-date': pickupDate,
        'pickup-location': pickupLocation || 'Not specified',
        'dropoff-date': dropoffDate,
        'dropoff-location': dropoffLocation || 'Not specified',
        'booking-link': bookingLink || 'https://ridematchstlucia.com/my-bookings'
      });
      
      if (result) {
        console.log(`Booking confirmation email sent to: ${renterEmail} for vehicle: ${vehicleName}`);
        res.json({ success: true, message: 'Booking confirmation email sent successfully' });
      } else {
        console.error(`Failed to send booking confirmation email to: ${renterEmail}`);
        res.status(500).json({ success: false, error: 'Failed to send booking confirmation email' });
      }
    } catch (error) {
      console.error('Booking confirmation email error:', error);
      res.status(500).json({ error: 'Failed to send booking confirmation email' });
    }
  });

  app.post("/api/emails/booking-confirmation-company", async (req, res) => {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return res.status(503).json({ error: 'Email service not initialized' });
      }

      const { 
        companyEmail,
        companyContactName,
        vehicleName, 
        renterFirstName,
        renterLastName,
        pickupDateTime, 
        returnDateTime,
        bookingLink 
      } = req.body;
      
      if (!companyEmail || !vehicleName || !renterFirstName || !pickupDateTime || !returnDateTime) {
        return res.status(400).json({ error: 'Missing required booking details' });
      }

      // Use the sendEvent method for company booking confirmation
      const result = await emailService.sendEvent('booking-confirmation-company', companyEmail, {
        'company-contact-name': companyContactName || 'Manager',
        'vehicle-name': vehicleName,
        'renter-first-name': renterFirstName,
        'renter-last-name': renterLastName || '',
        'pickup-date-time': pickupDateTime,
        'return-date-time': returnDateTime,
        'booking-link': bookingLink || 'https://ridematchstlucia.com/company/bookings'
      });
      
      if (result) {
        console.log(`Company booking confirmation email sent to: ${companyEmail} for vehicle: ${vehicleName}`);
        res.json({ success: true, message: 'Company booking confirmation email sent successfully' });
      } else {
        console.error(`Failed to send company booking confirmation email to: ${companyEmail}`);
        res.status(500).json({ success: false, error: 'Failed to send company booking confirmation email' });
      }
    } catch (error) {
      console.error('Company booking confirmation email error:', error);
      res.status(500).json({ error: 'Failed to send company booking confirmation email' });
    }
  });

  app.post("/api/emails/booking-confirmation-admin", async (req, res) => {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return res.status(503).json({ error: 'Email service not initialized' });
      }

      const { 
        adminEmail,
        vehicleName, 
        companyName,
        renterFirstName,
        renterLastName,
        pickupDateTime, 
        returnDateTime
      } = req.body;
      
      if (!adminEmail || !vehicleName || !companyName || !renterFirstName || !pickupDateTime || !returnDateTime) {
        return res.status(400).json({ error: 'Missing required booking details' });
      }

      const renterName = `${renterFirstName} ${renterLastName || ''}`.trim();

      // Use the sendAdminBookingNotification method
      const result = await emailService.sendAdminBookingNotification({
        adminEmail,
        vehicleName,
        companyName,
        renterName,
        pickupDateTime,
        returnDateTime
      });
      
      if (result) {
        console.log(`Admin booking confirmation email sent to: ${adminEmail} for vehicle: ${vehicleName}`);
        res.json({ success: true, message: 'Admin booking confirmation email sent successfully' });
      } else {
        console.error(`Failed to send admin booking confirmation email to: ${adminEmail}`);
        res.status(500).json({ success: false, error: 'Failed to send admin booking confirmation email' });
      }
    } catch (error) {
      console.error('Admin booking confirmation email error:', error);
      res.status(500).json({ error: 'Failed to send admin booking confirmation email' });
    }
  });

  app.post("/api/emails/booking-cancellation-renter", async (req, res) => {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return res.status(503).json({ error: 'Email service not initialized' });
      }

      const { 
        renterEmail,
        renterFirstName,
        vehicleName, 
        pickupDate
      } = req.body;
      
      if (!renterEmail || !renterFirstName || !vehicleName || !pickupDate) {
        return res.status(400).json({ error: 'Missing required cancellation details' });
      }

      // Use the sendBookingCancellationRenter method
      const result = await emailService.sendBookingCancellationRenter({
        renterEmail,
        renterName: renterFirstName,
        vehicleName,
        pickupDate
      });
      
      if (result) {
        console.log(`Booking cancellation email sent to: ${renterEmail} for vehicle: ${vehicleName}`);
        res.json({ success: true, message: 'Booking cancellation email sent successfully' });
      } else {
        console.error(`Failed to send booking cancellation email to: ${renterEmail}`);
        res.status(500).json({ success: false, error: 'Failed to send booking cancellation email' });
      }
    } catch (error) {
      console.error('Booking cancellation email error:', error);
      res.status(500).json({ error: 'Failed to send booking cancellation email' });
    }
  });

  app.post("/api/emails/booking-cancellation-company", async (req, res) => {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return res.status(503).json({ error: 'Email service not initialized' });
      }

      const { 
        companyEmail,
        companyContactName,
        vehicleName, 
        renterFirstName,
        renterLastName,
        bookingLink
      } = req.body;
      
      if (!companyEmail || !vehicleName || !renterFirstName) {
        return res.status(400).json({ error: 'Missing required cancellation details' });
      }

      const renterName = `${renterFirstName} ${renterLastName || ''}`.trim();

      // Use the sendBookingCancellationCompany method
      const result = await emailService.sendBookingCancellationCompany({
        companyEmail,
        companyContactName: companyContactName || 'Manager',
        vehicleName,
        renterName,
        bookingLink
      });
      
      if (result) {
        console.log(`Company booking cancellation email sent to: ${companyEmail} for vehicle: ${vehicleName}`);
        res.json({ success: true, message: 'Company booking cancellation email sent successfully' });
      } else {
        console.error(`Failed to send company booking cancellation email to: ${companyEmail}`);
        res.status(500).json({ success: false, error: 'Failed to send company booking cancellation email' });
      }
    } catch (error) {
      console.error('Company booking cancellation email error:', error);
      res.status(500).json({ error: 'Failed to send company booking cancellation email' });
    }
  });

  // Email service test endpoint
  app.post("/api/test-email", async (req, res) => {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return res.status(503).json({ error: 'Email service not initialized' });
      }

      const { email, type } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email address required' });
      }

      let result = false;
      switch (type) {
        case 'welcome':
          result = await emailService.sendWelcomeEmail(email, 'Test', 'User');
          break;
        case 'company':
          result = await emailService.sendCompanySignupEmail(email, 'Test Company', 'Test Person');
          break;
        default:
          // Just test contact creation
          result = await emailService.createContact({
            email,
            firstName: 'Test',
            lastName: 'User',
            userRole: 'renter'
          });
      }

      res.json({ success: result, message: result ? 'Email sent successfully' : 'Email sending failed' });
    } catch (error) {
      console.error('Email test error:', error);
      res.status(500).json({ error: 'Email test failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
