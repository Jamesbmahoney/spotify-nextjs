import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // if user logged in, token will exist
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL_URL,
  });

  // this grabs the url, from which it is coming
  const { pathname } = req.nextUrl;

  // if user is already signedin, but goes to login page, redirect to home page
  if (token && pathname === "/login") {
    return NextResponse.redirect("/");
  }

  //if user wants to sign in
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  //redirect to login if there is no token, and are requesting a protected route
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
