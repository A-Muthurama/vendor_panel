import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, ChevronRight, LogOut, LayoutDashboard, Utensils, User, LifeBuoy } from "lucide-react";
import "../styles/TopHeader.css";
import jpLogo from "../assets/jp-logo.png";

const TopHeader = () => {
    const { vendor, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: "DASHBOARD", path: "/vendor/dashboard", icon: <LayoutDashboard size={18} /> },
        { label: "MANAGE OFFERS", path: "/vendor/offers", icon: <Utensils size={18} /> },
        { label: "PROFILE", path: "/vendor/profile", icon: <User size={18} /> },
        // { label: "SUBSCRIPTION", path: "/pricing", icon: <CreditCard size={18} /> }, // Hidden temporarily - Free trial active
        { label: "SUPPORT", path: "/support", icon: <LifeBuoy size={18} /> },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <header className="top-header">
                {/* 1. Brand / Logo - Redirects to Dashboard */}
                <div className="header-brand" onClick={() => { navigate("/vendor/dashboard"); closeMenu(); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    <h2 className="brand-title" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '18px',
                        fontWeight: '700',
                        letterSpacing: '1px',
                        background: 'linear-gradient(to right, #8B6F47, #D4AF37, #8B6F47)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase',
                        margin: 0
                    }}>JEWELLERS PARADISE</h2>
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
                    {/* Shop Profile Button - Clickable, redirects to Profile */}
                    <button
                        className="shop-profile-btn"
                        onClick={() => navigate("/vendor/profile")}
                        title="View Shop Profile"
                    >
                        <span className="shop-icon">🏪</span>
                        <span className="shop-name-text">
                            {vendor?.shopName?.toUpperCase() || "MY SHOP"}
                        </span>
                    </button>

                    {/* Logout Button */}
                    <button className="header-logout-btn" onClick={logout}>
                        LOGOUT
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                <div className={`mobile-sidebar-overlay ${isMenuOpen ? "active" : ""}`} onClick={closeMenu}></div>

                {/* Mobile Sidebar */}
                <div className={`mobile-sidebar ${isMenuOpen ? "open" : ""}`}>
                    <div className="mobile-sidebar-header">
                        <div className="header-brand" onClick={() => { navigate("/vendor/dashboard"); closeMenu(); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                                src={jpLogo}
                                alt="JP Logo"
                                style={{
                                    height: '40px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    mixBlendMode: 'multiply'
                                }}
                            />
                            <h2 className="brand-title" style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '16px',
                                fontWeight: '700',
                                letterSpacing: '1px',
                                background: 'linear-gradient(to right, #8B6F47, #D4AF37, #8B6F47)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textTransform: 'uppercase',
                                margin: 0
                            }}>JEWELLERS PARADISE</h2>
                        </div>
                        <button className="close-sidebar-btn" onClick={closeMenu}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className="mobile-vendor-info">
                        <div className="mobile-shop-avatar">
                            {vendor?.shopName?.charAt(0).toUpperCase() || "S"}
                        </div>
                        <div className="mobile-shop-details">
                            <h4>{vendor?.shopName || "My Shop"}</h4>
                            <p>{vendor?.ownerName}</p>
                        </div>
                    </div>

                    <nav className="mobile-nav-list">
                        {navItems.map((item) => (
                            <Link
                                to={item.path}
                                key={item.path}
                                className={`mobile-nav-item ${location.pathname === item.path ? "active" : ""}`}
                                onClick={closeMenu}
                            >
                                <span className="mobile-nav-icon">{item.icon}</span>
                                <span className="mobile-nav-label">{item.label}</span>
                                <ChevronRight size={16} className="chevron" />
                            </Link>
                        ))}
                    </nav>

                    <div className="mobile-sidebar-footer">
                        <button className="mobile-logout-btn" onClick={() => { logout(); closeMenu(); }}>
                            <LogOut size={18} />
                            <span>LOGOUT</span>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default TopHeader;
