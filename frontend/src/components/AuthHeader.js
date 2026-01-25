import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthHeader.css";

const AuthHeader = () => {
    const navigate = useNavigate();

    return (
        <header className="auth-header">
            {/* 1. Brand / Logo */}
            <div className="auth-header-brand">
                <div className="auth-brand-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3L3 9L12 22L21 9L18 3H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 22L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 22L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 className="auth-brand-title">PROJECT J</h2>
            </div>

            {/* 2. Navigation Menu */}
            <nav className="auth-header-nav">
                <Link to="https://www.jewellersparadise.com/" className="auth-nav-item">HOME</Link>
                <Link to="https://www.jewellersparadise.com/offers" className="auth-nav-item">OFFERS</Link>
            </nav>

            {/* 3. CTA Button */}
            <div className="auth-header-right">
                <button
                    className="auth-cta-btn"
                    onClick={() => navigate('/vendor/help-support')}
                >
                    Help & Support
                </button>
            </div>
        </header>
    );
};

export default AuthHeader;
