import "../styles/auth.css";
import { useState, useMemo } from "react";
import { signupVendor, sendEmailOTP, verifyEmailOTP } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { locations } from "../data/locations";
import SearchableDropdown from "../components/SearchableDropdown";
import AuthHeader from "../components/AuthHeader";


const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Flatten locations to handle Union Territories as states
  const flattenedLocations = useMemo(() => {
    const data = { ...locations };
    if (data["Union Territories"]) {
      Object.assign(data, data["Union Territories"]);
      delete data["Union Territories"];
    }
    return data;
  }, []);

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const [files, setFiles] = useState({
    AADHAAR: null,
    PAN: null,
    GST: null,
    TRADE_LICENSE: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Add success message state
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // ---------- OTP STATES ----------
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  // ---------------- OTP HANDLERS ----------------
  const handleSendOTP = async () => {
    if (!form.email) {
      setError("Please enter your email first");
      return;
    }
    setError("");
    setSuccess("");
    setIsOtpSending(true);

    try {
      const res = await sendEmailOTP({ email: form.email });
      setSuccess(res.data.message);
      setShowOtpInput(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setError("");
    setSuccess("");
    setIsOtpVerifying(true);

    try {
      await verifyEmailOTP({ email: form.email, otp });
      setIsEmailVerified(true);
      setShowOtpInput(false);
      setSuccess("Email verified successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsOtpVerifying(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  const handleLocationChange = (name, value) => {
    if (name === "state") {
      setForm({ ...form, state: value, city: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ---------------- FILE CHANGE ----------------
  const handleFileChange = (type, file) => {
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("KYC must be PDF, JPG, or PNG");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    setError("");

    setFiles((prev) => ({
      ...prev,
      [type]: file
    }));
  };

  // ---------------- SUBMIT ----------------
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ---------- VALIDATIONS ----------
    if (!form.state || !form.city) {
      setError("Please select both State and District");
      setLoading(false);
      return;
    }

    if (form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    if (form.pincode.length !== 6) {
      setError("Pincode must be exactly 6 digits");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // ---------- EMAIL VERIFICATION CHECK ----------
    if (!isEmailVerified) {
      setError("Please verify your email via OTP first");
      setLoading(false);
      return;
    }

    // ---------- REQUIRED KYC CHECK ----------
    if (!files.AADHAAR || !files.PAN || !files.GST) {
      setError("Aadhaar, PAN, and GST documents are mandatory");
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions to proceed");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      // Text fields
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          formData.append(key, value);
        }
      });

      // File fields (MUST MATCH BACKEND)
      formData.append("AADHAAR", files.AADHAAR);
      formData.append("PAN", files.PAN);
      formData.append("GST", files.GST);

      if (files.TRADE_LICENSE) {
        formData.append("TRADE_LICENSE", files.TRADE_LICENSE);
      }

      const res = await signupVendor(formData);

      const { token, vendorStatus, vendor } = res.data;

      // Auto-Login
      if (token) {
        login(token, vendorStatus, vendor);
      }

      navigate("/vendor/pending-approval");
    } catch (err) {
      console.error("Signup Error:", err);
      if (!err.response) {
        setError("Network Error: Unable to reach server.");
        return;
      }

      const message = err.response?.data?.message || "Signup failed.";

      if (message.includes("already registered")) {
        setError(<>This email is already registered. <Link to="/vendor/login" style={{ color: '#d4af37' }}>Login here</Link></>);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />
      <div className="auth-page">
        <form className="auth-box" onSubmit={submit}>
          <h2>SELLER SIGNUP</h2>

          {error && <div className="error-text" style={{ padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{error}</div>}
          {success && <div className="success-text" style={{ color: 'green', fontSize: '14px', textAlign: 'center', marginBottom: '15px' }}>{success}</div>}

          <input name="shopName" placeholder="Shop Name" value={form.shopName} onChange={handleChange} required />
          <input name="ownerName" placeholder="Owner Name" value={form.ownerName} onChange={handleChange} required />

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              readOnly={isEmailVerified}
              style={isEmailVerified ? { backgroundColor: '#f0f0f0', border: '1px solid #2ecc71' } : {}}
            />
            {!isEmailVerified && !showOtpInput && (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isOtpSending}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 'auto',
                  padding: '5px 15px',
                  fontSize: '12px',
                  height: 'auto',
                  margin: 0,
                  backgroundColor: '#4C0F2E'
                }}
              >
                {isOtpSending ? "Sending..." : "Verify"}
              </button>
            )}
            {isEmailVerified && (
              <span style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#2ecc71',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>✓ Verified</span>
            )}
          </div>

          {showOtpInput && !isEmailVerified && (
            <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                style={{ marginBottom: 0 }}
              />
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isOtpVerifying}
                style={{ width: 'auto', whiteSpace: 'nowrap', backgroundColor: '#4C0F2E' }}
              >
                {isOtpVerifying ? "Verifying..." : "Confirm OTP"}
              </button>
            </div>
          )}

          <input name="phone" placeholder="Phone (10-digit)" value={form.phone} onChange={handleChange} required />

          {/* Searchable Selects for Locations */}
          <div style={{ display: 'flex', gap: '15px', width: '100%', marginBottom: '5px' }}>
            <SearchableDropdown
              options={Object.keys(flattenedLocations)}
              value={form.state}
              onChange={(val) => handleLocationChange("state", val)}
              placeholder="Select State"
            />
            <SearchableDropdown
              options={flattenedLocations[form.state] || []}
              value={form.city}
              onChange={(val) => handleLocationChange("city", val)}
              placeholder={form.state ? "Select District" : "Select State First"}
              disabled={!form.state}
            />
          </div>

          <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
          <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} required />

          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />

          {/* ---------- KYC FILES ---------- */}
          <label>Aadhaar Card (Required)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange("AADHAAR", e.target.files[0])} required />

          <label>PAN Card (Required)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange("PAN", e.target.files[0])} required />

          <label>GST Certificate (Required)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange("GST", e.target.files[0])} required />

          <label>Trade License (Optional)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange("TRADE_LICENSE", e.target.files[0])} />

          {/* Terms & Conditions */}
          <div style={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#FDFBF7',
            borderRadius: '8px',
            border: '1px solid #E6DCCD',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  margin: 0,
                  marginTop: '2px',
                  accentColor: '#4C0F2E',
                  flexShrink: 0
                }}
              />

              <label
                htmlFor="terms"
                style={{
                  margin: 0,
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: '#2C1E16',
                  lineHeight: '1.5',
                  flex: 1
                }}
              >
                I have read and agree to the{' '}
                <Link
                  to="/terms"
                  target="_blank"
                  style={{
                    color: '#4C0F2E',
                    fontWeight: '600',
                    textDecoration: 'none',
                    borderBottom: '1px solid #4C0F2E'
                  }}
                >
                  Partner Registration Policy & Terms of Service
                </Link>
              </label>
            </div>
          </div>

          <button disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>

          <div className="auth-link">
            Already registered? <Link to="/vendor/login">Login</Link>
          </div>
        </form>
      </div>
     
    </>
  );
};

export default Signup;
