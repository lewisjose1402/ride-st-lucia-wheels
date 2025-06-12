
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Car, 
  LayoutDashboard, 
  User, 
  CalendarClock,
  Settings
} from 'lucide-react';

type CompanyLayoutProps = {
  children: ReactNode;
  title: string;
};

const CompanyLayout = ({ children, title }: CompanyLayoutProps) => {
  const location = useLocation();
  const { profile } = useAuth();
  
  const navItems = [
    { path: '/company', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/company/vehicles', icon: <Car size={18} />, label: 'Vehicles' },
    { path: '/company/bookings', icon: <CalendarClock size={18} />, label: 'Bookings' },
    { path: '/company/profile', icon: <User size={18} />, label: 'Company Profile' },
    { path: '/company/settings', icon: <Settings size={18} />, label: 'Settings' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Debug logging for profile data
  console.log("Company Layout - Profile Data:", profile);
  console.log("Company Logo URL:", profile?.logo_url);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex mt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200 hidden md:block">
          <div className="p-6 flex flex-col items-center space-y-3">
            <Avatar className="h-16 w-16">
              {profile?.logo_url ? (
                <AvatarImage 
                  src={profile.logo_url} 
                  alt={`${profile.company_name} logo`}
                  className="object-cover"
                  onError={(e) => {
                    console.error("Error loading logo image:", e);
                    // Hide the image element if it fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <AvatarFallback className="bg-brand-purple text-white text-xl">
                {getInitials(profile?.company_name || 'Co')}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold text-brand-purple text-center truncate w-full">
              {profile?.company_name || 'Company Dashboard'}
            </h2>
          </div>
          <nav className="mt-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-brand-purple ${
                  location.pathname === item.path ? 'bg-brand-purple bg-opacity-10 text-brand-purple font-medium border-l-4 border-brand-purple' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Mobile menu */}
        <div className="md:hidden bg-gray-50 border-b border-gray-200 w-full overflow-x-auto">
          <div className="flex p-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-3 mx-1 text-xs ${
                  location.pathname === item.path ? 'text-brand-purple font-medium' : 'text-gray-600'
                }`}
              >
                <span className="mb-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyLayout;
