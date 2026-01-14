import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ---------------- SIGNUP ---------------- */
export const signup = async (req, res) => {
  try {
    const { shopName, ownerName, email, phone, password } = req.body;

    if (!shopName || !ownerName || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!req.files?.AADHAAR || !req.files?.PAN || !req.files?.GST) {
      return res.status(400).json({ message: "Required KYC missing" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendorResult = await pool.query(
      `INSERT INTO vendors 
       (shop_name, owner_name, email, phone, password_hash)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [shopName, ownerName, email, phone, hashedPassword]
    );

    const vendorId = vendorResult.rows[0].id;

    for (const docType in req.files) {
      const file = req.files[docType][0];

      await pool.query(
        `INSERT INTO kyc_documents (vendor_id, doc_type, file_url)
         VALUES ($1,$2,$3)`,
        [vendorId, docType, file.path] // Cloudinary URL
      );
    }

    // Generate Token
    const token = jwt.sign(
      { id: vendorId, role: "VENDOR" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Signup successful. Await admin approval.",
      token,
      vendorStatus: "PENDING",
      vendor: {
        id: vendorId,
        shopName,
        ownerName,
        email
      }
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err.message);
    console.error("SIGNUP STACK:", err.stack);
    return res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM vendors WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const vendor = result.rows[0];

    const match = await bcrypt.compare(password, vendor.password_hash);
    console.log("Login attempt:", email, "| Password match:", match);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: vendor.id, role: "VENDOR" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      vendorStatus: vendor.status,
      rejectionReason: vendor.rejection_reason,
      vendor: {
        id: vendor.id,
        shopName: vendor.shop_name,
        ownerName: vendor.owner_name,
        email: vendor.email
      }
    });

  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
};
