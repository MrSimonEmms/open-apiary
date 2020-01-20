/**
 * 002-create-apiary-table.migration
 */

/* Node modules */

/* Third-party modules */
import {
  QueryRunner,
  MigrationInterface,
  Table,
  TableForeignKey,
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

    await queryRunner.createTable(new Table({
      name: 'hive',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'uuid',
        type: 'varchar',
        width: 100,
      }, {
        name: 'establishedDate',
        type: 'date',
      }, {
        name: 'origin',
        type: 'text',
        isNullable: true,
      }, {
        name: 'apiaryId',
        type: 'integer',
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

    await queryRunner.createForeignKey('hive', new TableForeignKey({
      columnNames: [
        'apiaryId',
      ],
      referencedTableName: 'apiary',
      referencedColumnNames: [
        'id',
      ],
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }));
  }

  async down(queryRunner: QueryRunner) : Promise<any> {
    const table = await queryRunner.getTable('hive');
    const foreignKey = table.foreignKeys
      .find((fk) => fk.columnNames.indexOf('apiaryId') !== -1);
    await queryRunner.dropForeignKey('hive', foreignKey);
    await queryRunner.dropTable('hive');
    await queryRunner.dropTable('apiary');
  }
}
