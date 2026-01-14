import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { token, status, vendor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/vendor/login");
      return;
    }
  }, [token, navigate]);

  const isPending = status === "PENDING";

  return (
    <div className="dashboard-container">
      <TopHeader />

      <div className="dashboard-content">

        {/* Welcome Section */}
        <div className="welcome-banner">
          <h1>Welcome Back, {vendor?.ownerName?.split(" ")[0] || "Vendor"}!</h1>
          <p>Here’s what’s happening with your shop today.</p>
        </div>

        {/* ---------- PENDING ALERT ---------- */}
        {isPending && (
          <div className="alert-banner">
            <span className="alert-icon">⚠️</span>
            <div className="alert-text">
              <strong>Account Under Review</strong>
              <p>Your documents are being verified. You can explore the panel, but offer creation is disabled until approval.</p>
            </div>
          </div>
        )}

        {/* ---------- METRICS GRID ---------- */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon gold">📦</div>
            <div className="metric-info">
              <h3>0</h3>
              <p>Total Offers</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon purple">🚀</div>
            <div className="metric-info">
              <h3>0</h3>
              <p>Active Offers</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon roast">💎</div>
            <div className="metric-info">
              <h3>Free</h3>
              <p>Current Plan</p>
            </div>
          </div>
        </div>

        {/* ---------- QUICK ACTIONS ---------- */}
        <section className="dashboard-section">
          <h3>Quick Actions</h3>
          <div className="actions-row">
            <button
              className="action-btn primary"
              onClick={() => isPending ? alert("Pending Approval") : navigate("/vendor/offers/new")}
              disabled={isPending}
            >
              <span className="btn-icon">➕</span> Create New Offer
            </button>

            <button className="action-btn secondary" onClick={() => navigate("/pricing")}>
              <span className="btn-icon">💎</span> Upgrade Plan
            </button>

            <button className="action-btn secondary" onClick={() => navigate("/vendor/profile")}>
              <span className="btn-icon">⚙️</span> Settings
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
