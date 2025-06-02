import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/reset-password', '/'];
const AUTH_ROUTES = ['/auth/token/refresh'];

const AUTH_ROUTES = ['/auth/token/refresh', '/auth/success'];

function isPublicRoute(pathname: string): boolean {
    if (pathname === '/') {
        return true;
    }
    const publicRoutesWithSubpaths = ['/login', '/register', '/reset-password'];
    return publicRoutesWithSubpaths.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
    return AUTH_ROUTES.some(route => pathname.startsWith(route));
}

async function checkTokenValidity(request: NextRequest): Promise<{ isValid: boolean; needsRefresh: boolean }> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
            headers: {
                cookie: request.headers.get('cookie') || '',
            },
            credentials: 'include',
            cache: 'no-store',
        });

        if (res.ok) {
            return { isValid: true, needsRefresh: false };
        }

        if (res.status === 401) {
            return { isValid: false, needsRefresh: true };
        }

        return { isValid: false, needsRefresh: false };
    } catch (err) {
        console.error('Token validation failed:', err);
        return { isValid: false, needsRefresh: false };
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isPublicRoute(pathname) || isAuthRoute(pathname)) {
        return NextResponse.next();
    }

    const { isValid, needsRefresh } = await checkTokenValidity(request);    if (isValid) {
        return NextResponse.next();
    }

    if (needsRefresh) {
        // Redirect to refresh API route with the original destination
        const refreshUrl = new URL('/auth/token/refresh', request.url);
        refreshUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(refreshUrl);
    }

    // Token is invalid and can't be refreshed, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|api|static|.*\\..*).*)'],
};