"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CalendarController_1 = require("../controllers/CalendarController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get('/', CalendarController_1.calendarController.getEvents);
router.post('/', CalendarController_1.calendarController.createEvent);
router.put('/:id', CalendarController_1.calendarController.updateEvent);
router.delete('/:id', CalendarController_1.calendarController.deleteEvent);
exports.default = router;
//# sourceMappingURL=calendarRoutes.js.map