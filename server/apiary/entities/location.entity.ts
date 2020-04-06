/**
 * location.entity
 */

/* Node modules */

/* Third-party modules */
import {
  AfterLoad,
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
    type: 'decimal',
    precision: 10,
    scale: 8,
  })
  latitude: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsLongitude()
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8,
  })
  longitude: number;

  @AfterLoad()
  setCoordsAsNumbers() {
    if (this.latitude) {
      this.latitude = Number(this.latitude);
    }
    if (this.longitude) {
      this.longitude = Number(this.longitude);
    }
  }
}
