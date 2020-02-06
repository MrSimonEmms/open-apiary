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
  TableIndex,
} from 'typeorm';

/* Files */

export default class CreateApiaryTable1578955798961 implements MigrationInterface {
  async up(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'location',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'latitude',
        type: 'decimal',
        precision: 10,
        scale: 8,
      }, {
        name: 'longitude',
        type: 'decimal',
        precision: 11,
        scale: 8,
      }],
    }));

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
        name: 'locationId',
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

    await queryRunner.createForeignKey('apiary', new TableForeignKey({
      columnNames: [
        'locationId',
      ],
      referencedTableName: 'location',
      referencedColumnNames: [
        'id',
      ],
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createTable(new Table({
      name: 'hive',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'apiaryCount',
        type: 'integer',
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

    await queryRunner.createIndex('hive', new TableIndex({
      columnNames: [
        'apiaryCount',
      ],
      name: 'apiaryCountIndex',
    }));

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

  async down(queryRunner: QueryRunner) : Promise<void> {
    const hiveTable = await queryRunner.getTable('hive');
    const hiveFK = hiveTable.foreignKeys
      .find((fk) => fk.columnNames.indexOf('apiaryId') !== -1);
    await queryRunner.dropForeignKey('hive', hiveFK);
    await queryRunner.dropTable('hive');

    const locationTable = await queryRunner.getTable('hive');
    const locationFK = locationTable.foreignKeys
      .find((fk) => fk.columnNames.indexOf('locationId') !== -1);
    await queryRunner.dropForeignKey('apiary', locationFK);
    await queryRunner.dropTable('apiary');

    await queryRunner.dropTable('location');
  }
}
