import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

import Index from "./pages/Index.tsx";
import Rooms from "./pages/Rooms.tsx";
import RoomDetail from "./pages/RoomDetail.tsx";
import Gallery from "./pages/Gallery.tsx";
import Location from "./pages/Location.tsx";
import Contact from "./pages/Contact.tsx";
import Offers from "./pages/Offers.tsx";
import NotFound from "./pages/NotFound.tsx";

import GuestHub from "./pages/guest/GuestHub.tsx";
import RoomQR from "./pages/guest/RoomQR.tsx";

import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminRequests from "./pages/admin/AdminRequests.tsx";
import AdminServices from "./pages/admin/AdminServices.tsx";
import AdminRooms from "./pages/admin/AdminRooms.tsx";
import AdminContent from "./pages/admin/AdminContent.tsx";
import AdminReports from "./pages/admin/AdminReports.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminQRCodes from "./pages/admin/AdminQRCodes.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public site */}
            <Route path="/" element={<Index />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:slug" element={<RoomDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/location" element={<Location />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/contact" element={<Contact />} />

            {/* Guest QR hub (no auth) */}
            <Route path="/guest" element={<GuestHub />} />
            <Route path="/r/:qrCodeSlug" element={<RoomQR />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute>
                  <AdminRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute>
                  <AdminServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rooms"
              element={
                <ProtectedRoute>
                  <AdminRooms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute>
                  <AdminContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/qr-codes"
              element={
                <ProtectedRoute>
                  <AdminQRCodes />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
