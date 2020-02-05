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

/* Files */

async function getConnection() {
  const driver = (process.env.DB_TYPE || 'mysql').toLowerCase();

  // eslint-disable-next-line global-require,import/no-dynamic-require
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
      console.log(`No data in ${name} - skipping`);
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

      console.log(`Inserted ${inserts} row(s) to ${name}`);
    } catch (err) {
      console.log('Error - backing out');

      try {
        await connection.truncate(name);
      } catch (trunErr) {
        console.log('Erroring backing out');
        console.log(trunErr);
      }

      throw err;
    }
  }), Promise.resolve());

  await connection.close();
}

const maxTries = Number(process.env.MAX_TRIES || 1);
const timeout = Number(process.env.TIMEOUT || 1000);
const tasks = [];

/* If using docker, let that handle this */
for (let attempt = 1; attempt <= maxTries; attempt += 1) {
  tasks.push(async () => {
    console.log(`Attempt number ${attempt}`);

    try {
      await main();

      console.log(`Successfully executed on attempt ${attempt}`);
      process.exit();
    } catch (err) {
      console.log(`Attempt ${attempt} failed`);
      console.log(err.stack);

      if (attempt < maxTries) {
        const delay = timeout * attempt;

        console.log(`Retrying in ${delay / 1000} second(s)...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return;
      }

      console.log('No retries left');
      throw err;
    }
  });
}

tasks.reduce((thenable, task) => thenable.then(() => task()), Promise.resolve())
  .catch(() => {
    process.exit(1);
  });
