import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/login/callback', '/'];
  
  // API routes and static files should be allowed through
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If accessing a public route, allow through
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle onboarding flow
  if (pathname.startsWith('/onboarding/')) {
    // User is authenticated, let them proceed with onboarding
    return NextResponse.next();
  }

  // For all other protected routes, check if user has completed onboarding
  if (!session.user.role) {
    return NextResponse.redirect(new URL('/onboarding/role', request.url));
  }

  if (!session.user.hasProfile) {
    if (session.user.role === 'student') {
      return NextResponse.redirect(new URL('/onboarding/student-profile', request.url));
    } else if (session.user.role === 'company') {
      return NextResponse.redirect(new URL('/onboarding/company-profile', request.url));
    }
  }

  // If user is fully onboarded, redirect to success page
  if (session.user.hasProfile && session.user.profileCompleted) {
    // Allow access to success page
    if (pathname === '/onboarding/success') {
      return NextResponse.next();
    }
    
    // Redirect other paths to success page
    if (pathname === '/' || pathname.startsWith('/onboarding/')) {
      return NextResponse.redirect(new URL('/onboarding/success', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
