/**
 * 003-create-inspection-table.migration
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

const inspectionFks = [{
  table: 'brood',
  key: 'broodId',
}, {
  table: 'health',
  key: 'healthId',
}, {
  table: 'queen',
  key: 'queenId',
}, {
  table: 'queen_cell',
  key: 'queenCellId',
}, {
  table: 'weather',
  key: 'weatherId',
}];

export default class CreateInspectionTable1580940761725 implements MigrationInterface {
  async up(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'brood',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'eggs',
        type: 'tinyint',
      }, {
        name: 'frames',
        type: 'integer',
      }, {
        name: 'pattern',
        type: 'tinyint',
      }],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'feed',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'quantity',
        type: 'double',
      }, {
        name: 'type',
        type: 'varchar',
        width: 100,
        isNullable: true,
      }, {
        name: 'inspectionId',
        type: 'integer',
      }],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'health',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'ok',
        type: 'tinyint',
      }, {
        name: 'diseases',
        type: 'text',
      }],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'queen',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'clipped',
        type: 'tinyint',
      }, {
        name: 'marked',
        type: 'varchar',
        width: 10,
      }, {
        name: 'seen',
        type: 'tinyint',
      }],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'queen_cell',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'left',
        type: 'integer',
      }, {
        name: 'removed',
        type: 'integer',
      }],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'weather',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'temp',
        type: 'double',
      }, {
        name: 'desc',
        type: 'varchar',
        width: 10,
      }],
    }), true);

    await queryRunner.createTable(new Table({
      name: 'inspection',
      columns: [{
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }, {
        name: 'date',
        type: 'date',
      }, {
        name: 'stores',
        type: 'integer',
      }, {
        name: 'room',
        type: 'integer',
      }, {
        name: 'temper',
        type: 'integer',
      }, {
        name: 'supers',
        type: 'integer',
      }, {
        name: 'varroa',
        type: 'varchar',
        width: 10,
      }, {
        name: 'notes',
        type: 'text',
      }, {
        name: 'queenId',
        type: 'integer',
      }, {
        name: 'queenCellId',
        type: 'integer',
      }, {
        name: 'broodId',
        type: 'integer',
      }, {
        name: 'healthId',
        type: 'integer',
      }, {
        name: 'weatherId',
        type: 'integer',
      }, {
        name: 'hiveId',
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

    await queryRunner.createForeignKey('feed', new TableForeignKey({
      columnNames: [
        'inspectionId',
      ],
      referencedTableName: 'inspection',
      referencedColumnNames: [
        'id',
      ],
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKeys('inspection', inspectionFks
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
    await queryRunner.dropTable('inspection');
    await queryRunner.dropTable('feed');

    await Promise.all(inspectionFks.map(async ({ table }) => {
      await queryRunner.dropTable(table);
    }));
  }
}
