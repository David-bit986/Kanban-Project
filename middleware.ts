import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Protect dashboard and other private routes
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Auth routes should not be accessible when logged in
  const authRoutes = ["/login", "/register", "/forgot", "/forgot-password", "/reset-password"];
  const isAuthRoute = authRoutes.includes(pathname);

  // If trying to access protected route without session, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access auth routes or home page, redirect to dashboard
  if ((isAuthRoute || pathname === "/") && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
