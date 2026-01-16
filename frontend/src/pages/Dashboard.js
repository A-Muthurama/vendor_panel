import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopHeader from "../components/TopHeader";
import "../styles/dashboard.css";
import { Clock } from 'lucide-react';

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
              Welcome Back, <span className="highlighted-name">{vendor?.ownerName?.split(" ")[0] || "Vendor"}</span>! <span className="emoji-sparkle"></span>
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
              <span className="alert-icon"><Clock size={32} color="#666" /></span>
              <div className="alert-text">
                <h4>Verification in Progress</h4>
                <p>Limited access until documents are verified.</p>
              </div>
            </div>
            <button className="contact-support-btn" onClick={() => navigate("/support")}>Support</button>
          </div>
        )}

        {/* ---------- COMPACT METRICS ---------- */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-box cream">📦</div>
            <div className="metric-content">
              <h2 className="metric-value">{currentStats.totalOffers || 0}</h2>
              <span className="metric-label">TOTAL OFFERS</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box pink">🚀</div>
            <div className="metric-content">
              <h2 className="metric-value">{currentStats.activeOffers || 0}</h2>
              <span className="metric-label">ACTIVE OFFERS</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box grey">💎</div>
            <div className="metric-content">
              <h2 className="metric-value">{subscription.planName || "Free"}</h2>
              <span className="metric-label">CURRENT PLAN</span>
              {(subscription.planName === "Free" || !subscription.planName) && (
                <button
                  className="upgrade-mini-btn"
                  onClick={() => status !== 'APPROVED' ? alert("⚠️ Verification Required: You can upgrade your plan once your account is VERIFIED.") : navigate("/pricing")}
                >
                  UPGRADE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ---------- QUICK TOOLS ---------- */}
        <section className="dashboard-section">
          <h3>Business Growth Tools</h3>
          <div className="actions-grid">
            <div className="action-card" onClick={() => status !== 'APPROVED' ? alert("⚠️ Verification Required: Your account must be APPROVED to create new offers.") : navigate("/upload")}>
              <div className="action-icon-circle">✨</div>
              <div className="action-info">
                <h4>New Offer</h4>
                <p>Post collection</p>
              </div>
            </div>

            <div className="action-card" onClick={() => navigate("/pricing")}>
              <div className="action-icon-circle">💰</div>
              <div className="action-info">
                <h4>Plans</h4>
                <p>View upgrades</p>
              </div>
            </div>

            <div className="action-card" onClick={() => navigate("/vendor/offers")}>
              <div className="action-icon-circle">�</div>
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
