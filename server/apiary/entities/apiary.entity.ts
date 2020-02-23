/**
 * apiary.entity
 */

/* Node modules */

/* Third-party modules */
import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import { IApiary } from '../interfaces/apiary';
import Hive from './hive.entity'; // eslint-disable-line import/no-cycle
import Location from './location.entity';
import Media from '../../media/entities/media.entity';

@Entity()
export default class Apiary implements IApiary {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsString({ always: true })
  @MaxLength(200, { always: true })
  @Column({
    type: 'varchar',
    length: 200,
  })
  name: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @OneToOne(() => Location, {
    cascade: true,
  })
  @JoinColumn()
  location: Location;

  @IsOptional({ always: true })
  @OneToOne(() => Media, {
    cascade: true,
  })
  @JoinColumn()
  image: Media;

  @OneToMany(() => Hive, (hive) => hive.apiary, {
    cascade: true,
  })
  hives: Hive[];

  @CreateDateColumn({
    type: 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;
}
