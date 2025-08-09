import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;
  
  // Get redirect count to detect loops
  const redirectCount = parseInt(request.cookies.get('redirect_count')?.value || '0');
  
  // Prevent redirect loops
  if (redirectCount > 3) {
    const response = NextResponse.next();
    response.cookies.delete('redirect_count');
    return response;
  }
  
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

  // Break redirect loops if detected (more than 5 redirects)
  if (redirectCount > 5) {
    // Clear problematic cookies and force to sign-in
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.set('access_token', '', { 
      maxAge: 0,
      path: '/',
      sameSite: 'strict'
    });
    response.cookies.set('redirect_count', '0', { 
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    return response;
  }

  // If trying to access protected routes without token
  if ((isProtectedRoute || isAdminRoute) && !token) {
    // Only redirect if not already on sign-in page
    if (pathname !== '/sign-in') {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.set('redirect_count', (redirectCount + 1).toString(), { 
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });
      return response;
    }
  }
  
  // Clear redirect count on successful access
  const response = NextResponse.next();
  if (redirectCount > 0) {
    response.cookies.delete('redirect_count');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};