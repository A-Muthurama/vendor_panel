import React from "react";
import "../styles/dashboard.css";
import "../styles/Support.css";
import TopHeader from "../components/TopHeader";

const Support = () => {
    const contactMethods = [
        {
            icon: "✉️",
            title: "Email Support",
            value: "support@jewellerparadise.com",
            desc: "Response within 24 hours"
        },
        {
            icon: "📞",
            title: "Phone Support",
            value: "+91 99999 99999",
            desc: "Mon-Sat, 10am - 7pm"
        },
        {
            icon: "💬",
            title: "WhatsApp",
            value: "+91 88888 88888",
            desc: "Instant assistance"
        }
    ];

    return (
        <div className="dashboard-container">
            <TopHeader />
            <div className="dashboard-content">
                <div className="support-wrapper">
                    <div className="support-header">
                        <h1>Help & Support</h1>
                        <p>Our dedicated team is here to assist you with your business growth.</p>
                    </div>

                    <div className="support-grid">
                        {contactMethods.map((method, index) => (
                            <div className="support-card" key={index}>
                                <div className="support-icon-box">{method.icon}</div>
                                <h3>{method.title}</h3>
                                <div className="support-value">{method.value}</div>
                                <p>{method.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-grid">
                            <div className="faq-item">
                                <h4>How do I post a new offer?</h4>
                                <p>Go to 'Manage Offers' and click on 'Create New Offer'. Fill in the details and your offer will be live instantly.</p>
                            </div>
                            <div className="faq-item">
                                <h4>When will my KYC be approved?</h4>
                                <p>KYC verification typically takes 24-48 business hours. You'll receive an email notification once approved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
