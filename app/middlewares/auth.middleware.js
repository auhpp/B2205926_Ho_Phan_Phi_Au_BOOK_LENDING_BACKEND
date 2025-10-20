import ApiError from "./../api-error.js";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new ApiError(401, 'Authentication token is required.'));
        }
        const token = authHeader.split(' ')[1];
        const signerKey = process.env.SIGNER_KEY;
        const decoded = jwt.verify(token, signerKey);
        req.user = decoded;
        return next();
    } catch (error) {
        if (error.name == 'JsonWebTokenError') {
            return next(new ApiError(403, 'Invalid token.'));
        }
        if (error.name == 'TokenExpiredError') {
            return next(new ApiError(403, 'Token has expired.'));
        }
        return next(error);
    }
}

export default authMiddleware;