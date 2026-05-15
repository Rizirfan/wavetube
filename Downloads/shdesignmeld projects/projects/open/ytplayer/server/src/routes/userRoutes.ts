import express from 'express';
import { verifyToken } from '../middleware/auth';
import { 
  getLikedSongs, 
  toggleLikeSong, 
  addRecentTrack 
} from '../controllers/userController';

const router = express.Router();

router.use(verifyToken);

router.get('/liked-songs', getLikedSongs);
router.post('/like', toggleLikeSong);
router.post('/recent', addRecentTrack);

export default router;
