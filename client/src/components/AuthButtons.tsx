
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useCompanyAccess } from '@/hooks/useCompanyAccess';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, Building, Calendar, Shield } from 'lucide-react';

const AuthButtons = () => {
  const { user, signOut, isRentalCompany, isAdmin, isRenter } = useAuth();
  const { shouldShowCompanyDashboard } = useCompanyAccess();

  console.log("AuthButtons - isAdmin:", isAdmin, "isRentalCompany:", isRentalCompany, "shouldShowCompanyDashboard:", shouldShowCompanyDashboard);

  return (
    <div>
      {!user ? (
        <div className="flex gap-3">
          <Link to="/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-brand-purple hover:bg-brand-purple-dark text-white">Sign Up</Button>
          </Link>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-brand-purple text-white">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium">
              {user.email || 'User Account'}
            </div>
            <DropdownMenuSeparator />
            
            {/* Admin Dashboard - show first for admin users */}
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/admin/dashboard" className="w-full flex items-center cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            {/* My Bookings - available to renters and rental companies */}
            {(isRenter || isRentalCompany || isAdmin) && (
              <DropdownMenuItem asChild>
                <Link to="/my-bookings" className="w-full flex items-center cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            {/* Company Dashboard - for users with company profiles (including admin users) */}
            {shouldShowCompanyDashboard && (
              <DropdownMenuItem asChild>
                <Link to="/company/dashboard" className="w-full flex items-center cursor-pointer">
                  <Building className="mr-2 h-4 w-4" />
                  <span>Company Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default AuthButtons;
