import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// Routes that are public and do not require authentication
const PUBLIC_PAGES = ['/', '/login', '/register', '/reset-password'];

// Initialize next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always', // Ensures all paths have a locale prefix (e.g., /en/about)
});

// The main middleware function that handles both i18n and authentication
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip the locale prefix from the pathname to check against the public pages list
  const pathnameWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';

  const isPublicPage = PUBLIC_PAGES.some((p) =>
    p === '/' ? pathnameWithoutLocale === p : pathnameWithoutLocale.startsWith(p)
  );

  // First, let the i18n middleware handle the request
  const i18nResponse = intlMiddleware(request);

  // If the page is public, no authentication is needed.
  // Return the response from the i18n middleware.
  if (isPublicPage) {
    return i18nResponse;
  }

  // For protected pages, perform an authentication check
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
      cache: 'no-store',
    });

    // If the token is valid, allow the request to proceed
    if (res.ok) {
      return i18nResponse;
    }

    // Extract locale for redirect URLs
    const locale = pathname.split('/')[1] || 'en';

    // If the token needs to be refreshed (e.g., 401 Unauthorized)
    if (res.status === 401) {
      const refreshUrl = new URL('/auth/token/refresh', request.url);
      refreshUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(refreshUrl);
    }

    // If the token is invalid and cannot be refreshed, redirect to the login page
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);

  } catch (err) {
    console.error('Middleware auth check failed:', err);
    // In case of a network error or other exception, redirect to login
    const locale = pathname.split('/')[1] || 'en';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  // This matcher excludes routes that should not be processed by the middleware.
  // - api: API routes
  // - auth: Authentication-related API routes
  // - _next: Next.js internal files
  // - files with extensions (e.g., .ico, .svg)
  matcher: ['/((?!api|auth|_next|.*\\..*).*)'],
};