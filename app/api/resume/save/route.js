import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/session";
import { addNotification } from "@/app/admin/actions/notificationActions";

// POST /api/resume/save — บันทึก resume ใหม่ หรืออัปเดตถ้ามี resume_id แล้ว
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = user.id;

  try {
    const body = await request.json();
    const { resumeId, data } = body; // data is the context object

    const { config, personal, educations, experiences, summary, skills, languages, certifications, projects } = data;
    const template = config?.template || "classic";
    const title = personal?.firstName
      ? `${personal.firstName} ${personal.lastName || ""}`.trim() + " Resume"
      : "My Resume";

    if (resumeId) {
      // ===== UPDATE resume ที่มีอยู่แล้ว =====
      const updateRes = await query(
        "UPDATE resumes SET title = ?, template = ? WHERE id = ? AND user_id = ?",
        [title, template, resumeId, userId]
      );

      // Security Check: ป้องกันการแอบอัปเดต resume_content ของคนอื่น
      if (updateRes.affectedRows === 0) {
        return NextResponse.json({ message: "Forbidden: You don't own this resume" }, { status: 403 });
      }

      await query(
        `UPDATE resume_content 
         SET config = ?, personal = ?, education = ?, experience = ?, summary = ?, skills = ?, languages = ?, certifications = ?, projects = ?
         WHERE resume_id = ?`,
        [
          JSON.stringify(config),
          JSON.stringify(personal),
          JSON.stringify(educations),
          JSON.stringify(experiences),
          JSON.stringify(summary),
          JSON.stringify(skills),
          JSON.stringify(languages || []),
          JSON.stringify(certifications || []),
          JSON.stringify(projects || []),
          resumeId,
        ]
      );

      return NextResponse.json({ message: "Saved", resumeId }, { status: 200 });
    } else {
      // ===== INSERT resume ใหม่ =====
      const newId = uuidv4();

      await query(
        "INSERT INTO resumes (id, user_id, title, template, status) VALUES (?, ?, ?, ?, 'Draft')",
        [newId, userId, title, template]
      );

      await query(
        `INSERT INTO resume_content (resume_id, config, personal, education, experience, summary, skills, languages, certifications, projects)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newId,
          JSON.stringify(config),
          JSON.stringify(personal),
          JSON.stringify(educations),
          JSON.stringify(experiences),
          JSON.stringify(summary),
          JSON.stringify(skills),
          JSON.stringify(languages || []),
          JSON.stringify(certifications || []),
          JSON.stringify(projects || []),
        ]
      );

      // ✅ Trigger Admin Notification
      await addNotification(`มีการสร้างเรซูเม่ใหม่: ${title}`, "resume", `/admin/resumes/${newId}`);

      return NextResponse.json(
        { message: "Created", resumeId: newId },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Save Resume Error Detailed:", {
      message: error.message,
      stack: error.stack,
      userId: user?.id,
      resumeId: resumeId
    });
    return NextResponse.json({ message: "Server Error", detail: error.message }, { status: 500 });
  }
}
