const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'smartpersona_db'
  });

  console.log('Migrating resume_content table...');

  try {
    // 1. Drop foreign key constraint
    await connection.execute("ALTER TABLE resume_content DROP FOREIGN KEY resume_content_ibfk_1");
    // 2. Modify id to remove auto_increment
    await connection.execute("ALTER TABLE resume_content MODIFY id int NOT NULL");
    // 3. Drop primary key
    await connection.execute("ALTER TABLE resume_content DROP PRIMARY KEY");
    // 4. Drop id column
    await connection.execute("ALTER TABLE resume_content DROP COLUMN id");
    // 5. Drop old index
    await connection.execute("ALTER TABLE resume_content DROP INDEX resume_id");
    // 6. Add primary key
    await connection.execute("ALTER TABLE resume_content ADD PRIMARY KEY (resume_id)");
    // 7. Re-add foreign key
    await connection.execute("ALTER TABLE resume_content ADD CONSTRAINT resume_content_ibfk_1 FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE CASCADE");

    console.log('Migration successful!');
  } catch (e) {
    console.error('Migration failed:', e);
  }

  await connection.end();
}

run();
