import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import CreateLayoutClient from "./CreateLayoutClient";

/**
 * Create Layout (Server Side Protection)
 * ใช้ตรวจสอบสิทธิ์แทน Middleware สำหรับเส้นทาง /create
 */
export default async function CreateLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?from=/create");
  }

  // ห้าม Admin เข้ามาส่วนของผู้ใช้ (ความต้องการเดิมใน proxy.js)
  if (user.role?.toLowerCase() === "admin") {
    redirect("/admin");
  }

  return <CreateLayoutClient>{children}</CreateLayoutClient>;
}
