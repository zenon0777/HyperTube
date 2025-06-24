/**
 * Interface for torrent data returned from the API
 */
interface TorrentData {
  magnet?: string;
  hash?: string;
  title?: string;
  seeders?: number;
  leechers?: number;
  size?: string;
  [key: string]: unknown;
}

/**
 * Interface for TMDB movie data
 */
interface TMDBMovieData {
  title?: string;
  original_title?: string;
  release_date?: string;
  id?: number;
  [key: string]: unknown;
}

/**
 * Extracts torrent hash from magnet link
 * @param magnetLink - The magnet link string
 * @returns The extracted hash or null if not found
 */
export function extractHashFromMagnet(magnetLink: string): string | null {
  if (!magnetLink || typeof magnetLink !== 'string') {
    return null;
  }

  try {
    const hashMatch = magnetLink.match(/xt=urn:btih:([a-fA-F0-9]{40}|[a-fA-F0-9]{32})/i);
    if (hashMatch && hashMatch[1]) {
      return hashMatch[1].toUpperCase();
    }
    return null;
  } catch (error) {
    console.log('Error extracting hash from magnet link:', error);
    return null;
  }
}

/**
 * Fetches torrent data from the backend search API
 * @param title - Movie title
 * @param year - Movie release year (optional)
 * @returns Promise resolving to torrent data or null
 */
export async function fetchTorrentForMovie(title: string, year?: string | number): Promise<TorrentData | null> {
  try {
    const params = new URLSearchParams({
      title: title.trim(),
    });
    
    if (year) {
      params.append('year', year.toString());
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/search_torrents?${params.toString()}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch torrent: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.torrent) {
      console.log(`Found torrent for "${title}" (${year}):`, data.torrent);
      return data.torrent;
    }
    
    return null;
  } catch (error) {
    console.log('Error fetching torrent for movie:', error);
    return null;
  }
}

/**
 * Gets a torrent hash for streaming from TMDB movie data
 * @param movieData - TMDB movie data object
 * @returns Promise resolving to torrent hash or null
 */
export async function getTorrentHashForTMDBMovie(movieData: TMDBMovieData): Promise<string | null> {
  try {
    if (!movieData) {
      return null;
    }

    const title = movieData.title || movieData.original_title;
    if (!title) {
      return null;
    }

    const year = movieData.release_date ? new Date(movieData.release_date).getFullYear() : undefined;

    console.log(`Searching torrent for TMDB movie: "${title}" (${year})`);

    const torrentData = await fetchTorrentForMovie(title, year);
    
    if (torrentData && torrentData.magnet) {
      const hash = extractHashFromMagnet(torrentData.magnet);
      if (hash) {
        console.log(`Extracted hash for "${title}": ${hash}`);
        return hash;
      }
    }

    return null;
  } catch (error) {
    console.log('Error getting torrent hash for TMDB movie:', error);
    return null;
  }
}
