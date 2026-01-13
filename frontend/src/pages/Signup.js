import "../styles/auth.css";
import { useState } from "react";
import { signupVendor } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { locations } from "../data/locations";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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
  const [loading, setLoading] = useState(false);

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setForm({ ...form, state: value, city: "" });
      return;
    }

    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;

    setForm({ ...form, [name]: value });
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

    // ---------- REQUIRED KYC CHECK ----------
    if (!files.AADHAAR || !files.PAN || !files.GST) {
      setError("Aadhaar, PAN, and GST documents are mandatory");
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
      setError(
        err.response?.data?.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit}>
        <h2>Seller Signup</h2>

        {error && <div className="error-text">{error}</div>}

        <input name="shopName" placeholder="Shop Name" value={form.shopName} onChange={handleChange} required />
        <input name="ownerName" placeholder="Owner Name" value={form.ownerName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone (10-digit)" value={form.phone} onChange={handleChange} required />

        <select disabled value="India">
          <option>India</option>
        </select>

        <select name="state" value={form.state} onChange={handleChange} required>
          <option value="">Select State</option>
          {Object.keys(locations).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <select name="city" value={form.city} onChange={handleChange} disabled={!form.state} required>
          <option value="">
            {form.state ? "Select District" : "Select State first"}
          </option>
          {(locations[form.state] || []).map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

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

        <button disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>

        <div className="auth-link">
          Already registered? <Link to="/vendor/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
