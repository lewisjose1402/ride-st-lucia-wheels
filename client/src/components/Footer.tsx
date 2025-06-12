
import { Facebook, Instagram, Mail, Twitter } from 'lucide-react';
import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-xl mb-4">RideMatch St. Lucia</h3>
            <p className="text-gray-300 mb-4">
              Connecting tourists with local car rental companies for the perfect island experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-brand-orange" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-brand-orange" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-brand-orange" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/vehicles" className="text-gray-300 hover:text-white">Browse Vehicles</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* For Rental Companies */}
          <div>
            <h3 className="font-bold text-lg mb-4">For Rental Companies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signin" className="text-gray-300 hover:text-white">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">Register Your Business</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-white">How It Works</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p className="flex items-center text-gray-300 mb-2">
              <Mail size={16} className="mr-2" />
              <a href="mailto:info@ridematchstlucia.com" className="hover:text-white">
                info@ridematchstlucia.com
              </a>
            </p>
            <p className="text-gray-300 mb-4">Castries, St. Lucia</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} RideMatch St. Lucia. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
