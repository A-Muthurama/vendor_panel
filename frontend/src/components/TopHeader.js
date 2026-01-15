import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/TopHeader.css";

const TopHeader = () => {
    const { vendor, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { label: "DASHBOARD", path: "/vendor/dashboard" },
        { label: "MANAGE OFFERS", path: "/vendor/offers" },
        { label: "PROFILE", path: "/vendor/profile" },
        { label: "SUBSCRIPTION", path: "/pricing" },
        { label: "SUPPORT", path: "/support" },
    ];

    return (
        <header className="top-header">
            {/* 1. Brand / Logo - Redirects to Dashboard */}
            <div className="header-brand" onClick={() => navigate("/vendor/dashboard")} style={{ cursor: 'pointer' }}>
                <div className="brand-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3L3 9L12 22L21 9L18 3H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 22L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 22L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2>PROJECT J</h2>
            </div>

            {/* 2. Navigation Menu */}
            <nav className="header-nav">
                {navItems.map((item) => (
                    <Link
                        to={item.path}
                        key={item.path}
                        className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                    >
                        <span className="nav-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* 3. User Actions (Right Side) */}
            <div className="header-right">
                {/* Shop Name - Clickable, redirects to Profile */}
                <span
                    className="shop-name-link"
                    onClick={() => navigate("/vendor/profile")}
                    style={{ cursor: 'pointer', marginRight: '20px', fontWeight: '600', color: '#4C0F2E', fontSize: '14px' }}
                >
                    {vendor?.shopName?.toUpperCase() || "MY SHOP"}
                </span>

                {/* Logout Button */}
                <button className="header-logout-btn" onClick={logout}>
                    LOGOUT
                </button>
            </div>
        </header>
    );
};

export default TopHeader;
