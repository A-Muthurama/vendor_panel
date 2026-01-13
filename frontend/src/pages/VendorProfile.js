import React from "react";
import "../styles/dashboard.css";
import { useAuth } from "../context/AuthContext";

const VendorProfile = () => {
    const { vendor } = useAuth();

    return (
        <div className="dashboard-page">
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div className="dashboard-header">
                    <div>
                        <h2 style={{ color: "#4C0F2E" }}>My Profile</h2>
                        <p className="shop-name">Manage your account and KYC details</p>
                    </div>
                </div>

                {/* Profile Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "30px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    border: "1px solid #efe1d1"
                }}>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "30px" }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            background: "#4C0F2E",
                            color: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "32px",
                            fontWeight: "bold"
                        }}>
                            {vendor?.ownerName?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: "#4C0F2E", fontSize: "24px" }}>{vendor?.ownerName}</h3>
                            <p style={{ margin: "5px 0 0", color: "#666" }}>{vendor?.shopName}</p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div className="info-item">
                            <label style={{ display: "block", color: "#888", fontSize: "12px", marginBottom: "4px" }}>Email Address</label>
                            <div style={{ padding: "12px", background: "#f9f9f9", borderRadius: "8px", color: "#333", fontWeight: "500" }}>
                                {vendor?.email}
                            </div>
                        </div>
                        <div className="info-item">
                            <label style={{ display: "block", color: "#888", fontSize: "12px", marginBottom: "4px" }}>Phone Number</label>
                            <div style={{ padding: "12px", background: "#f9f9f9", borderRadius: "8px", color: "#333", fontWeight: "500" }}>
                                {vendor?.phone || "N/A"}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px dashed #ddd" }}>
                        <h4 style={{ color: "#4C0F2E", marginBottom: "15px" }}>Verification Status</h4>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 16px",
                            background: "#e6fffa",
                            color: "#047857",
                            borderRadius: "20px",
                            fontWeight: "600",
                            fontSize: "14px"
                        }}>
                            ✅ KYC Documents Submitted
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorProfile;
