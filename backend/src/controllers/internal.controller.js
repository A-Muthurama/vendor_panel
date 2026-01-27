import pool from "../db.js";

/* ===== INTERNAL: APPROVE VENDOR ===== */
export const approveVendorInternal = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE vendors SET status = 'APPROVED' WHERE id = $1",
    [id]
  );

  res.json({ message: "Vendor approved (internal)" });
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
