import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopHeader from "../components/TopHeader";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { token, status: authStatus, vendor } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ stats: { totalOffers: 0, activeOffers: 0 }, subscription: { planName: "Free" } });

  useEffect(() => {
    if (!token) {
      navigate("/vendor/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/protected/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [token, navigate]);

  const vendorData = stats.vendor || {};
  const currentStats = stats.stats || {};
  const subscription = stats.subscription || {};
  const status = vendorData.status || authStatus;
  const isPending = status === "PENDING" || status === "PENDING_APPROVAL";

  return (

    <div className="dashboard-container enhanced-bg">
      <TopHeader />

      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>
              Welcome Back, <span className="highlighted-name">{vendor?.ownerName?.split(" ")[0] || "Vendor"}</span>! <span className="emoji-sparkle">✨</span>
            </h1>
            <p>Overview for <strong>{vendorData.shop_name || vendor?.shopName}</strong></p>
          </div>
          <div className={`status-indicator status-glow ${status?.toLowerCase()}`}> 
            <span className={`status-dot ${status?.toLowerCase()}`}></span>
            {status}
          </div>
        </div>

        {/* ---------- PENDING ALERT ---------- */}
        {isPending && (
          <div className="alert-banner">
            <div className="alert-content">
              <span className="alert-icon">🕒</span>
              <div className="alert-text">
                <h4>Verification in Progress</h4>
                <p>Limited access until documents are verified.</p>
              </div>
            </div>
            <button className="contact-support-btn" onClick={() => navigate("/support")}>Support</button>
          </div>
        )}

        {/* ---------- COMPACT METRICS ---------- */}
        <div className="metrics-grid enhanced-metrics">
          <div className="metric-card animated-card">
            <div className="metric-icon-box gold animated-icon">📦</div>
            <div className="metric-content">
              <span className="metric-label">Total Listings</span>
              <h2 className="metric-value count-animate">{currentStats.totalOffers || 0}</h2>
              <span className="metric-footer">Across categories</span>
            </div>
          </div>

          <div className="metric-card animated-card">
            <div className="metric-icon-box purple animated-icon">🚀</div>
            <div className="metric-content">
              <span className="metric-label">Active Offers</span>
              <h2 className="metric-value count-animate">{currentStats.activeOffers || 0}</h2>
              <span className="metric-footer">Live now</span>
            </div>
          </div>

          <div className="metric-card primary-gradient-card animated-card">
            <div className="metric-icon-box gradient-icon">💎</div>
            <div className="metric-content">
              <span className="metric-label">Business Plan</span>
              <h2 className="metric-value">{subscription.planName || "Free"}</h2>
              <span className="metric-footer">
                {subscription.remainingPosts !== undefined ? `${subscription.remainingPosts} posts left` : "Standard access"}
                {!subscription.planName && <button className="upgrade-mini-btn" onClick={() => navigate("/pricing")}>Upgrade</button>}
              </span>
            </div>
          </div>
        </div>

        {/* ---------- QUICK TOOLS ---------- */}
        <section className="dashboard-section">
          <h3 className="section-title-animated">Business Growth Tools</h3>
          <div className="actions-grid enhanced-actions">
            <div className="action-card animated-card" onClick={() => isPending ? alert("Approval required") : navigate("/upload")}> 
              <div className="action-icon-circle tool-animate">✨</div>
              <div className="action-info">
                <h4>New Offer</h4>
                <p>Post collection</p>
              </div>
            </div>

            <div className="action-card animated-card" onClick={() => navigate("/pricing")}> 
              <div className="action-icon-circle tool-animate">💰</div>
              <div className="action-info">
                <h4>Plans</h4>
                <p>View upgrades</p>
              </div>
            </div>

            <div className="action-card animated-card" onClick={() => navigate("/vendor/offers")}> 
              <div className="action-icon-circle tool-animate">📊</div>
              <div className="action-info">
                <h4>Offers</h4>
                <p>Manage listings</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
