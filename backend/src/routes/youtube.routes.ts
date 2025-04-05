
import { Router } from 'express';
import { YoutubeController } from '../controllers/youtube.controller';
import { YoutubeService } from '../services/youtube.service';

const router = Router();
const youtubeService = new YoutubeService();
const youtubeController = new YoutubeController(youtubeService);

router.get('/youtube/search', (req, res) => youtubeController.searchVideo(req, res));
router.get('/youtube/search/multiple', (req, res) => youtubeController.searchVideos(req, res));

export const youtubeRoutes = router;
