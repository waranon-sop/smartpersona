import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Next.js Middleware / Proxy
 * รับหน้าที่ด่านหน้า (Firewall) ตรวจสอบและสกัดกั้นการเข้าใช้งาน Page/API เส้นทางสำคัญ
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Only apply to /admin, /create, /api/admin, and /auth
  const isAuthRoute = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  const isApiRoute = pathname.startsWith("/api/admin");

  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/create") &&
    !isApiRoute &&
    !isAuthRoute
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("token")?.value;

  // --------- จัดการส่วนคนยังไม่ล็อกอิน ---------
  if (!cookie) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // ถ้าตั้งใจมาหน้า Auth อยู่แล้ว ปล่อยผ่าน
    if (isAuthRoute) {
      return NextResponse.next();
    }
    // เข้าหน้าอื่นแต่ยังไม่ล็อกอิน ให้ดีดไปหน้า Login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --------- จัดการส่วนคนล็อกอินแล้ว ---------
  let payload;
  try {
    // 2. Verify Token using jose (Edge-compatible)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: decodedPayload } = await jwtVerify(cookie, secret);
    payload = decodedPayload;
  } catch (err) {
    console.error("JWT Verify Error in Middleware:", err.message);
    if (isApiRoute) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    if (isAuthRoute) return NextResponse.next();
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = payload.role?.toLowerCase() || 'user';

  // 3. ถ้าล็อกอินแล้วและจะพยายามเข้าหน้า Auth อีก ให้ดีดกลับไป Dashboard
  if (isAuthRoute) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/create/dashboard", request.url));
  }

  // 4. Admin Route Protection: Must have 'admin' role
  if (pathname.startsWith("/admin") || isApiRoute) {
    if (userRole !== "admin") {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
      }
      // Redirect regular users to their dashboard if they try to access /admin
      const dashboardUrl = new URL("/create/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 5. Create Route Protection: Admin can't access user side 
  if (pathname.startsWith("/create")) {
    if (userRole === "admin") {
      // Redirect Admins to the admin area if they try to access /create
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/create/:path*", "/api/admin/:path*", "/auth/:path*"],
};
