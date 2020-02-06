/**
 * sqlite
 */

/* Node modules */

/* Third-party modules */
const sqlite3 = require('sqlite3').verbose();

/* Files */

module.exports = class SQLite {
  constructor() {
    this.opts = {
      database: process.env.DB_NAME,
    };
    this.db = new sqlite3.Database(this.opts.database);
  }

  async auth() {
    await this.execQuery('SELECT 1 + 1');
  }

  async close() {
    await this.db.close();
  }

  execQuery (sql) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        console.log(sql);
        this.db.get(sql, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(result);
        });
      });
    });
  }

  async insertBulk(table, data) {
    const columns = Object.keys(data[0]);

    const cols = columns
      .map((item) => `\`${item}\``)
      .join(', ');

    const sql = `INSERT INTO ${table} (${cols}) VALUES (${columns.map(() => '?').join(', ')})`;
    const values = data.map((item) => Object.values(item));

    const tasks = values.map((params) => new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const insert = params.map(param => {
          if (param instanceof Date) {
            return param.toISOString();
          }

          return param;
        });

        this.db.run(sql, insert, (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      });
    }));

    await Promise.all(tasks);

    return values.length;
  }

  async truncate(table) {
    await this.execQuery(`DELETE FROM ${table}`);
  }
};
