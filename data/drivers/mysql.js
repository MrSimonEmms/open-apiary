/**
 * mysql
 */

/* Node modules */

/* Third-party modules */
const mysql = require('mysql2/promise');

/* Files */

module.exports = class MySQL {
  constructor() {
    this.opts = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT || 3306)
    };
  }

  async auth() {
    this.db = await mysql.createConnection(this.opts);

    /* Do a dummy query to check connection ok */
    await this.db.query('SELECT 1 + 1');
  }

  async close() {
    await this.db.close();
  }

  async insertBulk(table, dataArr) {
    const columns = Object.keys(dataArr[0])
      .map((item) => `\`${item}\``)
      .join(', ');
    const sql = `INSERT INTO ${table} (${columns}) VALUES ?`;
    const values = dataArr.map((item) => Object.values(item));

    await this.db.query(sql, [
      values,
    ]);

    return values.length;
  }

  async truncate(table) {
    return this.db.query(`DELETE FROM ${table}`);
  }
};
