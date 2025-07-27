import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const TestEmail = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [bookingLink, setBookingLink] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyContactName, setCompanyContactName] = useState('');
  const [renterFirstName, setRenterFirstName] = useState('');
  const [renterLastName, setRenterLastName] = useState('');
  const [pickupDateTime, setPickupDateTime] = useState('');
  const [returnDateTime, setReturnDateTime] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminVehicleName, setAdminVehicleName] = useState('');
  const [adminCompanyName, setAdminCompanyName] = useState('');
  const [adminRenterFirstName, setAdminRenterFirstName] = useState('');
  const [adminRenterLastName, setAdminRenterLastName] = useState('');
  const [adminPickupDateTime, setAdminPickupDateTime] = useState('');
  const [adminReturnDateTime, setAdminReturnDateTime] = useState('');
  const [cancellationRenterEmail, setCancellationRenterEmail] = useState('');
  const [cancellationRenterFirstName, setCancellationRenterFirstName] = useState('');
  const [cancellationVehicleName, setCancellationVehicleName] = useState('');
  const [cancellationPickupDate, setCancellationPickupDate] = useState('');
  const [companyCancellationEmail, setCompanyCancellationEmail] = useState('');
  const [companyCancellationContactName, setCompanyCancellationContactName] = useState('');
  const [companyCancellationVehicleName, setCompanyCancellationVehicleName] = useState('');
  const [companyCancellationRenterFirstName, setCompanyCancellationRenterFirstName] = useState('');
  const [companyCancellationRenterLastName, setCompanyCancellationRenterLastName] = useState('');
  const [companyCancellationBookingLink, setCompanyCancellationBookingLink] = useState('');
  const [adminCancellationEmail, setAdminCancellationEmail] = useState('');
  const [adminCancellationVehicleName, setAdminCancellationVehicleName] = useState('');
  const [adminCancellationCompanyName, setAdminCancellationCompanyName] = useState('');
  const [adminCancellationRenterFirstName, setAdminCancellationRenterFirstName] = useState('');
  const [adminCancellationRenterLastName, setAdminCancellationRenterLastName] = useState('');
  const [preRentalRenterEmail, setPreRentalRenterEmail] = useState('');
  const [preRentalRenterFirstName, setPreRentalRenterFirstName] = useState('');
  const [preRentalRenterLastName, setPreRentalRenterLastName] = useState('');
  const [preRentalVehicleName, setPreRentalVehicleName] = useState('');
  const [preRentalPickupDateTime, setPreRentalPickupDateTime] = useState('');
  const [preRentalPickupLocation, setPreRentalPickupLocation] = useState('');
  const [preRentalBookingLink, setPreRentalBookingLink] = useState('');
  const [companyReminderEmail, setCompanyReminderEmail] = useState('');
  const [companyReminderContactName, setCompanyReminderContactName] = useState('');
  const [companyReminderVehicleName, setCompanyReminderVehicleName] = useState('');
  const [companyReminderRenterFirstName, setCompanyReminderRenterFirstName] = useState('');
  const [companyReminderRenterLastName, setCompanyReminderRenterLastName] = useState('');
  const [companyReminderPickupDateTime, setCompanyReminderPickupDateTime] = useState('');
  const [companyReminderBookingLink, setCompanyReminderBookingLink] = useState('');
  // Contact form test state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  // Company approval test state
  const [approvalEmail, setApprovalEmail] = useState('');  
  const [approvalContactName, setApprovalContactName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendWelcomeEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: firstName || 'Test',
          lastName: lastName || 'User'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Welcome email sent successfully to ${email}`,
        });
        console.log('Welcome email sent successfully:', data);
      } else {
        throw new Error('Failed to send welcome email');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send welcome email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCompanyEmail = async () => {
    if (!email || !companyName) {
      toast({
        title: "Required fields missing",
        description: "Please enter email address and company name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/company-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          companyName,
          contactPerson: contactPerson || 'Manager'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Company signup email sent successfully to ${email}`,
        });
        console.log('Company email sent successfully:', data);
      } else {
        throw new Error('Failed to send company email');
      }
    } catch (error) {
      console.error('Error sending company email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send company signup email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendBookingEmail = async () => {
    if (!email || !vehicleName || !pickupDate || !dropoffDate) {
      toast({
        title: "Required fields missing",
        description: "Please enter email, vehicle name, pickup date, and dropoff date",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          renterEmail: email,
          vehicleName,
          pickupDate,
          pickupLocation: pickupLocation || 'Not specified',
          dropoffDate,
          dropoffLocation: dropoffLocation || 'Not specified',
          bookingLink: bookingLink || 'https://ridematchstlucia.com/my-bookings'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Booking confirmation email sent successfully to ${email}`,
        });
        console.log('Booking confirmation email sent successfully:', data);
      } else {
        throw new Error('Failed to send booking confirmation email');
      }
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send booking confirmation email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCompanyBookingEmail = async () => {
    if (!companyEmail || !vehicleName || !renterFirstName || !pickupDateTime || !returnDateTime) {
      toast({
        title: "Required fields missing",
        description: "Please enter company email, vehicle name, renter first name, and both date/times",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/booking-confirmation-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyEmail,
          companyContactName: companyContactName || 'Manager',
          vehicleName,
          renterFirstName,
          renterLastName: renterLastName || '',
          pickupDateTime,
          returnDateTime,
          bookingLink: bookingLink || 'https://ridematchstlucia.com/company/bookings'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Company booking confirmation email sent successfully to ${companyEmail}`,
        });
        console.log('Company booking confirmation email sent successfully:', data);
      } else {
        throw new Error('Failed to send company booking confirmation email');
      }
    } catch (error) {
      console.error('Error sending company booking confirmation email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send company booking confirmation email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAdminBookingEmail = async () => {
    if (!adminEmail || !adminVehicleName || !adminCompanyName || !adminRenterFirstName || !adminPickupDateTime || !adminReturnDateTime) {
      toast({
        title: "Required fields missing",
        description: "Please enter all required fields: admin email, vehicle name, company name, renter first name, and both date/times",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/booking-confirmation-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail,
          vehicleName: adminVehicleName,
          companyName: adminCompanyName,
          renterFirstName: adminRenterFirstName,
          renterLastName: adminRenterLastName || '',
          pickupDateTime: adminPickupDateTime,
          returnDateTime: adminReturnDateTime
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Admin booking confirmation email sent successfully to ${adminEmail}`,
        });
        console.log('Admin booking confirmation email sent successfully:', data);
      } else {
        throw new Error('Failed to send admin booking confirmation email');
      }
    } catch (error) {
      console.error('Error sending admin booking confirmation email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send admin booking confirmation email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCancellationEmail = async () => {
    if (!cancellationRenterEmail || !cancellationRenterFirstName || !cancellationVehicleName || !cancellationPickupDate) {
      toast({
        title: "Required fields missing",
        description: "Please enter all required fields: renter email, first name, vehicle name, and pickup date",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/booking-cancellation-renter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          renterEmail: cancellationRenterEmail,
          renterFirstName: cancellationRenterFirstName,
          vehicleName: cancellationVehicleName,
          pickupDate: cancellationPickupDate
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Booking cancellation email sent successfully to ${cancellationRenterEmail}`,
        });
        console.log('Booking cancellation email sent successfully:', data);
      } else {
        throw new Error('Failed to send booking cancellation email');
      }
    } catch (error) {
      console.error('Error sending booking cancellation email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send booking cancellation email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCompanyCancellationEmail = async () => {
    if (!companyCancellationEmail || !companyCancellationVehicleName || !companyCancellationRenterFirstName) {
      toast({
        title: "Required fields missing",
        description: "Please enter company email, vehicle name, and renter first name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/booking-cancellation-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyEmail: companyCancellationEmail,
          companyContactName: companyCancellationContactName || 'Manager',
          vehicleName: companyCancellationVehicleName,
          renterFirstName: companyCancellationRenterFirstName,
          renterLastName: companyCancellationRenterLastName || '',
          bookingLink: companyCancellationBookingLink || 'https://ridematchstlucia.com/company/bookings'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Company booking cancellation email sent successfully to ${companyCancellationEmail}`,
        });
        console.log('Company booking cancellation email sent successfully:', data);
      } else {
        throw new Error('Failed to send company booking cancellation email');
      }
    } catch (error) {
      console.error('Error sending company booking cancellation email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send company booking cancellation email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAdminCancellationEmail = async () => {
    if (!adminCancellationEmail || !adminCancellationVehicleName || !adminCancellationCompanyName || !adminCancellationRenterFirstName) {
      toast({
        title: "Required fields missing",
        description: "Please enter admin email, vehicle name, company name, and renter first name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/booking-cancellation-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: adminCancellationEmail,
          vehicleName: adminCancellationVehicleName,
          companyName: adminCancellationCompanyName,
          renterFirstName: adminCancellationRenterFirstName,
          renterLastName: adminCancellationRenterLastName || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Admin booking cancellation email sent successfully to ${adminCancellationEmail}`,
        });
        console.log('Admin booking cancellation email sent successfully:', data);
      } else {
        throw new Error('Failed to send admin booking cancellation email');
      }
    } catch (error) {
      console.error('Error sending admin booking cancellation email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send admin booking cancellation email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPreRentalReminderEmail = async () => {
    if (!preRentalRenterEmail || !preRentalRenterFirstName || !preRentalVehicleName || !preRentalPickupDateTime || !preRentalPickupLocation) {
      toast({
        title: "Required fields missing",
        description: "Please enter renter email, first name, vehicle name, pickup date/time, and pickup location",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/pre-rental-reminder-renter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          renterEmail: preRentalRenterEmail,
          renterFirstName: preRentalRenterFirstName,
          renterLastName: preRentalRenterLastName || '',
          vehicleName: preRentalVehicleName,
          pickupDateTime: preRentalPickupDateTime,
          pickupLocation: preRentalPickupLocation,
          bookingLink: preRentalBookingLink || 'https://ridematchstlucia.com/bookings'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Pre-rental reminder email sent successfully to ${preRentalRenterEmail}`,
        });
        console.log('Pre-rental reminder email sent successfully:', data);
      } else {
        throw new Error('Failed to send pre-rental reminder email');
      }
    } catch (error) {
      console.error('Error sending pre-rental reminder email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send pre-rental reminder email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendContactForm = async () => {
    if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all contact form fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Contact form sent!",
          description: `Contact form submission sent to admin@ridematchstlucia.com`,
        });
        console.log('Contact form sent successfully:', data);
      } else {
        throw new Error('Failed to send contact form');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Contact form failed",
        description: "Failed to send contact form. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCompanyReminderEmail = async () => {
    if (!companyReminderEmail || !companyReminderContactName || !companyReminderVehicleName || !companyReminderRenterFirstName || !companyReminderPickupDateTime) {
      toast({
        title: "Required fields missing",
        description: "Please enter company email, contact name, vehicle name, renter first name, and pickup date/time",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/pre-rental-reminder-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyEmail: companyReminderEmail,
          companyContactName: companyReminderContactName,
          vehicleName: companyReminderVehicleName,
          renterFirstName: companyReminderRenterFirstName,
          renterLastName: companyReminderRenterLastName || '',
          pickupDateTime: companyReminderPickupDateTime,
          bookingLink: companyReminderBookingLink || 'https://ridematchstlucia.com/company/bookings'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Company pre-rental reminder email sent successfully to ${companyReminderEmail}`,
        });
        console.log('Company pre-rental reminder email sent successfully:', data);
      } else {
        throw new Error('Failed to send company pre-rental reminder email');
      }
    } catch (error) {
      console.error('Error sending company pre-rental reminder email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send company pre-rental reminder email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCompanyApprovalEmail = async () => {
    if (!approvalEmail || !approvalContactName) {
      toast({
        title: "Required fields missing",
        description: "Please enter company email and contact name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: approvalEmail,
          type: 'company-approved'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email sent!",
          description: `Company approval email sent successfully to ${approvalEmail}`,
        });
        console.log('Company approval email sent successfully:', data);
      } else {
        throw new Error('Failed to send company approval email');
      }
    } catch (error) {
      console.error('Error sending company approval email:', error);
      toast({
        title: "Email failed",
        description: "Failed to send company approval email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Email System</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="welcome" className="w-full">
              <TabsList className="grid w-full grid-cols-12">
                <TabsTrigger value="welcome">Welcome</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="approval">Approved</TabsTrigger>
                <TabsTrigger value="booking">Renter</TabsTrigger>
                <TabsTrigger value="company-booking">Company</TabsTrigger>
                <TabsTrigger value="admin-booking">Admin</TabsTrigger>
                <TabsTrigger value="cancellation">Cancel</TabsTrigger>
                <TabsTrigger value="company-cancel">Co Cancel</TabsTrigger>
                <TabsTrigger value="admin-cancel">Ad Cancel</TabsTrigger>
                <TabsTrigger value="reminder">Reminder</TabsTrigger>
                <TabsTrigger value="company-reminder">Co Remind</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="welcome" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Test"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="User"
                  />
                </div>
                
                <Button 
                  onClick={handleSendWelcomeEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Welcome Email'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'renter-signup-welcome' event in Loops.</p>
                </div>
              </TabsContent>

              <TabsContent value="company" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email Address</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="company@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Test Company Ltd"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="John Manager"
                  />
                </div>
                
                <Button 
                  onClick={handleSendCompanyEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Company Signup Email'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'company-signup-pending' event in Loops.</p>
                </div>
              </TabsContent>

              <TabsContent value="approval" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="approvalEmail">Company Email</Label>
                  <Input
                    id="approvalEmail"
                    type="email"
                    value={approvalEmail}
                    onChange={(e) => setApprovalEmail(e.target.value)}
                    placeholder="company@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="approvalContactName">Contact Name</Label>
                  <Input
                    id="approvalContactName"
                    type="text"
                    value={approvalContactName}
                    onChange={(e) => setApprovalContactName(e.target.value)}
                    placeholder="John Company Owner"
                    required
                  />
                </div>
                
                <Button 
                  onClick={handleSendCompanyApprovalEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Company Approval Email'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'company-approved' event in Loops.</p>
                  <p className="mt-1">Required properties: company-contact-name</p>
                </div>
              </TabsContent>

              <TabsContent value="booking" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="renterEmail">Renter Email</Label>
                  <Input
                    id="renterEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="renter@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vehicleName">Vehicle Name</Label>
                  <Input
                    id="vehicleName"
                    type="text"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    placeholder="Honda Civic 2023"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dropoffDate">Dropoff Date</Label>
                    <Input
                      id="dropoffDate"
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input
                      id="pickupLocation"
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="Hewanorra Airport"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dropoffLocation">Dropoff Location</Label>
                    <Input
                      id="dropoffLocation"
                      type="text"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      placeholder="Hotel Lobby"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bookingLink">Booking Link (Optional)</Label>
                  <Input
                    id="bookingLink"
                    type="url"
                    value={bookingLink}
                    onChange={(e) => setBookingLink(e.target.value)}
                    placeholder="https://ridematchstlucia.com/my-bookings"
                  />
                </div>
                
                <Button 
                  onClick={handleSendBookingEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Booking Confirmation'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'booking-confirmation-renter' event in Loops.</p>
                  <p className="mt-1">Required properties: vehicle-name, pickup-date, pickup-location, dropoff-date, dropoff-location, booking-link</p>
                </div>
              </TabsContent>

              <TabsContent value="company-booking" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="companyEmailBooking">Company Email</Label>
                  <Input
                    id="companyEmailBooking"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="company@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyContactNameBooking">Company Contact Name</Label>
                  <Input
                    id="companyContactNameBooking"
                    type="text"
                    value={companyContactName}
                    onChange={(e) => setCompanyContactName(e.target.value)}
                    placeholder="Manager"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleNameCompany">Vehicle Name</Label>
                  <Input
                    id="vehicleNameCompany"
                    type="text"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    placeholder="Honda Civic 2023"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="renterFirstNameBooking">Renter First Name</Label>
                    <Input
                      id="renterFirstNameBooking"
                      type="text"
                      value={renterFirstName}
                      onChange={(e) => setRenterFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="renterLastNameBooking">Renter Last Name</Label>
                    <Input
                      id="renterLastNameBooking"
                      type="text"
                      value={renterLastName}
                      onChange={(e) => setRenterLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDateTime">Pickup Date & Time</Label>
                    <Input
                      id="pickupDateTime"
                      type="datetime-local"
                      value={pickupDateTime}
                      onChange={(e) => setPickupDateTime(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="returnDateTime">Return Date & Time</Label>
                    <Input
                      id="returnDateTime"
                      type="datetime-local"
                      value={returnDateTime}
                      onChange={(e) => setReturnDateTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bookingLinkCompany">Booking Link (Optional)</Label>
                  <Input
                    id="bookingLinkCompany"
                    type="url"
                    value={bookingLink}
                    onChange={(e) => setBookingLink(e.target.value)}
                    placeholder="https://ridematchstlucia.com/company/bookings"
                  />
                </div>
                
                <Button 
                  onClick={handleSendCompanyBookingEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Company Booking Confirmation'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'booking-confirmation-company' event in Loops.</p>
                  <p className="mt-1">Required properties: company-contact-name, vehicle-name, renter-first-name, renter-last-name, pickup-date-time, return-date-time, booking-link</p>
                </div>
              </TabsContent>

              <TabsContent value="admin-booking" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="adminEmailBooking">Admin Email</Label>
                  <Input
                    id="adminEmailBooking"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@ridematchstlucia.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminVehicleNameBooking">Vehicle Name</Label>
                  <Input
                    id="adminVehicleNameBooking"
                    type="text"
                    value={adminVehicleName}
                    onChange={(e) => setAdminVehicleName(e.target.value)}
                    placeholder="Honda Civic 2023"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminCompanyNameBooking">Company Name</Label>
                  <Input
                    id="adminCompanyNameBooking"
                    type="text"
                    value={adminCompanyName}
                    onChange={(e) => setAdminCompanyName(e.target.value)}
                    placeholder="Island Rentals Ltd"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminRenterFirstNameBooking">Renter First Name</Label>
                    <Input
                      id="adminRenterFirstNameBooking"
                      type="text"
                      value={adminRenterFirstName}
                      onChange={(e) => setAdminRenterFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminRenterLastNameBooking">Renter Last Name</Label>
                    <Input
                      id="adminRenterLastNameBooking"
                      type="text"
                      value={adminRenterLastName}
                      onChange={(e) => setAdminRenterLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminPickupDateTime">Pickup Date & Time</Label>
                    <Input
                      id="adminPickupDateTime"
                      type="datetime-local"
                      value={adminPickupDateTime}
                      onChange={(e) => setAdminPickupDateTime(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminReturnDateTime">Return Date & Time</Label>
                    <Input
                      id="adminReturnDateTime"
                      type="datetime-local"
                      value={adminReturnDateTime}
                      onChange={(e) => setAdminReturnDateTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSendAdminBookingEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Admin Booking Notification'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'booking-confirmation-admin' event in Loops.</p>
                  <p className="mt-1">Required properties: vehicle-name, company-name, renter-first-name, renter-last-name, pickup-date-time, return-date-time</p>
                </div>
              </TabsContent>

              <TabsContent value="cancellation" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="cancellationRenterEmail">Renter Email</Label>
                  <Input
                    id="cancellationRenterEmail"
                    type="email"
                    value={cancellationRenterEmail}
                    onChange={(e) => setCancellationRenterEmail(e.target.value)}
                    placeholder="renter@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cancellationRenterFirstName">Renter First Name</Label>
                  <Input
                    id="cancellationRenterFirstName"
                    type="text"
                    value={cancellationRenterFirstName}
                    onChange={(e) => setCancellationRenterFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellationVehicleName">Vehicle Name</Label>
                  <Input
                    id="cancellationVehicleName"
                    type="text"
                    value={cancellationVehicleName}
                    onChange={(e) => setCancellationVehicleName(e.target.value)}
                    placeholder="Honda Civic 2023"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellationPickupDate">Original Pickup Date</Label>
                  <Input
                    id="cancellationPickupDate"
                    type="date"
                    value={cancellationPickupDate}
                    onChange={(e) => setCancellationPickupDate(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  onClick={handleSendCancellationEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Booking Cancellation Email'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'booking-cancelled-renter' event in Loops.</p>
                  <p className="mt-1">Required properties: renter-first-name, vehicle-name, pickup-date</p>
                </div>
              </TabsContent>

              <TabsContent value="company-cancel" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="companyCancellationEmail">Company Email</Label>
                  <Input
                    id="companyCancellationEmail"
                    type="email"
                    value={companyCancellationEmail}
                    onChange={(e) => setCompanyCancellationEmail(e.target.value)}
                    placeholder="company@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyCancellationContactName">Company Contact Name</Label>
                  <Input
                    id="companyCancellationContactName"
                    type="text"
                    value={companyCancellationContactName}
                    onChange={(e) => setCompanyCancellationContactName(e.target.value)}
                    placeholder="Manager"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyCancellationVehicleName">Vehicle Name</Label>
                  <Input
                    id="companyCancellationVehicleName"
                    type="text"
                    value={companyCancellationVehicleName}
                    onChange={(e) => setCompanyCancellationVehicleName(e.target.value)}
                    placeholder="Honda Civic 2023"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyCancellationRenterFirstName">Renter First Name</Label>
                    <Input
                      id="companyCancellationRenterFirstName"
                      type="text"
                      value={companyCancellationRenterFirstName}
                      onChange={(e) => setCompanyCancellationRenterFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyCancellationRenterLastName">Renter Last Name</Label>
                    <Input
                      id="companyCancellationRenterLastName"
                      type="text"
                      value={companyCancellationRenterLastName}
                      onChange={(e) => setCompanyCancellationRenterLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyCancellationBookingLink">Booking Link (Optional)</Label>
                  <Input
                    id="companyCancellationBookingLink"
                    type="url"
                    value={companyCancellationBookingLink}
                    onChange={(e) => setCompanyCancellationBookingLink(e.target.value)}
                    placeholder="https://ridematchstlucia.com/company/bookings"
                  />
                </div>
                
                <Button 
                  onClick={handleSendCompanyCancellationEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Company Cancellation Email'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'booking-cancelled-company' event in Loops.</p>
                  <p className="mt-1">Required properties: company-contact-name, vehicle-name, renter-first-name, renter-last-name, booking-link</p>
                </div>
              </TabsContent>

              <TabsContent value="admin-cancel" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="adminCancellationEmail">Admin Email</Label>
                  <Input
                    id="adminCancellationEmail"
                    type="email"
                    value={adminCancellationEmail}
                    onChange={(e) => setAdminCancellationEmail(e.target.value)}
                    placeholder="admin@ridematchstlucia.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminCancellationVehicleName">Vehicle Name</Label>
                  <Input
                    id="adminCancellationVehicleName"
                    type="text"
                    value={adminCancellationVehicleName}
                    onChange={(e) => setAdminCancellationVehicleName(e.target.value)}
                    placeholder="Honda Civic 2023"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminCancellationCompanyName">Company Name</Label>
                  <Input
                    id="adminCancellationCompanyName"
                    type="text"
                    value={adminCancellationCompanyName}
                    onChange={(e) => setAdminCancellationCompanyName(e.target.value)}
                    placeholder="St. Lucia Car Rentals"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminCancellationRenterFirstName">Renter First Name</Label>
                    <Input
                      id="adminCancellationRenterFirstName"
                      type="text"
                      value={adminCancellationRenterFirstName}
                      onChange={(e) => setAdminCancellationRenterFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminCancellationRenterLastName">Renter Last Name</Label>
                    <Input
                      id="adminCancellationRenterLastName"
                      type="text"
                      value={adminCancellationRenterLastName}
                      onChange={(e) => setAdminCancellationRenterLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSendAdminCancellationEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Admin Cancellation Email'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'booking-cancelled-admin' event in Loops.</p>
                  <p className="mt-1">Required properties: vehicle-name, company-name, renter-first-name, renter-last-name</p>
                </div>
              </TabsContent>

              <TabsContent value="reminder" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="preRentalRenterEmail">Renter Email</Label>
                  <Input
                    id="preRentalRenterEmail"
                    type="email"
                    value={preRentalRenterEmail}
                    onChange={(e) => setPreRentalRenterEmail(e.target.value)}
                    placeholder="renter@example.com"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preRentalRenterFirstName">Renter First Name</Label>
                    <Input
                      id="preRentalRenterFirstName"
                      type="text"
                      value={preRentalRenterFirstName}
                      onChange={(e) => setPreRentalRenterFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preRentalRenterLastName">Renter Last Name</Label>
                    <Input
                      id="preRentalRenterLastName"
                      type="text"
                      value={preRentalRenterLastName}
                      onChange={(e) => setPreRentalRenterLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preRentalVehicleName">Vehicle Name</Label>
                  <Input
                    id="preRentalVehicleName"
                    type="text"
                    value={preRentalVehicleName}
                    onChange={(e) => setPreRentalVehicleName(e.target.value)}
                    placeholder="Honda Civic 2023"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preRentalPickupDateTime">Pickup Date & Time</Label>
                  <Input
                    id="preRentalPickupDateTime"
                    type="datetime-local"
                    value={preRentalPickupDateTime}
                    onChange={(e) => setPreRentalPickupDateTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preRentalPickupLocation">Pickup Location</Label>
                  <Input
                    id="preRentalPickupLocation"
                    type="text"
                    value={preRentalPickupLocation}
                    onChange={(e) => setPreRentalPickupLocation(e.target.value)}
                    placeholder="Hewanorra International Airport"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preRentalBookingLink">Booking Link (Optional)</Label>
                  <Input
                    id="preRentalBookingLink"
                    type="url"
                    value={preRentalBookingLink}
                    onChange={(e) => setPreRentalBookingLink(e.target.value)}
                    placeholder="https://ridematchstlucia.com/bookings"
                  />
                </div>
                
                <Button 
                  onClick={handleSendPreRentalReminderEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Pre-Rental Reminder Email'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'pre-rental-reminder-renter' event in Loops.</p>
                  <p className="mt-1">Required properties: renter-first-name, vehicle-name, pickup-date-time, pickup-location, booking-link</p>
                </div>
              </TabsContent>

              <TabsContent value="company-reminder" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="companyReminderEmail">Company Email</Label>
                  <Input
                    id="companyReminderEmail"
                    type="email"
                    value={companyReminderEmail}
                    onChange={(e) => setCompanyReminderEmail(e.target.value)}
                    placeholder="company@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyReminderContactName">Company Contact Name</Label>
                  <Input
                    id="companyReminderContactName"
                    type="text"
                    value={companyReminderContactName}
                    onChange={(e) => setCompanyReminderContactName(e.target.value)}
                    placeholder="Manager"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyReminderVehicleName">Vehicle Name</Label>
                  <Input
                    id="companyReminderVehicleName"
                    type="text"
                    value={companyReminderVehicleName}
                    onChange={(e) => setCompanyReminderVehicleName(e.target.value)}
                    placeholder="Honda Civic 2023"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyReminderRenterFirstName">Renter First Name</Label>
                    <Input
                      id="companyReminderRenterFirstName"
                      type="text"
                      value={companyReminderRenterFirstName}
                      onChange={(e) => setCompanyReminderRenterFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyReminderRenterLastName">Renter Last Name</Label>
                    <Input
                      id="companyReminderRenterLastName"
                      type="text"
                      value={companyReminderRenterLastName}
                      onChange={(e) => setCompanyReminderRenterLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyReminderPickupDateTime">Pickup Date & Time</Label>
                  <Input
                    id="companyReminderPickupDateTime"
                    type="datetime-local"
                    value={companyReminderPickupDateTime}
                    onChange={(e) => setCompanyReminderPickupDateTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyReminderBookingLink">Booking Link (Optional)</Label>
                  <Input
                    id="companyReminderBookingLink"
                    type="url"
                    value={companyReminderBookingLink}
                    onChange={(e) => setCompanyReminderBookingLink(e.target.value)}
                    placeholder="https://ridematchstlucia.com/company/bookings"
                  />
                </div>
                
                <Button 
                  onClick={handleSendCompanyReminderEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Company Reminder Email'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'pre-rental-reminder-company' event in Loops.</p>
                  <p className="mt-1">Required properties: company-contact-name, vehicle-name, renter-first-name, renter-last-name, pickup-date-time, booking-link</p>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmailField">Contact Email</Label>
                  <Input
                    id="contactEmailField"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactSubject">Subject</Label>
                  <Input
                    id="contactSubject"
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="Question about vehicle rental"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactMessage">Message</Label>
                  <textarea
                    id="contactMessage"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Hi, I have a question about..."
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical"
                    required
                  />
                </div>
                
                <Button 
                  onClick={handleSendContactForm}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Contact Form'}
                </Button>

                <div className="text-sm text-gray-600 mt-4">
                  <p>This triggers the 'contact-form-submission' event in Loops.</p>
                  <p className="mt-1">Sends to: admin@ridematchstlucia.com</p>
                  <p className="mt-1">Required properties: contact-name, contact-email, contact-subject, contact-message, submission-date</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestEmail;