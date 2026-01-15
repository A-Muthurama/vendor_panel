import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    return res.status(201).json({
      message: "Signup successful. Await admin approval.",
      token,
      vendorStatus: "PENDING",
      vendor: {
        id: vendorId,
        shopName,
        ownerName,
        email,
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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const vendor = result.rows[0];
    console.log("LOGIN DEBUG: User found.", {
      id: vendor.id,
      db_email: vendor.email,
      hash_length: vendor.password_hash ? vendor.password_hash.length : 0,
      status: vendor.status
    });

    // Extra debug: print hash and password (for dev only, remove in prod)
    console.log("LOGIN DEBUG: DB password_hash:", vendor.password_hash);
    console.log("LOGIN DEBUG: Input password:", password);

    const match = await bcrypt.compare(password, vendor.password_hash);
    console.log("LOGIN DEBUG: Password comparison result:", match);

    if (!match) {
      console.log("LOGIN DEBUG: Password mismatch.", { input: password, hash: vendor.password_hash });
      return res.status(401).json({ message: "Invalid credentials" });
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
        state: vendor.state,
        city: vendor.city,
        pincode: vendor.pincode,
        address: vendor.address
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};
