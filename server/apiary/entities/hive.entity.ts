/**
 * hive.entity
 */

/* Node modules */

/* Third-party modules */
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import uuid from 'uuid';

/* Files */
import Apiary from './apiary.entity'; // eslint-disable-line import/no-cycle
import Inspection from './inspection.entity'; // eslint-disable-line import/no-cycle
import { IHive } from '../interfaces/apiary';

@Entity()
export default class Hive implements IHive {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('apiaryCountIndex')
  @Column({
    type: 'integer',
  })
  apiaryCount: number;

  @Column({
    type: 'varchar',
    length: 100,
    update: false,
  })
  uuid: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsISO8601({ always: true })
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

  @ManyToOne(() => Apiary, (apiary) => apiary.hives, {
    eager: true,
  })
  apiary: Apiary;

  @OneToMany(() => Inspection, (inspection) => inspection.hive, {
    cascade: true,
  })
  inspections: Inspection[];

  @CreateDateColumn({
    type: 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;

  @BeforeInsert()
  generateUUID() {
    this.uuid = uuid.v4();
  }
}
