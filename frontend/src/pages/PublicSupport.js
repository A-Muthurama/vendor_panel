import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, MessageSquare } from "lucide-react";
import "../styles/PublicSupport.css";
import "../styles/AuthHeader.css";
import jpLogo from "../assets/jp-logo.png";
import AuthFooter from "../components/AuthFooter";

const PublicSupport = () => {
    const navigate = useNavigate();

    const contactMethods = [
        {
            icon: <Mail size={32} />,
            title: "Email Support",
            value: "support@projectj.com",
            desc: "We aim to respond within 24 hours."
        },
        {
            icon: <Phone size={32} />,
            title: "Phone Support",
            value: "+91 99999 99999",
            desc: "Mon-Sat, 10:00 AM - 7:00 PM"
        },
        {
            icon: <MessageSquare size={32} />,
            title: "WhatsApp",
            value: "+91 88888 88888",
            desc: "Instant assistance for urgent queries."
        }
    ];

    const faqs = [
        {
            question: "How do I register as a vendor?",
            answer: "Click on 'Sign up' in the top menu, fill in your details, upload the required KYC documents (Aadhaar, PAN, GST), and submit your application."
        },
        {
            question: "How long does approval take?",
            answer: "Our admin team typical verifies accounts within 24-48 business hours. You can check your status by logging in periodically."
        },
        {
            question: "Is there a registration fee?",
            answer: "Registration is currently free. We offer various subscription plans once your account is approved to list your products."
        },
        {
            question: "What if my application is rejected?",
            answer: "If rejected, you will see the reason when you login. You can correct the details or documents and resubmit your application."
        }
    ];

    return (
        <>
            {/* Custom Header with Sign Up Button */}
            <header className="auth-header">
                {/* 1. Brand / Logo */}
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

                {/* 3. Login & Sign Up Buttons */}
                <div className="auth-header-right" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button
                        className="auth-nav-item"
                        onClick={() => navigate('/vendor/login')}
                        style={{
                            background: 'transparent',
                            border: '2px solid #4C0F2E',
                            color: '#4C0F2E',
                            padding: '10px 24px',
                            borderRadius: '25px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#4C0F2E';
                            e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#4C0F2E';
                        }}
                    >
                        Login
                    </button>
                    <button
                        className="auth-cta-btn"
                        onClick={() => navigate('/vendor/signup')}
                    >
                        Sign Up
                    </button>
                </div>
            </header>

            <div className="public-support-page">
                {/* Hero Section */}
                <div className="support-hero">
                    <h1>We're Here to Help</h1>
                    <p>Have questions? Need assistance with your vendor account? Reach out to our dedicated support team.</p>
                </div>

                <div className="support-main-content">
                    {/* Contact Cards */}
                    <div className="contact-grid">
                        {contactMethods.map((method, index) => (
                            <div className="contact-card" key={index}>
                                <div className="contact-icon-wrapper">
                                    {method.icon}
                                </div>
                                <h3>{method.title}</h3>
                                <div className="contact-value">{method.value}</div>
                                <p className="contact-desc">{method.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="faq-container">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <div className="faq-list">
                            {faqs.map((faq, index) => (
                                <div className="faq-box" key={index}>
                                    <h4>{faq.question}</h4>
                                    <p>{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
            <AuthFooter />
        </>
    );
};

export default PublicSupport;
//public support page, it is for without login users
