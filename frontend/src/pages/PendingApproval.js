import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ maxWidth: "500px", textAlign: "center", borderTop: "5px solid #4C0F2E" }}>

        {/* Header Icon */}
        <div style={{ fontSize: "50px", marginBottom: "15px" }}>⏳</div>

        {/* Heading */}
        <h2 style={{ color: "#4C0F2E", marginBottom: "15px", fontWeight: "700" }}>
          Account Under Review
        </h2>

        {/* Status Message */}
        <p style={{ color: "#333", fontSize: "15px", lineHeight: "1.6", marginBottom: "25px", fontWeight: "500" }}>
          Your Seller account has been registered successfully!
          <br />
          Our admin team is currently verifying your details.
        </p>

        {/* Info Box */}
        <div style={{
          backgroundColor: "#fff8e1", /* Very light yellow */
          border: "1px solid #d4af37",
          padding: "20px",
          borderRadius: "10px",
          margin: "0 auto 25px auto",
          textAlign: "left",
          maxWidth: "90%"
        }}>
          <h4 style={{ color: "#4C0F2E", marginTop: 0, marginBottom: "10px", fontSize: "16px" }}>
            Next Steps:
          </h4>
          <ul style={{ color: "#555", fontSize: "14px", paddingLeft: "20px", marginBottom: 0 }}>
            <li style={{ marginBottom: "8px" }}>Explore our <strong>Subscription Plans</strong></li>
            <li style={{ marginBottom: "8px" }}>Prepare your offer details</li>
            <li>Wait for admin approval (24-48 hrs)</li>
          </ul>
        </div>

        {/* Primary Action Button */}
        <button
          className="auth-btn"
          onClick={() => navigate("/pricing")}
          style={{
            backgroundColor: "#4C0F2E",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            marginBottom: "15px",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
        >
          View Subscription Plans
        </button>

        {/* Secondary Action Button */}
        <button
          className="auth-btn"
          onClick={() => navigate("/vendor/dashboard")}
          style={{
            backgroundColor: "transparent",
            border: "2px solid #4C0F2E",
            color: "#faf3f6ff",
            fontWeight: "600",
            padding: "12px",
            borderRadius: "8px"
          }}
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
};

export default PendingApproval;
