/**
 * hive.entity
 */

/* Node modules */

/* Third-party modules */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsDate,
  IsNotEmpty,
  IsOptional, IsString,
  IsUUID,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import Apiary from './apiary.entity'; // eslint-disable-line import/no-cycle
import { IHive } from '../interfaces/apiary';

@Entity()
export default class Hive implements IHive {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsUUID('4', { always: true })
  @Column({
    type: 'varchar',
    length: 100,
  })
  uuid: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsDate({ always: true })
  @Column({
    type: 'date',
  })
  // This is the (approx) date the hive was established
  establishedDate: Date;

  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  origin: string;

  @ManyToOne(() => Apiary, (apiary) => apiary.hives)
  apiary: Apiary;

  @CreateDateColumn({
    type: 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;
}
