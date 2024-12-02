import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken');
    console.log('token:', token);
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.startsWith('/public/') || pathname.startsWith('/img/')) {
        return NextResponse.next();
    }

    if (!token && !request.nextUrl.pathname.startsWith('/auth/login')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (token && request.nextUrl.pathname.startsWith('/auth/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/:path*']
};