import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base';
import { User } from './user.model';

@Entity('messages')
export class Message extends Base {
  @Column({ nullable: true })
  text!: string;

  @Column({ nullable: true })
  file!: string;

  @ManyToOne(() => User)
  @JoinColumn()
  from!: User;

  @ManyToOne(() => User)
  @JoinColumn()
  to!: User;

  @Column({ type: 'boolean', default: false })
  updated!: boolean;
}
