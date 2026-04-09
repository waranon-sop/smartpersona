import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sqlUser = "SELECT id, name, email, profile_pic FROM users WHERE id = ?";
    const users = await query(sqlUser, [user.id]);
    
    if (users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const sqlEmails = "SELECT id, email, is_primary FROM user_emails WHERE user_id = ? ORDER BY is_primary DESC";
    const emails = await query(sqlEmails, [user.id]);

    return NextResponse.json({
      user: users[0],
      emails: emails
    }, { status: 200 });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, profile_pic } = await request.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const sql = "UPDATE users SET name = ?, profile_pic = ? WHERE id = ?";
    await query(sql, [name, profile_pic, user.id]);

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Delete the user from the database. 
    // ON DELETE CASCADE will handle associated resumes, resume_content, and user_emails.
    const sql = "DELETE FROM users WHERE id = ?";
    await query(sql, [user.id]);

    // Import cookies dynamically to avoid next/headers issues in edge cases if possible, 
    // but standard import is fine for Next.js App Router API.
    const { cookies } = await import("next/headers");
    cookies().delete("token");

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Account Deletion Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
