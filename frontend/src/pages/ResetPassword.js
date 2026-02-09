import "../styles/auth.css";
import { useState, useEffect } from "react";
import { resetPassword } from "../api/authApi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const email = query.get("email");

    useEffect(() => {
        console.log("Reset Password Params:", { token, email });
        if (!token || !email) {
            setError("Invalid or missing reset link. Please make sure you clicked the full link from your email.");
        }
    }, [token, email]);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
            setError("Password must be 8-16 characters and include: 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character (@$!%*?&)");
            return;
        }

        setLoading(true);

        try {
            const res = await resetPassword({ email, token, newPassword });
            setMessage(res.data.message);
            setTimeout(() => navigate("/vendor/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthHeader />
            <div className="auth-page">
                <form className="auth-box" onSubmit={submit}>
                    <h2>RESET PASSWORD</h2>

                    {error && <div className="error-text">{error}</div>}
                    {message && <div style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{message}</div>}

                    {!message && token && email && (
                        <>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </>
                    )}

                    <div className="auth-link">
                        Back to <Link to="/vendor/login">Login</Link>
                    </div>
                </form>
            </div>

        </>
    );
};

export default ResetPassword;
