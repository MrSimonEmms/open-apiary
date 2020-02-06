/**
 * queen.entity
 */

/* Node modules */

/* Third-party modules */
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

/* Files */
import { IQueen, QueenMarked } from '../interfaces/apiary';

const queenMarkedEnum : (string | boolean)[] = Object.values(QueenMarked);
queenMarkedEnum.push(true, false);

@Entity()
export default class Queen implements IQueen {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsBoolean({ always: true })
  @Column({
    type: 'boolean',
  })
  clipped: boolean;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsIn(queenMarkedEnum, { always: true })
  @Column({
    type: 'varchar',
    length: 10,
  })
  marked: QueenMarked | boolean;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsBoolean({ always: true })
  @Column({
    type: 'boolean',
  })
  seen: boolean;

  @AfterLoad()
  setMarked() {
    /* The DB stores booleans as 1/0 - set to boolean for public API */
    if ((<any> this.marked) === '1') {
      this.marked = true;
    } else if ((<any> this.marked) === '0') {
      this.marked = false;
    }
  }

  /**
   * Queen Not Seen
   *
   * If the queen isn't seen, the marked and clipped
   * must be false
   */
  protected queenNotSeen() {
    if (!this.seen) {
      this.clipped = false;
      this.marked = false;
    }
  }

  @BeforeInsert()
  beforeInsert() {
    this.queenNotSeen();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.queenNotSeen();
  }
}
