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
         COUNT(*) FILTER (WHERE status = 'ACTIVE' AND end_date >= CURRENT_DATE) as active_offers,
         COUNT(*) FILTER (WHERE status = 'EXPIRED' OR end_date < CURRENT_DATE) as expired_offers,
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
                activeOffers: parseInt(stats.active_offers),
                expiredOffers: parseInt(stats.expired_offers),
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
    const { title, description, posterUrl, category, startDate, endDate, shopAddress, mapLink } = req.body;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1. Check Subscription
        const subRes = await client.query(
            `SELECT id, remaining_posts FROM subscriptions 
       WHERE vendor_id = $1 AND status = 'ACTIVE' AND expiry_date > NOW()
       ORDER BY expiry_date DESC LIMIT 1`,
            [vendorId]
        );

        if (subRes.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(403).json({ message: "No active subscription found. Please upgrade." });
        }

        const subscription = subRes.rows[0];
        if (subscription.remaining_posts <= 0) {
            await client.query("ROLLBACK");
            return res.status(403).json({ message: "Post limit reached. Please upgrade plan." });
        }

        // 2. Insert Offer
        const offerRes = await client.query(
            `INSERT INTO offers 
       (vendor_id, title, description, poster_url, category, start_date, end_date, shop_address, map_link)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [vendorId, title, description, posterUrl, category, startDate, endDate, shopAddress, mapLink]
        );

        // 3. Deduct Post Count
        await client.query(
            "UPDATE subscriptions SET remaining_posts = remaining_posts - 1 WHERE id = $1",
            [subscription.id]
        );

        await client.query("COMMIT");
        res.status(201).json({ message: "Offer created successfully", offer: offerRes.rows[0] });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("CREATE OFFER ERROR:", err);
        res.status(500).json({ message: "Failed to create offer" });
    } finally {
        client.release();
    }
};

/* ---------------- BUY SUBSCRIPTION ---------------- */
export const buySubscription = async (req, res) => {
    const vendorId = req.user.id;
    const { planName, price, posts, paymentId } = req.body; // paymentId logic skipped for simplicity, assume verified

    try {
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

