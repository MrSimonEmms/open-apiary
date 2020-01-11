/**
 * typeorm
 *
 * This is only meant as a helper for development. It converts
 * the config into a typeorm friendly config and executes the
 * command provided
 */

/* Node modules */
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/* Third-party modules */
const mkdirp = require('mkdirp');

/* Files */

const cmd = process.argv.slice(2);
const baseDir = path.join(__dirname, '..', 'server');

async function main() {
  const connection = {
    name: 'default',
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    entities: [
      path.join(baseDir, '**', '*.entity{.ts,.js}'),
    ],
    migrations: [
      path.join(baseDir, '**', '*.migration{.ts,.js}'),
    ],
  };

  /* Write the config to a file */
  const configDir = path.join(baseDir, '..', 'tmp');
  mkdirp.sync(configDir);

  const configFile = path.join(baseDir, '..', 'tmp', 'connection.json');

  await fs.promises.writeFile(configFile, JSON.stringify(connection, null, 2), 'utf8');

  const tsNode = path.join(baseDir, '..', 'node_modules', '.bin', 'ts-node');
  const target = path.join(baseDir, '..', 'node_modules', '.bin', 'typeorm');

  exec(`${tsNode} -P ./server/tsconfig.json ${target} ${cmd.join(' ')} --config="tmp/connection.json"`, {}, (err, stdout, stderr) => {
    if (err) {
      throw err;
    }
    if (stderr) {
      throw stderr;
    }

    console.log(stdout);
  });
}

main()
  .catch(err => {
    console.log(err.stack);
    process.exit(1);
  });
