"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = exports.AnalyticsController = void 0;
const AnalyticsService_1 = require("../services/AnalyticsService");
class AnalyticsController {
    async getAnalyticsHistory(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const history = await AnalyticsService_1.analyticsService.getAnalyticsHistory(req.user.uid);
            res.json(history);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch analytics history' });
        }
    }
    async computeAnalytics(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const todayRecord = await AnalyticsService_1.analyticsService.computeDailyAnalytics(req.user.uid);
            res.json(todayRecord);
        }
        catch (error) {
            console.error('Daily analytics calculation failed:', error);
            res.status(500).json({ error: 'Failed to compute daily analytics' });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
exports.analyticsController = new AnalyticsController();
//# sourceMappingURL=AnalyticsController.js.map