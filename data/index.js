/**
 * index
 *
 * This stubs the data for testing/development. It doesn't
 * set the table structure as that's handled by the application.
 */

/* Node modules */
const path = require('path');

/* Third-party modules */
const { sync: glob } = require('glob');
const mysql = require('mysql2/promise');

/* Files */

async function getConnection() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
  });

  /* Do a dummy query to check connection ok */
  await db.query('SELECT 1 + 1');

  return db;
}

async function main() {
  const connection = await getConnection();

  const src = path.join(__dirname, 'data', '**', '*.{js,json}');
  const files = glob(src);

  await Promise.all(files.map(async (file) => {
    /* First, get the data */
    const data = require(file);

    const name = path.basename(path.basename(file, '.js'), '.json');

    if (!Array.isArray(data)) {
      throw new Error(`Data not an array: ${name}`);
    }

    if (data.length === 0) {
      console.log(`No data in ${name} - skipping`);
      return;
    }

    /* Clear out any existing data */
    await connection.query(`TRUNCATE TABLE ${name}`);

    const parsedData = data.map(item => {
      const now = new Date();
      if (!item.createdAt) {
        item.createdAt = now;
      }
      if (!item.updatedAt) {
        item.updatedAt = now;
      }

      return item;
    });

    const columns = Object.keys(parsedData[0]).join(', ');
    const sql = `INSERT INTO ${name} (${columns}) VALUES ?`;

    const values = parsedData.map(item => Object.values(item));

    await connection.query(sql, [
      values,
    ]);

    console.log(`Inserted ${values.length} row(s) to ${name}`);
  }));

  await connection.close();
}

main()
  .catch(err => {
    console.log(err.stack);
    process.exit(1);
  });
