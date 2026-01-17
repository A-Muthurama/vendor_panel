import pool from "../db.js";

/* ---------------- DASHBOARD STATS ---------------- */
export const getDashboardStats = async (req, res) => {
    const vendorId = req.user.id; // from authMiddleware
    const client = await pool.connect();

    try {
        // 1. Get Vendor Status & Details
        const vendorRes = await client.query(
            "SELECT shop_name, owner_name, status, rejection_reason FROM vendors WHERE id = $1",
            [vendorId]
        );
        const vendor = vendorRes.rows[0];

        // 2. Get Active Subscription
        // We get the latest active subscription that hasn't expired
        const subRes = await client.query(
            `SELECT * FROM subscriptions 
       WHERE vendor_id = $1 AND status = 'ACTIVE' AND expiry_date > NOW() 
       ORDER BY expiry_date DESC LIMIT 1`,
            [vendorId]
        );
        const subscription = subRes.rows[0] || null;

        // 3. Get Offer Counts
        const offersRes = await client.query(
            `SELECT 
          COUNT(*) FILTER (WHERE status = 'APPROVED') as approved_offers,
          COUNT(*) FILTER (WHERE status = 'PENDING') as pending_offers,
          COUNT(*) as total_offers
        FROM offers WHERE vendor_id = $1`,
            [vendorId]
        );
        const stats = offersRes.rows[0];

        res.json({
            vendor,
            subscription: subscription ? {
                planName: subscription.plan_name,
                remainingPosts: subscription.remaining_posts,
                totalPosts: subscription.total_posts,
                expiryDate: subscription.expiry_date
            } : null,
            stats: {
                approvedOffers: parseInt(stats.approved_offers),
                pendingOffers: parseInt(stats.pending_offers),
                totalOffers: parseInt(stats.total_offers)
            }
        });

    } catch (err) {
        console.error("DASHBOARD STATS ERROR:", err);
        res.status(500).json({ message: "Failed to fetch stats" });
    } finally {
        client.release();
    }
};

/* ---------------- GET OFFERS ---------------- */
export const getOffers = async (req, res) => {
    const vendorId = req.user.id;
    try {
        const result = await pool.query(
            "SELECT * FROM offers WHERE vendor_id = $1 ORDER BY created_at DESC",
            [vendorId]
        );

        // Check expiry dynamically for display (optional update DB if needed)
        const offers = result.rows.map(offer => {
            const isExpired = new Date(offer.end_date) < new Date();
            return { ...offer, status: isExpired ? 'EXPIRED' : offer.status };
        });

        res.json(offers);
    } catch (err) {
        console.error("GET OFFERS ERROR:", err);
        res.status(500).json({ message: "Failed to fetch offers" });
    }
};

/* ---------------- CREATE OFFER ---------------- */
export const createOffer = async (req, res) => {
    const vendorId = req.user.id;
    const {
        title,
        description,
        category,
        startDate,
        endDate,
        shopAddress,
        mapLink,
        buyLink,
        discountType,
        discountLabel,
        discountValueNumeric,
        isFeatured
    } = req.body;

    // 1. Image & Video Storage
    // upload.fields returns an object: { poster: [file], video: [file] }
    const posterUrl = req.files['poster'] ? req.files['poster'][0].path : null;
    const videoUrl = req.files['video'] ? req.files['video'][0].path : null;

    if (!posterUrl) {
        return res.status(400).json({ message: "Product Media (Poster) is required." });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 2. Auth & Verification Check
        const vendorStatusRes = await client.query("SELECT status FROM vendors WHERE id = $1", [vendorId]);
        const vendorStatus = vendorStatusRes.rows[0]?.status;

        if (vendorStatus !== "APPROVED" && vendorStatus !== "VERIFIED") {
            await client.query("ROLLBACK");
            return res.status(403).json({
                message: `Account Verification Required. Current status: ${vendorStatus}. Please contact admin.`
            });
        }

        // 3. Plan & Limit Check
        const subRes = await client.query(
            `SELECT id, remaining_posts FROM subscriptions 
             WHERE vendor_id = $1 AND status = 'ACTIVE' AND expiry_date > NOW()
             ORDER BY expiry_date DESC LIMIT 1`,
            [vendorId]
        );

        if (subRes.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(403).json({ message: "No active subscription. Please upgrade your plan." });
        }

        const subscription = subRes.rows[0];
        if (subscription.remaining_posts <= 0) {
            await client.query("ROLLBACK");
            return res.status(403).json({ message: "Post limit reached for your current plan." });
        }

        // 4. Data Storage: Save everything to Neon DB
        const offerRes = await client.query(
            `INSERT INTO offers 
             (vendor_id, title, description, poster_url, video_url, category, start_date, end_date, shop_address, map_link, buy_link, discount_type, discount_label, discount_value_numeric, is_featured, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'PENDING')
             RETURNING *`,
            [
                vendorId,
                title,
                description,
                posterUrl,
                videoUrl,
                category,
                startDate,
                endDate,
                shopAddress,
                mapLink,
                buyLink,
                discountType,
                discountLabel,
                discountValueNumeric || 0,
                isFeatured === 'true', // FormData sends everything as strings
            ]
        );

        // 5. Update Subscription Count
        await client.query(
            "UPDATE subscriptions SET remaining_posts = remaining_posts - 1 WHERE id = $1",
            [subscription.id]
        );

        await client.query("COMMIT");
        res.status(201).json({
            message: "Offer published! Awaiting Admin verification.",
            offer: offerRes.rows[0]
        });

    } finally {
        if (client) client.release();
    }
};

