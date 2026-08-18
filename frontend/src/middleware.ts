// frontend/src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/landing(.*)", "/sign-in(.*)", "/sign-up(.*)", "/forgot-password(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const hasDemoParam = url.searchParams.get("demo") === "true";
  const referer = req.headers.get("referer") || "";
  const isDemoReferer = referer.includes("demo=true");

  // Lightning-fast bypass for demo mode session - skip Clerk network latency completely
  if (hasDemoParam || isDemoReferer) {
    return NextResponse.next();
  }

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // If logged-in user hits root "/", redirect to /dashboard
  if (userId && url.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!userId) {
    const hasSignedUp = req.cookies.get("has_signed_up")?.value === "true";
    const redirectTarget = hasSignedUp ? "/sign-in" : "/sign-up";
    const targetUrl = new URL(redirectTarget, req.url);
    targetUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(targetUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|fontawesome|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};