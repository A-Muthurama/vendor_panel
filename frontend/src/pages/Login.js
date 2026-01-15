import "../styles/auth.css";
import { useState } from "react";
import { loginVendor } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Debug: log input values
    console.log("LOGIN DEBUG: Submitting login", { email, password });

    try {
      const res = await loginVendor({ email, password });
      console.log("LOGIN DEBUG: API response", res);
      const { token, vendorStatus, vendor, rejectionReason } = res.data;

      // Save auth globally (context uses 'status' so we map vendorStatus -> status)
      login(token, vendorStatus, vendor);

      // Status-based redirect
      if (vendorStatus === "APPROVED") {
        navigate("/vendor/dashboard");
      } else if (vendorStatus === "PENDING" || vendorStatus === "PENDING_APPROVAL") {
        // User requested to go to Pending Approval page, not Dashboard
        navigate("/vendor/pending-approval");
      } else if (vendorStatus === "REJECTED") {
        navigate("/vendor/rejected", { state: { reason: rejectionReason } });
      } else {
        // Fallback
        navigate("/vendor/dashboard");
      }
    } catch (err) {
      console.log("LOGIN DEBUG: API error", err, err?.response);
      const code = err.response?.data?.code;
      const message = err.response?.data?.message || "Invalid credentials";

      if (code === "USER_NOT_FOUND") {
        setError(<>This email is not registered. <Link to="/vendor/signup" style={{ color: '#d4af37' }}>Register here</Link></>);
      } else if (code === "WRONG_PASSWORD") {
        setError(<>Incorrect password. <Link to="/vendor/forgot-password" style={{ color: '#d4af37' }}>Reset it?</Link></>);
      } else {
        setError(message);
      }
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit}>
        <h2>SELLER LOGIN</h2>

        {error && <div className="error-text">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <div className="auth-link" style={{ marginBottom: '10px' }}>
          <Link to="/vendor/forgot-password" style={{ color: '#4C0F2E', fontSize: '14px', textDecoration: 'underline' }}>
            Forgot Password?
          </Link>
        </div>
        <div className="auth-link">
          New Seller? <Link to="/vendor/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
