import { Button } from "./ui/button";
import { Link } from "wouter";

const CallToAction = () => {
  return (
    <section className="py-16 bg-brand-purple">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Are You a Car Rental Company in St. Lucia?
            </h2>
            <p className="text-xl text-white/90 mb-6">
              Join our platform to reach more customers and grow your business. RideMatch connects tourists from around the world with local rental services.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button className="bg-white text-brand-purple hover:bg-gray-100">
                  Register Your Business
                </Button>
              </Link>
              <Link to="/how-it-works-partners">
                <Button variant="outline" className="bg-white text-brand-purple border-white hover:bg-gray-100 hover:text-brand-purple">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:ml-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h3 className="text-xl font-bold text-brand-dark mb-3">Benefits for Partners</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-brand-purple text-white rounded-full p-1 mr-2 text-xs">✓</span>
                  <span>Increase your visibility to tourists</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-brand-purple text-white rounded-full p-1 mr-2 text-xs">✓</span>
                  <span>Manage bookings through one simple dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-brand-purple text-white rounded-full p-1 mr-2 text-xs">✓</span>
                  <span>Receive instant notifications for new reservations</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-brand-purple text-white rounded-full p-1 mr-2 text-xs">✓</span>
                  <span>Access insights and analytics for your business</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
