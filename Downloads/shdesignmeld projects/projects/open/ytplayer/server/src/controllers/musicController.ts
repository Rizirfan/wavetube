import { Request, Response } from 'express';
import ytSearch from 'yt-search';

export const searchMusic = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Query is required' });
  }

  console.log(`[Search] Query: "${q}" via yt-search`);

  try {

    const queries = [
      `${q} music`,
      `${q} song`,
      `${q} official audio`,
      `${q} top tracks`,
    ];

    const seen = new Set<string>();
    const collected: any[] = [];

    for (const pattern of queries) {
      const r = await ytSearch(pattern);
      const videos = r.videos || [];

      for (const v of videos) {
        if (!v?.videoId) continue;
        if (seen.has(v.videoId)) continue;
        seen.add(v.videoId);
        collected.push(v);
        if (collected.length >= 50) break;
      }

      if (collected.length >= 50) break;
    }

    const items = collected.slice(0, 50).map(video => ({
      id: video.videoId,
      title: video.title,
      artist: video.author.name,
      thumbnail: video.thumbnail,
      duration: video.timestamp,
    }));

    res.json(items);
  } catch (error: any) {
    console.error('yt-search Error:', error);
    res.status(500).json({ message: 'Error performing search', details: error.message });
  }
};

export const getTrending = async (req: Request, res: Response) => {
  try {
    console.log('[Trending] Fetching trending via yt-search');
    // yt-search doesn't have a direct "trending" so we just search for generic terms or hits
    const queries = ['top hits 2024', 'global top songs', 'trending music', 'new popular songs'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    const r = await ytSearch(randomQuery);
    const videos = r.videos.slice(0, 50);


    const items = videos.map(video => ({
      id: video.videoId,
      title: video.title,
      artist: video.author.name,
      thumbnail: video.thumbnail,
      duration: video.timestamp
    }));

    res.json(items);
  } catch (error: any) {
    console.error('yt-search Trending Error:', error);
    res.status(500).json({ message: 'Error fetching trending tracks' });
  }
};
