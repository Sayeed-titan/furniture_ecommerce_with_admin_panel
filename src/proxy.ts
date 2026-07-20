import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const userType = (req.auth?.user as { userType?: string } | undefined)?.userType;

  if (pathname.startsWith("/admin")) {
    const isLoggedInAsAdmin = userType === "admin";
    const isLoginPage = pathname === "/admin/login";

    if (!isLoggedInAsAdmin && !isLoginPage) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoggedInAsAdmin && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/account")) {
    const isLoggedInAsCustomer = userType === "customer";
    const isAuthPage = pathname === "/account/login" || pathname === "/account/register";

    if (!isLoggedInAsCustomer && !isAuthPage) {
      const loginUrl = new URL("/account/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoggedInAsCustomer && isAuthPage) {
      return NextResponse.redirect(new URL("/account", req.nextUrl.origin));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
