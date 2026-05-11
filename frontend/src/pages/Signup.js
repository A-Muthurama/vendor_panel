import "../styles/auth.css";
import { useState, useMemo } from "react";
import { signupVendor, sendEmailOTP, verifyEmailOTP } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { locations } from "../data/locations";
import { countries } from "../data/countries";
import { countryCodes } from "../data/countryCodes";
import SearchableDropdown from "../components/SearchableDropdown";
import AuthHeader from "../components/AuthHeader";
import Toast from "../components/Toast";


import { compressImage } from "../utils/imageCompression";
import { Eye, EyeOff, Map as MapIcon, MapPin } from "lucide-react"; // Import Icons

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    country: "India",
    password: "",
    confirmPassword: ""
  });

  const [files, setFiles] = useState({
    AADHAAR: null,
    PAN: null,
    GST: null,
    TRADE_LICENSE: null,
    ISR_FORM_W9: null,
    NATIONAL_ID: null,
    TAX_ID: null
  });

  // Toast State & Shims
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Compatibility shims for existing code
  const setError = (msg) => {
    if (msg) showToast(msg, "error");
    else closeToast();
  };

  const setSuccess = (msg) => {
    if (msg) showToast(msg, "success");
    else closeToast();
  };

  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [complianceConfirmed, setComplianceConfirmed] = useState(false);

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

    if (name === "phone") {
      const [, , maxDigits] = countryCodes[form.country] || ["+", 5, 15];
      if (!/^\d*$/.test(value)) return;
      if (value.length > maxDigits) return;
    }
    if (name === "pincode") {
      if (form.country === "India") {
        if (!/^\d{0,6}$/.test(value)) return;
      } else {
        if (!/^[A-Za-z0-9\s-]{0,12}$/.test(value)) return;
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleLocationChange = (name, value) => {
    if (name === "country") {
      setForm({ ...form, country: value, state: "", city: "", pincode: "", phone: "" });
    } else if (name === "state") {
      setForm({ ...form, state: value, city: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ---------------- FILE CHANGE ----------------
  const handleFileChange = async (type, file) => { // Made async
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("KYC must be JPG, PNG, or PDF");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // Increased limit for raw, will compress
      setError("File size must be under 10MB");
      return;
    }

    setError(""); // Clear error

    // Compress if image
    let processFile = file;
    if (file.type.startsWith('image/')) {
      try {
        // Optional: You could show a specialized toast "Optimizing image..."
        processFile = await compressImage(file);
      } catch (err) {
        console.warn("Image compression failed, using original:", err);
      }
    }

    setFiles((prev) => ({
      ...prev,
      [type]: processFile
    }));
  };

  // ---------------- SUBMIT ----------------
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ---------- VALIDATIONS ----------
    if (!form.state || !form.city) {
      setError("Please select/enter both State and City");
      setLoading(false);
      return;
    }

    const [, phoneMin, phoneMax] = countryCodes[form.country] || ["+", 5, 15];
    if (form.phone.length < phoneMin || form.phone.length > phoneMax) {
      setError(`Phone number must be ${phoneMin === phoneMax ? phoneMin : `${phoneMin}–${phoneMax}`} digits for ${form.country}`);
      setLoading(false);
      return;
    }

    if (form.country === "India") {
      if (form.pincode.length !== 6) {
        setError("Pincode must be exactly 6 digits");
        setLoading(false);
        return;
      }
    } else {
      if (form.pincode.length < 3) {
        setError("Please enter a valid Pincode/Zipcode");
        setLoading(false);
        return;
      }
    }

    // Professional Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(form.password)) {
      setError("Password must be 8-16 characters and include: 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character (@$!%*?&)");
      setLoading(false);
      return;
    }

    // Check for personal info in password
    const passLower = form.password.toLowerCase();
    const ownerLower = form.ownerName.toLowerCase().trim();
    const shopLower = form.shopName.toLowerCase().trim();

    if (ownerLower.length > 2 && passLower.includes(ownerLower)) {
      setError("Password cannot contain your Name");
      setLoading(false);
      return;
    }

    if (shopLower.length > 2 && passLower.includes(shopLower)) {
      setError("Password cannot contain your Shop Name");
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
    if (form.country === "United States") {
      if (!files.ISR_FORM_W9) {
        setError("ISR Form W-9 is mandatory for US vendors");
        setLoading(false);
        return;
      }
    } else if (form.country === "India") {
      if (!files.AADHAAR || !files.PAN || !files.GST) {
        setError("Aadhaar, PAN, and GST documents are mandatory");
        setLoading(false);
        return;
      }
    } else {
      if (!files.NATIONAL_ID || !files.TAX_ID) {
        setError("National ID and Tax ID are mandatory for international vendors");
        setLoading(false);
        return;
      }
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions to proceed");
      setLoading(false);
      return;
    }

    if (!complianceConfirmed) {
      setError("Please confirm compliance with Indian laws to proceed");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      const [dialCode] = countryCodes[form.country] || ["+"];

      // Text fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === "confirmPassword") return;
        if (key === "phone") {
          // Store full international number e.g. +91XXXXXXXXXX
          formData.append("phone", `${dialCode}${value}`);
        } else {
          formData.append(key, value);
        }
      });

      // File fields (MUST MATCH BACKEND)
      if (form.country === "United States") {
        if (files.ISR_FORM_W9) formData.append("ISR_FORM_W9", files.ISR_FORM_W9);
      } else if (form.country === "India") {
        formData.append("AADHAAR", files.AADHAAR);
        formData.append("PAN", files.PAN);
        formData.append("GST", files.GST);
      } else {
        if (files.NATIONAL_ID) formData.append("NATIONAL_ID", files.NATIONAL_ID);
        if (files.TAX_ID) formData.append("TAX_ID", files.TAX_ID);
      }

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

      if (message.toLowerCase().includes("already registered")) {
        setToast({
          message: "This email is already registered. Redirecting to login...",
          type: "info"
        });
        setTimeout(() => navigate("/vendor/login"), 2000);
      } else {
        showToast(message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <div className="auth-page">
        <form className="auth-box" onSubmit={submit}>
          <h2>SELLER SIGNUP</h2>



          <div className="input-group-relative">
            <input
              name="shopName"
              placeholder="Shop Name"
              value={form.shopName}
              onChange={handleChange}
              maxLength={30}
              required
              className="has-count"
            />
            <span className={`char-count ${form.shopName.length >= 30 ? 'limit-reached' : ''}`}>
              {form.shopName.length}/30
            </span>
          </div>

          <div className="input-group-relative">
            <input
              name="ownerName"
              placeholder="Owner Name"
              value={form.ownerName}
              onChange={handleChange}
              maxLength={25}
              required
              className="has-count"
            />
            <span className={`char-count ${form.ownerName.length >= 25 ? 'limit-reached' : ''}`}>
              {form.ownerName.length}/25
            </span>
          </div>

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              readOnly={isEmailVerified}
              style={{
                ...(isEmailVerified ? { backgroundColor: '#f0f0f0', border: '1px solid #2ecc71' } : {}),
                paddingRight: '90px' // Space for absolute button
              }}
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

          {/* Searchable Selects for Locations */}
          <div style={{ marginBottom: '15px' }}>
            <SearchableDropdown
              options={countries}
              value={form.country}
              onChange={(val) => handleLocationChange("country", val)}
              placeholder="Country"
              icon={MapIcon}
            />
          </div>

          {/* Phone with country dial code */}
          {(() => {
            const [dialCode, minD, maxD] = countryCodes[form.country] || ["+", 5, 15];
            const hint = minD === maxD ? `${minD} digits` : `${minD}–${maxD} digits`;
            return (
              <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '15px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 14px', background: '#f5f0eb', border: '1px solid #d4c4b0',
                  borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                  color: '#4C0F2E', whiteSpace: 'nowrap', flexShrink: 0, minWidth: '64px'
                }}>
                  {dialCode}
                </div>
                <input
                  name="phone"
                  type="tel"
                  placeholder={`Phone (${hint})`}
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={maxD}
                  required
                  style={{ marginBottom: 0, flex: 1 }}
                />
              </div>
            );
          })()}

          <div className="location-row">
            {form.country === "India" ? (
              <>
                <SearchableDropdown
                  options={Object.keys(flattenedLocations)}
                  value={form.state}
                  onChange={(val) => handleLocationChange("state", val)}
                  placeholder="State"
                  icon={MapIcon}
                />
                <SearchableDropdown
                  options={flattenedLocations[form.state] || []}
                  value={form.city}
                  onChange={(val) => handleLocationChange("city", val)}
                  placeholder={form.state ? "District" : "State First"}
                  disabled={!form.state}
                  icon={MapPin}
                />
              </>
            ) : (
              <>
                <input
                  name="state"
                  placeholder="State / Province"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </>
            )}
          </div>

          <input
            name="pincode"
            placeholder="Pincode / Zipcode"
            value={form.pincode}
            onChange={handleChange}
            maxLength={form.country === 'India' ? 6 : 12}
            required
          />

          <div className="input-group-relative">
            <textarea
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
              maxLength={50}
              required
              className="has-count"
            />
            <span className={`char-count textarea ${form.address.length >= 50 ? 'limit-reached' : ''}`}>
              {form.address.length}/50
            </span>
          </div>

          <div>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px', lineHeight: '1.4' }}>
              Must be 8+ chars with Uppercase, Lowercase, Number & Special Char
            </div>
          </div>

          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex="-1"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* ---------- KYC FILES ---------- */}
          {form.country === "United States" ? (
            <>
              <label>ISR Form W-9 (Required)</label>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange("ISR_FORM_W9", e.target.files[0])} required />
            </>
          ) : form.country === "India" ? (
            <>
              <label>Aadhaar Card (Required)</label>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange("AADHAAR", e.target.files[0])} required />

              <label>PAN Card (Required)</label>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange("PAN", e.target.files[0])} required />

              <label>GST Certificate (Required)</label>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange("GST", e.target.files[0])} required />
            </>
          ) : (
            <>
              <label>National ID / Passport (Required)</label>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange("NATIONAL_ID", e.target.files[0])} required />

              <label>Tax Identification Document (Required)</label>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange("TAX_ID", e.target.files[0])} required />
            </>
          )}

          <label>Trade License (Optional)</label>
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange("TRADE_LICENSE", e.target.files[0])} />

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
                className="auth-checkbox"
              />

              <label
                htmlFor="terms"
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '400',
                  textTransform: 'none',
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

          <div style={{
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
                id="compliance"
                checked={complianceConfirmed}
                onChange={(e) => setComplianceConfirmed(e.target.checked)}
                className="auth-checkbox"
              />

              <label
                htmlFor="compliance"
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '400',
                  textTransform: 'none',
                  cursor: 'pointer',
                  color: '#2C1E16',
                  lineHeight: '1.5',
                  flex: 1
                }}
              >
                I confirm that all offers posted comply with Indian laws and I am solely responsible for transactions.
              </label>
            </div>
          </div>

          <button disabled={loading}>
            {loading ? "Processing Registration..." : "Register"}
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
