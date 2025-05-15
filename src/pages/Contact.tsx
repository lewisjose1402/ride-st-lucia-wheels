
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-brand-purple text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Have questions about RideMatch St. Lucia? We're here to help!
            </p>
          </div>
        </section>
        
        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-6">Get In Touch</h2>
                <p className="text-gray-600 mb-8">
                  We're always happy to hear from you, whether you have a question about our services, 
                  need help with a booking, or want to partner with us as a rental company.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="text-brand-purple mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium text-brand-dark">Email Us</h3>
                      <p className="text-gray-600">info@ridematchstlucia.com</p>
                      <p className="text-gray-600">support@ridematchstlucia.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-brand-purple mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium text-brand-dark">Call Us</h3>
                      <p className="text-gray-600">+1 (758) 123-4567</p>
                      <p className="text-gray-600">Monday-Friday, 8:30am-5:00pm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="text-brand-purple mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium text-brand-dark">Visit Us</h3>
                      <p className="text-gray-600">RideMatch St. Lucia</p>
                      <p className="text-gray-600">123 Rodney Bay Blvd</p>
                      <p className="text-gray-600">Gros Islet, St. Lucia</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-brand-dark mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your name" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email" required className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this regarding?" required className="mt-1" />
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help you..." 
                      required 
                      className="mt-1 min-h-[150px]" 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple-dark">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
