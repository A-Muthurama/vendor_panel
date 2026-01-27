import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";
import "../styles/VendorProfile.css";
import TopHeader from "../components/TopHeader";

const VendorProfile = () => {
    const { token, vendor: authVendor } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [submittedDocs, setSubmittedDocs] = useState([]);
    const [fetchingDocs, setFetchingDocs] = useState(true);

    // Document types to match with backend
    const kycConfig = [
        { name: "Aadhaar Card", type: "AADHAAR", icon: "🆔" },
        { name: "PAN Card", type: "PAN", icon: "💳" },
        { name: "GST Certificate", type: "GST", icon: "📜" },
        { name: "Trade License", type: "TRADE_LICENSE", icon: "📋" }
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/protected/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data) {
                    setProfileData(res.data.vendor);
                    const docTypes = res.data.documents.map(d => d.type.toUpperCase());
                    setSubmittedDocs(docTypes);
                }
            } catch (err) {
                console.error("Error fetching profile details:", err);
            } finally {
                setFetchingDocs(false);
            }
        };
        fetchProfile();
    }, [token]);

    // Use current session data immediately, background update later
    const vendor = profileData || authVendor;

    const getInitials = () => {
        return vendor?.ownerName?.charAt(0).toUpperCase() || "V";
    };

    // Helper to check if a doc is submitted
    const isDocSubmitted = (type) => {
        // If the vendor is approved, they must have submitted their core docs
        if (vendor?.status === 'APPROVED' && ['AADHAAR', 'PAN', 'GST'].includes(type)) {
            return true;
        }
        return submittedDocs.includes(type.toUpperCase());
    };

    return (
        <div className="dashboard-container">
            <TopHeader />

            <div className="dashboard-content">
                <div className="profile-content-wrapper">

                    {/* Page Header */}
                    <div className="profile-page-header">
                        <h1>Profile</h1>
                        <p className="profile-subtitle">Review your verified business credentials</p>
                    </div>

                    {/* Main Profile Card */}
                    <div className="profile-main-card">

                        {/* Header Section with Avatar */}
                        <div className="profile-card-header">
                            <div className="profile-avatar-large">
                                {getInitials()}
                            </div>
                            <div className="profile-header-info">
                                <h2>{vendor?.shopName || "Seller"}</h2>
                                <p className="owner-name">Owner: {vendor?.ownerName || "Owner"}</p>
                                <div className={`verification-badge ${vendor?.status?.toLowerCase() || 'pending'}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                    {vendor?.status === 'APPROVED' ? 'VERIFIED' : (vendor?.status === 'REJECTED' ? 'REJECTED' : 'SUBMITTED')}
                                </div>
                                {vendor?.status === 'REJECTED' && (
                                    <div className="rejection-reason-box" style={{
                                        marginTop: '15px',
                                        padding: '12px 15px',
                                        backgroundColor: '#fff1f0',
                                        border: '1px solid #ffa39e',
                                        borderRadius: '6px',
                                        color: '#cf1322',
                                        fontSize: '14px',
                                        maxWidth: '400px'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>❌</span> Rejection Reason:
                                        </div>
                                        <div>{vendor.reasons || vendor.rejectionReason || "Your application was rejected. Please contact support."}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Business Information Section */}
                        <div className="profile-section">
                            <h3 className="section-title">
                                <span className="title-icon">🏪</span>
                                Business Information
                            </h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Shop Name</label>
                                    <div className="info-value">{vendor?.shopName || "N/A"}</div>
                                </div>
                                <div className="info-item">
                                    <label>Owner Name</label>
                                    <div className="info-value">{vendor?.ownerName || "N/A"}</div>
                                </div>
                                <div className="info-item">
                                    <label>Email Address</label>
                                    <div className="info-value">{vendor?.email || "N/A"}</div>
                                </div>
                                <div className="info-item">
                                    <label>Phone Number</label>
                                    <div className="info-value">{vendor?.phone || "N/A"}</div>
                                </div>
                                <div className="info-item">
                                    <label>Vendor ID</label>
                                    <div className="info-value">#{vendor?.id || "N/A"}</div>
                                </div>
                            </div>
                        </div>

                        {/* Location Information Section */}
                        <div className="profile-section">
                            <h3 className="section-title">
                                <span className="title-icon">📍</span>
                                Location Details
                            </h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>State</label>
                                    <div className="info-value">{vendor?.state || "N/A"}</div>
                                </div>
                                <div className="info-item">
                                    <label>City/District</label>
                                    <div className="info-value">{vendor?.city || "N/A"}</div>
                                </div>
                                <div className="info-item">
                                    <label>Pincode</label>
                                    <div className="info-value">{vendor?.pincode || "N/A"}</div>
                                </div>
                                <div className="info-item full-width">
                                    <label>Complete Address</label>
                                    <div className="info-value">{vendor?.address || "N/A"}</div>
                                </div>
                            </div>
                        </div>

                        {/* KYC Documents Section */}
                        <div className="profile-section">
                            <h3 className="section-title">
                                <span className="title-icon">📄</span>
                                Submitted Documents
                            </h3>
                            <p className="section-description">
                                Verification status of your legal business documents
                            </p>
                            <div className="kyc-documents-grid">
                                {kycConfig.map((doc) => {
                                    const submitted = isDocSubmitted(doc.type);
                                    return (
                                        <div className={`kyc-document-card ${!submitted ? 'not-submitted' : ''}`} key={doc.type}>
                                            <div className="doc-icon-large">{doc.icon}</div>
                                            <div className="doc-info">
                                                <h4>{doc.name}</h4>
                                                {fetchingDocs && submittedDocs.length === 0 ? (
                                                    <span className="doc-status checking">Checking...</span>
                                                ) : submitted ? (
                                                    vendor?.status === 'APPROVED' ? (
                                                        <span className="doc-status submitted">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                            </svg>
                                                            VERIFIED
                                                        </span>
                                                    ) : (
                                                        <span className="doc-status pending">SUBMITTED</span>
                                                    )
                                                ) : (
                                                    <span className="doc-status pending">NOT SUBMITTED</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default VendorProfile;
