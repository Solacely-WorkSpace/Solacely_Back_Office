import { NextResponse } from "next/server";

export function middleware(request) {
  // We can't access localStorage in middleware (server-side)
  // So we need to set a cookie when logging in
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/sign-in',
    '/sign-up',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/view-listing'
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Admin routes
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/(admin)');

  // Protected routes
  const isProtectedRoute = pathname.startsWith('/user') || 
                          pathname.startsWith('/add-new-listing') || 
                          pathname.startsWith('/edit-listing');

  // If trying to access protected routes without token
  if ((isProtectedRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect from homepage to sign-in if not authenticated
  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If authenticated and trying to access auth pages, redirect to appropriate dashboard
  if (token && (pathname === '/sign-in' || pathname === '/sign-up')) {
    // We'll redirect to dashboard instead of home
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};