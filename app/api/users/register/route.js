import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { addNotification } from "@/app/admin/actions/notificationActions";

export async function POST(request) {
  try {
    // ✅ FIX: ไม่รับ roleId จาก client (กำหนด default ที่ server เท่านั้น)
    const body = await request.json();
    console.log("Register Request Body:", body);
    const { username, email, password } = body;

    if (!username || !email || !password) {
      console.log("Missing fields:", { username: !!username, email: !!email, password: !!password });
      return NextResponse.json(
        { message: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    // Check if registration is locked
    const settings = await query("SELECT setting_value FROM settings WHERE setting_key = 'allow_registration'");
    
    // Logic: If allow_registration is NOT 'true', then it's locked.
    // The previous logic was inverted and had a destructuring bug.
    if (!settings || settings.length === 0 || settings[0].setting_value !== "true") {
      return NextResponse.json(
        { message: "การสมัครสมาชิกถูกระงับชั่วคราวโดยผู้ดูแลระบบ" },
        { status: 403 },
      );
    }

    if (password.length < 6) {
      console.log("Password too short:", password.length);
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    // ✅ Map username to name column, use built-in 'User' enum role
    const result = await query(sql, [username, email, hashPassword, 'User']);
    const userId = result.insertId;

    if (userId) {
      const emailSql = "INSERT INTO user_emails (user_id, email, is_primary) VALUES (?, ?, ?)";
      await query(emailSql, [userId, email, true]);

      // ✅ Trigger Admin Notification
      await addNotification(`มีผู้สมัครสมาชิกใหม่: ${username}`, "user", "/admin/users");
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    // ✅ FIX: แยก duplicate entry ออกจาก server error
    if (error.code === "ER_DUP_ENTRY") {
      const isEmail = error.message.includes(email);
      return NextResponse.json(
        { message: isEmail ? "อีเมลนี้ถูกใช้งานแล้ว" : "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" },
        { status: 409 },
      );
    }
    console.error("Register Error Detailed:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง" }, { status: 500 });
  }
}
