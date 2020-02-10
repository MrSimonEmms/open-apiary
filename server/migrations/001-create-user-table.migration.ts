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
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'name',
        type: 'varchar',
        width: 200,
      }, {
        name: 'emailAddress',
        type: 'varchar',
        width: 200,
        isUnique: true,
      }, {
        name: 'password',
        type: 'varchar',
        width: 200,
      }, {
        name: 'changeOnLogin',
        type: 'tinyint',
      }, {
        name: 'createdAt',
        type: 'datetime',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
      }, {
        name: 'updatedAt',
        type: 'datetime',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
      }],
    }), true);
  }

  async down(queryRunner: QueryRunner) : Promise<any> {
    await queryRunner.dropTable(('user'));
  }
}
