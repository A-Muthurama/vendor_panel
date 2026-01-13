import React from "react";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

const VendorOffers = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-page">
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <div className="dashboard-header">
                    <div>
                        <h2 style={{ color: "#4C0F2E" }}>Manage Offers</h2>
                        <p className="shop-name">Create and manage your product listings</p>
                    </div>
                    <button
                        style={{
                            background: "#4C0F2E",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                        onClick={() => navigate("/pricing")} // Redirect to pricing if no sub?
                    >
                        + Creates New Offer
                    </button>
                </div>

                <div style={{
                    marginTop: "40px",
                    padding: "60px 20px",
                    background: "#fff",
                    borderRadius: "16px",
                    textAlign: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    border: "1px dashed #d4af37"
                }}>
                    <div style={{ fontSize: "60px", marginBottom: "20px" }}>🛍️</div>
                    <h3 style={{ color: "#4C0F2E", marginBottom: "10px" }}>No Active Offers</h3>
                    <p style={{ color: "#666", maxWidth: "400px", margin: "0 auto 30px" }}>
                        You haven't posted any offers yet. Start by purchasing a subscription plan or posting your first product.
                    </p>
                    <button
                        style={{
                            background: "transparent",
                            border: "2px solid #4C0F2E",
                            color: "#4C0F2E",
                            padding: "10px 24px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate("/pricing")}
                    >
                        View Subscription Plans
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorOffers;
