import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import HowItWorks from "./pages/HowItWorks";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CompanySignUp from "./pages/CompanySignUp";

// Company pages
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyProfile from "./pages/company/Profile";
import CompanyVehicles from "./pages/company/Vehicles";
import CompanyBookings from "./pages/company/Bookings";
import CompanySettings from "./pages/company/Settings";
import AddEditVehicle from "./pages/company/AddEditVehicle";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
        const response = await fetch(url as string);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      },
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Switch>
            {/* Public routes */}

            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<CompanySignUp />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />


            {/* Company routes */}
            <Route path="/company">
              {() => {
                window.location.href = "/company/dashboard";
                return null;
              }}
            </Route>
            <Route path="/company/dashboard">
              {() => (
                <ProtectedRoute requiredRole="rental_company">
                  <CompanyDashboard />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/company/profile">
              {() => (
                <ProtectedRoute requiredRole="rental_company">
                  <CompanyProfile />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/company/vehicles">
              {() => (
                <ProtectedRoute requiredRole="rental_company">
                  <CompanyVehicles />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/company/vehicles/add">
              {() => (
                <ProtectedRoute requiredRole="rental_company">
                  <AddEditVehicle />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/company/vehicles/edit/:id">
              {() => (
                <ProtectedRoute requiredRole="rental_company">
                  <AddEditVehicle />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/company/bookings">
              {() => (
                <ProtectedRoute requiredRole="rental_company">
                  <CompanyBookings />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/company/settings">
              {() => (
                <ProtectedRoute requiredRole="rental_company">
                  <CompanySettings />
                </ProtectedRoute>
              )}
            </Route>

            {/* Admin routes */}
            <Route path="/admin">
              {() => {
                window.location.href = "/admin/dashboard";
                return null;
              }}
            </Route>
            <Route path="/admin/dashboard">
              {() => (
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              )}
            </Route>

            <Route component={NotFound} />
          </Switch>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
