import { NextRequest, NextResponse } from 'next/server';
import { fetchSubtitlesForMovie, extractMovieInfoFromName } from '@/api/subtitles/movieSubtitles';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieName = searchParams.get('movieName');

    if (!movieName) {
      return NextResponse.json(
        { error: 'movieName parameter is required' },
        { status: 400 }
      );
    }

    // console.log(`[Subtitle Search API] Searching subtitles for: ${movieName}`);

    const movieInfo = extractMovieInfoFromName(movieName);
    // console.log(`[Subtitle Search API] Extracted movie info:`, movieInfo);

    const subtitles = await fetchSubtitlesForMovie(movieInfo);
    // console.log(`[Subtitle Search API] Found ${subtitles.length} subtitle tracks`);

    const subtitleResults = subtitles.map(track => {
      const urlParts = track.src.split('file_id=');
      const fileId = urlParts.length > 1 ? urlParts[1].split('&')[0] : null;
      
      return {
        fileId: fileId,
        language: track.srcLang,
        languageName: track.label,
        downloadUrl: track.src
      };
    }).filter(subtitle => subtitle.fileId);

    return NextResponse.json({
      success: true,
      movieName,
      movieInfo,
      subtitles: subtitleResults
    });

  } catch (error) {
    console.error('[Subtitle Search API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search subtitles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
