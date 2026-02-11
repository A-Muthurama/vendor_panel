import React from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import "../styles/auth.css";
import "../styles/Terms.css";

const Terms = () => {
    const navigate = useNavigate();

    return (
        <>
            <AuthHeader />
            <div className="terms-container">
                <div className="terms-box">
                    {/* Header Section */}
                    <div className="terms-header-section">
                        <div className="terms-badge">
                            <span>
                                📜 LEGAL AGREEMENT
                            </span>
                        </div>
                        <h1 className="terms-title">Terms of Service</h1>
                        <p className="terms-updated">
                            Last Updated: January 28, 2026
                        </p>
                    </div>

                    <div className="terms-body">
                        {/* Hero Section */}
                        <section className="terms-hero">
                            <div className="terms-hero-header">
                                <div className="terms-hero-icon">
                                    🤝
                                </div>
                                <h3 className="terms-hero-title">Partner Registration Policy</h3>
                            </div>
                            <p className="terms-hero-text">
                                By registering as a jewellery store/merchant on our platform, you acknowledge and agree to abide by the following terms and conditions.
                            </p>
                        </section>

                        {/* Terms Content */}
                        <div className="terms-content">
                            {/* Term 1 */}
                            <div className="term-item">
                                <div className="term-header">
                                    <span className="term-icon">✅</span>
                                    <h4 className="term-title">1. Eligibility and Verification</h4>
                                </div>
                                <p className="term-text">
                                    Partners must be legally registered businesses in India and provide valid business registration, GST, and identity documents when requested. We reserve the right to verify submitted details and reject or suspend registrations that fail verification.
                                </p>
                            </div>

                            {/* Term 2 */}
                            <div className="term-item">
                                <div className="term-header">
                                    <span className="term-icon">📝</span>
                                    <h4 className="term-title">2. Accuracy of Information</h4>
                                </div>
                                <p className="term-text">
                                    Partners must ensure that all business details, contact information, and offer content are accurate, complete, and kept up to date at all times. Any discrepancies found may lead to account suspension.
                                </p>
                            </div>

                            {/* Term 3 */}
                            <div className="term-item">
                                <div className="term-header">
                                    <span className="term-icon">⚖️</span>
                                    <h4 className="term-title">3. Offer Compliance</h4>
                                </div>
                                <p className="term-text">
                                    All offers must comply with applicable Indian laws, including consumer protection, hallmarking, advertising, and taxation laws. Misleading, false, or illegal offers are strictly prohibited.
                                </p>
                            </div>

                            {/* Term 4 */}
                            <div className="term-item">
                                <div className="term-header">
                                    <span className="term-icon">💼</span>
                                    <h4 className="term-title">4. Responsibility for Transactions</h4>
                                </div>
                                <p className="term-text">
                                    All sales, billing, warranties, returns, and after-sales services are the sole responsibility of the partner. The Platform acts as a discovery layer and is not a party to any transaction between partners and users.
                                </p>
                            </div>

                            {/* Term 5 */}
                            <div className="term-item">
                                <div className="term-header">
                                    <span className="term-icon">📸</span>
                                    <h4 className="term-title">5. Content Rights</h4>
                                </div>
                                <p className="term-text">
                                    Partners grant the Platform a non-exclusive, worldwide right to display their business name, logo, and offer content for listing, marketing, and promotional purposes across our digital channels.
                                </p>
                            </div>

                            {/* Term 6 */}
                            <div className="term-item">
                                <div className="term-header">
                                    <span className="term-icon">⚠️</span>
                                    <h4 className="term-title">6. Suspension and Termination</h4>
                                </div>
                                <div className="term-text">
                                    <p style={{ marginTop: 0 }}>We reserve the right to suspend or terminate partner accounts immediately for:</p>
                                    <ul style={{ paddingLeft: "25px", margin: "10px 0 0 0" }}>
                                        <li style={{ marginBottom: "8px" }}>Provision of false or misleading information during or after registration.</li>
                                        <li style={{ marginBottom: "8px" }}>Repeated user complaints regarding service or product quality.</li>
                                        <li style={{ marginBottom: "8px" }}>Violation of Indian laws or platform-specific policies.</li>
                                        <li style={{ marginBottom: "8px" }}>Misuse of the Platform's intellectual property or data.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Term 7 */}
                            <div className="term-item">
                                <div className="term-header">
                                    <span className="term-icon">🛡️</span>
                                    <h4 className="term-title">7. Indemnity</h4>
                                </div>
                                <p className="term-text">
                                    Partners agree to indemnify and hold the Platform harmless from any claims, disputes, legal actions, penalties, or losses arising from their offers, business conduct, or operational failures.
                                </p>
                            </div>
                        </div>

                        {/* Privacy Section */}
                        <div className="privacy-section">
                            <div className="privacy-header">
                                <div className="privacy-icon">
                                    🔒
                                </div>
                                <h3 className="privacy-title">Privacy Commitment</h3>
                            </div>
                            <p className="privacy-text">
                                We value your trust. The information collected during registration (Business details, KYC, contacts) is encrypted and used solely for business verification and platform service delivery. We do not sell or share your business data with third-party marketers. Your data security is our priority.
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="terms-footer">
                        <button
                            className="terms-back-btn"
                            onClick={() => navigate("/vendor/signup")}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 12px 30px rgba(76, 15, 46, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 8px 20px rgba(76, 15, 46, 0.3)";
                            }}
                        >
                            <span style={{ fontSize: "20px" }}>←</span>
                            <span>Back to Registration</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Terms;
