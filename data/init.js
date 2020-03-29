/**
 * init
 *
 * This stubs the data for testing/development. It doesn't
 * set the table structure as that's handled by the application.
 */

/* Node modules */
const path = require('path');

/* Third-party modules */
const { sync: glob } = require('glob');

/* Files */

async function getConnection() {
  let driver = (process.env.DB_TYPE || 'mysql').toLowerCase();

  if (driver === 'mariadb') {
    driver = 'mysql';
  }

  // eslint-disable-next-line global-require,import/no-dynamic-require
  const Driver = require(`./drivers/${driver}`);

  const db = new Driver();

  await db.auth();

  return db;
}

module.exports = async function main(log = true) {
  const connection = await getConnection();

  const src = path.join(__dirname, 'data', '**', '*.{js,json}');
  const files = glob(src, {
    sort: false,
  }).sort((a, b) => {
    /* Always put link tables to end - assume they've got keys */
    if (a.includes('link_')) {
      return 1;
    }
    if (b.includes('link_')) {
      return -1;
    }
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }

    return 0;
  });

  await files.reduce((thenable, file) => thenable.then(async () => {
    /* First, get the data */
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const items = require(file);

    const name = path.basename(path.basename(file, '.js'), '.json')
      .replace(/^(\d.*-)/, '');

    const { meta = {}, data = items } = items;

    if (!Array.isArray(data)) {
      throw new Error(`Data not an array: ${name}`);
    }

    if (data.length === 0) {
      if (log) {
        console.log(`No data in ${name} - skipping`);
      }
      return;
    }

    /* Clear out any existing data */
    await connection.truncate(name);

    const parsedData = data.map((item) => {
      const now = new Date();
      if (!item.createdAt && meta.created !== false) {
        // eslint-disable-next-line no-param-reassign
        item.createdAt = now;
      }
      if (!item.updatedAt && meta.updated !== false) {
        // eslint-disable-next-line no-param-reassign
        item.updatedAt = now;
      }

      return item;
    });

    try {
      const inserts = await connection.insertBulk(name, parsedData);

      if (log) {
        console.log(`Inserted ${inserts} row(s) to ${name}`);
      }
    } catch (err) {
      if (log) {
        console.log('Error - backing out');
      }

      try {
        await connection.truncate(name);
      } catch (trunErr) {
        if (log) {
          console.log('Erroring backing out');
          console.log(trunErr);
        }
      }

      throw err;
    }
  }), Promise.resolve());

  await connection.close();
};

module.exports.getConnection = () => getConnection();
