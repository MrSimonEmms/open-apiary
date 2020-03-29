/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */
const main = require('./init');

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
