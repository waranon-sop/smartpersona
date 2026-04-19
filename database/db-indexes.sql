-- ====================================================
-- SmartPersona - DB Performance Indexes
-- รัน script นี้ใน MySQL เพื่อเพิ่มความเร็ว query
-- ====================================================

USE smartpersona_db;

-- users table: index สำหรับ query ที่ใช้บ่อย
CREATE INDEX IF NOT EXISTS idx_users_created_at
  ON users (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_role
  ON users (role);

CREATE INDEX IF NOT EXISTS idx_users_status
  ON users (status);

-- index รวม (composite) สำหรับ filter + sort
CREATE INDEX IF NOT EXISTS idx_users_role_status
  ON users (role, status);

-- resumes table: index สำหรับ query ที่ใช้บ่อย
CREATE INDEX IF NOT EXISTS idx_resumes_user_id
  ON resumes (user_id);

CREATE INDEX IF NOT EXISTS idx_resumes_created_at
  ON resumes (created_at DESC);

-- index รวมสำหรับ dashboard ที่ query user resumes
CREATE INDEX IF NOT EXISTS idx_resumes_user_created
  ON resumes (user_id, created_at DESC);

-- ตรวจสอบ indexes ที่สร้าง
SHOW INDEX FROM users;
SHOW INDEX FROM resumes;
