import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const LOCALES = ['en', 'fr'];
const DEFAULT_LOCALE = 'en';

const PUBLIC_PAGES = ['/', '/login', '/register', '/reset-password'];

const intlMiddleware = createIntlMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const i18nResponse = intlMiddleware(request);

  if (i18nResponse.status === 307 || i18nResponse.status === 308) {
    return i18nResponse;
  }
  
  const pathnameWithLocale = request.nextUrl.pathname;
  const pathSegments = pathnameWithLocale.split('/').filter(Boolean);
  const potentialLocale = pathSegments[0];

  const isLocalePresent = LOCALES.includes(potentialLocale);
  const pathWithoutLocale = isLocalePresent ? `/${pathSegments.slice(1).join('/')}` : pathnameWithLocale;

  const isPublicPage = PUBLIC_PAGES.some((p) =>
    p === '/' ? pathWithoutLocale === p || pathWithoutLocale === '' : pathWithoutLocale.startsWith(p)
  );

  if (isPublicPage) {
    return i18nResponse;
  }

  try {
    const backendUrl = process.env.INTERNAL_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log(`[Middleware] Auth check for "${pathnameWithLocale}" at: ${backendUrl}/auth/me/`);
    
    const res = await fetch(`${backendUrl}/auth/me/`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (res.ok) {
      return i18nResponse;
    }

    const locale = isLocalePresent ? potentialLocale : DEFAULT_LOCALE;
    
    if (res.status === 401) {
      console.log(`[Middleware] Auth failed with 401 for "${pathnameWithLocale}". Redirecting to refresh.`);
      const refreshUrl = new URL('/auth/token/refresh', request.url);
      refreshUrl.searchParams.set('redirect', pathnameWithLocale);
      return NextResponse.redirect(refreshUrl);
    }

    console.log(`[Middleware] Auth failed for "${pathnameWithLocale}". Redirecting to login.`);
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathnameWithLocale);
    return NextResponse.redirect(loginUrl);

  } catch (err) {
    console.error(`[Middleware] Auth check fetch failed for "${pathnameWithLocale}":`, err);
    const pathLocale = LOCALES.includes(pathSegments[0]) ? pathSegments[0] : DEFAULT_LOCALE;
    const loginUrl = new URL(`/${pathLocale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/((?!api|auth|_next|.*\\..*).*)'],
};