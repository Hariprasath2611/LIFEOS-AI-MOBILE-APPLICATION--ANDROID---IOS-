import { Response, NextFunction } from 'express';
import { verifyFirebaseToken } from '../config/firebase';
import { userService } from '../services/UserService';
import { AuthenticatedRequest } from '../types';

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // Verify using Firebase
    const decodedToken = await verifyFirebaseToken(token);
    
    if (!decodedToken || !decodedToken.uid) {
      res.status(401).json({ error: 'Invalid or expired credentials' });
      return;
    }

    // Find or create matching user in MongoDB database
    const user = await userService.getOrCreateUser(
      decodedToken.uid,
      decodedToken.email || '',
      decodedToken.name,
      decodedToken.picture
    );

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
