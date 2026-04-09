import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

/**
 * Resume Layout (Server Component)
 * ทำหน้าที่ตรวจสอบสิทธิ์ (Auth Check) เฉพาะหน้าแสดงผล Resume
 * เพื่อรองรับเงื่อนไข "บังคับ Login" โดยไม่ใช้ Middleware
 */
export default async function ResumePageLayout({ children, params }) {
  const user = await getCurrentUser();
  
  if (!user) {
    const { id } = await params;
    // ดีดไปหน้า Login พร้อมแนบ path เดิมไว้กลับมา
    redirect(`/auth/login?from=/resume/${id}`);
  }

  return <>{children}</>;
}
