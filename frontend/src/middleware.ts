import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const hasDemoParam = req.nextUrl.searchParams.get("demo") === "true";
  const referer = req.headers.get("referer") || "";
  const isDemoReferer = referer.includes("demo=true");

  // If logged-in user with Clerk account hits root "/", redirect to /dashboard
  if (userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow access if user is authenticated OR has demo=true param OR coming from a demo session
  if (!userId && !hasDemoParam && !isDemoReferer && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|fontawesome|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};