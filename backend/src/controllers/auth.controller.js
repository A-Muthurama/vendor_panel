import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/email.js";
import crypto from "crypto";
import axios from "axios";

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
    try {
      const adminBackendUrl = process.env.ADMIN_BACKEND_URL;
      const internalSyncKey = process.env.INTERNAL_SYNC_KEY;

      if (!adminBackendUrl || !internalSyncKey) {
        console.warn(
          "Vendor sync skipped: missing ADMIN_BACKEND_URL or INTERNAL_SYNC_KEY",
        );
      } else {
        await axios.post(
          `${adminBackendUrl.replace(/\/$/, "")}/internal/vendors`,
          {
            externalVendorId: vendor.id, // vendors.id
            shopName: vendor.shop_name,
            ownerName: vendor.owner_name,
            email: vendor.email,
          },
          {
            headers: {
              "x-internal-key": internalSyncKey,
            },
          },
        );
      }
    } catch (syncErr) {
      console.error("Vendor sync failed:", syncErr?.response?.data || syncErr);
    }

    // 9. Send Welcome Email (Don't let email failure block signup)
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Project J - Registration Successful!",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <h2 style="color: #4C0F2E; margin-top: 0;">Welcome to Project J, ${ownerName}!</h2>
              <p>Congratulations! Your shop, <strong>${shopName}</strong>, has been successfully registered on our platform.</p>
              
              <div style="background-color: #fff9fa; border-left: 4px solid #4C0F2E; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #4C0F2E;">Account Status: PENDING APPROVAL</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Our team is currently verifying your KYC documents. This process usually takes 24-48 business hours.</p>
              </div>

              <p>Once approved, you will be able to:</p>
              <ul style="color: #555;">
                <li>Upload and manage your jewelry offers</li>
                <li>Reach more customers in your area</li>
                <li>Access your vendor dashboard</li>
              </ul>

              <p style="font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
                If you have any questions, feel free to reply to this email or contact our support team.
              </p>
              <p style="font-size: 14px; color: #333;">
                Best Regards,<br/><strong>Team Project J</strong>
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Welcome Email Failed:", emailErr);
    }

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
    console.error("SIGNUP ERROR MESSAGE:", err.message);
    console.error("SIGNUP ERROR STACK:", err.stack);
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }
    // Return JSON error so frontend displays it
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
    console.log(
      `LOGIN DEBUG: Attempting login for email: [${email}] password: [${password}]`,
    );

    const result = await pool.query("SELECT * FROM vendors WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      console.log("LOGIN DEBUG: No user found with this email.", { email });
      return res.status(404).json({
        message: "This email is not registered with us.",
        code: "USER_NOT_FOUND",
      });
    }

    const vendor = result.rows[0];

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

    console.log("LOGIN DEBUG: Login successful for vendor id:", vendor.id);

    return res.json({
      token,
      vendorStatus: vendor.status,
      rejectionReason: vendor.rejection_reason,
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
    console.log(`FORGOT PASSWORD: Request received for [${email}]`);
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
      baseUrl = urlObj.origin; // This gets only 'https://your-app.vercel.app'
    } catch (e) {
      baseUrl = baseUrl.replace(/\/$/, "");
    }
    const resetLink = `${baseUrl}/vendor/reset-password?token=${token}&email=${email}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Request - Project J",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h2 style="color: #4C0F2E; margin-top: 0;">Password Reset Request</h2>
            <p>Hi ${vendor.owner_name},</p>
            <p>We received a request to reset your password for your Project J account. If you didn't make this request, you can ignore this email.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #4C0F2E; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Reset My Password</a>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <span style="color: #4C0F2E; word-break: break-all;">${resetLink}</span>
            </p>

            <p style="font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
              This link will expire in <strong>15 minutes</strong> for your security.
            </p>
            <p style="font-size: 14px; color: #333;">
              Best Regards,<br/><strong>Team Project J</strong>
            </p>
          </div>
        </div>
      `,
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
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await pool.query("DELETE FROM otp_verifications WHERE email = $1", [email]);

    // Insert new OTP
    await pool.query(
      "INSERT INTO otp_verifications (email, otp, expires_at) VALUES ($1, $2, $3)",
      [email, otp, expiry],
    );

    // Send Email
    await sendEmail({
      to: email,
      subject: `Your OTP for Project J Signup: ${otp}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; background-color: #f9f9f9;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h2 style="color: #4C0F2E; margin-top: 0; text-align: center;">Email Verification</h2>
            <p>Please use the following One-Time Password (OTP) to verify your email address and continue your registration:</p>
            
            <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <h1 style="color: #4C0F2E; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
            </div>

            <p style="font-size: 13px; color: #999; text-align: center;">
              This OTP is valid for <strong>10 minutes</strong>.
            </p>
            
            <p style="font-size: 14px; color: #333; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
              Best Regards,<br/><strong>Team Project J</strong>
            </p>
          </div>
        </div>
      `,
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
