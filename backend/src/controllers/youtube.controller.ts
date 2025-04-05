
import { Request, Response } from 'express';
import { YoutubeService } from '../services/youtube.service';

export class YoutubeController {
  constructor(private youtubeService: YoutubeService) {}

  async searchVideo(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Query parameter is required' });
      }

      const result = await this.youtubeService.searchVideo(query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error searching video' });
    }
  }

  async searchVideos(req: Request, res: Response) {
    try {
      const { query, limit } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Query parameter is required' });
      }

      const videos = await this.youtubeService.searchVideos(query, Number(limit) || 5);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: 'Error searching videos' });
    }
  }
}
