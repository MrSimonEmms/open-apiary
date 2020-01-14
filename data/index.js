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
  const files = glob(src, {
    sort: false,
  })
    .sort((a, b) => {
      /* Always put link tables to end - assume they've got keys */
      if (a.includes('link_')) {
        return 1;
      } else if (b.includes('link_')) {
        return -1;
      } else if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      }

      return 0;
    });

  await Promise.all(files.map(async (file) => {
    /* First, get the data */
    const items = require(file);

    const name = path.basename(path.basename(file, '.js'), '.json');

    const { meta = {}, data = items } = items;

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
      if (!item.createdAt && meta.created !== false) {
        item.createdAt = now;
      }
      if (!item.updatedAt && meta.updated !== false) {
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
