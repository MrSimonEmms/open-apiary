/**
 * user.entity
 */

/* Node modules */
import crypto from 'crypto';

/* Third-party modules */
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import { IUser } from '../interfaces/user';

const passwordJoin = '$';

@Entity()
export default class User implements IUser {
  private tempPassword: string;

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
  @IsString({ always: true })
  @MaxLength(200, { always: true })
  @IsEmail({}, { always: true })
  @Column({
    type: 'varchar',
    length: 200,
    unique: true,
  })
  emailAddress: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsString({ always: true })
  @MinLength(6, { always: true })
  @MaxLength(50, { always: true })
  @Column({
    type: 'varchar',
    length: 200,
  })
  password: string;

  @IsBoolean()
  @Column({
    type: 'boolean',
    default: false,
  })
  changeOnLogin: boolean;

  @CreateDateColumn({
    type: 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;

  @AfterLoad()
  private loadTempPassword() : void {
    this.tempPassword = this.password;
  }

  private encryptPassword(resetChangeOnLogin = false) {
    if (this.password !== this.tempPassword) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(this.password, salt, 2048, 32, 'sha512')
        .toString('hex');
      this.password = [
        salt,
        hash,
      ].join(passwordJoin);
      this.tempPassword = this.password;

      if (resetChangeOnLogin) {
        /* Password changed - remove requirement to change password */
        this.changeOnLogin = false;
      }
    }
  }

  @BeforeInsert()
  beforeInsert() {
    this.encryptPassword();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.encryptPassword(true);
  }

  verifyPassword(password: string) : boolean {
    const [salt, originalHash] = this.password.split('$');

    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512')
      .toString('hex');

    return hash === originalHash;
  }
}
