import cron from 'node-cron';
import { storage } from '../storage';
import { getEmailService } from './emailService';

export class ReminderService {
  private isRunning = false;
  
  // Start the reminder service to run daily at 9 AM
  start() {
    if (this.isRunning) {
      console.log('Reminder service is already running');
      return;
    }

    console.log('Starting reminder service...');
    this.isRunning = true;

    // Run daily at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('Running daily reminder check...');
      await this.sendPreRentalReminders();
    });

    console.log('Reminder service started - will run daily at 9:00 AM');
  }

  stop() {
    console.log('Stopping reminder service...');
    this.isRunning = false;
  }

  // Send pre-rental reminders for bookings happening tomorrow
  async sendPreRentalReminders() {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        console.log('Email service not available - skipping reminders');
        return;
      }

      // Get tomorrow's date in YYYY-MM-DD format
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      console.log(`Checking for bookings on ${tomorrowStr}...`);

      // Get all confirmed bookings for tomorrow
      const bookings = await this.getBookingsForDate(tomorrowStr);
      console.log(`Found ${bookings.length} bookings for tomorrow`);

      for (const booking of bookings) {
        try {
          // Send reminder to renter
          if (booking.email) {
            await emailService.sendPreRentalReminderRenter({
              renterEmail: booking.email,
              renterName: `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || booking.driverName || 'Renter',
              vehicleName: booking.vehicleName,
              pickupDateTime: `${booking.pickupDate}T${booking.pickupTime || '09:00'}`,
              pickupLocation: booking.pickupLocation,
              bookingLink: `https://ridematchstlucia.com/booking-confirmation?booking_id=${booking.id}`
            });
            console.log(`Reminder sent to renter: ${booking.email}`);
          }

          // Send reminder to company
          if (booking.companyEmail) {
            await emailService.sendPreRentalReminderCompany({
              companyEmail: booking.companyEmail,
              companyContactName: booking.companyContactName || 'Manager',
              vehicleName: booking.vehicleName,
              renterName: `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || booking.driverName || 'Renter',
              pickupDateTime: `${booking.pickupDate}T${booking.pickupTime || '09:00'}`,
              bookingLink: `https://ridematchstlucia.com/company/bookings`
            });
            console.log(`Reminder sent to company: ${booking.companyEmail}`);
          }

          // Small delay between emails to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to send reminder for booking ${booking.id}:`, error);
        }
      }

      console.log(`Completed sending ${bookings.length} pre-rental reminders`);
    } catch (error) {
      console.error('Error in sendPreRentalReminders:', error);
    }
  }

  // Get bookings for a specific date with related data
  private async getBookingsForDate(dateStr: string) {
    try {
      // This would need to be implemented with the actual database query
      // For now, return empty array as the storage interface doesn't have this method
      // In a real implementation, you'd add this method to the storage interface
      console.log(`Getting bookings for date: ${dateStr}`);
      
      // TODO: Implement getBookingsByDate in storage interface
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching bookings for date:', error);
      return [];
    }
  }

  // Manual trigger for testing
  async sendTestReminder(bookingId: string) {
    const emailService = getEmailService();
    if (!emailService) {
      throw new Error('Email service not available');
    }

    const booking = await storage.getBooking(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Send test reminders (implement similar to the scheduled version)
    console.log(`Sending test reminder for booking: ${bookingId}`);
    // Implementation would be similar to the loop above
  }
}

export const reminderService = new ReminderService();