import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// // Middleware function
// export default clerkMiddleware((auth, req) => {
//   // Protect any route under /admin
//   if (req.nextUrl.pathname.startsWith("/admin")) {
//     auth().protect();
//   }

//   return NextResponse.next();
// });

// // Middleware configuration
// export const config = {
//   matcher: ["/admin/:path*", "/api/:path*", "/trpc/:path*"], // Match all admin routes and API/trpc routes
// };
