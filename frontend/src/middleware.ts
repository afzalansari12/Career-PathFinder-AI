import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Allow instant Demo Mode access if query param ?demo=true or demo_mode cookie is present
  const isDemo =
    req.nextUrl.searchParams.get("demo") === "true" ||
    req.cookies.get("demo_mode")?.value === "true";

  if (isDemo && req.nextUrl.searchParams.get("demo") === "true") {
    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    res.cookies.set("demo_mode", "true", { path: "/" });
    return res;
  }

  // If authenticated user or demo user hits root "/", redirect to /dashboard
  if ((userId || isDemo) && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect non-public routes for unauthenticated visitors
  if (!userId && !isDemo && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|fontawesome|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};