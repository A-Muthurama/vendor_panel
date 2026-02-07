import multer from "multer";

export const errorHandler = (err, req, res, next) => {
    console.error("Global Error Handler:", err);

    // Handle Multer Errors
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File is too large. Maximum size is 5MB.",
                error: err.code
            });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "Too many files or incorrect field name uploaded.",
                error: err.code
            });
        }
        return res.status(400).json({
            message: `File upload error: ${err.message}`,
            error: err.code
        });
    }

    // Handle Syntax Errors (JSON parsing)
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON payload" });
    }

    // Handle General Errors
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        message,
        error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};
