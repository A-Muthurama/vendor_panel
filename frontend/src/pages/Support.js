import React from "react";
import "../styles/dashboard.css";
import TopHeader from "../components/TopHeader";

const Support = () => {
    return (
        <div className="dashboard-container">
            <TopHeader />
            <div className="dashboard-content">
                <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", paddingTop: "40px" }}>
                    <h2 style={{ color: "#4C0F2E", fontSize: "32px", marginBottom: "10px" }}>Help & Support</h2>
                    <p style={{ color: "#666", marginBottom: "40px" }}>Have questions? We are here to help you grow your business.</p>

                    <div style={{
                        background: "#fff",
                        borderRadius: "16px",
                        padding: "40px",
                        boxShadow: "0 15px 40px rgba(76, 15, 46, 0.08)",
                        borderTop: "5px solid #d4af37"
                    }}>
                        <div style={{ marginBottom: "30px" }}>
                            <div style={{
                                width: "50px",
                                height: "50px",
                                background: "#fff8e1",
                                color: "#d4af37",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 15px",
                                fontSize: "24px"
                            }}>
                                ✉️
                            </div>
                            <h4 style={{ color: "#4C0F2E", margin: "0 0 5px" }}>Email Support</h4>
                            <p style={{ margin: 0, color: "#666" }}>support@projectj.com</p>
                        </div>

                        <div style={{ width: "100%", height: "1px", background: "#eee", margin: "30px 0" }}></div>

                        <div>
                            <div style={{
                                width: "50px",
                                height: "50px",
                                background: "#fff8e1",
                                color: "#d4af37",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 15px",
                                fontSize: "24px"
                            }}>
                                📞
                            </div>
                            <h4 style={{ color: "#4C0F2E", margin: "0 0 5px" }}>Phone Support</h4>
                            <p style={{ margin: 0, color: "#666" }}>+91 99999 99999</p>
                            <small style={{ color: "#888" }}>(Mon-Fri, 9am - 6pm)</small>
                        </div>
                    </div>

                    <div style={{ marginTop: "30px", color: "#888", fontSize: "14px" }}>
                        &copy; 2026 Project J. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
