const mysql = require('mysql2/promise');
const fs = require('fs');

async function dump() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'smartpersona_db'
    });

    console.log('-- SmartPersona Database Dump');
    console.log('CREATE DATABASE IF NOT EXISTS smartpersona_db;');
    console.log('USE smartpersona_db;');

    const [tables] = await connection.query('SHOW TABLES');
    for (const tableRow of tables) {
        const tableName = Object.values(tableRow)[0];
        
        // Structure
        const [[{ 'Create Table': createSql }]] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
        console.log(`\nDROP TABLE IF EXISTS \`${tableName}\`;\n${createSql};\n`);

        // Data
        const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
        if (rows.length > 0) {
            const columns = Object.keys(rows[0]).map(col => `\`${col}\``).join(', ');
            const values = rows.map(row => {
                const vals = Object.values(row).map(val => {
                    if (val === null) return 'NULL';
                    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                    if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
                    if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
                    return val;
                }).join(', ');
                return `(${vals})`;
            }).join(',\n');
            console.log(`INSERT INTO \`${tableName}\` (${columns}) VALUES\n${values};\n`);
        }
    }

    await connection.end();
}

dump().catch(err => {
    console.error(err);
    process.exit(1);
});
