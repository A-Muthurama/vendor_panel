import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

import jpLogo from "../assets/jp-logo.png";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: "Dashboard", path: "/vendor/dashboard", icon: "📊" },
        { label: "Manage Offers", path: "/vendor/offers", icon: "🏷️" },
        { label: "Profile & KYC", path: "/vendor/profile", icon: "👤" },
        // { label: "Subscription", path: "/pricing", icon: "💎" }, // Hidden temporarily - Free trial active
        { label: "Support", path: "/support", icon: "🎧" },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <img
                    src={jpLogo}
                    alt="JP Logo"
                    style={{
                        height: '45px',
                        width: 'auto',
                        objectFit: 'contain',
                        mixBlendMode: 'multiply'
                    }}
                />
                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '16px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    background: 'linear-gradient(to right, #8B6F47, #D4AF37, #8B6F47)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textTransform: 'uppercase',
                    margin: 0,
                    textAlign: 'center'
                }}>JEWELLERS PARADISE</h2>
            </div>
            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    <li
                        key={item.path}
                        className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.label}</span>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <p style={{ fontSize: '10px', opacity: 0.8 }}>© 2026 JEWELLERS PARADISE.<br />ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    );
};

export default Sidebar;
