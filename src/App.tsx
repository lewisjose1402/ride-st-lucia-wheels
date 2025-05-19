
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VehiclesPage from "./pages/Vehicles";
import VehicleDetailPage from "./pages/VehicleDetail";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyVehicles from "./pages/company/Vehicles";
import AddEditVehicle from "./pages/company/AddEditVehicle";
import CompanyProfile from "./pages/company/Profile";
import CompanyBookings from "./pages/company/Bookings";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Company Routes */}
            <Route path="/company" element={
              <ProtectedRoute requiredRole="rental_company">
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/company/vehicles" element={
              <ProtectedRoute requiredRole="rental_company">
                <CompanyVehicles />
              </ProtectedRoute>
            } />
            <Route path="/company/vehicles/add" element={
              <ProtectedRoute requiredRole="rental_company">
                <AddEditVehicle />
              </ProtectedRoute>
            } />
            <Route path="/company/vehicles/edit/:id" element={
              <ProtectedRoute requiredRole="rental_company">
                <AddEditVehicle />
              </ProtectedRoute>
            } />
            <Route path="/company/profile" element={
              <ProtectedRoute requiredRole="rental_company">
                <CompanyProfile />
              </ProtectedRoute>
            } />
            <Route path="/company/bookings" element={
              <ProtectedRoute requiredRole="rental_company">
                <CompanyBookings />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
