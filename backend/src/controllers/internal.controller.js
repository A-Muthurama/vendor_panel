import pool from "../db.js";
import { sendEmail } from "../config/email.js";
import {
  getApprovalEmail,
  getRejectionEmail,
  getOfferApprovalEmail,
  getOfferRejectionEmail
} from "../utils/emailTemplates.js";

/* ===== INTERNAL: APPROVE VENDOR ===== */
export const approveVendorInternal = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Update vendor status and set approved_at timestamp + initial 20 posts for trial
    const approvalTime = new Date();
    await client.query(
      "UPDATE vendors SET status = 'APPROVED', approved_at = $2, posts_remaining = 20 WHERE id = $1",
      [id, approvalTime]
    );

    // 2. Create 90-day free trial subscription
    const trialExpiryDate = new Date(approvalTime);
    trialExpiryDate.setDate(trialExpiryDate.getDate() + 90); // 90 days from approval

    await client.query(
      `INSERT INTO subscriptions 
       (vendor_id, plan_name, price, total_posts, remaining_posts, expiry_date, status, start_date)
       VALUES ($1, 'Free Trial', 0, 20, 20, $2, 'ACTIVE', $3)
       ON CONFLICT DO NOTHING`,
      [id, trialExpiryDate, approvalTime]
    );

    await client.query("COMMIT");

    // 3. Send Approval Email (async)
    const vendorRes = await client.query("SELECT email, owner_name, shop_name FROM vendors WHERE id = $1", [id]);
    if (vendorRes.rows.length > 0) {
      const { email, owner_name, shop_name } = vendorRes.rows[0];
      sendEmail({
        to: email,
        subject: "Jewellers Paradise - Account Approved",
        html: getApprovalEmail(owner_name, shop_name),
      }).catch(err => console.error("Internal Approval Email Error:", err));
    }

    res.json({
      message: "Vendor approved with 90-day free trial",
      trialExpiryDate: trialExpiryDate
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("APPROVE VENDOR ERROR:", err);
    res.status(500).json({ message: "Failed to approve vendor", error: err.message });
  } finally {
    client.release();
  }
};

/* ===== INTERNAL: REJECT VENDOR ===== */
export const rejectVendorInternal = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  await pool.query(
    "UPDATE vendors SET status = 'REJECTED', rejection_reason = $2, reasons = $2 WHERE id = $1",
    [id, reason || null]
  );

  // Send Rejection Email
  const vendorRes = await pool.query("SELECT email, owner_name, shop_name FROM vendors WHERE id = $1", [id]);
  if (vendorRes.rows.length > 0) {
    const { email, owner_name, shop_name } = vendorRes.rows[0];
    sendEmail({
      to: email,
      subject: "Jewellers Paradise - Application Status Update",
      html: getRejectionEmail(owner_name, shop_name, reason),
    }).catch(err => console.error("Internal Rejection Email Error:", err));
  }

  res.json({ message: "Vendor rejected and notification sent" });
};

/* ===== INTERNAL: APPROVE OFFER ===== */
export const approveOfferInternal = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE offers SET status = 'APPROVED' WHERE id = $1",
    [id]
  );

  // Send Offer Approval Email
  const offerRes = await pool.query(
    `SELECT v.email, v.owner_name, o.title 
     FROM offers o 
     JOIN vendors v ON o.vendor_id = v.id 
     WHERE o.id = $1`,
    [id]
  );
  if (offerRes.rows.length > 0) {
    const { email, owner_name, title } = offerRes.rows[0];
    sendEmail({
      to: email,
      subject: "Jewellers Paradise - Offer Published",
      html: getOfferApprovalEmail(owner_name, title),
    }).catch(err => console.error("Internal Offer Approval Email Error:", err));
  }

  res.json({ message: "Offer approved (internal)" });
};

/* ===== INTERNAL: REJECT OFFER ===== */
export const rejectOfferInternal = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  await pool.query(
    "UPDATE offers SET status = 'REJECTED', rejection_reason = $2 WHERE id = $1",
    [id, reason || null]
  );

  // Send Offer Rejection Email
  const offerRes = await pool.query(
    `SELECT v.email, v.owner_name, o.title 
     FROM offers o 
     JOIN vendors v ON o.vendor_id = v.id 
     WHERE o.id = $1`,
    [id]
  );
  if (offerRes.rows.length > 0) {
    const { email, owner_name, title } = offerRes.rows[0];
    sendEmail({
      to: email,
      subject: "Jewellers Paradise - Offer Status Update",
      html: getOfferRejectionEmail(owner_name, title, reason),
    }).catch(err => console.error("Internal Offer Rejection Email Error:", err));
  }

  res.json({ message: "Offer rejected (internal)" });
};
