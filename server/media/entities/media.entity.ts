/**
 * media.entity
 */

/* Node modules */

/* Third-party modules */
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import uuid from 'uuid';

/* Files */
import { IMedia } from '../interfaces/media';
import { IUser } from '../../user/interfaces/user';
import User from '../../user/entities/user.entity';

@Entity()
export default class Media implements IMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    update: false,
  })
  uuid: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsString(({ always: true }))
  @MaxLength(200, { always: true })
  @Column({
    type: 'varchar',
    length: 200,
  })
  originalFileName: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsString(({ always: true }))
  @MaxLength(250, { always: true })
  @Column({
    type: 'varchar',
    length: 250,
  })
  uploadedFileName: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsString(({ always: true }))
  @MaxLength(100, { always: true })
  @Column({
    type: 'varchar',
    length: 100,
  })
  mimeType: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsInt({ always: true })
  @MaxLength(100, { always: true })
  @Column({
    type: 'integer',
  })
  size: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @OneToOne(() => User, {
    cascade: true,
  })
  @JoinColumn()
  user: IUser;

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
