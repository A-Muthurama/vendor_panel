import React from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import AuthFooter from "../components/AuthFooter";
import "../styles/auth.css";

const Terms = () => {
    const navigate = useNavigate();

    return (
        <>
            <AuthHeader />
            <div className="auth-page" style={{
                paddingTop: "120px",
                paddingBottom: "80px",
                background: "linear-gradient(135deg, #FDFBF7 0%, #FFF5E6 100%)",
                minHeight: "100vh"
            }}>
                <div className="auth-box" style={{
                    maxWidth: "1000px",
                    padding: "60px",
                    textAlign: "left",
                    borderRadius: "24px",
                    boxShadow: "0 20px 60px rgba(76, 15, 46, 0.15)",
                    backgroundColor: "#fff",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    animation: "fadeInUp 0.6s ease-out"
                }}>
                    {/* Header Section */}
                    <div style={{ textAlign: "center", marginBottom: "50px" }}>
                        <div style={{
                            display: "inline-block",
                            padding: "8px 20px",
                            background: "linear-gradient(135deg, #4C0F2E 0%, #6B1B3D 100%)",
                            borderRadius: "20px",
                            marginBottom: "20px"
                        }}>
                            <span style={{ color: "#D4AF37", fontSize: "14px", fontWeight: "600", letterSpacing: "1px" }}>
                                📜 LEGAL AGREEMENT
                            </span>
                        </div>
                        <h1 style={{
                            background: "linear-gradient(135deg, #4C0F2E 0%, #6B1B3D 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            marginBottom: "15px",
                            fontSize: "42px",
                            fontWeight: "800",
                            fontFamily: "var(--font-heading)",
                            letterSpacing: "-0.5px"
                        }}>Terms of Service</h1>
                        <p style={{
                            color: '#6B4E3D',
                            fontSize: "15px",
                            fontWeight: "500"
                        }}>
                            Last Updated: January 28, 2026
                        </p>
                    </div>

                    <div style={{ color: "#2C1E16", lineHeight: "1.9", fontSize: "16px" }}>
                        {/* Hero Section */}
                        <section style={{
                            marginBottom: "40px",
                            padding: "30px",
                            background: "linear-gradient(135deg, #FDF8F9 0%, #FFF5E6 100%)",
                            borderRadius: "16px",
                            borderLeft: "6px solid #D4AF37",
                            boxShadow: "0 4px 15px rgba(76, 15, 46, 0.08)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                                <div style={{
                                    width: "50px",
                                    height: "50px",
                                    background: "linear-gradient(135deg, #4C0F2E 0%, #6B1B3D 100%)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "24px"
                                }}>
                                    🤝
                                </div>
                                <h3 style={{
                                    color: "#4C0F2E",
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: "700"
                                }}>Partner Registration Policy</h3>
                            </div>
                            <p style={{
                                fontWeight: "600",
                                margin: 0,
                                color: "#2C1E16",
                                fontSize: "16px"
                            }}>
                                By registering as a jewellery store/merchant on our platform, you acknowledge and agree to abide by the following terms and conditions.
                            </p>
                        </section>

                        {/* Terms Content */}
                        <div className="terms-content">
                            {/* Term 1 */}
                            <div style={{
                                marginBottom: "30px",
                                padding: "25px",
                                backgroundColor: "#FDFBF7",
                                borderRadius: "12px",
                                border: "1px solid #E6DCCD",
                                transition: "all 0.3s ease"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "28px" }}>✅</span>
                                    <h4 style={{
                                        color: "#4C0F2E",
                                        fontSize: "20px",
                                        margin: 0,
                                        fontWeight: "700"
                                    }}>1. Eligibility and Verification</h4>
                                </div>
                                <p style={{ margin: 0, paddingLeft: "40px", textAlign: "left" }}>
                                    Partners must be legally registered businesses in India and provide valid business registration, GST, and identity documents when requested. We reserve the right to verify submitted details and reject or suspend registrations that fail verification.
                                </p>
                            </div>

                            {/* Term 2 */}
                            <div style={{
                                marginBottom: "30px",
                                padding: "25px",
                                backgroundColor: "#FDFBF7",
                                borderRadius: "12px",
                                border: "1px solid #E6DCCD"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "28px" }}>📝</span>
                                    <h4 style={{
                                        color: "#4C0F2E",
                                        fontSize: "20px",
                                        margin: 0,
                                        fontWeight: "700"
                                    }}>2. Accuracy of Information</h4>
                                </div>
                                <p style={{ margin: 0, paddingLeft: "40px", textAlign: "left" }}>
                                    Partners must ensure that all business details, contact information, and offer content are accurate, complete, and kept up to date at all times. Any discrepancies found may lead to account suspension.
                                </p>
                            </div>

                            {/* Term 3 */}
                            <div style={{
                                marginBottom: "30px",
                                padding: "25px",
                                backgroundColor: "#FDFBF7",
                                borderRadius: "12px",
                                border: "1px solid #E6DCCD"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "28px" }}>⚖️</span>
                                    <h4 style={{
                                        color: "#4C0F2E",
                                        fontSize: "20px",
                                        margin: 0,
                                        fontWeight: "700"
                                    }}>3. Offer Compliance</h4>
                                </div>
                                <p style={{ margin: 0, paddingLeft: "40px", textAlign: "left" }}>
                                    All offers must comply with applicable Indian laws, including consumer protection, hallmarking, advertising, and taxation laws. Misleading, false, or illegal offers are strictly prohibited.
                                </p>
                            </div>

                            {/* Term 4 */}
                            <div style={{
                                marginBottom: "30px",
                                padding: "25px",
                                backgroundColor: "#FDFBF7",
                                borderRadius: "12px",
                                border: "1px solid #E6DCCD"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "28px" }}>💼</span>
                                    <h4 style={{
                                        color: "#4C0F2E",
                                        fontSize: "20px",
                                        margin: 0,
                                        fontWeight: "700"
                                    }}>4. Responsibility for Transactions</h4>
                                </div>
                                <p style={{ margin: 0, paddingLeft: "40px", textAlign: "left" }}>
                                    All sales, billing, warranties, returns, and after-sales services are the sole responsibility of the partner. The Platform acts as a discovery layer and is not a party to any transaction between partners and users.
                                </p>
                            </div>

                            {/* Term 5 */}
                            <div style={{
                                marginBottom: "30px",
                                padding: "25px",
                                backgroundColor: "#FDFBF7",
                                borderRadius: "12px",
                                border: "1px solid #E6DCCD"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "28px" }}>📸</span>
                                    <h4 style={{
                                        color: "#4C0F2E",
                                        fontSize: "20px",
                                        margin: 0,
                                        fontWeight: "700"
                                    }}>5. Content Rights</h4>
                                </div>
                                <p style={{ margin: 0, paddingLeft: "40px", textAlign: "left" }}>
                                    Partners grant the Platform a non-exclusive, worldwide right to display their business name, logo, and offer content for listing, marketing, and promotional purposes across our digital channels.
                                </p>
                            </div>

                            {/* Term 6 */}
                            <div style={{
                                marginBottom: "30px",
                                padding: "25px",
                                backgroundColor: "#FDFBF7",
                                borderRadius: "12px",
                                border: "1px solid #E6DCCD"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "28px" }}>⚠️</span>
                                    <h4 style={{
                                        color: "#4C0F2E",
                                        fontSize: "20px",
                                        margin: 0,
                                        fontWeight: "700"
                                    }}>6. Suspension and Termination</h4>
                                </div>
                                <div style={{ paddingLeft: "40px", textAlign: "left" }}>
                                    <p style={{ marginTop: 0, textAlign: "left" }}>We reserve the right to suspend or terminate partner accounts immediately for:</p>
                                    <ul style={{
                                        paddingLeft: "25px",
                                        margin: "10px 0 0 0"
                                    }}>
                                        <li style={{ marginBottom: "8px" }}>Provision of false or misleading information during or after registration.</li>
                                        <li style={{ marginBottom: "8px" }}>Repeated user complaints regarding service or product quality.</li>
                                        <li style={{ marginBottom: "8px" }}>Violation of Indian laws or platform-specific policies.</li>
                                        <li style={{ marginBottom: "8px" }}>Misuse of the Platform's intellectual property or data.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Term 7 */}
                            <div style={{
                                marginBottom: "30px",
                                padding: "25px",
                                backgroundColor: "#FDFBF7",
                                borderRadius: "12px",
                                border: "1px solid #E6DCCD"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "28px" }}>🛡️</span>
                                    <h4 style={{
                                        color: "#4C0F2E",
                                        fontSize: "20px",
                                        margin: 0,
                                        fontWeight: "700"
                                    }}>7. Indemnity</h4>
                                </div>
                                <p style={{ margin: 0, paddingLeft: "40px", textAlign: "left" }}>
                                    Partners agree to indemnify and hold the Platform harmless from any claims, disputes, legal actions, penalties, or losses arising from their offers, business conduct, or operational failures.
                                </p>
                            </div>
                        </div>

                        {/* Privacy Section */}
                        <div style={{
                            marginTop: "50px",
                            padding: "35px",
                            background: "linear-gradient(135deg, #4C0F2E 0%, #6B1B3D 100%)",
                            borderRadius: "16px",
                            boxShadow: "0 10px 30px rgba(76, 15, 46, 0.2)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                                <div style={{
                                    width: "50px",
                                    height: "50px",
                                    background: "rgba(212, 175, 55, 0.2)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "24px"
                                }}>
                                    🔒
                                </div>
                                <h3 style={{
                                    color: "#D4AF37",
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: "700"
                                }}>Privacy Commitment</h3>
                            </div>
                            <p style={{
                                color: "#FFFFFF",
                                margin: 0,
                                lineHeight: "1.8",
                                fontSize: "16px"
                            }}>
                                We value your trust. The information collected during registration (Business details, KYC, contacts) is encrypted and used solely for business verification and platform service delivery. We do not sell or share your business data with third-party marketers. Your data security is our priority.
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div style={{
                        marginTop: "50px",
                        textAlign: "center",
                        borderTop: "2px solid #E6DCCD",
                        paddingTop: "40px"
                    }}>
                        <button
                            className="auth-btn"
                            onClick={() => navigate("/vendor/signup")}
                            style={{
                                padding: "16px 50px",
                                width: "auto",
                                borderRadius: "50px",
                                fontWeight: "700",
                                fontSize: "16px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "12px",
                                background: "linear-gradient(135deg, #4C0F2E 0%, #6B1B3D 100%)",
                                border: "2px solid #D4AF37",
                                boxShadow: "0 8px 20px rgba(76, 15, 46, 0.3)",
                                transition: "all 0.3s ease",
                                cursor: "pointer"
                            }}
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

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            <AuthFooter />
        </>
    );
};

export default Terms;
