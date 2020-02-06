/**
 * queenCell.entity
 */

/* Node modules */

/* Third-party modules */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import { IQueenCell } from '../interfaces/apiary';

@Entity()
export default class QueenCell implements IQueenCell {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsInt({ always: true })
  @Min(0, { always: true })
  @Column({
    type: 'integer',
  })
  left: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsInt({ always: true })
  @Min(0, { always: true })
  @Column({
    type: 'integer',
  })
  removed: number;
}
