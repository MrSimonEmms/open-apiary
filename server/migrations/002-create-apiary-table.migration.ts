/**
 * 002-create-apiary-table.migration
 */

/* Node modules */

/* Third-party modules */
import {
  QueryRunner,
  MigrationInterface,
  Table,
} from 'typeorm';

/* Files */

export default class CreateApiaryTable1578955798961 implements MigrationInterface {
  async up(queryRunner: QueryRunner) : Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'apiary',
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
    await queryRunner.dropTable('apiary');
  }
}
