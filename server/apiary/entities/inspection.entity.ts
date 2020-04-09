/**
 * inspection.entity
 */

/* Node modules */

/* Third-party modules */
import {
  AfterLoad,
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ArrayMinSize,
  IsArray,
  IsISO8601,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Type } from 'class-transformer';

/* Files */
import { IInspection } from '../interfaces/apiary';
import Brood from './brood.entity';
import Feed from './feed.entity'; // eslint-disable-line import/no-cycle
import Health from './health.entity';
import Hive from './hive.entity'; // eslint-disable-line import/no-cycle
import Queen from './queen.entity';
import QueenCell from './queenCell.entity';
import Weather from './weather.entity';

@Entity()
export default class Inspection implements IInspection {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsISO8601({}, { always: true })
  @Column({
    type: 'date',
  })
  date: Date;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsInt({ always: true })
  @Min(0, { always: true })
  @Column({
    type: 'integer',
  })
  stores: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsInt({ always: true })
  @Min(0, { always: true })
  @Column({
    type: 'integer',
  })
  room: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsInt({ always: true })
  @Min(0, { always: true })
  @Max(10, { always: true })
  @Column({
    type: 'integer',
  })
  temper: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsInt({ always: true })
  @Column({
    type: 'integer',
  })
  supers: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsIn([
    'L',
    'M',
    'H',
  ], { always: true })
  @Column({
    type: 'varchar',
    length: 10,
  })
  varroa: string;

  @IsString({ always: true })
  @Column({
    type: 'text',
  })
  notes: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @ValidateNested({ always: true })
  @OneToOne(() => Queen, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  @Type(() => Queen)
  queen: Queen;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @ValidateNested({ always: true })
  @OneToOne(() => QueenCell, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  @Type(() => QueenCell)
  queenCell: QueenCell;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @ValidateNested({ always: true })
  @OneToOne(() => Brood, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  @Type(() => Brood)
  brood: Brood;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @ValidateNested({ always: true })
  @OneToOne(() => Health, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  @Type(() => Health)
  health: Health;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @ValidateNested({ always: true })
  @OneToOne(() => Weather, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  @Type(() => Weather)
  weather: Weather;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @ValidateNested({
    always: true,
    each: true,
  })
  @IsArray({ always: true })
  @ArrayMinSize(1, { always: true })
  @OneToMany(() => Feed, (feed) => feed.inspection, {
    cascade: true,
  })
  @Type(() => Feed)
  feed: Feed[];

  @ManyToOne(() => Hive, (hive) => hive.inspections)
  hive: Hive;

  @CreateDateColumn({
    type: 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;

  @AfterLoad()
  afterLoad() {
    if (this.date) {
      this.date = new Date(this.date);
    }
  }
}
