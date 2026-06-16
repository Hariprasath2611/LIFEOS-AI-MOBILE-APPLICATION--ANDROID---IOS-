"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply authorization check across all user routes
router.use(authMiddleware_1.authMiddleware);
router.get('/profile', UserController_1.userController.getProfile);
router.put('/profile', UserController_1.userController.updateProfile);
router.get('/dashboard', UserController_1.userController.getDashboardSummary);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map