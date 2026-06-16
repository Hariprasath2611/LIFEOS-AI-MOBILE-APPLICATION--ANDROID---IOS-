"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AnalyticsController_1 = require("../controllers/AnalyticsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get('/', AnalyticsController_1.analyticsController.getAnalyticsHistory);
router.post('/compute', AnalyticsController_1.analyticsController.computeAnalytics);
exports.default = router;
//# sourceMappingURL=analyticsRoutes.js.map