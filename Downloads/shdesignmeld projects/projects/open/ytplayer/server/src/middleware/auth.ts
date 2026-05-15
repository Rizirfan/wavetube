import { Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import User from '../models/User';

export const verifyToken = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (!auth) {
      console.warn('Firebase Auth not initialized. Skipping token verification.');
      return res.status(500).json({ message: 'Auth service unavailable' });
    }
    const decodedToken = await (auth as any).verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // Synchronize user in MongoDB
    let user = await User.findOne({ firebaseId: uid });
    if (!user) {
      user = await User.create({
        firebaseId: uid,
        email: email || '',
        displayName: name || '',
        photoURL: picture || '',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
