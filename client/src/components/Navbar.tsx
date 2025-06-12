
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import AuthButtons from './AuthButtons';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-brand-purple" />
            <span className="font-bold text-xl text-brand-purple">RideMatch</span>
            <span className="font-light text-brand-purple-dark">St. Lucia</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-brand-dark hover:text-brand-purple transition-colors">
              Home
            </Link>
            <Link to="/vehicles" className="text-brand-dark hover:text-brand-purple transition-colors">
              Vehicles
            </Link>
            <Link to="/about" className="text-brand-dark hover:text-brand-purple transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-brand-dark hover:text-brand-purple transition-colors">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:block">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-brand-purple"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-4 py-4">
              <Link 
                to="/" 
                className="text-brand-dark hover:text-brand-purple transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/vehicles" 
                className="text-brand-dark hover:text-brand-purple transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Vehicles
              </Link>
              <Link 
                to="/about" 
                className="text-brand-dark hover:text-brand-purple transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-brand-dark hover:text-brand-purple transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <AuthButtons />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
