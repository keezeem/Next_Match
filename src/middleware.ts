// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth-edge';
import { authRoutes, publicRoutes } from './routes';

export async function middleware(req: NextRequest) {
  const session = await auth(req);
  const { nextUrl } = req;

  const isLoggedIn = !!session;
  const isPublic = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProfileComplete = session?.user.profileComplete;
  const isAdmin = session?.user.role === 'ADMIN';
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  if (isPublic || isAdmin) {
    return NextResponse.next();
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/members', nextUrl));
    }
    return NextResponse.next();
  }

  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  if (isLoggedIn && !isProfileComplete && nextUrl.pathname !== '/complete-profile') {
    return NextResponse.redirect(new URL('/complete-profile', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
};
