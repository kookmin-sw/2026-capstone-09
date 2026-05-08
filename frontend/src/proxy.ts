import { NextRequest, NextResponse } from 'next/server';

const MOBILE_UA = /android|iphone|ipad|ipod|blackberry|windows phone/i;

export function proxy(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? '';

  if (MOBILE_UA.test(ua) && !ua.includes('Electron')) {
    return NextResponse.redirect(new URL('/desktop-only', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!desktop-only|_next|favicon.ico).*)'],
};
