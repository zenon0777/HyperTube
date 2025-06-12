import { openSubtitlesService, SubtitleTrack } from '@/api/subtitles/opensubtitles';

interface MovieInfo {
  name: string;
  year?: string;
  imdbId?: string;
}

export async function fetchSubtitlesForMovie(movieInfo: MovieInfo): Promise<SubtitleTrack[]> {
  try {
    // console.log('Fetching subtitles for:', movieInfo);
    
    const subtitles = await openSubtitlesService.searchSubtitles(
      movieInfo.name,
      movieInfo.year,
      movieInfo.imdbId,
      ['en', 'fr', 'es', 'ar']
    );

    // console.log(`Found ${subtitles.length} subtitle tracks`);
    
    if (subtitles.length === 0 && movieInfo.year) {
      // console.log('No subtitles found with year, trying without year...');
      const fallbackSubtitles = await openSubtitlesService.searchSubtitles(
        movieInfo.name,
        undefined,
        movieInfo.imdbId,
        ['en', 'fr', 'es', 'ar']
      );
      // console.log(`Found ${fallbackSubtitles.length} subtitle tracks without year`);
      return fallbackSubtitles.length > 0 ? fallbackSubtitles : getFallbackSubtitles();
    }
    
    return subtitles.length > 0 ? subtitles : getFallbackSubtitles();
  } catch (error) {
    console.error('Failed to fetch subtitles:', error);
    return getFallbackSubtitles();
  }
}

export function extractMovieInfoFromName(movieName: string): MovieInfo {
  // console.log('Extracting movie info from:', movieName);
  
  const yearMatch = movieName.match(/\((\d{4})\)|\b(\d{4})\b/);
  const year = yearMatch ? yearMatch[1] || yearMatch[2] : undefined;
  
  const cleanName = movieName
    .replace(/\(?\d{4}\)?/g, '')
    .replace(/\b(720p|1080p|4K|HDRip|WEBRip|BluRay|DVDRip|CAMRip|BRRip|WEB-DL)\b/gi, '')
    .replace(/\b(x264|x265|HEVC|AAC|AC3|DTS|H\.264|H\.265)\b/gi, '')
    .replace(/\b(YTS|YIFY|RARBG|ETRG|FGT|EVO|CMRG|PSA|MkvCage)\b/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\{.*?\}/g, '')
    .replace(/\-.*?(mkv|mp4|avi)$/gi, '')
    .replace(/[\.\-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // console.log('Extracted movie info:', { name: cleanName, year });
  
  return {
    name: cleanName,
    year,
  };
}

export function extractImdbIdFromTorrent(torrentData: any): string | undefined {
  if (torrentData?.imdb_id) {
    return torrentData.imdb_id;
  }
  
  const imdbPattern = /tt\d{7,}/i;
  const description = torrentData?.description || torrentData?.comment || '';
  const match = description.match(imdbPattern);
  
  return match ? match[0] : undefined;
}

function getFallbackSubtitles(): SubtitleTrack[] {
  return [];
}
