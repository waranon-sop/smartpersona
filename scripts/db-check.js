const { query } = require("../lib/db");

async function check() {
  console.log("=== Database Connection & Status Check ===");
  try {
    // Check Database Version / Status
    const status = await query("SHOW VARIABLES LIKE 'max_allowed_packet'");
    console.log("Database Config:", status);

    // Check Users
    const users = await query("SELECT id, name, email, role FROM users");
    console.log("\nUsers in System:", users.length);
    console.table(users);
    
    // Check Resumes
    const resumes = await query("SELECT id, user_id, title, status FROM resumes");
    console.log("\nResumes in System:", resumes.length);
    console.table(resumes);

  } catch (err) {
    console.error("Error during database check:", err.message);
  } finally {
    process.exit();
  }
}

check();
