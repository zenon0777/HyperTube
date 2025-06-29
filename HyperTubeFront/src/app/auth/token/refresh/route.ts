import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);	const redirectPath = searchParams.get('redirect') || '/';

	console.log('Token refresh attempt for redirect:', redirectPath);

	try {
		// Attempt to refresh the token
		const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token/refresh/`, {
			method: 'POST',
			headers: {
				cookie: request.headers.get('cookie') || '',
				'Content-Type': 'application/json',
			},
			credentials: 'include',		});
		
		console.log('Refresh response status:', refreshResponse.status);
		
		if (refreshResponse.ok) {
			// Token refreshed successfully
			const response = NextResponse.redirect(new URL(redirectPath, request.url));
			
			// Copy all cookies from the refresh response
			const setCookieHeaders = refreshResponse.headers.getSetCookie();
			if (setCookieHeaders && setCookieHeaders.length > 0) {				setCookieHeaders.forEach(cookie => {
					response.headers.append('set-cookie', cookie);
				});
				console.log('Cookies set:', setCookieHeaders.length);
			}

			return response;		} else {
			// Refresh failed, redirect to login
			console.log('Refresh failed, redirecting to login');
			const loginUrl = new URL('/login', request.url);
			loginUrl.searchParams.set('redirect', redirectPath);
			return NextResponse.redirect(loginUrl);
		}
	} catch (error) {
		console.error('Token refresh failed:', error);
		
		// On error, redirect to login
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('redirect', redirectPath);
		return NextResponse.redirect(loginUrl);
	}
}