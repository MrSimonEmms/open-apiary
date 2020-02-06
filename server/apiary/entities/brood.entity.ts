/**
 * brood.entity
 */

/* Node modules */

/* Third-party modules */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import { IBrood } from '../interfaces/apiary';

@Entity()
export default class Brood implements IBrood {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsBoolean({ always: true })
  @Column({
    type: 'boolean',
  })
  eggs: boolean;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsInt({ always: true })
  @Min(0, { always: true })
  @Column({
    type: 'integer',
  })
  frames: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsBoolean({ always: true })
  @Column({
    type: 'boolean',
  })
  pattern: boolean;
}
