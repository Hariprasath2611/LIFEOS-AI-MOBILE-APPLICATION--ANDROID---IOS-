"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const repositories_1 = require("../repositories");
class UserService {
    async getOrCreateUser(uid, email, displayName, photoURL) {
        let user = await repositories_1.userRepo.findByUid(uid);
        if (!user) {
            user = await repositories_1.userRepo.create({
                uid,
                email,
                displayName: displayName || email.split('@')[0],
                photoURL,
                interests: [],
                goals: [],
                learningTopics: [],
                productivityScore: 0,
                preferences: {
                    notificationsEnabled: true,
                    aiAssistantEnabled: true,
                    theme: 'dark'
                }
            });
        }
        return user;
    }
    async getUser(uid) {
        return repositories_1.userRepo.findByUid(uid);
    }
    async updateUser(uid, updateData) {
        return repositories_1.userRepo.update({ uid }, updateData);
    }
    async incrementProductivityScore(uid, points) {
        const user = await repositories_1.userRepo.findByUid(uid);
        if (!user)
            return null;
        const currentScore = user.productivityScore || 0;
        const newScore = Math.max(0, Math.min(100, currentScore + points));
        return repositories_1.userRepo.update({ uid }, { productivityScore: newScore });
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=UserService.js.map