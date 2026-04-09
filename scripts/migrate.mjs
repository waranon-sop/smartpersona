import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function migrate() {
  console.log("🚀 Starting Database Migration (Adding missing columns)...");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'smartpersona_db',
  });

  const addColumnIfMissing = async (tableName, columnName, columnDef, afterColumn) => {
    console.log(`Checking column '${columnName}' in table '${tableName}'...`);
    
    // Check if column exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = ? 
        AND COLUMN_NAME = ?
    `, [process.env.DB_NAME || 'smartpersona_db', tableName, columnName]);

    if (columns.length === 0) {
      console.log(`Adding column '${columnName}'...`);
      await connection.query(`
        ALTER TABLE ${tableName} 
        ADD COLUMN ${columnName} ${columnDef} AFTER ${afterColumn}
      `);
      console.log(`✅ Column '${columnName}' added.`);
    } else {
      console.log(`ℹ️ Column '${columnName}' already exists.`);
    }
  };

  try {
    await addColumnIfMissing('resume_content', 'languages', 'JSON DEFAULT NULL', 'skills');
    await addColumnIfMissing('resume_content', 'certifications', 'JSON DEFAULT NULL', 'languages');
    await addColumnIfMissing('resume_content', 'projects', 'JSON DEFAULT NULL', 'certifications');

    console.log("\n✨ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
  } finally {
    await connection.end();
  }
}

migrate();
