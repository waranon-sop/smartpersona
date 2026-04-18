const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'smartpersona_db'
  });

  console.log('Connected to DB. Clearing base64 images...');

  const [result1] = await connection.execute(
    "UPDATE users SET profile_pic = NULL WHERE profile_pic LIKE 'data:image%'"
  );
  console.log(`Cleared ${result1.affectedRows} base64 images from users table.`);

  try {
    const [result2] = await connection.execute(
      `UPDATE resume_content 
       SET personal = JSON_REMOVE(personal, '$.profilePic') 
       WHERE JSON_UNQUOTE(JSON_EXTRACT(personal, '$.profilePic')) LIKE 'data:image%'`
    );
    console.log(`Cleared ${result2.affectedRows} base64 images from resume_content table.`);
  } catch (e) {
    console.log('Could not update resume_content:', e.message);
  }

  await connection.end();
}

run().catch(console.error);
