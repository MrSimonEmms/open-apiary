/**
 * 001-create-user-table
 */

/* Node modules */

/* Third-party modules */
import { QueryRunner, MigrationInterface, Table } from 'typeorm';

/* Files */

export default class CreateUserTable1578524292325 implements MigrationInterface {
  async up(queryRunner: QueryRunner) : Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'user',
      columns: [{
        name: 'id',
        type: 'int',
        isPrimary: true,
      }, {
        name: 'name',
        type: 'varchar',
        width: 200,
      }, {
        name: 'emailAddress',
        type: 'varchar',
        width: 200,
      }, {
        name: 'password',
        type: 'varchar',
        width: 200,
      }, {
        name: 'createdAt',
        type: 'datetime',
      }, {
        name: 'updatedAt',
        type: 'datetime',
      }],
    }), true);
  }

  async down(queryRunner: QueryRunner) : Promise<any> {
    await queryRunner.dropTable(('user'));
  }
}
