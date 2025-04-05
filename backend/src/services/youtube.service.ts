
import ytSearch from 'yt-search';

export interface YoutubeSearchResult {
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: number;
  description: string;
}

export class YoutubeService {
  public async searchVideo(query: string): Promise<YoutubeSearchResult | null> {
    try {
      const results = await ytSearch(query);
      
      if (results.videos.length === 0) {
        return null;
      }

      const video = results.videos[0];
      
      return {
        title: video.title,
        url: video.url,
        thumbnail: video.thumbnail,
        duration: video.duration.timestamp,
        views: video.views,
        description: video.description
      };
    } catch (error) {
      console.error('Error searching YouTube video:', error);
      return null;
    }
  }

  public async searchVideos(query: string, limit: number = 5): Promise<YoutubeSearchResult[]> {
    try {
      const results = await ytSearch(query);
      
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
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      return [];
    }
  }
}
