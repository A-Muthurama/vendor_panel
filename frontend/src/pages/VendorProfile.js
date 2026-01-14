import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";
import "../styles/VendorProfile.css";

import TopHeader from "../components/TopHeader";

const VendorProfile = () => {
    const { vendor } = useAuth();

    // Mock KYC data
    const kycDocs = [
        { name: "Aadhaar Card", type: "AADHAAR" },
        { name: "PAN Card", type: "PAN" },
        { name: "GST Certificate", type: "GST" },
        { name: "Trade License", type: "TRADE_LICENSE" }
    ];

    return (
        <div className="dashboard-container">
            <TopHeader />

            <div className="dashboard-content">
                <div className="profile-content-wrapper">

                    <div className="profile-header">
                        <p className="profile-subtitle">Manage your account information and verification details</p>
                    </div>

                    {/* Main Card */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <div className="profile-avatar">
                                {vendor?.ownerName?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="profile-info">
                                <h3>{vendor?.ownerName || "Vendor Owner"}</h3>
                                <p>{vendor?.shopName || "Shop Name"}</p>
                            </div>
                        </div>

                        <div className="profile-details">
                            <div className="detail-group">
                                <label>Email Address</label>
                                <div className="detail-value">
                                    <span className="detail-icon">✉️</span>
                                    {vendor?.email}
                                </div>
                            </div>

                            <div className="detail-group">
                                <label>Phone Number</label>
                                <div className="detail-value">
                                    <span className="detail-icon">📞</span>
                                    {vendor?.phone || "N/A"}
                                </div>
                            </div>

                            <div className="detail-group">
                                <label>Vendor ID</label>
                                <div className="detail-value">
                                    <span className="detail-icon">🆔</span>
                                    {vendor?.id || "Unknown"}
                                </div>
                            </div>
                        </div>

                        {/* KYC Section */}
                        <div className="kyc-section">
                            <div className="kyc-header">
                                <h4>KYC Documents</h4>
                                <div className="kyc-status submitted">
                                    <span>✅</span> Documents Submitted
                                </div>
                            </div>

                            <div className="kyc-grid">
                                {kycDocs.map((doc) => (
                                    <div className="kyc-doc-card" key={doc.type}>
                                        <span className="doc-icon">📄</span>
                                        <div className="doc-name">{doc.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VendorProfile;
