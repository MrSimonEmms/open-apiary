/**
 * feed.entity
 */

/* Node modules */

/* Third-party modules */
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import { IFeed } from '../interfaces/apiary';
import Inspection from './inspection.entity'; // eslint-disable-line import/no-cycle

@Entity()
export default class Feed implements IFeed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inspection, (inspection) => inspection.feed)
  inspection: Inspection;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  }, {
    always: true,
  })
  @Column({
    type: 'double',
  })
  quantity: number;

  @ValidateIf((feed) => feed.quantity > 0, { always: true })
  @IsString({ always: true })
  @MaxLength(100)
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  type: string;

  /**
   * Queen Not Seen
   *
   * If the queen isn't seen, the marked and clipped
   * must be false
   */
  protected noFeed() {
    if (!this.quantity) {
      this.type = null;
    }
  }

  @BeforeInsert()
  beforeInsert() {
    this.noFeed();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.noFeed();
  }
}
