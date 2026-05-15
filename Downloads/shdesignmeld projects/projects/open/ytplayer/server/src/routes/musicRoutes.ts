import express from 'express';
import { searchMusic, getTrending } from '../controllers/musicController';

const router = express.Router();

router.get('/search', searchMusic);
router.get('/trending', getTrending);

export default router;
