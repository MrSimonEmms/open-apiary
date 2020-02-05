/**
 * weather.entity
 */

/* Node modules */

/* Third-party modules */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsIn,
  IsNotEmpty, IsNumber,
  IsOptional,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import { IWeather } from '../interfaces/apiary';

@Entity()
export default class Weather implements IWeather {
  @PrimaryGeneratedColumn()
  id: number;

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
  temp: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsIn([
    'CLOUD',
    'FAIR',
    'HAIL',
    'RAIN',
    'SNOW',
    'SUN',
  ], { always: true })
  @Column({
    type: 'varchar',
    length: 10,
  })
  desc: string;
}
