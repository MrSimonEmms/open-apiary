/**
 * health.entity
 */

/* Node modules */

/* Third-party modules */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import { IHealth } from '../interfaces/apiary';

@Entity()
export default class Health implements IHealth {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsBoolean({ always: true })
  @Column({
    type: 'boolean',
  })
  ok: boolean;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsArray({ always: true })
  @Column('simple-array')
  diseases: string[];
}
