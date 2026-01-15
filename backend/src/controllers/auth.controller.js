import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/email.js";
import crypto from 'crypto';

/* ---------------- SIGNUP ---------------- */
export const signup = async (req, res) => {
  let client;
  try {
    // 1. Establish connection first (inside try to catch connection errors)
    client = await pool.connect();

    const { shopName, ownerName, email, phone, password, state, city, pincode, address } = req.body;

    // 2. Client-side validation fallback
    if (!shopName || !ownerName || !email || !phone || !password || !state || !city || !pincode || !address) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!req.files?.AADHAAR || !req.files?.PAN || !req.files?.GST) {
      return res.status(400).json({ message: "Required KYC missing" });
    }

    // 3. Start Transaction
    await client.query("BEGIN");

    // 4. Check email uniqueness
    const existingUser = await client.query("SELECT id FROM vendors WHERE email = $1", [email]);
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
       RETURNING id`,
      [shopName, ownerName, email, phone, hashedPassword, state, city, pincode, address]
    );

    const vendorId = vendorResult.rows[0].id;

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
        [vendorId, docType, fileUrl]
      );
    }

    // 7. Generate Token
    const token = jwt.sign(
      { id: vendorId, role: "VENDOR" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 8. Commit
    await client.query("COMMIT");

    // 9. Send Welcome Email (Don't let email failure block signup)
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Project J - Registration Successful",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4C0F2E;">Welcome to Project J, ${ownerName}!</h2>
            <p>Thank you for registering your shop, <strong>${shopName}</strong>, on our platform.</p>
            <p>Your account is currently <strong>PENDING APPROVAL</strong>. Our team will verify your KYC documents and activate your account within 24-48 business hours.</p>
            <p>Once approved, you can start posting your jewelry collections and offers.</p>
            <br/>
            <p>Best Regards,<br/>Team Project J</p>
          </div>
        `
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
        address
      }
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
    // Return JSON error so frontend displays it
    return res.status(500).json({
      message: "Signup failed",
      error: err.message || "Internal Server Error"
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
    console.log(`LOGIN DEBUG: Attempting login for email: [${email}] password: [${password}]`);

    const result = await pool.query(
      "SELECT * FROM vendors WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("LOGIN DEBUG: No user found with this email.", { email });
      return res.status(404).json({
        message: "This email is not registered with us.",
        code: "USER_NOT_FOUND"
      });
    }

    const vendor = result.rows[0];

    const match = await bcrypt.compare(password, vendor.password_hash);

    if (!match) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
        code: "WRONG_PASSWORD"
      });
    }

    const token = jwt.sign(
      { id: vendor.id, role: "VENDOR" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
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
        profilePictureUrl: vendor.profile_picture_url
      }
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
    const result = await pool.query("SELECT id, owner_name FROM vendors WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

    const vendor = result.rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      "UPDATE vendors SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [token, expiry, vendor.id]
    );

    const resetLink = `${process.env.FRONTEND_URL}/vendor/reset-password?token=${token}&email=${email}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Request - Project J",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4C0F2E;">Password Reset Request</h2>
          <p>Hi ${vendor.owner_name},</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4C0F2E; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.</p>
          <br/>
          <p>Best Regards,<br/>Team Project J</p>
        </div>
      `
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
      [email, token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE vendors SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
      [hashedPassword, result.rows[0].id]
    );

    res.json({ message: "Password updated successfully. You can now login." });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
