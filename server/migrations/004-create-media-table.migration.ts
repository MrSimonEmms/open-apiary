/**
 * 004-create-media-table.migration
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

const fks = [{
  table: 'user',
  key: 'userId',
}];

export default class CreateMediaTable1582048823905 implements MigrationInterface {
  async up(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'media',
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
        name: 'originalFileName',
        type: 'varchar',
        width: 200,
      }, {
        name: 'uploadedFileName',
        type: 'varchar',
        width: 250,
      }, {
        name: 'mimeType',
        type: 'varchar',
        width: 100,
      }, {
        name: 'size',
        type: 'integer',
      }, {
        name: 'userId',
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

    await queryRunner.createForeignKeys('media', fks
      .map(({ table, key }) => new TableForeignKey({
        columnNames: [
          key,
        ],
        referencedTableName: table,
        referencedColumnNames: [
          'id',
        ],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })));
  }

  async down(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.dropTable('media');

    await Promise.all(fks.map(async ({ table }) => {
      await queryRunner.dropTable(table);
    }));
  }
}
