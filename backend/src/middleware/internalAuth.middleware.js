export default function internalAuth(req, res, next) {
  const internalKey = req.headers["x-internal-key"];

  if (!internalKey || internalKey !== process.env.INTERNAL_SYNC_KEY) {
    return res.status(403).json({
      message: "Forbidden: Invalid internal key"
    });
  }

  next();
}
