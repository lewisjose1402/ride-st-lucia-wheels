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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Email System</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="welcome" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="welcome">Welcome Email</TabsTrigger>
                <TabsTrigger value="company">Company Signup</TabsTrigger>
                <TabsTrigger value="booking">Booking Confirm</TabsTrigger>
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestEmail;