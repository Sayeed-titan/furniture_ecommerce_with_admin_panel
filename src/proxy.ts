import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const authUser = req.auth?.user as { userType?: string; roleId?: string } | undefined;
  const userType = authUser?.userType;

  if (pathname.startsWith("/admin")) {
    // roleId matters as much as userType: a session minted before roles existed
    // carries userType but no roleId, and the page-level guard rejects those.
    // Without checking it here too, the two layers disagree and bounce the user
    // between /admin and /admin/login forever.
    const isLoggedInAsAdmin = userType === "admin" && Boolean(authUser?.roleId);
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
    const isAuthPage =
      pathname === "/account/login" ||
      pathname === "/account/register" ||
      pathname === "/account/forgot-password" ||
      pathname.startsWith("/account/reset-password/");

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
