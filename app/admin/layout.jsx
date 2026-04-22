import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUnreadNotifications } from './actions/notificationActions';
import { getSettings } from './actions/adminActions';
import AdminLayoutClient from "./AdminLayoutClient";

/**
 * Admin Layout (Server Side Protection)
 * ใช้ตรวจสอบสิทธิ์แทน Middleware สำหรับเส้นทาง /admin
 */
export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?from=/admin");
  }

  // เฉพาะ Admin เท่านั้นที่เข้าได้
  if (user.role?.toLowerCase() !== "admin") {
    redirect("/create/dashboard");
  }

  const initialNotifications = await getUnreadNotifications();
  const settings = await getSettings();
  const siteName = settings.site_name || "SmartPersona";

  return <AdminLayoutClient user={user} initialNotifications={initialNotifications} siteName={siteName}>{children}</AdminLayoutClient>;
}
