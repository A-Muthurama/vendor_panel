import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { token, status, vendor, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/vendor/login");
      return;
    }
    // We now allow PENDING users to stay on Dashboard
  }, [token, navigate]);

  const isPending = status === "PENDING";

  const handleRestrictedClick = (path) => {
    if (isPending) {
      alert("Account is under review. You cannot access this feature yet.");
      return;
    }
    navigate(path);
  };

  return (
    <div className="dashboard-page">
      {/* ---------- HEADER ---------- */}
      <div className="dashboard-header">
        <div>
          <h2>Seller Dashboard</h2>
          <p className="shop-name">
            {vendor?.shopName || "Your Shop"}
          </p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* ---------- PENDING BANNER -------- */}
      {isPending && (
        <div style={{
          backgroundColor: "#fff3cd",
          color: "#856404",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #ffeeba",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span>⚠️</span>
          <div>
            <strong>Account Under Review:</strong> You can view subscription plans, but posting offers is disabled until approved.
          </div>
        </div>
      )}

      {/* ---------- STATUS CARD ---------- */}
      <div className={`status-card ${isPending ? "pending" : "approved"}`}>
        <h4>Account Status</h4>
        <p>{isPending ? "⏳ Pending Approval" : "✅ Approved"}</p>
      </div>

      {/* ---------- STATS (PLACEHOLDERS) ---------- */}
      <div className="stats-grid">
        <div className="stat-card" style={{ opacity: isPending ? 0.6 : 1 }}>
          <h3>0</h3>
          <p>Total Offers</p>
        </div>

        <div className="stat-card" style={{ opacity: isPending ? 0.6 : 1 }}>
          <h3>0</h3>
          <p>Active Offers</p>
        </div>

        <div className="stat-card">
          <h3>Not Purchased</h3>
          <p>Subscription</p>
        </div>
      </div>

      {/* ---------- ACTIONS ---------- */}
      <div className="actions-grid">
        <div
          className={`action-card ${isPending ? "disabled" : ""}`}
          onClick={() => handleRestrictedClick("/vendor/offers")}
          style={{ opacity: isPending ? 0.5 : 1, cursor: isPending ? "not-allowed" : "pointer" }}
        >
          Manage Offers
          {isPending && <small style={{ display: "block", color: "red" }}> (Locked)</small>}
        </div>

        {/* Subscription Plans - ALWAYS OPEN */}
        <div
          className="action-card"
          onClick={() => navigate("/pricing")}
        >
          Subscription Plans
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/vendor/profile")}
        >
          Profile & KYC
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/support")}
        >
          Support
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
