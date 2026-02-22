import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Only ADMIN can access user management
    if (pathname.startsWith("/admin/users") && !isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/users") || pathname.startsWith("/api/frms/categories")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/users/:path*", "/api/frms/categories/:path*"],
};
