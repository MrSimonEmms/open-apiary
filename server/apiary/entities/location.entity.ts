/**
 * location.entity
 */

/* Node modules */

/* Third-party modules */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsOptional,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import { ILocation } from '../interfaces/apiary';

@Entity()
export default class Location implements ILocation {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsLatitude()
  @Column({
    type: 'varchar',
    length: 100,
  })
  lat: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsLongitude()
  @Column({
    type: 'varchar',
    length: 100,
  })
  long: number;
}
