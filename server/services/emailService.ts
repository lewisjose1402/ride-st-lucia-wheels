import axios from 'axios';

interface LoopsContact {
  email: string;
  firstName?: string;
  lastName?: string;
  userRole?: string;
  companyName?: string;
  phone?: string;
}

interface LoopsTransactionalEmail {
  transactionalId: string;
  email: string;
  dataVariables?: Record<string, any>;
}

export class LoopsEmailService {
  private apiKey: string;
  private baseUrl = 'https://app.loops.so/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Create or update contact in Loops
  async createContact(contact: LoopsContact): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/contacts/create`,
        contact,
        { headers: this.getHeaders() }
      );
      
      console.log('Contact created/updated in Loops:', contact.email);
      return response.status === 200;
    } catch (error) {
      console.error('Failed to create contact in Loops:', error);
      return false;
    }
  }

  // Send transactional email
  async sendTransactionalEmail(emailData: LoopsTransactionalEmail): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transactional`,
        emailData,
        { headers: this.getHeaders() }
      );
      
      console.log('Transactional email sent via Loops:', emailData.transactionalId, 'to:', emailData.email);
      return response.status === 200;
    } catch (error) {
      console.error('Failed to send transactional email:', error);
      return false;
    }
  }

  // Send event to trigger event-based emails
  async sendEvent(eventName: string, email: string, eventProperties?: Record<string, any>): Promise<boolean> {
    try {
      const eventData = {
        eventName,
        email,
        eventProperties: eventProperties || {}
      };

      console.log('Sending event to Loops:', eventData);

      const response = await axios.post(
        `${this.baseUrl}/events/send`,
        eventData,
        { headers: this.getHeaders() }
      );

      console.log('Event sent successfully:', response.data);
      return response.data.success === true;
    } catch (error: any) {
      console.error('Failed to send event:', error.response?.data || error.message);
      console.error('Full error:', error);
      return false;
    }
  }

  // Email template methods for different scenarios
  async sendWelcomeEmail(userEmail: string, firstName?: string, lastName?: string): Promise<boolean> {
    await this.createContact({
      email: userEmail,
      firstName,
      lastName,
      userRole: 'renter'
    });

    // Use Events API for event-triggered emails
    return this.sendEvent('renter-signup-welcome', userEmail, {
      firstName: firstName || 'there',
      lastName: lastName || ''
    });
  }

  async sendCompanySignupEmail(userEmail: string, companyName: string, contactPerson?: string): Promise<boolean> {
    await this.createContact({
      email: userEmail,
      firstName: contactPerson,
      companyName,
      userRole: 'rental_company'
    });

    // Use Events API for event-triggered emails
    return this.sendEvent('company-signup-pending', userEmail, {
      companyName,
      contactPerson: contactPerson || 'there'
    });
  }

  async sendBookingConfirmationEmails(bookingData: {
    bookingId: string;
    renterEmail: string;
    renterName: string;
    companyEmail: string;
    companyName: string;
    vehicleName: string;
    pickupDate: string;
    dropoffDate: string;
    totalPrice: number;
    pickupLocation: string;
    dropoffLocation: string;
  }): Promise<{ renterSent: boolean; companySent: boolean }> {
    
    const sharedData = {
      bookingId: bookingData.bookingId,
      vehicleName: bookingData.vehicleName,
      pickupDate: bookingData.pickupDate,
      dropoffDate: bookingData.dropoffDate,
      totalPrice: bookingData.totalPrice,
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation
    };

    // Send to renter using Events API
    const renterSent = await this.sendEvent('booking-confirmation-renter', bookingData.renterEmail, {
      'vehicle-name': bookingData.vehicleName,
      'pickup-date': bookingData.pickupDate,
      'pickup-location': bookingData.pickupLocation,
      'dropoff-date': bookingData.dropoffDate,
      'dropoff-location': bookingData.dropoffLocation,
      'booking-link': `https://ridematchstlucia.com/bookings/${bookingData.bookingId}`
    });

    // Send to company using Events API
    const companySent = await this.sendEvent('booking-confirmation-company', bookingData.companyEmail, {
      'company-contact-name': bookingData.companyName,
      'vehicle-name': bookingData.vehicleName,
      'renter-first-name': bookingData.renterName.split(' ')[0] || bookingData.renterName,
      'renter-last-name': bookingData.renterName.split(' ')[1] || '',
      'pickup-date-time': bookingData.pickupDate,
      'return-date-time': bookingData.dropoffDate,
      'booking-link': `https://ridematchstlucia.com/bookings/${bookingData.bookingId}`
    });

    return { renterSent, companySent };
  }

  async sendPaymentConfirmationEmails(paymentData: {
    bookingId: string;
    renterEmail: string;
    renterName: string;
    companyEmail: string;
    companyName: string;
    vehicleName: string;
    paymentAmount: number;
    paymentId: string;
  }): Promise<{ renterSent: boolean; companySent: boolean }> {
    
    const sharedData = {
      bookingId: paymentData.bookingId,
      vehicleName: paymentData.vehicleName,
      paymentAmount: paymentData.paymentAmount,
      paymentId: paymentData.paymentId
    };

    // Send to renter
    const renterSent = await this.sendTransactionalEmail({
      transactionalId: 'payment-confirmation-renter',
      email: paymentData.renterEmail,
      dataVariables: {
        ...sharedData,
        renterName: paymentData.renterName,
        companyName: paymentData.companyName
      }
    });

    // Send to company
    const companySent = await this.sendTransactionalEmail({
      transactionalId: 'payment-confirmation-company',
      email: paymentData.companyEmail,
      dataVariables: {
        ...sharedData,
        renterName: paymentData.renterName,
        renterEmail: paymentData.renterEmail
      }
    });

    return { renterSent, companySent };
  }

  async sendBookingCancellationEmails(cancellationData: {
    bookingId: string;
    renterEmail: string;
    renterName: string;
    companyEmail: string;
    companyName: string;
    vehicleName: string;
    pickupDate: string;
    dropoffDate: string;
    reason?: string;
  }): Promise<{ renterSent: boolean; companySent: boolean }> {
    
    const sharedData = {
      bookingId: cancellationData.bookingId,
      vehicleName: cancellationData.vehicleName,
      pickupDate: cancellationData.pickupDate,
      dropoffDate: cancellationData.dropoffDate,
      reason: cancellationData.reason || 'No reason provided'
    };

    // Send to renter
    const renterSent = await this.sendTransactionalEmail({
      transactionalId: 'booking-cancelled-renter',
      email: cancellationData.renterEmail,
      dataVariables: {
        ...sharedData,
        renterName: cancellationData.renterName,
        companyName: cancellationData.companyName
      }
    });

    // Send to company
    const companySent = await this.sendTransactionalEmail({
      transactionalId: 'booking-cancelled-company',
      email: cancellationData.companyEmail,
      dataVariables: {
        ...sharedData,
        renterName: cancellationData.renterName,
        renterEmail: cancellationData.renterEmail
      }
    });

    return { renterSent, companySent };
  }

  async sendPreRentalReminders(reminderData: {
    bookingId: string;
    renterEmail: string;
    renterName: string;
    companyEmail: string;
    companyName: string;
    vehicleName: string;
    pickupDate: string;
    pickupLocation: string;
    companyPhone?: string;
  }): Promise<{ renterSent: boolean; companySent: boolean }> {
    
    const sharedData = {
      bookingId: reminderData.bookingId,
      vehicleName: reminderData.vehicleName,
      pickupDate: reminderData.pickupDate,
      pickupLocation: reminderData.pickupLocation
    };

    // Send to renter
    const renterSent = await this.sendTransactionalEmail({
      transactionalId: 'pre-rental-reminder-renter',
      email: reminderData.renterEmail,
      dataVariables: {
        ...sharedData,
        renterName: reminderData.renterName,
        companyName: reminderData.companyName,
        companyPhone: reminderData.companyPhone || 'Contact company directly'
      }
    });

    // Send to company
    const companySent = await this.sendTransactionalEmail({
      transactionalId: 'pre-rental-reminder-company',
      email: reminderData.companyEmail,
      dataVariables: {
        ...sharedData,
        renterName: reminderData.renterName,
        renterEmail: reminderData.renterEmail
      }
    });

    return { renterSent, companySent };
  }

  async sendFeedbackRequest(feedbackData: {
    bookingId: string;
    renterEmail: string;
    renterName: string;
    vehicleName: string;
    companyName: string;
    rentalEndDate: string;
  }): Promise<boolean> {
    
    return this.sendTransactionalEmail({
      transactionalId: 'feedback-request',
      email: feedbackData.renterEmail,
      dataVariables: {
        bookingId: feedbackData.bookingId,
        renterName: feedbackData.renterName,
        vehicleName: feedbackData.vehicleName,
        companyName: feedbackData.companyName,
        rentalEndDate: feedbackData.rentalEndDate
      }
    });
  }

  async sendAdminBookingNotification(adminData: {
    adminEmail: string;
    vehicleName: string;
    companyName: string;
    renterName: string;
    pickupDateTime: string;
    returnDateTime: string;
  }): Promise<boolean> {
    return await this.sendEvent('booking-confirmation-admin', adminData.adminEmail, {
      'vehicle-name': adminData.vehicleName,
      'company-name': adminData.companyName,
      'renter-first-name': adminData.renterName.split(' ')[0] || adminData.renterName,
      'renter-last-name': adminData.renterName.split(' ')[1] || '',
      'pickup-date-time': adminData.pickupDateTime,
      'return-date-time': adminData.returnDateTime
    });
  }

  async sendBookingCancellationRenter(cancellationData: {
    renterEmail: string;
    renterName: string;
    vehicleName: string;
    pickupDate: string;
  }): Promise<boolean> {
    return await this.sendEvent('booking-cancelled-renter', cancellationData.renterEmail, {
      'renter-first-name': cancellationData.renterName.split(' ')[0] || cancellationData.renterName,
      'vehicle-name': cancellationData.vehicleName,
      'pickup-date': cancellationData.pickupDate
    });
  }

  async sendBookingCancellationCompany(cancellationData: {
    companyEmail: string;
    companyContactName: string;
    vehicleName: string;
    renterName: string;
    bookingLink?: string;
  }): Promise<boolean> {
    return await this.sendEvent('booking-cancelled-company', cancellationData.companyEmail, {
      'company-contact-name': cancellationData.companyContactName,
      'vehicle-name': cancellationData.vehicleName,
      'renter-first-name': cancellationData.renterName.split(' ')[0] || cancellationData.renterName,
      'renter-last-name': cancellationData.renterName.split(' ')[1] || '',
      'booking-link': cancellationData.bookingLink || 'https://ridematchstlucia.com/company/bookings'
    });
  }
}

// Initialize email service (will be configured with API key)
let emailService: LoopsEmailService | null = null;

export const initializeEmailService = (apiKey: string) => {
  emailService = new LoopsEmailService(apiKey);
  console.log('Loops email service initialized');
};

export const getEmailService = (): LoopsEmailService | null => {
  return emailService;
};