
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Car, Calendar, Shield, Clock, MapPin } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-brand-purple" />,
      title: "Search & Compare",
      description: "Enter your travel dates and browse through our wide selection of vehicles from trusted local rental companies across St. Lucia."
    },
    {
      icon: <Car className="w-12 h-12 text-brand-purple" />,
      title: "Choose Your Perfect Vehicle",
      description: "Select from economy cars, SUVs, jeeps, and luxury vehicles. View detailed photos, specifications, and real customer reviews."
    },
    {
      icon: <Calendar className="w-12 h-12 text-brand-purple" />,
      title: "Book Instantly",
      description: "Complete your booking online with a small confirmation deposit. Receive instant confirmation and booking details via email."
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-brand-orange" />,
      title: "Verified Companies",
      description: "All rental companies are verified and licensed to operate in St. Lucia"
    },
    {
      icon: <Clock className="w-8 h-8 text-brand-orange" />,
      title: "24/7 Support",
      description: "Get help anytime with our dedicated customer support team"
    },
    {
      icon: <MapPin className="w-8 h-8 text-brand-orange" />,
      title: "Island-Wide Delivery",
      description: "Convenient pickup and delivery options across the island"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-purple to-brand-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How RideMatch Works
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Discover how easy it is to find and book the perfect rental vehicle for your St. Lucia adventure
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Getting your ideal rental vehicle is easier than ever
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center bg-white p-8 rounded-lg shadow-lg relative">
                  <div className="absolute -top-4 -left-4 bg-brand-orange text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                Why Choose RideMatch?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We connect you with the best local rental companies in St. Lucia
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center p-6">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Rental Companies Section */}
        <section className="py-16 bg-brand-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
                For Rental Companies
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join our platform and reach more customers while we handle the marketing and bookings for you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark mb-3">Easy Management</h3>
                  <p className="text-gray-600">
                    Manage your fleet, bookings, and availability through our intuitive dashboard. 
                    Update vehicle information and track your business performance in real-time.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark mb-3">Increased Visibility</h3>
                  <p className="text-gray-600">
                    Reach thousands of tourists looking for rental vehicles in St. Lucia. 
                    Our platform promotes your business to the right customers at the right time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;
