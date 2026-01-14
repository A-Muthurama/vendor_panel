import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: "Dashboard", path: "/vendor/dashboard", icon: "📊" },
        { label: "Manage Offers", path: "/vendor/offers", icon: "🏷️" },
        { label: "Profile & KYC", path: "/vendor/profile", icon: "👤" },
        { label: "Subscription", path: "/pricing", icon: "💎" },
        { label: "Support", path: "/support", icon: "🎧" },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                {/* Logo Icon placed here if needed */}
                <div style={{ fontSize: "28px" }}>💎</div>
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
                <p>© 2026 Project J</p>
            </div>
        </div>
    );
};

export default Sidebar;
