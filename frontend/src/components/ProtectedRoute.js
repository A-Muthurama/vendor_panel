import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, status } = useAuth();

  // Normalize status to uppercase
  const normalizedStatus = (status || "").toUpperCase();

  if (!token) return <Navigate to="/vendor/login" />;
  
  // APPROVED, PENDING, PENDING_APPROVAL, LOGIN_APPROVAL, and OFFERS_APPROVAL are allowed
  const allowedStatuses = ["APPROVED", "PENDING", "PENDING_APPROVAL", "LOGIN_APPROVAL", "OFFERS_APPROVAL"];
  if (!allowedStatuses.includes(normalizedStatus)) return <Navigate to="/vendor/login" />;

  return children;
};

export default ProtectedRoute;
