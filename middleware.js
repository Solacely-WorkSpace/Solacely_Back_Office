import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ['/'],
  async afterAuth(auth, req) {
    // If the user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/(admin)') || 
        req.nextUrl.pathname.startsWith('/dashboard')) {
      // Check if user is authenticated
      if (!auth.userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }
      
      // Get user metadata to check if they're an admin
      const user = await clerkClient.users.getUser(auth.userId);
      const isAdmin = user.publicMetadata.role === 'admin';
      
      // If not an admin, redirect to home page
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};