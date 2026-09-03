export const requireRole = (...roles) => {
    return (req, res, next) => {
        const userRole = req.auth?.sessionClaims?.metadata?.role;

        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                data: null,
                error: "Forbidden: Insufficient permissions"
            });
        }

        req.userRole = userRole;
        next();
    };
};
