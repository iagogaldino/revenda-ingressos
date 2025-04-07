"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeController = void 0;
class YoutubeController {
    youtubeService;
    constructor(youtubeService) {
        this.youtubeService = youtubeService;
    }
    async searchVideo(req, res) {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ message: 'Query parameter is required' });
            }
            const result = await this.youtubeService.searchVideo(query);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ message: 'Error searching video' });
        }
    }
    async searchVideos(req, res) {
        try {
            const { query, limit } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ message: 'Query parameter is required' });
            }
            const videos = await this.youtubeService.searchVideos(query, Number(limit) || 5);
            res.json(videos);
        }
        catch (error) {
            res.status(500).json({ message: 'Error searching videos' });
        }
    }
}
exports.YoutubeController = YoutubeController;
