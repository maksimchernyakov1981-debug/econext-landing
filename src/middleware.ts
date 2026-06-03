import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type AdminSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin") return NextResponse.next();

  const res = NextResponse.next();
  const session = await getIronSession<AdminSession>(request, res, sessionOptions);
  if (!session.isLoggedIn) {
    const login = new URL("/admin", request.url);
    return NextResponse.redirect(login);
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
