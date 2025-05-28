
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Company pages
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyProfile from "./pages/company/Profile";
import CompanyVehicles from "./pages/company/Vehicles";
import CompanyBookings from "./pages/company/Bookings";
import CompanySettings from "./pages/company/Settings";
import AddEditVehicle from "./pages/company/AddEditVehicle";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />

            {/* Company routes */}
            <Route path="/company" element={<Navigate to="/company/dashboard" replace />} />
            <Route path="/company/dashboard" element={
              <ProtectedRoute requiredRole="rental_company">
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/company/profile" element={
              <ProtectedRoute requiredRole="rental_company">
                <CompanyProfile />
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
            <Route path="/company/vehicles/:id/edit" element={
              <ProtectedRoute requiredRole="rental_company">
                <AddEditVehicle />
              </ProtectedRoute>
            } />
            <Route path="/company/bookings" element={
              <ProtectedRoute requiredRole="rental_company">
                <CompanyBookings />
              </ProtectedRoute>
            } />
            <Route path="/company/settings" element={
              <ProtectedRoute requiredRole="rental_company">
                <CompanySettings />
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
