import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // ดึงจำนวนผู้ใช้งานทั้งหมด
    const userResult = await query("SELECT COUNT(*) as total FROM users");
    const totalUsers = userResult[0]?.total || 0;

    // ดึงจำนวนเรซูเม่ทั้งหมดที่ถูกสร้างขึ้น
    const resumeResult = await query("SELECT COUNT(*) as total FROM resumes");
    const totalResumes = resumeResult[0]?.total || 0;

    return NextResponse.json({
      totalUsers,
      totalResumes,
    }, { status: 200 });
  } catch (error) {
    console.error("Public Stats API Error:", error);
    return NextResponse.json({ totalUsers: 0, totalResumes: 0 }, { status: 500 });
  }
}
