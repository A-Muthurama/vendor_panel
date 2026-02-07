import pool from "../db.js";

/* ===== INTERNAL: APPROVE VENDOR ===== */
export const approveVendorInternal = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Update vendor status and set approved_at timestamp
    const approvalTime = new Date();
    await client.query(
      "UPDATE vendors SET status = 'APPROVED', approved_at = $2 WHERE id = $1",
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

  res.json({ message: "Vendor rejected (internal)" });
};

/* ===== INTERNAL: APPROVE OFFER ===== */
export const approveOfferInternal = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE offers SET status = 'APPROVED' WHERE id = $1",
    [id]
  );

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

  res.json({ message: "Offer rejected (internal)" });
};
