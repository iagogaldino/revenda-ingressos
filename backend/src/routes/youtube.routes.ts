import { Router, Request, Response, NextFunction } from 'express';
import { YoutubeController } from '../controllers/youtube.controller';
import { YoutubeService } from '../services/youtube.service';

const router = Router();
const youtubeService = new YoutubeService();
const youtubeController = new YoutubeController(youtubeService);

// Adicionado NextFunction para tratamento de erros
router.get('/youtube/search', (req: Request, res: Response, next: NextFunction) => youtubeController.searchVideo(req, res, next));
router.get('/youtube/search/multiple', (req: Request, res: Response, next: NextFunction) => youtubeController.searchVideos(req, res, next));

export const youtubeRoutes = router;
