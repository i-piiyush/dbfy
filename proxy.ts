import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAuthPage = (pathname: string) =>
  pathname === "/sign-in" ||
  pathname.startsWith("/sign-in/") ||
  pathname === "/sign-up" ||
  pathname.startsWith("/sign-up/");

const isApiRoute = (pathname: string) =>
  pathname === "/api" || pathname.startsWith("/api/") || pathname === "/trpc" || pathname.startsWith("/trpc/");

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  if (pathname === "/" || isAuthPage(pathname)) {
    const { isAuthenticated } = await auth();
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/playground", request.url));
    }
    return;
  }

  // Keep API responses in their handlers so unauthenticated callers receive
  // the existing JSON 401 response instead of Clerk's generic route response.
  if (isApiRoute(pathname) || pathname.startsWith("/__clerk/")) return;

  await auth.protect();
}, {
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
