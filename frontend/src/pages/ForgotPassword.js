import "../styles/auth.css";
import { useState } from "react";
import { forgotPassword } from "../api/authApi";
import { Link } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import AuthFooter from "../components/AuthFooter";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await forgotPassword({ email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to process request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthHeader />
            <div className="auth-page">
                <form className="auth-box" onSubmit={submit}>
                    <h2>FORGOT PASSWORD</h2>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                        Enter your registered email and we'll send you a link to reset your password.
                    </p>

                    {error && <div className="error-text">{error}</div>}
                    {message && <div style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{message}</div>}

                    <input
                        type="email"
                        placeholder="Enter Registration Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <div className="auth-link" style={{ marginTop: '20px' }}>
                        Back to <Link to="/vendor/login">Login</Link>
                    </div>
                </form>
            </div>
            <AuthFooter />
        </>
    );
};

export default ForgotPassword;
