/**
 * editPackageJson
 *
 * This started because of the need to get rid of the
 * patch-package post-install script. Also decided to
 * tidy a few things up to make it easier to read for
 * novice users.
 */

/* Node modules */
const { promises: fs } = require('fs');

/* Third-party modules */

/* Files */

async function main(pkgPath) {
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));

  /* Remove all scripts except "start" */
  const { start } = pkg.scripts;

  pkg.scripts = {
    start,
  };

  /* Remove */
  pkg.devDependencies = {};
  delete pkg.jest;

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
}

main(process.argv[2])
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  });
