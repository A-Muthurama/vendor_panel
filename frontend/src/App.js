import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PendingApproval from "./pages/PendingApproval";
import Rejected from "./pages/Rejected";
import Dashboard from "./pages/Dashboard";
import VendorOffers from "./pages/VendorOffers";
import VendorProfile from "./pages/VendorProfile";
import Support from "./pages/Support";
import ProtectedRoute from "./components/ProtectedRoute";
import PricingPlans from "./components/PricingPlans";
import PosterUpload from "./components/PosterUpload";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PublicSupport from "./pages/PublicSupport";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Redirect to Login */}
          <Route path="/" element={<Navigate to="/vendor/login" />} />

          {/* Public Routes */}
          <Route path="/vendor/signup" element={<Signup />} />
          <Route path="/vendor/login" element={<Login />} />
          <Route path="/vendor/forgot-password" element={<ForgotPassword />} />
          <Route path="/vendor/reset-password" element={<ResetPassword />} />
          <Route path="/vendor/pending-approval" element={<PendingApproval />} />

          <Route path="/vendor/rejected" element={<Rejected />} />
          <Route path="/vendor/help-support" element={<PublicSupport />} />

          {/* Protected Routes */}
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/offers"
            element={
              <ProtectedRoute>
                <VendorOffers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/profile"
            element={
              <ProtectedRoute>
                <VendorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <PricingPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <PosterUpload />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
