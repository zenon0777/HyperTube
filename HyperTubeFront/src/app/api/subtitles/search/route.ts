import { NextRequest, NextResponse } from 'next/server';
import { fetchSubtitlesForMovie, extractMovieInfoFromName } from '@/api/subtitles/movieSubtitles';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieName = searchParams.get('movieName');
    const localeParam = searchParams.get('locale');

    if (!movieName) {
      return NextResponse.json(
        { error: 'movieName parameter is required' },
        { status: 400 }
      );
    }

    const getUserLocale = (): string => {
      if (localeParam && (localeParam === 'en' || localeParam === 'fr')) {
        // console.log(`[Subtitle Search API] Using explicit locale parameter: ${localeParam}`);
        return localeParam;
      }
      
      const referer = request.headers.get('referer');
      if (referer) {
        const refererUrl = new URL(referer);
        const pathSegments = refererUrl.pathname.split('/');
        const localeFromPath = pathSegments[1];
        if (localeFromPath === 'en' || localeFromPath === 'fr') {
          // console.log(`[Subtitle Search API] Using locale from referer path: ${localeFromPath}`);
          return localeFromPath;
        }
      }
      
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';');
        
        const possibleCookieNames = ['NEXT_LOCALE', 'locale', 'next-intl-locale'];
        for (const cookieName of possibleCookieNames) {
          const localeCookie = cookies.find(cookie => cookie.trim().startsWith(`${cookieName}=`));
          if (localeCookie) {
            const locale = localeCookie.split('=')[1];
            if (locale === 'en' || locale === 'fr') {
              // console.log(`[Subtitle Search API] Using locale from cookie ${cookieName}: ${locale}`);
              return locale;
            }
          }
        }
      }
      
      const acceptLanguage = request.headers.get('accept-language');
      if (acceptLanguage && acceptLanguage.includes('fr')) {
        // console.log(`[Subtitle Search API] Using locale from Accept-Language header: fr`);
        return 'fr';
      }
      
      // console.log(`[Subtitle Search API] Falling back to default locale: en`);
      return 'en';
    };

    const preferredLanguage = getUserLocale();
    console.log(`[Subtitle Search API] Detected preferred language: ${preferredLanguage}`);

    // console.log(`[Subtitle Search API] Searching subtitles for: ${movieName}`);

    const movieInfo = extractMovieInfoFromName(movieName);
    // console.log(`[Subtitle Search API] Extracted movie info:`, movieInfo);

    const subtitles = await fetchSubtitlesForMovie(movieInfo, preferredLanguage);
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
