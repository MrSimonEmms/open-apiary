/**
 * user.entity
 */

/* Node modules */

/* Third-party modules */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

/* Files */
import { IUser } from '../interfaces/user';

@Entity()
export default class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  emailAddress: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  password: string;

  @Column({
    type: 'datetime',
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
  })
  updatedAt: Date;
}
