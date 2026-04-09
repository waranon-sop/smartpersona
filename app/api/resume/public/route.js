import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized: Please login to view this resume" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json({ message: "Resume ID is required" }, { status: 400 });
    }

    // ดึงข้อมูล Resume โดยไม่ต้องกรองด้วย user_id เพราะเป็นลิงก์แบบ Public
    const sql = `
      SELECT r.id, r.title, r.template, 
             c.config, c.personal, c.education, c.experience, c.summary, c.skills
      FROM resumes r
      LEFT JOIN resume_content c ON r.id = c.resume_id
      WHERE r.id = ?
    `;
    const results = await query(sql, [resumeId]);

    if (results.length === 0) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    const row = results[0];
    
    // แปลง JSON string เป็น Object ตามที่ออกแบบไว้
    const data = {
      config: typeof row.config === "string" ? JSON.parse(row.config) : row.config || { template: row.template || "classic" },
      personal: typeof row.personal === "string" ? JSON.parse(row.personal) : row.personal || {},
      education: typeof row.education === "string" ? JSON.parse(row.education) : row.education || null,
      experience: typeof row.experience === "string" ? JSON.parse(row.experience) : row.experience || null,
      experiences: typeof row.experience === "string" ? JSON.parse(row.experience) : row.experiences || null, 
      summary: typeof row.summary === "string" ? JSON.parse(row.summary) : row.summary || {},
      skills: typeof row.skills === "string" ? JSON.parse(row.skills) : row.skills || {}
    };

    // ส่ง data เปล่าๆ ออกมา เพื่อให้พร้อมใช้วาดในหน้าบ้าน
    return NextResponse.json({ data, resumeId: row.id, title: row.title }, { status: 200 });
  } catch (error) {
    console.error("Public Resume Load Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
