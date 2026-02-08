import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/auth.css";
import AuthHeader from "../components/AuthHeader";


import { useAuth } from "../context/AuthContext";

const Rejected = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { vendor } = useAuth();

    console.log("REJECTED DEBUG: location.state", location.state);
    console.log("REJECTED DEBUG: vendor context", vendor);

    const [backendReason, setBackendReason] = useState(null);

    useEffect(() => {
        if (!location.state?.reason && !location.state?.reasons && !vendor?.rejectionReason && !vendor?.reasons) {
            import("../api/vendorApi").then(({ getProfile }) => {
                getProfile().then(res => {
                    console.log("REJECTED DEBUG: Fetched profile", res.data);
                    if (res.data.vendor?.rejectionReason) {
                        setBackendReason(res.data.vendor.rejectionReason);
                    }
                }).catch(err => {
                    console.error("REJECTED DEBUG: Failed to fetch profile", err);
                });
            });
        }
    }, [location.state, vendor]);

    const reason = location.state?.reason ||
        location.state?.reasons ||
        vendor?.rejectionReason ||
        vendor?.reasons ||
        backendReason ||
        "Your application does not meet our criteria.";

    console.log("REJECTED DEBUG: computed reason", reason);

    return (
        <>
            <AuthHeader />
            <div className="auth-page">
                <div className="auth-box" style={{ maxWidth: "500px", textAlign: "center", borderTop: "5px solid #d32f2f" }}>

                    <div style={{ fontSize: "50px", marginBottom: "15px" }}>❌</div>

                    <h2 style={{ color: "#d32f2f", marginBottom: "15px", fontWeight: "700" }}>
                        Application Rejected
                    </h2>

                    <p style={{ color: "#333", fontSize: "15px", marginBottom: "25px" }}>
                        We are sorry, but your vendor application has been rejected by the admin.
                    </p>

                    <div style={{
                        backgroundColor: "#ffebee",
                        border: "1px solid #ffcdd2",
                        padding: "20px",
                        borderRadius: "8px",
                        marginBottom: "25px",
                        textAlign: "left"
                    }}>
                        <strong style={{ display: "block", color: "#b71c1c", marginBottom: "5px" }}>Reason:</strong>
                        <p style={{ margin: 0, color: "#c62828" }}>{reason}</p>
                    </div>

                    <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                        If you believe this is a mistake or if you have updated your documents,
                        you may contact support or try signing up again with a different email.
                    </p>

                    <button
                        className="auth-btn"
                        onClick={() => navigate("/vendor/login")}
                        style={{ backgroundColor: "#d32f2f" }}
                    >
                        Back to Login
                    </button>
                </div>
            </div>

        </>
    );
};

export default Rejected;
