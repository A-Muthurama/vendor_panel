import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthHeader.css";
import jpLogo from "../assets/jp-logo.png";

const AuthHeader = () => {
    const navigate = useNavigate();

    return (
        <header className="auth-header">
            {/* 1. Brand / Logo */}
            {/* 1. Brand / Logo */}
            <div className="auth-header-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                    src={jpLogo}
                    alt="JP Logo"
                    className="auth-brand-icon"
                    style={{
                        height: '55px',
                        width: 'auto',
                        objectFit: 'contain',
                        mixBlendMode: 'multiply'
                    }}
                />
                <h2 className="auth-brand-title" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '22px',
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
