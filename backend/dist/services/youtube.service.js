"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = void 0;
const yt_search_1 = __importDefault(require("yt-search"));
class YoutubeService {
    getEmbedUrl(url) {
        const videoId = this.extractVideoId(url);
        if (!videoId)
            return '';
        return `https://www.youtube.com/embed/${videoId}`;
    }
    extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : '';
    }
    async searchVideo(query) {
        try {
            const results = await (0, yt_search_1.default)(query);
            if (results.videos.length === 0) {
                return null;
            }
            const video = results.videos[0];
            return {
                title: video.title,
                url: video.url,
                embedUrl: this.getEmbedUrl(video.url),
                thumbnail: video.thumbnail || "",
                duration: video.duration.timestamp,
                views: video.views,
                description: video.description
            };
        }
        catch (error) {
            console.error('Error searching YouTube video:', error);
            return null;
        }
    }
    async searchVideos(query, limit = 5) {
        try {
            const results = await (0, yt_search_1.default)(query);
            return results.videos
                .slice(0, limit)
                .map(video => ({
                title: video.title,
                url: video.url,
                thumbnail: video.thumbnail,
                duration: video.duration.timestamp,
                views: video.views,
                description: video.description
            }));
        }
        catch (error) {
            console.error('Error searching YouTube videos:', error);
            return [];
        }
    }
}
exports.YoutubeService = YoutubeService;
