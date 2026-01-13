import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, status } = useAuth();

  if (!token) return <Navigate to="/vendor/login" />;
  if (!token) return <Navigate to="/vendor/login" />;
  // APPROVED or PENDING are allowed (PENDING gets restricted view)
  if (status !== "APPROVED" && status !== "PENDING") return <Navigate to="/vendor/login" />;

  return children;
};

export default ProtectedRoute;
