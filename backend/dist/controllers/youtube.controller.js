"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeController = void 0;
class YoutubeController {
    youtubeService;
    constructor(youtubeService) {
        this.youtubeService = youtubeService;
    }
    async searchVideo(req, res, next) {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                res.status(400).json({ message: 'Query parameter is required' });
                return;
            }
            const result = await this.youtubeService.searchVideo(query);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async searchVideos(req, res, next) {
        try {
            const { query, limit } = req.query;
            if (!query || typeof query !== 'string') {
                res.status(400).json({ message: 'Query parameter is required' });
                return;
            }
            const videos = await this.youtubeService.searchVideos(query, Number(limit) || 5);
            res.json(videos);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.YoutubeController = YoutubeController;
