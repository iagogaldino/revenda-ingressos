
import { NextFunction, Request, Response } from 'express';
import { YoutubeService } from '../services/youtube.service';

export class YoutubeController {
  constructor(private youtubeService: YoutubeService) {}

  async searchVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: 'Query parameter is required' });
        return;
      }

      const result = await this.youtubeService.searchVideo(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchVideos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, limit } = req.query;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: 'Query parameter is required' });
        return;
      }

      const videos = await this.youtubeService.searchVideos(query, Number(limit) || 5);
      res.json(videos);
    } catch (error) {
      next(error);
    }
  }
}
