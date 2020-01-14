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
const sqlite = require('sqlite3');

/* Files */

async function getConnection() {
  const driver = (process.env.DB_TYPE || 'mysql').toLowerCase();

  const Driver = require(`./drivers/${driver}`);

  const db = new Driver();

  await db.auth();

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
    await connection.truncate(name);

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

    const inserts = await connection.insertBulk(name, parsedData);

    console.log(`Inserted ${inserts} row(s) to ${name}`);
  }));

  await connection.close();
}

main()
  .catch(err => {
    console.log(err.stack);
    process.exit(1);
  });
