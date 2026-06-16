"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebase_1 = require("../config/firebase");
const UserService_1 = require("../services/UserService");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Authorization token required' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verify using Firebase
        const decodedToken = await (0, firebase_1.verifyFirebaseToken)(token);
        if (!decodedToken || !decodedToken.uid) {
            res.status(401).json({ error: 'Invalid or expired credentials' });
            return;
        }
        // Find or create matching user in MongoDB database
        const user = await UserService_1.userService.getOrCreateUser(decodedToken.uid, decodedToken.email || '', decodedToken.name, decodedToken.picture);
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map