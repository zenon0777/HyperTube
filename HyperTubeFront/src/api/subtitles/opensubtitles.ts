import axios from 'axios';

interface SubtitleTrack {
  kind: string;
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
}

interface OpenSubtitlesSearchResult {
  id: string;
  attributes: {
    subtitle_id: string;
    language: string;
    download_count: number;
    new_download_count: number;
    hearing_impaired: boolean;
    hd: boolean;
    fps: number;
    votes: number;
    points: number;
    ratings: number;
    from_trusted: boolean;
    foreign_parts_only: boolean;
    ai_translated: boolean;
    machine_translated: boolean;
    upload_date: string;
    release: string;
    comments: string;
    legacy_subtitle_id: number;
    uploader: {
      uploader_id: number;
      name: string;
      rank: string;
    };
    feature_details: {
      feature_id: number;
      feature_type: string;
      year: number;
      title: string;
      movie_name: string;
      imdb_id: number;
      tmdb_id: number;
    };
    url: string;
    related_links: {
      label: string;
      url: string;
      img_url: string;
    }[];
    files: Array<{
      file_id: number;
      cd_number: number;
      file_name: string;
    }>;
  };
}

interface OpenSubtitlesResponse {
  total_pages: number;
  total_count: number;
  per_page: number;
  page: number;
  data: OpenSubtitlesSearchResult[];
}

class OpenSubtitlesService {
  private readonly baseUrl = 'https://api.opensubtitles.com/api/v1';
  private readonly apiKey = "xGtzjiW9FG4nKur7XgDpM8nlkldxV9hX";

  private async makeRequest(endpoint: string, params: Record<string, string | number> = {}) {
    if (!this.apiKey) {
      console.error('OpenSubtitles API key is not configured. Please set OPENSUBTITLES_API_KEY in your environment variables.');
      throw new Error('OpenSubtitles API key is not configured');
    }

    try {
      // console.log(`Making OpenSubtitles API request to: ${endpoint}`, params);
      
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'HyperTube v1.0',
          'Accept': 'application/json',
        },
        params,
        timeout: 10000,
      });
      
      // console.log(`OpenSubtitles API response status: ${response.status}`);
      return response.data;
    } catch (error) {
      console.error('OpenSubtitles API Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }

  async searchSubtitles(
    movieName: string,
    year?: string,
    imdbId?: string,
    languages: string[] = ['en', 'fr'],
    preferredLanguage: string = 'en'
  ): Promise<SubtitleTrack[]> {
    try {
      const searchParams: Record<string, string | number> = {
        languages: languages.join(','),
        order_by: 'download_count',
        order_direction: 'desc',
        page: 1,
      };

      if (imdbId) {
        searchParams.imdb_id = imdbId;
        // console.log(`Searching subtitles by IMDB ID: ${imdbId}`);
      } else {
        searchParams.query = movieName;
        if (year) {
          searchParams.year = year;
        }
        // console.log(`Searching subtitles for: "${movieName}" (${year || 'no year'})`);
      }

      const response: OpenSubtitlesResponse = await this.makeRequest('/subtitles', searchParams);
      
      // console.log(`Found ${response.data?.length || 0} subtitle results`);
      
      if (!response.data || response.data.length === 0) {
        console.warn('No subtitles found for the given criteria');
        return [];
      }
      
      return this.processSubtitleResults(response.data, preferredLanguage);
    } catch (error) {
      console.error('Error searching subtitles:', error);
      return [];
    }
  }

  private processSubtitleResults(results: OpenSubtitlesSearchResult[], preferredLanguage: string = 'en'): SubtitleTrack[] {
    const tracks: SubtitleTrack[] = [];
    const languageMap = new Map<string, OpenSubtitlesSearchResult>();

    results.forEach(result => {
      const lang = result.attributes.language;
      const existing = languageMap.get(lang);
      
      if (!existing || 
          result.attributes.download_count > existing.attributes.download_count ||
          (result.attributes.from_trusted && !existing.attributes.from_trusted)) {
        languageMap.set(lang, result);
      }
    });

    // console.log(`Processing ${languageMap.size} unique languages from ${results.length} results`);

    languageMap.forEach((result, lang) => {
      const languageNames: Record<string, string> = {
        'en': 'English',
        'fr': 'Français',
        'es': 'Español',
        'de': 'Deutsch',
        'it': 'Italiano',
        'pt': 'Português',
        'ar': 'العربية',
        'zh': '中文',
        'ja': '日本語',
        'ko': '한국어',
        'ru': 'Русский',
        'nl': 'Nederlands',
        'sv': 'Svenska',
        'no': 'Norsk',
        'da': 'Dansk',
        'fi': 'Suomi',
        'pl': 'Polski',
        'cs': 'Čeština',
        'hu': 'Magyar',
        'tr': 'Türkçe',
        'he': 'עברית',
        'hi': 'हिन्दी',
        'th': 'ไทย',
        'vi': 'Tiếng Việt',
      };

      const label = result.attributes.hearing_impaired 
        ? `${languageNames[lang] || lang} (CC)`
        : languageNames[lang] || lang;

      const fileId = result.attributes.files?.[0]?.file_id || result.attributes.subtitle_id;
      
      if (fileId) {
        tracks.push({
          kind: 'subtitles',
          src: `/api/subtitles/download?file_id=${fileId}`,
          srcLang: lang,
          label,
          default: lang === preferredLanguage && !result.attributes.hearing_impaired,
        });
        
        // console.log(`Added subtitle track: ${label} (${lang}) - File ID: ${fileId}`);
      } else {
        console.warn(`No file ID found for subtitle in language: ${lang}`);
      }
    });

    return tracks;
  }

  async downloadSubtitle(fileId: string): Promise<string> {
    try {
      // console.log(`Requesting download for file ID: ${fileId}`);
      
      if (!this.apiKey) {
        throw new Error('OpenSubtitles API key is not configured');
      }

      const downloadResponse = await axios.post(
        `${this.baseUrl}/download`,
        {
          file_id: parseInt(fileId),
          sub_format: 'srt'
        },
        {
          headers: {
            'Api-Key': this.apiKey,
            'Content-Type': 'application/json',
            'User-Agent': 'HyperTube v1.0',
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );
      
      // console.log('Download POST response:', JSON.stringify(downloadResponse.data, null, 2));
      
      if (downloadResponse.data && downloadResponse.data.link) {
        // console.log(`Got download link: ${downloadResponse.data.link}`);
        return downloadResponse.data.link;
      }
      
      // console.log('POST failed, trying GET method...');
      const getResponse = await this.makeRequest(`/subtitles/${fileId}`, {});
      
      // console.log('GET response:', JSON.stringify(getResponse, null, 2));
      
      if (getResponse.data && getResponse.data.attributes) {
        const attributes = getResponse.data.attributes;
        if (attributes.url) {
          // console.log(`Got subtitle URL: ${attributes.url}`);
          return attributes.url;
        }
      }
      
      throw new Error('No download link found in OpenSubtitles response');
    } catch (error) {
      console.error('Error downloading subtitle:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }
}

export const openSubtitlesService = new OpenSubtitlesService();
export type { SubtitleTrack };