/* ---------------- BUY SUBSCRIPTION ---------------- */
export const buySubscription = async (req, res) => {
    const vendorId = req.user.id;
    const { planName, price, posts, paymentId } = req.body; // paymentId logic skipped for simplicity, assume verified

    try {
        // 0. Check Vendor Status
        const vendorRes = await pool.query("SELECT status FROM vendors WHERE id = $1", [vendorId]);
        if (vendorRes.rows[0]?.status !== "APPROVED") {
            return res.status(403).json({ message: "Verification Required: Your account must be APPROVED to purchase plans." });
        }

        // Calculate Expiry (30 days default)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        const result = await pool.query(
            `INSERT INTO subscriptions 
       (vendor_id, plan_name, price, total_posts, remaining_posts, expiry_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE')
       RETURNING *`,
            [vendorId, planName, price, posts, posts, expiryDate] // remaining = total initially
        );

        res.status(201).json({ message: "Subscription activated", subscription: result.rows[0] });

    } catch (err) {
        console.error("BUY SUB ERROR:", err);
        res.status(500).json({ message: "Failed to activate subscription" });
    }
};

/* ---------------- DELETE OFFER ---------------- */
export const deleteOffer = async (req, res) => {
    const vendorId = req.user.id;
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM offers WHERE id = $1 AND vendor_id = $2 RETURNING id",
            [id, vendorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Offer not found or unauthorized" });
        }

        res.json({ message: "Offer deleted successfully" });
    } catch (err) {
        console.error("DELETE OFFER ERROR:", err);
        res.status(500).json({ message: "Failed to delete offer" });
    }
};

/* ---------------- GET VENDOR PROFILE ---------------- */
export const getVendorProfile = async (req, res) => {
    const vendorId = req.user.id;
    console.log("BACKEND DEBUG: Fetching profile for vendorId:", vendorId);
    const client = await pool.connect();

    try {
        // 1. Get Full Vendor Details
        const vendorRes = await client.query(
            "SELECT id, shop_name, owner_name, email, phone, state, city, pincode, address, status, profile_picture_url FROM vendors WHERE id = $1",
            [vendorId]
        );
        const vendor = vendorRes.rows[0];

        if (!vendor) {
            console.log("BACKEND DEBUG: Vendor not found for ID:", vendorId);
            return res.status(404).json({ message: "Vendor not found" });
        }

        // 2. Get KYC Documents list
        const docsRes = await client.query(
            "SELECT doc_type, file_url, created_at FROM kyc_documents WHERE vendor_id = $1",
            [vendorId]
        );
        console.log(`BACKEND DEBUG: Found ${docsRes.rows.length} documents for vendor ${vendorId}`);
        docsRes.rows.forEach(d => console.log(` - ${d.doc_type}`));

        res.json({
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
                profilePictureUrl: vendor.profile_picture_url
            },
            documents: docsRes.rows.map(d => ({
                type: d.doc_type,
                url: d.file_url,
                date: d.created_at
            }))
        });

    } catch (err) {
        console.error("GET PROFILE ERROR:", err);
        res.status(500).json({ message: "Failed to fetch profile" });
    } finally {
        client.release();
    }
};

/* ---------------- UPDATE PROFILE PICTURE ---------------- */
export const updateProfilePicture = async (req, res) => {
    const vendorId = req.user.id;

    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        // Get Cloudinary URL from uploaded file
        const profilePictureUrl = req.file.path;

        // Update database
        const result = await pool.query(
            "UPDATE vendors SET profile_picture_url = $1 WHERE id = $2 RETURNING id, profile_picture_url",
            [profilePictureUrl, vendorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.json({
            message: "Profile picture updated successfully",
            profilePictureUrl: result.rows[0].profile_picture_url
        });

    } catch (err) {
        console.error("UPDATE PROFILE PICTURE ERROR:", err);
        res.status(500).json({ message: "Failed to update profile picture" });
    }
};

