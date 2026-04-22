import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Next.js Middleware / Proxy (Firewall)
 * จัดการสิทธิ์การเข้าถึง และตรวจสอบ Maintenance Mode (Lockdown)
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. SKIP: paths ที่ไม่ต้องตรวจอะไรเลย (Static, Favicon, Maintenance Page)
  const skipAlways = [
    "/maintenance",
    "/_next",
    "/favicon.ico",
    "/api/settings/maintenance", // API สำคัญที่หน้า maintenance ต้องใช้
    "/api/settings/public",
  ];

  if (skipAlways.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 2. ตรวจสอบ Token เพื่อระบุ Role
  const token = request.cookies.get("token")?.value;
  let userRole = null;
  let userId = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      userRole = payload.role?.toLowerCase();
      userId = payload.id;
    } catch (err) {
      // Token เสียหรือหมดอายุ
    }
  }

  const isAdmin = userRole === "admin";

  // 3. ตรวจสอบ Maintenance Mode (Lockdown)
  // ถ้าไม่ใช่ Admin ให้เช็คสถานะระบบ
  if (!isAdmin) {
    // ยกเว้นหน้า Login และ API บางส่วนเพื่อให้ Admin ยังเข้าทำงานได้
    const allowDuringMaintenance = [
      "/auth/login",
      "/api/auth/login",
      "/api/auth/verify",
    ];

    if (!allowDuringMaintenance.some(p => pathname.startsWith(p))) {
      try {
        const baseUrl = request.nextUrl.origin;
        const res = await fetch(`${baseUrl}/api/settings/maintenance`, {
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.maintenance === true) {
            // Redirect non-admin users to maintenance page
            return NextResponse.redirect(new URL("/maintenance", request.url));
          }
        }
      } catch (error) {
        console.error("Maintenance check failed in proxy:", error);
      }
    }
  }

  // 4. จัดการสิทธิ์การเข้าถึง (Original Proxy Logic)
  const isAuthRoute = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  const isApiAdminRoute = pathname.startsWith("/api/admin");

  // ถ้าล็อกอินแล้วจะเข้าหน้า Login/Register ให้ดีดออก
  if (token && isAuthRoute) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/create/dashboard", request.url));
  }

  // ป้องกันหน้า /admin และ /api/admin
  if (pathname.startsWith("/admin") || isApiAdminRoute) {
    if (!isAdmin) {
      if (isApiAdminRoute) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/auth/login?from=" + pathname, request.url));
    }
  }

  // ป้องกันหน้า /create (ให้เฉพาะ User ทั่วไปเข้า)
  if (pathname.startsWith("/create")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?from=" + pathname, request.url));
    }
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
