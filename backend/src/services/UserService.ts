import { userRepo } from '../repositories';
import { IUser } from '../models/User';

export class UserService {
  async getOrCreateUser(uid: string, email: string, displayName?: string, photoURL?: string): Promise<IUser> {
    let user = await userRepo.findByUid(uid);
    if (!user) {
      user = await userRepo.create({
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

  async getUser(uid: string): Promise<IUser | null> {
    return userRepo.findByUid(uid);
  }

  async updateUser(uid: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return userRepo.update({ uid }, updateData);
  }

  async incrementProductivityScore(uid: string, points: number): Promise<IUser | null> {
    const user = await userRepo.findByUid(uid);
    if (!user) return null;
    const currentScore = user.productivityScore || 0;
    const newScore = Math.max(0, Math.min(100, currentScore + points));
    return userRepo.update({ uid }, { productivityScore: newScore });
  }
}

export const userService = new UserService();
