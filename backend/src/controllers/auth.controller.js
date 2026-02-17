import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/email.js";
import crypto from "crypto";
import axios from "axios";
import { getWelcomeEmail, getForgotPasswordEmail, getOTPEmail } from "../utils/emailTemplates.js";

/* ---------------- SIGNUP ---------------- */
export const signup = async (req, res) => {
  let client;
  try {
    // 1. Establish connection first (inside try to catch connection errors)
    client = await pool.connect();

    const {
      shopName,
      ownerName,
      email,
      phone,
      password,
      state,
      city,
      pincode,
      address,
    } = req.body;

    // 2. Client-side validation fallback
    if (
      !shopName ||
      !ownerName ||
      !email ||
      !phone ||
      !password ||
      !state ||
      !city ||
      !pincode ||
      !address
    ) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 2.1 Professional & Secured Validation Rules
    if (ownerName.length > 25) {
      return res.status(400).json({ message: "Owner Name must be within 25 characters" });
    }
    if (shopName.length > 30) {
      return res.status(400).json({ message: "Shop Name must be within 30 characters" });
    }
    if (address.length > 50) {
      return res.status(400).json({ message: "Address must be within 50 characters" });
    }
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ message: "Pincode must be exactly 6 digits" });
    }

    // Password Complexity: Min 8, Caps, Small, Number, Special Char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 chars long and include 1 uppercase, 1 lowercase, 1 number, and 1 special char"
      });
    }

    // Check for personal info in password
    const passLower = password.toLowerCase();
    const ownerLower = ownerName.toLowerCase().trim();
    const shopLower = shopName.toLowerCase().trim();

    if (ownerLower.length > 2 && passLower.includes(ownerLower)) {
      return res.status(400).json({ message: "Password cannot contain your Name" });
    }
    if (shopLower.length > 2 && passLower.includes(shopLower)) {
      return res.status(400).json({ message: "Password cannot contain your Shop Name" });
    }

    if (!req.files?.AADHAAR || !req.files?.PAN || !req.files?.GST) {
      return res.status(400).json({ message: "Required KYC missing" });
    }

    // 3. Start Transaction
    await client.query("BEGIN");

    // 4. Check email uniqueness
    const existingUser = await client.query(
      "SELECT id FROM vendors WHERE email = $1",
      [email],
    );
    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert Vendor
    const vendorResult = await client.query(
      `INSERT INTO vendors 
       (shop_name, owner_name, email, phone, password_hash, state, city, pincode, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, shop_name, owner_name, email`,
      [
        shopName,
        ownerName,
        email,
        phone,
        hashedPassword,
        state,
        city,
        pincode,
        address,
      ],
    );

    const vendor = vendorResult.rows[0];
    const vendorId = vendor.id;

    // 6. Insert KYC Docs
    for (const docType in req.files) {
      const file = req.files[docType][0];
      const fileUrl = file.path || file.location;

      if (!fileUrl) {
        throw new Error(`File URL missing for ${docType}`);
      }

      await client.query(
        `INSERT INTO kyc_documents (vendor_id, doc_type, file_url)
         VALUES ($1,$2,$3)`,
        [vendorId, docType, fileUrl],
      );
    }

    // 7. Generate Token
    const token = jwt.sign(
      { id: vendorId, role: "VENDOR" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 8. Commit
    await client.query("COMMIT");

    // 8.1 Sync vendor to admin backend (do not block signup on failure)
    const adminBackendUrl = process.env.ADMIN_BACKEND_URL;
    const internalSyncKey = process.env.INTERNAL_SYNC_KEY;

    if (adminBackendUrl && internalSyncKey) {
      axios.post(
        `${adminBackendUrl.replace(/\/$/, "")}/internal/vendors`,
        {
          externalVendorId: vendor.id,
          shopName: vendor.shop_name,
          ownerName: vendor.owner_name,
          email: vendor.email,
        },
        {
          headers: {
            "x-internal-key": internalSyncKey,
          },
          timeout: 5000 // 5s timeout
        }
      ).catch(syncErr => {
        console.error("Vendor sync failed in background:", syncErr?.response?.data || syncErr.message);
      });
    }

    // 9. Send Welcome Email (Don't let email failure block signup)
    sendEmail({
      to: email,
      subject: "Jewellers Paradise - Registration Successful",
      html: getWelcomeEmail(shopName),
    }).catch(emailErr => {
      console.error("Background Welcome Email Failed:", emailErr.message);
    });

    return res.status(201).json({
      message: "Signup successful. Await admin approval.",
      token,
      vendorStatus: "PENDING",
      vendor: {
        id: vendorId,
        shopName,
        ownerName,
        email,
        phone,
        state,
        city,
        pincode,
        address,
      },
    });
  } catch (err) {
    console.error("SIGNUP ERROR TRACE:", err);
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }
    return res.status(500).json({
      message: "Signup failed",
      error: err.message || "Internal Server Error",
    });
  } finally {
    if (client) {
      try {
        client.release();
      } catch (releaseErr) {
        console.error("Release failed:", releaseErr);
      }
    }
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`LOGIN DEBUG: Attempting login for email: [${email}]`);

    const result = await pool.query("SELECT * FROM vendors WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "This email is not registered with us.",
        code: "USER_NOT_FOUND",
      });
    }

    const vendor = result.rows[0];

    // Check if vendor is suspended
    if (vendor.status === 'SUSPENDED') {
      return res.status(403).json({
        message: "Your account is currently suspended. Kindly refer to your registered email ID for further details. If you require assistance, please contact our support team at jewellersparadisej@gmail.com ",
        code: "ACCOUNT_SUSPENDED"
      });
    }

    const match = await bcrypt.compare(password, vendor.password_hash);

    if (!match) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
        code: "WRONG_PASSWORD",
      });
    }

    const token = jwt.sign(
      { id: vendor.id, role: "VENDOR" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      token,
      vendorStatus: vendor.status,
      vendor: {
        id: vendor.id,
        shopName: vendor.shop_name,
        ownerName: vendor.owner_name,
        email: vendor.email,
        phone: vendor.phone,
        state: vendor.state,
        city: vendor.city,
        pincode: vendor.pincode,
        address: vendor.address,
        status: vendor.status,
        profilePictureUrl: vendor.profile_picture_url,
        rejectionReason: vendor.rejection_reason || vendor.reasons,
        posts_remaining: vendor.posts_remaining
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query(
      "SELECT id, owner_name FROM vendors WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });
    }

    const vendor = result.rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await pool.query(
      "UPDATE vendors SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [token, expiry, vendor.id],
    );

    let baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    try {
      const urlObj = new URL(baseUrl);
      baseUrl = urlObj.origin;
    } catch (e) {
      baseUrl = baseUrl.replace(/\/$/, "");
    }
    const resetLink = `${baseUrl}/vendor/reset-password?token=${token}&email=${email}`;

    const systemRef = crypto.randomBytes(4).toString('hex').toUpperCase();

    sendEmail({
      to: email,
      subject: "Jewellers Paradise - Password Reset Request",
      html: getForgotPasswordEmail(resetLink, systemRef),
    });

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to process request" });
  }
};

/* ---------------- RESET PASSWORD ---------------- */
export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const result = await pool.query(
      "SELECT id FROM vendors WHERE email = $1 AND reset_password_token = $2 AND reset_password_expires > NOW()",
      [email, token],
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE vendors SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
      [hashedPassword, result.rows[0].id],
    );

    res.json({ message: "Password updated successfully. You can now login." });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

/* ---------------- SEND OTP ---------------- */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existing = await pool.query(
      "SELECT id FROM vendors WHERE email = $1",
      [email],
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete any existing OTP for this email
    await pool.query("DELETE FROM otp_verifications WHERE email = $1", [email]);

    // Insert new OTP
    await pool.query(
      "INSERT INTO otp_verifications (email, otp, expires_at) VALUES ($1, $2, $3)",
      [email, otp, expiry],
    );

    // Send Email
    sendEmail({
      to: email,
      subject: "Jewellers Paradise - Email Verification",
      html: getOTPEmail(otp),
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ---------------- VERIFY OTP ---------------- */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await pool.query(
      "SELECT id FROM otp_verifications WHERE email = $1 AND otp = $2 AND expires_at > NOW()",
      [email, otp],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, delete it so it can't be used again
    await pool.query("DELETE FROM otp_verifications WHERE email = $1", [email]);

    res.json({ message: "Email verified successfully", success: true });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};
