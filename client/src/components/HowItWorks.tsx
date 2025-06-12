
import { Search, Car, Calendar } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-brand-purple" />,
      title: "Search & Compare",
      description: "Enter your dates and preferences to find and compare available rental vehicles from local companies."
    },
    {
      icon: <Car className="w-12 h-12 text-brand-purple" />,
      title: "Choose Your Vehicle",
      description: "Browse through our wide selection of vehicles and choose the one that perfectly fits your needs."
    },
    {
      icon: <Calendar className="w-12 h-12 text-brand-purple" />,
      title: "Book & Confirm",
      description: "Book your vehicle online with a small deposit and receive instant confirmation for your reservation."
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
            How RideMatch Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Finding and booking your ideal rental vehicle in St. Lucia is simple and hassle-free
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
