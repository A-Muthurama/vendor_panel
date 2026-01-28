import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import AuthFooter from "../components/AuthFooter";
import "../styles/auth.css";

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <>
      <AuthHeader />
      <div className="auth-page">
        <div className="auth-box" style={{ maxWidth: "500px", textAlign: "center", borderTop: "5px solid var(--primary-gold)" }}>

          {/* Header Icon */}
          <div style={{ fontSize: "50px", marginBottom: "15px" }}>⏳</div>

          {/* Heading */}
          <h2>Account Under Review</h2>

          {/* Status Message */}
          <p style={{ marginBottom: "25px", fontWeight: "500" }}>
            Your Seller account has been registered successfully!
            <br />
            Our admin team is currently verifying your details.
          </p>

          {/* Info Box */}
          <div style={{
            backgroundColor: "#FFF9C4", /* Light Gold/Yellow */
            border: "1px solid var(--primary-gold)",
            padding: "20px",
            borderRadius: "var(--radius-md)",
            margin: "0 auto 25px auto",
            textAlign: "left",
            maxWidth: "90%"
          }}>
            <h4 style={{ color: "var(--text-dark)", marginTop: 0, marginBottom: "10px", fontSize: "16px" }}>
              Next Steps:
            </h4>
            <ul style={{ color: "var(--text-muted)", fontSize: "14px", paddingLeft: "20px", marginBottom: 0 }}>
              <li style={{ marginBottom: "8px" }}>Explore our <strong>Subscription Plans</strong></li>
              <li style={{ marginBottom: "8px" }}>Prepare your offer details</li>
              <li>Wait for admin approval (24-48 hrs)</li>
            </ul>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => navigate("/pricing")}
          >
            View Subscription Plans
          </button>

          {/* Secondary Action Button */}
          <button
            onClick={() => navigate("/vendor/dashboard")}
            style={{
              backgroundColor: "transparent",
              border: "2px solid var(--primary-gold)",
              color: "var(--text-dark)",
              marginTop: "10px",
              boxShadow: "none"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "var(--primary-gold)";
              e.target.style.color = "plum purple";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "var(--text-dark)";
            }}
          >
            Go to Dashboard
          </button>

        </div>
      </div>
      <AuthFooter />
    </>
  );
};

export default PendingApproval;
