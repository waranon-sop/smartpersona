import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function DELETE(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    // ลบ resume โดยเช็คสิทธิ์ว่าเป็นของ user นี้จริง
    const result = await query(
      "DELETE FROM resumes WHERE id = ? AND user_id = ?",
      [id, user.id]
    );

    // SQL ของเรามี ON DELETE CASCADE อยู่แล้วที่ resume_content ดังนั้นไม่ต้องลบแยก
    
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
