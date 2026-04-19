"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

// User Actions
import { redirect } from "next/navigation";

import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/session";

export async function incrementResumeView(id) {
  try {
    const user = await getCurrentUser();
    // Real Usage Logic: Only increment if NOT an admin
    if (user?.role?.toLowerCase() === "admin")
      return { success: false, reason: "admin_ignore" };

    await pool.query("UPDATE resumes SET views = views + 1 WHERE id = ?", [id]);
    revalidatePath("/admin/resumes");
    return { success: true };
  } catch (error) {
    console.error("Failed to increment views:", error);
    return { success: false };
  }
}

export async function incrementResumeDownload(id) {
  try {
    const user = await getCurrentUser();
    // Real Usage Logic: Only increment if NOT an admin
    if (user?.role?.toLowerCase() === "admin")
      return { success: false, reason: "admin_ignore" };

    await pool.query(
      "UPDATE resumes SET downloads = downloads + 1 WHERE id = ?",
      [id],
    );
    revalidatePath("/admin/resumes");
    return { success: true };
  } catch (error) {
    console.error("Failed to increment downloads:", error);
    return { success: false };
  }
}

export async function createUser(formData) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role?.toLowerCase() !== "admin")
    throw new Error("Unauthorized");

  const name = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const status = formData.get("status");

  try {
    // Basic validation
    if (!name || !email || !password)
      throw new Error("username, email and password are required");
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(email)) throw new Error("Invalid email format");
    if (String(password).length < 8)
      throw new Error("Password must be at least 8 characters");
    const allowedRoles = ["admin", "user", "Admin", "User"];
    const allowedStatus = ["Active", "Inactive", "Suspended"];
    if (role && !allowedRoles.includes(role)) throw new Error("Invalid role");
    if (status && !allowedStatus.includes(status))
      throw new Error("Invalid status");
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, status],
    );
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error(error.message || "Failed to create user");
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?success=User+created+successfully");
}

export async function updateUser(id, formData) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role?.toLowerCase() !== "admin")
    throw new Error("Unauthorized");

  const name = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const status = formData.get("status");

  try {
    // Basic validation
    const emailRe = /^\S+@\S+\.\S+$/;
    if (email && !emailRe.test(email)) throw new Error("Invalid email format");
    const allowedRoles = ["admin", "user", "Admin", "User"];
    const allowedStatus = ["Active", "Inactive", "Suspended"];
    if (role && !allowedRoles.includes(role)) throw new Error("Invalid role");
    if (status && !allowedStatus.includes(status))
      throw new Error("Invalid status");

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE users SET name = ?, email = ?, password = ?, role = ?, status = ? WHERE id = ?",
        [name, email, hashedPassword, role, status, id],
      );
    } else {
      await pool.query(
        "UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?",
        [name, email, role, status, id],
      );
    }
  } catch (error) {
    console.error("Failed to update user:", error);
    throw new Error(error.message || "Failed to update user");
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?success=User+updated+successfully");
}

export async function deleteUser(id) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role?.toLowerCase() !== "admin")
    throw new Error("Unauthorized");

  let isSuccess = false;
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    isSuccess = true;
  } catch (error) {
    console.error("Failed to delete user:", error);
  }

  if (isSuccess) {
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    redirect("/admin/users?success=User+deleted+successfully&t=" + Date.now());
  } else {
    redirect("/admin/users?error=Failed+to+delete+user");
  }
}

export async function updateUserStatus(id, newStatus) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role?.toLowerCase() !== "admin")
    throw new Error("Unauthorized");

  let isSuccess = false;
  try {
    await pool.query("UPDATE users SET status = ? WHERE id = ?", [
      newStatus,
      id,
    ]);
    isSuccess = true;
  } catch (error) {
    console.error("Failed to update status:", error);
  }

  if (isSuccess) {
    revalidatePath("/admin/users");
    redirect("/admin/users?success=Status+updated");
  }
}

// Resume Actions
export async function deleteResume(id) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role?.toLowerCase() !== "admin")
    throw new Error("Unauthorized");

  let isSuccess = false;
  try {
    await pool.query("DELETE FROM resumes WHERE id = ?", [id]);
    isSuccess = true;
  } catch (error) {
    console.error("Failed to delete resume:", error);
  }

  if (isSuccess) {
    revalidatePath("/admin/resumes");
    revalidatePath("/admin");
    redirect("/admin/resumes?success=Resume+deleted+successfully&t=" + Date.now());
  } else {
    redirect("/admin/resumes?error=Failed+to+delete+resume");
  }
}

// Settings Actions
export async function getSettings() {
  const currentUser = await getCurrentUser();
  if (currentUser?.role?.toLowerCase() !== "admin") return {};

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT
      )
    `);
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM settings",
    );
    const settings = rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});
    return settings;
  } catch (error) {
    console.error("Failed to get settings:", error);
    return {};
  }
}

export async function updateSettings(formData) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role?.toLowerCase() !== "admin")
    throw new Error("Unauthorized");

  const site_name = formData.get("site_name");
  const contact_email = formData.get("contact_email");
  const site_description = formData.get("site_description");
  const allow_registration =
    formData.get("allow_registration") === "on" ? "true" : "false";
  const maintenance_mode = 
    formData.get("maintenance_mode") === "on" ? "true" : "false";

  try {
    const settingsToSave = [
      ["site_name", site_name],
      ["contact_email", contact_email],
      ["site_description", site_description],
      ["allow_registration", allow_registration],
      ["maintenance_mode", maintenance_mode],
    ];

    // Basic validation
    const emailRe = /^\S+@\S+\.\S+$/;
    if (contact_email && !emailRe.test(contact_email))
      throw new Error("Invalid supportEmail");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT
      )
    `);

    for (const [key, val] of settingsToSave) {
      if (val !== null && val !== undefined) {
        await pool.query(
          "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
          [key, val, val],
        );
      }
    }
  } catch (error) {
    console.error("Failed to update settings:", error);
    throw new Error("Failed to save settings: " + error.message);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  redirect("/admin/settings?success=Settings+saved+successfully");
}

export async function toggleQuickSetting(key, stringValue) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role?.toLowerCase() !== "admin")
    throw new Error("Unauthorized");

  const allowedKeys = ["allow_registration", "maintenance_mode"];
  if (!allowedKeys.includes(key)) throw new Error("Invalid setting key");

  try {
    await pool.query(
      "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      [key, stringValue, stringValue]
    );
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle quick setting", error);
    return { success: false, error: error.message };
  }
}

export async function performLockdown() {
  const currentUser = await getCurrentUser();
  if (currentUser?.role?.toLowerCase() !== "admin")
    throw new Error("Unauthorized");

  try {
    // Soft Lockdown: Maintenance Mode ON, Registration OFF
    await pool.query(
      "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      ["maintenance_mode", "true", "true"]
    );
    await pool.query(
      "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      ["allow_registration", "false", "false"]
    );
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to lockdown", error);
    return { success: false, error: error.message };
  }
}
