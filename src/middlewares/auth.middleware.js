import { getAuth } from "@clerk/express";

export const requireAuth = async (req, res, next) => {
    const auth = getAuth(req);

    if(!auth.isAuthenticated) {
        return res.status(401).json({
            success: false,
            message: "unauthorized"
        })
    }
    next();
}