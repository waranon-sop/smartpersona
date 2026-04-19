"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Ensures the notifications table exists.
 */
async function initNotificationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message VARCHAR(255) NOT NULL,
      type VARCHAR(50) DEFAULT 'system',
      link VARCHAR(255) DEFAULT '#',
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Adds a new notification to the database.
 * Used internally by API routes to notify admins.
 */
export async function addNotification(message, type = 'system', link = '#') {
  try {
    await initNotificationsTable();
    await pool.query(
      "INSERT INTO notifications (message, type, link) VALUES (?, ?, ?)",
      [message, type, link]
    );
    // Optionally trigger a revalidate if we want to update admin layout statically
    // But typically real-time dashboards fetch this on mount or via polling.
    // revalidatePath('/admin', 'layout'); 
  } catch (error) {
    console.error("Failed to add notification:", error);
  }
}

/**
 * Retrieves all unread notifications, limited to the most recent 20.
 */
export async function getUnreadNotifications() {
  try {
    await initNotificationsTable();
    const [rows] = await pool.query(
      "SELECT * FROM notifications WHERE is_read = false ORDER BY created_at DESC LIMIT 20"
    );
    
    // We must serialize the dates from DB (which can be Date objects) into strings for Next.js Server Components.
    return rows.map(r => ({
      ...r,
      created_at: new Date(r.created_at).toISOString()
    }));
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return [];
  }
}

/**
 * Marks all notifications as read.
 */
export async function markAllAsRead() {
  try {
    await pool.query("UPDATE notifications SET is_read = true WHERE is_read = false");
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return { success: false };
  }
}
