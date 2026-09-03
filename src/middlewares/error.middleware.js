export const errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        success: false,
        data: null,
        error: err.message || "Internal Server Error"
    });
};
