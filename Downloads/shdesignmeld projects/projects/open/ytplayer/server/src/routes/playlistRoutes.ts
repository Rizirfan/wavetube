import express from 'express';
import { verifyToken } from '../middleware/auth';
import { 
  createPlaylist, 
  getMyPlaylists, 
  addTrackToPlaylist, 
  removeTrackFromPlaylist,
  deletePlaylist 
} from '../controllers/playlistController';

const router = express.Router();

router.use(verifyToken);

router.post('/', createPlaylist);
router.get('/', getMyPlaylists);
router.post('/add', addTrackToPlaylist);
router.post('/remove', removeTrackFromPlaylist);
router.delete('/:id', deletePlaylist);

export default router;
